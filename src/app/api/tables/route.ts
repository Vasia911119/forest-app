import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: tablesData, error: tablesError } = await supabase
      .from('tables')
      .select('id, date')
      .order('id');
    if (tablesError) throw tablesError;

    const { data: rowsData, error: rowsError } = await supabase
      .from('rows')
      .select('*');
    if (rowsError) throw rowsError;

    const tables = tablesData.map(table => ({
      id: table.id,
      date: table.date,
      rows: rowsData
        .filter(row => row.table_id === table.id)
        .map(row => ({
          id: row.id,
          forest: row.forest,
          buyer: row.buyer,
          product: row.product,
          species: row.species,
          volume: row.volume,
          amount: row.amount,
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
    const { tables } = await request.json();

    if (!tables || !Array.isArray(tables)) {
      return NextResponse.json({ error: 'Очікується масив tables' }, { status: 400 });
    }

    const supabase = await createClient();

    for (const table of tables) {
      let tableId = table.id;

      // Створення нової таблиці, якщо id не заданий
      if (typeof tableId !== 'number') {
        if (!table.date) continue;
        const { data: inserted, error: insertError } = await supabase
          .from('tables')
          .insert({ date: table.date })
          .select('id')
          .single();
        if (insertError) throw insertError;
        tableId = inserted.id;
      } else {
        // Оновлення дати
        const { error: updateTableError } = await supabase
          .from('tables')
          .update({ date: table.date })
          .eq('id', tableId);
        if (updateTableError) throw updateTableError;
      }

      // Отримання існуючих рядків
      const { data: existingRows, error: fetchRowsError } = await supabase
        .from('rows')
        .select('id')
        .eq('table_id', tableId);
      if (fetchRowsError) throw fetchRowsError;

      const existingRowIds = existingRows.map(r => r.id);
      const newRowIds = table.rows
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');
      const rowsToDelete = existingRowIds.filter(id => !newRowIds.includes(id));

      // Видалення рядків, які були видалені на фронті
      if (rowsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('rows')
          .delete()
          .eq('table_id', tableId)
          .in('id', rowsToDelete);
        if (deleteError) throw deleteError;
      }

      // Додавання нових рядків
      const rowsToInsert = table.rows
        .filter(r => r.id === undefined || r.id === null)
        .map(r => ({
          table_id: tableId,
          forest: r.forest,
          buyer: r.buyer,
          product: r.product,
          species: r.species,
          volume: r.volume ?? 0,
          amount: r.amount ?? 0,
        }));

      // Оновлення існуючих рядків
      const rowsToUpdate = table.rows
        .filter(r => typeof r.id === 'number' && existingRowIds.includes(r.id))
        .map(r => ({
          id: r.id,
          table_id: tableId,
          forest: r.forest,
          buyer: r.buyer,
          product: r.product,
          species: r.species,
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

    return NextResponse.json({ message: 'Таблиці оновлено' }, { status: 200 });
  } catch (error) {
    console.error('Помилка оновлення таблиць:', error);
    return NextResponse.json({ error: 'Не вдалося оновити таблиці' }, { status: 500 });
  }
}