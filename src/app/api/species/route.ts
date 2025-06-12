import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET all species
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('species').select('*').order('name');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data.map(s => s.name));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}

// Add new species
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Порожня назва' }, { status: 400 });
    const supabase = await createClient();
    const { error } = await supabase.from('species').insert({ name });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Додано' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}

// Delete species
export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Порожня назва' }, { status: 400 });
    const supabase = await createClient();
    const { error } = await supabase.from('species').delete().eq('name', name);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Видалено' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}