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
          volume: row.volume || 0,
          amount: row.amount || 0,
        })),
    }));

    console.log('Returning tables:', tables);
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Помилка завантаження таблиць:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити таблиці' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tables } = await request.json() as { tables: TableData[] };
    console.log('Received tables:', JSON.stringify(tables, null, 2));

    if (!tables || !Array.isArray(tables)) {
      console.error('Validation failed: tables is not an array');
      return NextResponse.json({ error: 'Неправильні дані таблиць' }, { status: 400 });
    }

    for (const table of tables) {
      if (typeof table.id !== 'number') {
        console.error('Validation failed: table id is not a number', table);
        return NextResponse.json({ error: 'Кожна таблиця повинна мати id' }, { status: 400 });
      }
      if (!Array.isArray(table.rows)) {
        console.error('Validation failed: rows is not an array', table);
        return NextResponse.json({ error: 'Рядки таблиці повинні бути масивом' }, { status: 400 });
      }
    }

    const supabase = await createClient();

    for (const table of tables) {
      console.log('Processing table:', table.id);
      // Оновлюємо дату таблиці
      const { error: updateTableError } = await supabase
        .from('tables')
        .update({ date: table.date })
        .eq('id', table.id);
      if (updateTableError) {
        console.error('Update table error:', updateTableError);
        throw updateTableError;
      }

      // Отримуємо існуючі рядки для table_id
      const { data: existingRows, error: fetchRowsError } = await supabase
        .from('rows')
        .select('id')
        .eq('table_id', table.id);
      if (fetchRowsError) {
        console.error('Error fetching existing rows:', fetchRowsError);
        throw fetchRowsError;
      }

      // Визначаємо, які рядки потрібно видалити
      const existingRowIds = existingRows.map(row => row.id);
      const newRowIds = table.rows
        .map(row => row.id)
        .filter((id): id is number => typeof id === 'number'); // Фільтруємо лише числові id
      const rowsToDelete = existingRowIds.filter(id => !newRowIds.includes(id));
      console.log('Existing row IDs:', existingRowIds);
      console.log('New row IDs:', newRowIds);
      console.log('Rows to delete:', rowsToDelete);

      // Видаляємо рядки, які більше не потрібні
      if (rowsToDelete.length > 0) {
        const { error: deleteRowsError } = await supabase
          .from('rows')
          .delete()
          .eq('table_id', table.id)
          .in('id', rowsToDelete);
        if (deleteRowsError) {
          console.error('Error deleting rows:', deleteRowsError);
          throw deleteRowsError;
        }
      }

      // Розділяємо рядки на нові (без id) і ті, що потрібно оновити (з id)
      if (table.rows.length > 0) {
        const rowsToInsert = table.rows
          .filter(row => row.id === undefined || row.id === null)
          .map(row => ({
            table_id: table.id,
            forest: row.forest || '',
            buyer: row.buyer || '',
            product: row.product || '',
            species: row.species || '',
            volume: row.volume || 0,
            amount: row.amount || 0,
          }));
        const rowsToUpdate = table.rows
          .filter(row => typeof row.id === 'number' && existingRowIds.includes(row.id))
          .map(row => ({
            id: row.id,
            table_id: table.id,
            forest: row.forest || '',
            buyer: row.buyer || '',
            product: row.product || '',
            species: row.species || '',
            volume: row.volume || 0,
            amount: row.amount || 0,
          }));

        console.log('Rows to insert:', rowsToInsert);
        console.log('Rows to update:', rowsToUpdate);

        // Вставляємо нові рядки
        let insertedRowIds: number[] = [];
        if (rowsToInsert.length > 0) {
          const { data: insertedRows, error: insertRowsError } = await supabase
            .from('rows')
            .insert(rowsToInsert)
            .select('id');
          if (insertRowsError) {
            console.error('Insert rows error:', insertRowsError);
            throw insertRowsError;
          }
          insertedRowIds = insertedRows.map(row => row.id);
          // Оновлюємо table.rows із новими id
          let index = 0;
          table.rows.forEach((row) => {
            if (row.id === undefined || row.id === null) {
              row.id = insertedRowIds[index++];
            }
          });
        }

        // Оновлюємо існуючі рядки
        if (rowsToUpdate.length > 0) {
          const { error: updateRowsError } = await supabase
            .from('rows')
            .upsert(rowsToUpdate, { onConflict: 'id' });
          if (updateRowsError) {
            console.error('Update rows error:', updateRowsError);
            throw updateRowsError;
          }
        }
      }
    }

    return NextResponse.json({ message: 'Таблиці оновлено', updatedTables: tables }, { status: 200 });
  } catch (error) {
    console.error('Помилка оновлення таблиць:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Не вдалося оновити таблиці', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Не вдалося оновити таблиці', details: 'Невідома помилка' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { tableId, rowId } = await request.json() as { tableId: number; rowId: number };
    if (typeof tableId !== 'number' || typeof rowId !== 'number') {
      return NextResponse.json({ error: 'Неправильні ідентифікатори' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('rows').delete().eq('table_id', tableId).eq('id', rowId);

    if (error) throw error;

    return NextResponse.json({ message: 'Рядок видалено' }, { status: 200 });
  } catch (error) {
    console.error('Помилка видалення рядка:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Не вдалося видалити рядок', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Не вдалося видалити рядок', details: 'Невідома помилка' }, { status: 500 });
  }
}