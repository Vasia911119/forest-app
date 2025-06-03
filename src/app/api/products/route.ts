import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('products').select('name');

    if (error) throw error;

    return NextResponse.json(data.map(item => item.name));
  } catch (error) {
    console.error('Помилка завантаження продуктів:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити продукти' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Неправильне ім’я продукту' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('products').insert({ name });

    if (error) throw error;

    return NextResponse.json({ message: 'Продукт додано' }, { status: 201 });
  } catch (error) {
    console.error('Помилка додавання продукту:', error);
    return NextResponse.json({ error: 'Не вдалося додати продукт' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Неправильне ім’я продукту' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('products').delete().eq('name', name);

    if (error) throw error;

    return NextResponse.json({ message: 'Продукт видалено' }, { status: 200 });
  } catch (error) {
    console.error('Помилка видалення продукту:', error);
    return NextResponse.json({ error: 'Не вдалося видалити продукт' }, { status: 500 });
  }
}