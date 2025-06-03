import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Initializing Supabase client for forests...');
    const supabase = await createClient();
    console.log('Fetching forests from Supabase...');
    const { data, error } = await supabase.from('forests').select('name');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Data fetched:', data);
    return NextResponse.json(data.map(item => item.name)); // Повертаємо масив рядків
  } catch (error) {
    console.error('Помилка завантаження лісництв:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити лісництва' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Неправильне ім’я лісництва' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('forests').insert({ name });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ message: 'Лісництво додано' }, { status: 201 });
  } catch (error) {
    console.error('Помилка додавання лісництва:', error);
    return NextResponse.json({ error: 'Не вдалося додати лісництво' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Неправильне ім’я лісництва' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('forests').delete().eq('name', name);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ message: 'Лісництво видалено' }, { status: 200 });
  } catch (error) {
    console.error('Помилка видалення лісництва:', error);
    return NextResponse.json({ error: 'Не вдалося видалити лісництво' }, { status: 500 });
  }
}