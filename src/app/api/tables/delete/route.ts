import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (typeof id !== 'number') return NextResponse.json({ error: 'Некоректний id' }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from('tables').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Таблиця видалена' }, { status: 200 });
}