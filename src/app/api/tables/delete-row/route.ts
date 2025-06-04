import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// DELETE /api/tables/delete-row
export async function DELETE(request: NextRequest) {
  try {
    const { tableId, rowId } = await request.json();

    // Приводимо до числа і перевіряємо
    const tableIdNum = Number(tableId);
    const rowIdNum = Number(rowId);

    if (!tableIdNum || !rowIdNum || isNaN(tableIdNum) || isNaN(rowIdNum)) {
      return NextResponse.json({ error: 'Потрібні валідні tableId і rowId' }, { status: 400 });
    }

    const supabase = await createClient();

    // Перевірка: чи існує рядок і чи належить цій таблиці
    const { data: row, error: fetchError } = await supabase
      .from('rows')
      .select('id, table_id')
      .eq('id', rowIdNum)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Рядок не знайдено' }, { status: 404 });
    }
    if (!row || row.table_id !== tableIdNum) {
      return NextResponse.json({ error: 'Рядок не належить цій таблиці' }, { status: 400 });
    }

    // Видалення
    const { error: deleteError } = await supabase
      .from('rows')
      .delete()
      .eq('id', rowIdNum);

    if (deleteError) {
      return NextResponse.json({ error: 'Не вдалося видалити рядок' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/tables/delete-row]', error);
    return NextResponse.json({ error: 'Помилка видалення рядка' }, { status: 500 });
  }
}