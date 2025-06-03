import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { date } = await request.json();
    if (!date || typeof date !== 'string') {
      return NextResponse.json({ error: 'Неправильна дата' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tables')
      .insert({ date })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Помилка створення таблиці:', error);
    return NextResponse.json({ error: 'Не вдалося створити таблицю' }, { status: 500 });
  }
}