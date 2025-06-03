import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { TableData, Row } from '@/types';

export async function GET() {
  try {
    const supabase = await createClient();

    // Отримуємо всі таблиці
    const { data: tablesData, error: tablesError } = await supabase
      .from('tables')
      .select('id, date');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return NextResponse.json({ error: 'Не вдалося завантажити таблиці', details: tablesError.message }, { status: 500 });
    }

    if (!tablesData || tablesData.length === 0) {
      return NextResponse.json({ tables: [] }, { status: 200 });
    }

    // Отримуємо рядки для всіх таблиць
    const tableIds = tablesData.map(table => table.id);
    const { data: rowsData, error: rowsError } = await supabase
      .from('rows')
      .select('id, table_id, forest, buyer, product, species, volume, amount')
      .in('table_id', tableIds);

    if (rowsError) {
      console.error('Error fetching rows:', rowsError);
      return NextResponse.json({ error: 'Не вдалося завантажити рядки', details: rowsError.message }, { status: 500 });
    }

    // Формуємо відповідь у форматі TableData[]
    const tables: TableData[] = tablesData.map(table => {
      const rows: Row[] = rowsData
        ? rowsData
            .filter(row => row.table_id === table.id)
            .map(row => ({
              id: row.id,
              forest: row.forest || '',
              buyer: row.buyer || '',
              product: row.product || '',
              species: row.species || '',
              volume: row.volume || 0,
              amount: row.amount || 0,
            }))
        : [];
      return {
        id: table.id,
        date: table.date || '',
        rows,
      };
    });

    console.log('Fetched tables:', tables);
    return NextResponse.json({ tables }, { status: 200 });
  } catch (error) {
    console.error('Помилка завантаження таблиць:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Не вдалося завантажити таблиці', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Не вдалося завантажити таблиці', details: 'Невідома помилка' }, { status: 500 });
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
      const { error: updateTableError } = await supabase
        .from('tables')
        .update({ date: table.date })
        .eq('id', table.id);
      if (updateTableError) {
        console.error('Update table error:', updateTableError);
        throw updateTableError;
      }

      const { data: existingRows, error: fetchRowsError } = await supabase
        .from('rows')
        .select('id')
        .eq('table_id', table.id);
      if (fetchRowsError) {
        console.error('Error fetching existing rows:', fetchRowsError);
        throw fetchRowsError;
      }

      const existingRowIds = existingRows.map(row => row.id);
      const newRowIds = table.rows
        .map(row => row.id)
        .filter((id): id is number => typeof id === 'number');
      const rowsToDelete = existingRowIds.filter(id => !newRowIds.includes(id));
      console.log('Existing row IDs:', existingRowIds);
      console.log('New row IDs:', newRowIds);
      console.log('Rows to delete:', rowsToDelete);

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
          let index = 0;
          table.rows.forEach((row, i) => {
            if (row.id === undefined || row.id === null) {
              row.id = insertedRowIds[index++];
            }
          });
        }

        if (rowsToUpdate.length > 0) {
          const { error: updateRowsError } = await supabase
            .from('rows')
            .upsert(rowsToUpdate, {
              onConflict: 'id',
              ignoreDuplicates: false,
            });
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