import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { TableData } from '../../types/index';

// Ініціалізація Supabase клієнта
const supabaseUrl = 'https://aws-0-us-east-1.pooler.supabase.com';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false,
  },
});

export async function GET() {
  try {
    console.log('Attempting to fetch from tables...');
    const { data, error } = await supabase
      .from('tables')
      .select('date, rows');

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }

    const tables: TableData[] = data.map(row => ({
      date: row.date,
      rows: row.rows || [],
    }));

    console.log('Fetched tables:', tables);
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Помилка завантаження таблиць:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити таблиці' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const table: TableData = await request.json();
    const { error } = await supabase
      .from('tables')
      .upsert({ date: table.date, rows: table.rows });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Помилка збереження таблиці:', error);
    return NextResponse.json({ error: 'Не вдалося зберегти таблицю' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { date } = await request.json();
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('date', date);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Помилка видалення таблиці:', error);
    return NextResponse.json({ error: 'Не вдалося видалити таблицю' }, { status: 500 });
  }
}