import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('purchases').select('buyer, product, species, volume, amount');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Помилка завантаження покупок:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити покупки' }, { status: 500 });
  }
}