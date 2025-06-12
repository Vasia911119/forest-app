import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/rows?tableId=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    const supabase = await createClient();
    let query = supabase.from('rows').select('*');
    if (tableId) {
      query = query.eq('table_id', Number(tableId));
    }
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}

// DELETE /api/rows?id=15
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Потрібен id рядка' }, { status: 400 });
    }
    const supabase = await createClient();
    const { error } = await supabase.from('rows').delete().eq('id', Number(id));
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}

// PATCH /api/rows?id=15
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Потрібен id рядка' }, { status: 400 });
    }
    const body = await request.json();
    const supabase = await createClient();
    const { data, error } = await supabase.from('rows').update(body).eq('id', Number(id)).select('*').single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
}

// POST /api/rows
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валідація обов'язкових полів
    if (!body.table_id) {
      return NextResponse.json({ error: 'Потрібен table_id' }, { status: 400 });
    }

    // Перетворення числових значень
    const rowData = {
      ...body,
      table_id: Number(body.table_id),
      volume: Number(body.volume) || 0,
      amount: Number(body.amount) || 0
    };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('rows')
      .insert(rowData)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Внутрішня помилка сервера' }, { status: 500 });
  }
} 