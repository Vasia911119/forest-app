import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET all purchases
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('purchases').select('*').order('buyer');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// Add new purchase
export async function POST(request: Request) {
  const { buyer, product, species, volume, amount } = await request.json();
  if (!buyer || !product || !species || !volume || !amount) {
    return NextResponse.json({ error: 'Всі поля обовʼязкові' }, { status: 400 });
  }
  const supabase = await createClient();
  const { error } = await supabase.from('purchases').insert({ buyer, product, species, volume, amount });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Додано' }, { status: 201 });
}

// Delete purchase
export async function DELETE(request: Request) {
  const { buyer, product, species } = await request.json();
  if (!buyer || !product || !species) return NextResponse.json({ error: 'Всі поля обовʼязкові' }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from('purchases').delete().eq('buyer', buyer).eq('product', product).eq('species', species);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Видалено' }, { status: 200 });
}