import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET all species
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('species').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(s => s.name));
}

// Add new species
export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: 'Порожня назва' }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from('species').insert({ name });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Додано' }, { status: 201 });
}

// Delete species
export async function DELETE(request: Request) {
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: 'Порожня назва' }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from('species').delete().eq('name', name);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Видалено' }, { status: 200 });
}