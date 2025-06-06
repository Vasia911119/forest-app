'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { TableData } from '../types';
import TableList from './TableList';
import TableView from './TableView';

export default function TableEditor() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [forests, setForests] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [species, setSpecies] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<{ buyer: string; product: string; species: string; volume: number; amount: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // Для модалки вибору дати при створенні таблиці
  const [showDateModal, setShowDateModal] = useState(false);
  const [pendingDate, setPendingDate] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const tablesRes = await fetch('/api/tables');
        if (!tablesRes.ok) throw new Error('Не вдалося завантажити таблиці');
        const tablesData = await tablesRes.json();
        setTables(tablesData);

        const forestsRes = await fetch('/api/forests');
        if (!forestsRes.ok) throw new Error('Не вдалося завантажити лісництва');
        const forestsData = await forestsRes.json();
        setForests(forestsData);

        const productsRes = await fetch('/api/products');
        if (!productsRes.ok) throw new Error('Не вдалося завантажити продукцію');
        const productsData = await productsRes.json();
        setProducts(productsData);

        const speciesRes = await fetch('/api/species');
        if (!speciesRes.ok) throw new Error('Не вдалося завантажити породи');
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);

        const purchasesRes = await fetch('/api/purchases');
        if (!purchasesRes.ok) throw new Error('Не вдалося завантажити покупки');
        const purchasesData = await purchasesRes.json();
        setPurchases(purchasesData);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        alert('Не вдалося завантажити дані.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Фільтруємо пусті рядки перед збереженням
  function sanitizeTables(tables: TableData[]): TableData[] {
    return tables.map(t => ({
      ...t,
      rows: (t.rows || []).filter(
        r =>
          r &&
          typeof r === 'object' &&
          'forest' in r &&
          'product' in r &&
          'species' in r &&
          r.forest !== '' &&
          r.product !== '' &&
          r.species !== ''
      )
    }));
  }

  const debouncedSave = useMemo(
    () =>
      debounce(async (rawData: { tables: TableData[] }) => {
        const data = { tables: sanitizeTables(rawData.tables) };
        console.log('debouncedSave payload:', JSON.stringify(data, null, 2));
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
        } catch (error) {
          console.error('Помилка збереження:', error);
          alert('Не вдалося зберегти дані: ' + (error instanceof Error ? error.message : error));
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
      const { id } = await res.json();
      const newTable: TableData = {
        id,
        date: pendingDate,
        rows: [],
      };
      setTables(prev => [...prev, newTable]);
      setPendingDate('');
      setShowDateModal(false);
    } catch (error) {
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
    [] // setTables не змінюється, тому залежності порожні
  );
  console.log('TableEditor tables:', tables);
  console.log('TableEditor forests:', forests);

  return (
    <div className="w-full overflow-x-auto p-4 sm:p-2">
      <button
        onClick={openDateModal}
        className="mb-4 sm:mb-2 bg-green-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-green-600 sm:text-sm md:text-base cursor-pointer"
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

      <TableList
        tables={tables}
        setTables={setTables}
        debouncedSave={debouncedSave}
        deleteTable={deleteTable}
        forests={forests}
        setForests={setForests}
        products={products}
        setProducts={setProducts}
        species={species}
        setSpecies={setSpecies}
        purchases={purchases}
        setPurchases={setPurchases}
      />
      <TableView tables={tables || []} forests={forests || []} />
    </div>
  );
}