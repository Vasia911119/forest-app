'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { TableData } from '../types';
import { saveRowsToStorage, loadRowsFromStorage } from '../utils/storage';
import TableList from './TableList';

export default function TableEditor() {
  const [tables, setTables] = useState<TableData[]>([]);

  useEffect(() => {
    try {
      const loaded = loadRowsFromStorage();
      if (loaded.tables.length > 0) {
        setTables(loaded.tables);
      } else {
        setTables([]);
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
    if (tables.length > 0) {
      const lastTable = tables[tables.length - 1];
      if (!lastTable.date) {
        alert('Будь ласка, введіть дату для поточної таблиці, перш ніж додавати нову.');
        return;
      }
    }

    const newTable: TableData = {
      date: '',
      rows: [],
    };
    setTables(prev => [...prev, newTable]);
  }, [tables]);

  // Функція для видалення цілої таблиці, визначена тут
  const deleteTable = useCallback((tableIdx: number) => {
    if (confirm('Ви впевнені, що хочете видалити цю таблицю?')) {
      const newTables = tables.filter((_, idx) => idx !== tableIdx);
      setTables(newTables);
      debouncedSave({ tables: newTables });
    }
  }, [tables, setTables, debouncedSave]); // Важливо: додаємо залежності useCallback

  return (
    <div className="w-full overflow-x-auto p-4 sm:p-2">
      <button
        onClick={addTable}
        className="mb-4 sm:mb-2 bg-green-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-green-600 sm:text-sm md:text-base"
      >
        Додати таблицю
      </button>
      <TableList
        tables={tables}
        setTables={setTables}
        debouncedSave={debouncedSave}
        deleteTable={deleteTable}
      />
    </div>
  );
}