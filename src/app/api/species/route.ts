import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('species').select('name');

    if (error) throw error;
    return NextResponse.json(data.map(item => item.name));
  } catch (error) {
    console.error('Помилка завантаження порід:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити породи' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Неправильне ім’я продукту' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('species').insert({ name });

    if (error) throw error;

    return NextResponse.json({ message: 'Породу додано' }, { status: 201 });
  } catch (error) {
    console.error('Помилка додавання породи:', error);
    return NextResponse.json({ error: 'Не вдалося додати породу' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Неправильне ім’я породи' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('species').delete().eq('name', name);

    if (error) throw error;

    return NextResponse.json({ message: 'Породу видалено' }, { status: 200 });
  } catch (error) {
    console.error('Помилка видалення породи:', error);
    return NextResponse.json({ error: 'Не вдалося видалити породу' }, { status: 500 });
  }
}