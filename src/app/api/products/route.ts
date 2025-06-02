// import { NextApiRequest, NextApiResponse } from 'next';
// import { sql } from '@vercel/postgres';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     if (req.method === 'GET') {
//       const result = await sql`SELECT name FROM products ORDER BY name;`;
//       return res.status(200).json(result.rows.map(row => row.name));
//     }

//     if (req.method === 'POST') {
//       const { name } = req.body;
//       if (!name || typeof name !== 'string') {
//         return res.status(400).json({ error: 'Назва продукції є обов’язковою і має бути текстом.' });
//       }
//       await sql`INSERT INTO products (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING;`;
//       return res.status(201).json({ message: 'Продукцію додано.' });
//     }

//     if (req.method === 'DELETE') {
//       const { name } = req.body;
//       if (!name || typeof name !== 'string') {
//         return res.status(400).json({ error: 'Назва продукції є обов’язковою.' });
//       }
//       const result = await sql`DELETE FROM products WHERE name = ${name};`;
//       if (result.rowCount === 0) {
//         return res.status(404).json({ error: 'Продукцію не знайдено.' });
//       }
//       return res.status(200).json({ message: 'Продукцію видалено.' });
//     }

//     return res.status(405).json({ error: 'Метод не підтримується.' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Помилка сервера.' });
//   }
// }
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`SELECT name FROM products`;
    const products: string[] = result.rows.map(row => row.name);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Помилка завантаження продукції:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити продукцію' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { product } = await request.json();
    await sql`INSERT INTO products (name) VALUES (${product}) ON CONFLICT (name) DO NOTHING`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Помилка збереження продукції:', error);
    return NextResponse.json({ error: 'Не вдалося зберегти продукцію' }, { status: 500 });
  }
}