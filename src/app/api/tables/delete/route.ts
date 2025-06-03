import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json() as { id: number };
    console.log('Received table id to delete:', id);
    if (typeof id !== 'number') {
      console.error('Invalid table id:', id);
      return NextResponse.json({ error: 'Неправильний ідентифікатор таблиці' }, { status: 400 });
    }

    const supabase = await createClient();
    // Перевіряємо, чи існує таблиця
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('tables')
      .select('id')
      .eq('id', id)
      .single();
    if (tableCheckError || !tableExists) {
      console.error('Table not found or error:', tableCheckError);
      return NextResponse.json({ error: 'Таблиця не знайдена' }, { status: 404 });
    }

    // Видаляємо всі рядки, пов’язані з таблицею
    const { error: deleteRowsError } = await supabase
      .from('rows')
      .delete()
      .eq('table_id', id);
    if (deleteRowsError) {
      console.error('Error deleting rows:', deleteRowsError);
      throw deleteRowsError;
    }

    // Видаляємо саму таблицю
    const { error: deleteTableError } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);
    if (deleteTableError) {
      console.error('Error deleting table:', deleteTableError);
      throw deleteTableError;
    }

    console.log('Table deleted successfully:', id);
    return NextResponse.json({ message: 'Таблицю видалено' }, { status: 200 });
  } catch (error) {
    console.error('Помилка видалення таблиці:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Не вдалося видалити таблицю', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Не вдалося видалити таблицю', details: 'Невідома помилка' }, { status: 500 });
  }
}