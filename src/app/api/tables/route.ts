import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { TableData } from '../../types/index';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: tablesData, error: tablesError } = await supabase
      .from('tables')
      .select('id, date');
    if (tablesError) throw tablesError;

    const { data: rowsData, error: rowsError } = await supabase
      .from('rows')
      .select('*');
    if (rowsError) throw rowsError;

    const tables: TableData[] = tablesData.map(table => ({
      id: table.id,
      date: table.date,
      rows: rowsData
        .filter(row => row.table_id === table.id)
        .map(row => ({
          id: row.id,
          forest: row.forest || '',
          buyer: row.buyer || '',
          product: row.product || '',
          species: row.species || '',
          volume: row.volume ?? 0,
          amount: row.amount ?? 0,
        })),
    }));

    return NextResponse.json(tables);
  } catch (error) {
    console.error('Помилка завантаження таблиць:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити таблиці' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tables } = await request.json() as { tables: TableData[] };

    if (!tables || !Array.isArray(tables)) {
      return NextResponse.json({ error: 'Неправильні дані таблиць' }, { status: 400 });
    }

    const supabase = await createClient();

    for (const table of tables) {
      if (typeof table.id !== 'number' || !Array.isArray(table.rows)) {
        return NextResponse.json({ error: 'Некоректні дані таблиці або рядків' }, { status: 400 });
      }

      // Оновлюємо дату таблиці
      const { error: updateTableError } = await supabase
        .from('tables')
        .update({ date: table.date })
        .eq('id', table.id);
      if (updateTableError) throw updateTableError;

      // Отримуємо існуючі рядки для таблиці
      const { data: existingRows, error: fetchRowsError } = await supabase
        .from('rows')
        .select('id')
        .eq('table_id', table.id);
      if (fetchRowsError) throw fetchRowsError;

      const existingRowIds = existingRows.map(r => r.id);
      const newRowIds = table.rows
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');
      const rowsToDelete = existingRowIds.filter(id => !newRowIds.includes(id));

      // Видаляємо зайві рядки
      if (rowsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('rows')
          .delete()
          .eq('table_id', table.id)
          .in('id', rowsToDelete);
        if (deleteError) throw deleteError;
      }

      // Розподіляємо рядки для вставки та оновлення
      const rowsToInsert = table.rows
        .filter(r => r.id === undefined || r.id === null)
        .map(r => ({
          table_id: table.id,
          forest: r.forest || '',
          buyer: r.buyer || '',
          product: r.product || '',
          species: r.species || '',
          volume: r.volume ?? 0,
          amount: r.amount ?? 0,
        }));

      const rowsToUpdate = table.rows
        .filter(r => typeof r.id === 'number' && existingRowIds.includes(r.id))
        .map(r => ({
          id: r.id,
          table_id: table.id,
          forest: r.forest || '',
          buyer: r.buyer || '',
          product: r.product || '',
          species: r.species || '',
          volume: r.volume ?? 0,
          amount: r.amount ?? 0,
        }));

      if (rowsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('rows')
          .insert(rowsToInsert);
        if (insertError) throw insertError;
      }

      if (rowsToUpdate.length > 0) {
        const { error: updateRowsError } = await supabase
          .from('rows')
          .upsert(rowsToUpdate, { onConflict: 'id' });
        if (updateRowsError) throw updateRowsError;
      }
    }

    return NextResponse.json({ message: 'Таблиці оновлено', updatedTables: tables }, { status: 200 });
  } catch (error) {
    console.error('Помилка оновлення таблиць:', error);
    return NextResponse.json({ error: 'Не вдалося оновити таблиці' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { tableId, rowId } = await request.json() as { tableId: number; rowId: number };

    if (typeof tableId !== 'number' || typeof rowId !== 'number') {
      return NextResponse.json({ error: 'Неправильні ідентифікатори' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('rows')
      .delete()
      .eq('table_id', tableId)
      .eq('id', rowId);

    if (error) throw error;

    return NextResponse.json({ message: 'Рядок видалено' }, { status: 200 });
  } catch (error) {
    console.error('Помилка видалення рядка:', error);
    return NextResponse.json({ error: 'Не вдалося видалити рядок' }, { status: 500 });
  }
}
