import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { TableData } from '@/app/types';

interface TablesResponse {
  tables?: TableData[];
  error?: string;
}

/**
 * Отримання всіх таблиць з рядками
 */
export async function GET(): Promise<NextResponse<TablesResponse>> {
  try {
    const supabase = await createClient();
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('id, date')
      .order('id');

    if (tablesError) {
      console.error('Помилка отримання таблиць:', tablesError);
      return NextResponse.json({ error: tablesError.message }, { status: 500 });
    }

    const { data: rows, error: rowsError } = await supabase
      .from('rows')
      .select('*');

    if (rowsError) {
      console.error('Помилка отримання рядків:', rowsError);
      return NextResponse.json({ error: rowsError.message }, { status: 500 });
    }

    const tablesWithRows = tables.map(table => ({
      ...table,
      rows: rows.filter(row => row.table_id === table.id)
    }));

    return NextResponse.json({ tables: tablesWithRows });
  } catch (error) {
    console.error('Помилка обробки запиту:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

/**
 * Оновлення таблиць та їх рядків
 */
export async function POST(request: Request): Promise<NextResponse<TablesResponse>> {
  try {
    const { tables } = await request.json() as { tables: TableData[] };
    const supabase = await createClient();

    for (const table of tables) {
      // Оновлюємо таблицю
      const { error: tableError } = await supabase
          .from('tables')
          .update({ date: table.date })
        .eq('id', table.id);

      if (tableError) {
        console.error('Помилка оновлення таблиці:', tableError);
        return NextResponse.json({ error: tableError.message }, { status: 500 });
      }

      // Отримуємо поточні id рядків
      const { data: existingRows, error: existingRowsError } = await supabase
        .from('rows')
        .select('id')
        .eq('table_id', table.id);

      if (existingRowsError) {
        console.error('Помилка отримання існуючих рядків:', existingRowsError);
        return NextResponse.json({ error: existingRowsError.message }, { status: 500 });
      }

      const existingRowIds = existingRows?.map(row => row.id) || [];

      // Видаляємо рядки, яких немає в нових даних
      if (existingRowIds.length > 0) {
      const newRowIds = table.rows
          .filter(row => row.id)
          .map(row => row.id);
      const rowsToDelete = existingRowIds.filter(id => !newRowIds.includes(id));

      if (rowsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('rows')
          .delete()
            .eq('table_id', table.id)
          .in('id', rowsToDelete);

          if (deleteError) {
            console.error('Помилка видалення рядків:', deleteError);
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
          }
        }
      }

      // Оновлюємо або додаємо нові рядки
      for (const row of table.rows) {
        const rowData = {
          table_id: table.id,
          forest: row.forest,
          buyer: row.buyer,
          product: row.product,
          species: row.species,
          volume: row.volume,
          amount: row.amount
        };

        if (row.id) {
          // Оновлюємо існуючий рядок
          const { error: updateError } = await supabase
            .from('rows')
            .update(rowData)
            .eq('id', row.id);

          if (updateError) {
            console.error('Помилка оновлення рядка:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
          }
        } else {
          // Додаємо новий рядок
          const { data: newRow, error: insertError } = await supabase
          .from('rows')
            .insert(rowData)
            .select()
            .single();

          if (insertError) {
            console.error('Помилка додавання рядка:', insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

          // Оновлюємо id в локальному стані
          row.id = newRow.id;
        }
      }
    }

    // Повертаємо оновлені дані
    const { data: updatedTables, error: fetchError } = await supabase
      .from('tables')
      .select('id, date')
      .order('id');

    if (fetchError) {
      console.error('Помилка отримання оновлених таблиць:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const { data: updatedRows, error: rowsError } = await supabase
          .from('rows')
      .select('*');

    if (rowsError) {
      console.error('Помилка отримання оновлених рядків:', rowsError);
      return NextResponse.json({ error: rowsError.message }, { status: 500 });
    }

    const tablesWithRows = updatedTables.map(table => ({
      ...table,
      rows: updatedRows.filter(row => row.table_id === table.id)
    }));

    return NextResponse.json({ tables: tablesWithRows });
  } catch (error) {
    console.error('Помилка обробки запиту:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}