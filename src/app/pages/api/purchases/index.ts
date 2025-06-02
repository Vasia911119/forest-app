import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT buyer, product, species, volume, amount FROM purchases ORDER BY buyer;`;
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { buyer, product, species, volume, amount } = req.body;
      if (!buyer || !product || !species || typeof volume !== 'number' || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Усі поля є обов’язковими.' });
      }
      await sql`
        INSERT INTO purchases (buyer, product, species, volume, amount)
        VALUES (${buyer}, ${product}, ${species}, ${volume}, ${amount})
        ON CONFLICT (buyer, product, species) DO NOTHING;
      `;
      return res.status(201).json({ message: 'Інформацію про покупку додано.' });
    }

    if (req.method === 'DELETE') {
      const { buyer, product, species } = req.body;
      if (!buyer || !product || !species) {
        return res.status(400).json({ error: 'Поля buyer, product і species є обов’язковими.' });
      }
      const result = await sql`
        DELETE FROM purchases
        WHERE buyer = ${buyer} AND product = ${product} AND species = ${species};
      `;
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Інформацію про покупку не знайдено.' });
      }
      return res.status(200).json({ message: 'Інформацію про покупку видалено.' });
    }

    return res.status(405).json({ error: 'Метод не підтримується.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Помилка сервера.' });
  }
}