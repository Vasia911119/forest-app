'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import type { TableData } from '../types';
import TableList from './TableList';
import LoadingSpinner from './LoadingSpinner';

export default function TableEditor() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [forests, setForests] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [species, setSpecies] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<{ buyer: string; product: string; species: string; volume: number; amount: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Для модалки вибору дати при створенні таблиці
  const [showDateModal, setShowDateModal] = useState(false);
  const [pendingDate, setPendingDate] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд таймаут

      try {
        const [tablesRes, forestsRes, productsRes, speciesRes, purchasesRes] = await Promise.all([
          fetch('/api/tables', { signal: controller.signal }),
          fetch('/api/forests', { signal: controller.signal }),
          fetch('/api/products', { signal: controller.signal }),
          fetch('/api/species', { signal: controller.signal }),
          fetch('/api/purchases', { signal: controller.signal })
        ]);

        if (!tablesRes.ok) throw new Error('Не вдалося завантажити таблиці');
        if (!forestsRes.ok) throw new Error('Не вдалося завантажити лісництва');
        if (!productsRes.ok) throw new Error('Не вдалося завантажити продукцію');
        if (!speciesRes.ok) throw new Error('Не вдалося завантажити породи');
        if (!purchasesRes.ok) throw new Error('Не вдалося завантажити покупки');

        const [tablesData, forestsData, productsData, speciesData, purchasesData] = await Promise.all([
          tablesRes.json(),
          forestsRes.json(),
          productsRes.json(),
          speciesRes.json(),
          purchasesRes.json()
        ]);

        setTables(Array.isArray(tablesData.tables) ? tablesData.tables : []);
        setForests(forestsData);
        setProducts(productsData);
        setSpecies(speciesData);
        setPurchases(purchasesData);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            setError('Час очікування вичерпано. Перевірте підключення до інтернету.');
          } else {
            setError(error.message || 'Невідома помилка');
          }
        } else {
          setError('Невідома помилка');
        }
        console.error('Помилка завантаження даних:', error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // sanitizeTables тепер не фільтрує порожні рядки
  function sanitizeTables(tables: TableData[]): TableData[] {
    return tables.map(t => ({
      ...t,
      rows: t.rows || []
    }));
  }

  const debouncedSave = useMemo(
    () =>
      debounce(async (rawData: { tables: TableData[] }) => {
        const data = { tables: sanitizeTables(rawData.tables) };
        // console.log('debouncedSave payload:', JSON.stringify(data, null, 2));
        try {
          const res = await fetch('/api/tables', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) {
            let text = '';
            try {
              text = await res.text();
            } catch {}
            throw new Error('Не вдалося зберегти дані. Сервер відповів: ' + text);
          }
          const responseData = await res.json();
          return responseData;
        } catch (error) {
          console.error('Помилка збереження:', error);
          alert('Не вдалося зберегти дані: ' + (error instanceof Error ? error.message : error));
          return null;
        }
      }, 1000),
    []
  );

  // Додаємо таблицю через модалку з вибором дати
  const openDateModal = useCallback(() => {
    setPendingDate('');
    setShowDateModal(true);
  }, []);

  const createTableWithDate = useCallback(async () => {
    if (!pendingDate) return;
    // Перевірка, щоб не було дубля дати (опційно)
    if (tables.some(t => t.date === pendingDate)) {
      alert('Таблиця з такою датою вже існує!');
      return;
    }
    try {
      const res = await fetch('/api/tables/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: pendingDate }),
      });
      if (!res.ok) throw new Error('Не вдалося створити таблицю');
      // Після створення — оновлюємо масив таблиць з сервера
      const tablesRes = await fetch('/api/tables');
      const tablesData = await tablesRes.json();
      setTables(Array.isArray(tablesData.tables) ? tablesData.tables : []);
      setPendingDate('');
      setShowDateModal(false);
    } catch (error) {
      console.error(error);
      alert('Не вдалося створити таблицю.');
    }
  }, [pendingDate, tables]);

  // ОНОВЛЕНА ФУНКЦІЯ ВИДАЛЕННЯ ТАБЛИЦІ
  const deleteTable = useCallback(
    async (tableId: number) => {
      try {
        const res = await fetch('/api/tables/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: tableId }),
        });
        await res.json();
        if (!res.ok) throw new Error('Не вдалося видалити таблицю');
        setTables(prevTables => prevTables.filter(table => table.id !== tableId));
      } catch (error) {
        console.error('Помилка видалення таблиці:', error);
        alert('Не вдалося видалити таблицю.');
      }
    },
    []
  );

  // Додаємо функцію для додавання рядка
  const addRow = useCallback(async (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) {
      alert('Таблиця не знайдена');
      return;
    }
    try {
      const res = await fetch('/api/rows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_id: tableId,
          forest: '',
          buyer: '',
          product: '',
          species: '',
          volume: 1,
          amount: 1
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Add row response:', { status: res.status, text: errorText });
        throw new Error('Не вдалося додати рядок');
      }
      
      const newRow = await res.json();
      setTables(prevTables => prevTables.map(table =>
        table.id === tableId
          ? { ...table, rows: [...table.rows, newRow] }
          : table
      ));
    } catch (error) {
      console.error('Помилка додавання рядка:', error);
      alert('Не вдалося додати рядок.');
    }
  }, [tables]);

  // ОНОВЛЕНА функція видалення рядка
  const deleteRow = useCallback(async (tableId: number, rowId: number) => {
    try {
      const res = await fetch(`/api/rows?id=${rowId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete row response:', { status: res.status, text: errorText });
        throw new Error('Не вдалося видалити рядок');
      }
      setTables(prevTables =>
        prevTables.map(table =>
          table.id === tableId
            ? { ...table, rows: table.rows.filter(row => row.id !== rowId) }
            : table
        )
      );
    } catch (error) {
      console.error('Помилка видалення рядка:', error);
      alert('Не вдалося видалити рядок.');
    }
  }, [tables]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return (
    <div className="w-full overflow-x-auto p-4 sm:p-2">
      {loading && <LoadingSpinner />}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Помилка:</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Спробувати ще раз
          </button>
        </div>
      )}

      {/* TableList з кнопкою ⇅ Вхідні дані тепер першою */}
      <TableList
        tables={tables}
        setTables={setTables}
        debouncedSave={debouncedSave}
        deleteTable={deleteTable}
        deleteRow={deleteRow}
        addRow={addRow}
        forests={forests}
        setForests={setForests}
        products={products}
        setProducts={setProducts}
        species={species}
        setSpecies={setSpecies}
        purchases={purchases}
        setPurchases={setPurchases}
      />

      {/* Кнопка Додати таблицю тепер нижче */}
      <button
        onClick={openDateModal}
        className="mt-4 sm:mt-2 bg-emerald-600 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-emerald-700 sm:text-sm md:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
        type="button"
        aria-label="Додати таблицю"
      >
        {loading ? "Завантаження..." : "Додати таблицю"}
      </button>

      {/* Модалка вибору дати для створення нової таблиці */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[300px] flex flex-col gap-4">
            <label htmlFor="table-date" className="font-semibold">Оберіть дату для нової таблиці:</label>
            <input
              id="table-date"
              type="date"
              value={pendingDate}
              onChange={e => setPendingDate(e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDateModal(false)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                type="button"
              >Скасувати</button>
              <button
                className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
                type="button"
                disabled={!pendingDate}
                onClick={createTableWithDate}
              >Створити</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}