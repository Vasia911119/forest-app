'use client';

import { useEffect, useState } from 'react';
import { TableData } from '../types';
import { loadRowsFromStorage } from '../utils/storage';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import TableDisplayList from './TableDisplayList';

// Реєстрація компонентів Chart.js
ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function TableView() {
  const [tables, setTables] = useState<TableData[]>([]);

  useEffect(() => {
    try {
      const saved = loadRowsFromStorage();
      setTables(saved.tables || []);
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
      setTables([]);
      alert('Не вдалося завантажити дані.');
    }
  }, []);

  return (
    <div className="p-4 sm:p-2">
      {tables.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-sm md:text-lg">Немає доступних таблиць для відображення.</p>
      ) : (
        <TableDisplayList tables={tables} />
      )}
    </div>
  );
}