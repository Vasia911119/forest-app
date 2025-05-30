'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Row, TableData } from '../types';
import { saveRowsToStorage, loadRowsFromStorage } from '../utils/storage';
import TableList from './TableList';

export default function TableEditor() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    try {
      const loaded = loadRowsFromStorage();
      if (loaded.tables.length > 0) {
        setTables(loaded.tables);
        const maxId = loaded.tables
        .flatMap((t: TableData) => t.rows)
        .reduce((max: number, row: Row) => Math.max(max, row.id), 0);
        setCounter(maxId + 1 || 1);
      } else {
        setTables([]);
        setCounter(1);
      }
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
      alert('Не вдалося завантажити дані.');
    }
  }, []);

  const debouncedSave = useMemo(() => debounce((data: { tables: TableData[] }) => {
    saveRowsToStorage(data);
  }, 500), []);

  const addTable = useCallback(() => {
    const newTable: TableData = {
      date: '',
      rows: [],
    };
    setTables(prev => [...prev, newTable]);
  }, []);

  return (
    <div className="w-full overflow-x-auto p-4 sm:p-2">
      <TableList
        tables={tables}
        setTables={setTables}
        counter={counter}
        setCounter={setCounter}
        debouncedSave={debouncedSave}
      />
      <button
        onClick={addTable}
        className="mt-4 sm:mt-2 bg-green-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-green-600 sm:text-sm md:text-base"
      >
        Додати таблицю
      </button>
    </div>
  );
}