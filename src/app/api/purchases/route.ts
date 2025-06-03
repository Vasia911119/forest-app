import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('purchases').select('buyer, product, species, volume, amount');
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    return NextResponse.json({ error: 'Не вдалося завантажити покупки' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const purchase = await request.json();
    const { data, error } = await supabase.from('purchases').insert(purchase);
    if (error) throw error;
    return NextResponse.json({ message: 'Покупка додана', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Не вдалося додати інформацію про покупку' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { buyer, product, species } = await request.json();

    if (!buyer || !product || !species) {
      return NextResponse.json({ error: 'Неповні дані для видалення' }, { status: 400 });
    }

    const { error } = await supabase
      .from('purchases')
      .delete()
      .match({ buyer, product, species });

    if (error) throw error;

    return NextResponse.json({ message: 'Покупка видалена' });
  } catch (error) {
    return NextResponse.json({ error: 'Не вдалося видалити інформацію про покупку' }, { status: 500 });
  }
}
