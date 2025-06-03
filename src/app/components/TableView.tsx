'use client';

import { useEffect, useState } from 'react';
import { TableData } from '../types';
import TableDisplayList from './TableDisplayList';

export default function TableView() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [forests, setForests] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tablesRes = await fetch('/api/tables');
        if (!tablesRes.ok) throw new Error('Не вдалося завантажити таблиці');
        const tablesData = await tablesRes.json();
        setTables(tablesData);

        const forestsRes = await fetch('/api/forests');
        if (!forestsRes.ok) throw new Error('Не вдалося завантажити лісництва');
        const forestsData = await forestsRes.json();
        setForests(forestsData);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        alert('Не вдалося завантажити дані.');
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-2">
      {tables.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-sm md:text-lg">Немає доступних таблиць для відображення.</p>
      ) : (
        <TableDisplayList tables={tables} forests={forests} />
      )}
    </div>
  );
}