import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT date, rows FROM tables ORDER BY date;`;
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { date, rows } = req.body;
      if (!date || !Array.isArray(rows)) {
        return res.status(400).json({ error: 'Дата і рядки є обов’язковими.' });
      }
      await sql`
        INSERT INTO tables (date, rows)
        VALUES (${date}, ${rows}::jsonb)
        ON CONFLICT (date) DO UPDATE SET rows = EXCLUDED.rows;
      `;
      return res.status(201).json({ message: 'Таблицю додано або оновлено.' });
    }

    if (req.method === 'DELETE') {
      const { date } = req.body;
      if (!date) {
        return res.status(400).json({ error: 'Дата є обов’язковою.' });
      }
      const result = await sql`DELETE FROM tables WHERE date = ${date};`;
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Таблицю не знайдено.' });
      }
      return res.status(200).json({ message: 'Таблицю видалено.' });
    }

    return res.status(405).json({ error: 'Метод не підтримується.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Помилка сервера.' });
  }
}