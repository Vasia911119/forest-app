import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT name FROM forests ORDER BY name;`;
      return res.status(200).json(result.rows.map(row => row.name));
    }

    if (req.method === 'POST') {
      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Назва лісництва є обов’язковою і має бути текстом.' });
      }
      await sql`INSERT INTO forests (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING;`;
      return res.status(201).json({ message: 'Лісництво додано.' });
    }

    if (req.method === 'DELETE') {
      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Назва лісництва є обов’язковою.' });
      }
      const result = await sql`DELETE FROM forests WHERE name = ${name};`;
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Лісництво не знайдено.' });
      }
      return res.status(200).json({ message: 'Лісництво видалено.' });
    }

    return res.status(405).json({ error: 'Метод не підтримується.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Помилка сервера.' });
  }
}