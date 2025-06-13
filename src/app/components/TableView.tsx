'use client';

import { useEffect, useState, useCallback } from 'react';
import type { TableData } from '../types';
import TableDisplayList from './TableDisplayList';
import LoadingSpinner from './LoadingSpinner';

export default function TableView() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/tables');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Не вдалося завантажити дані: ${errorText}`);
      }
      const data = await res.json();
      setTables(Array.isArray(data.tables) ? data.tables : []);
    } catch (err) {
      console.error('Помилка завантаження даних:', err);
      setError(err instanceof Error ? err.message : 'Невідома помилка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 my-4">
        <p>Помилка: {error}</p>
        <button
          onClick={() => fetchData()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          type="button"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-0 md:px-4">
      {tables.length === 0 ? (
        <p className="text-center text-green-500 my-4">
          Немає таблиць для відображення
        </p>
      ) : (
        <TableDisplayList tables={tables} />
      )}
    </div>
  );
}