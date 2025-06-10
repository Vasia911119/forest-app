import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Валідація id
    if (typeof id !== 'number' || id <= 0) {
      return NextResponse.json(
        { error: 'Некоректний id таблиці' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Перевірка існування таблиці
    const { data: existingTable } = await supabase
      .from('tables')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingTable) {
      return NextResponse.json(
        { error: 'Таблицю не знайдено' },
        { status: 404 }
      );
    }

    // Видалення таблиці
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Помилка видалення таблиці:', error);
      return NextResponse.json(
        { error: 'Не вдалося видалити таблицю' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Таблицю успішно видалено' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Помилка обробки запиту:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}