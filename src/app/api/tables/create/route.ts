import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { date } = await request.json();

    // Валідація дати
    if (!date) {
      return NextResponse.json(
        { error: 'Дата є обов\'язковим полем' },
        { status: 400 }
      );
    }

    // Перевірка формату дати
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Неправильний формат дати. Використовуйте YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Перевірка на дублікат дати
    const { data: existingTable } = await supabase
      .from('tables')
      .select('id')
      .eq('date', date)
      .single();

    if (existingTable) {
      return NextResponse.json(
        { error: 'Таблиця з такою датою вже існує' },
        { status: 409 }
      );
    }

    // Створення нової таблиці
    const { data, error } = await supabase
      .from('tables')
      .insert({ date })
      .select('id')
      .single();

    if (error) {
      console.error('Помилка створення таблиці:', error);
      return NextResponse.json(
        { error: 'Не вдалося створити таблицю' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { id: data.id, message: 'Таблицю створено успішно' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Помилка обробки запиту:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}