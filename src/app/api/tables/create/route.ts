import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { date } = await request.json();
  if (!date) return NextResponse.json({ error: 'Неправильна дата' }, { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.from('tables').insert({ date }).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}