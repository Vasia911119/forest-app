// 'use client';

// import { useEffect, useState, useCallback, useMemo } from 'react';
// import debounce from 'lodash/debounce';
// import { TableData } from '../types';
// import TableList from './TableList';

// export default function TableEditor() {
//   const [tables, setTables] = useState<TableData[]>([]);
//   const [forests, setForests] = useState<string[]>([]);
//   const [products, setProducts] = useState<string[]>([]);
//   const [species, setSpecies] = useState<string[]>([]);
//   const [purchases, setPurchases] = useState<{ buyer: string; product: string; species: string; volume: number; amount: number }[]>([]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Завантаження таблиць
//         const tablesRes = await fetch('/api/tables');
//         if (!tablesRes.ok) throw new Error('Не вдалося завантажити таблиці');
//         const tablesData = await tablesRes.json();
//         setTables(tablesData);

//         // Завантаження лісництв
//         const forestsRes = await fetch('/api/forests');
//         if (!forestsRes.ok) throw new Error('Не вдалося завантажити лісництва');
//         const forestsData = await forestsRes.json();
//         setForests(forestsData);

//         // Завантаження продукції
//         const productsRes = await fetch('/api/products');
//         if (!productsRes.ok) throw new Error('Не вдалося завантажити продукцію');
//         const productsData = await productsRes.json();
//         setProducts(productsData);

//         // Завантаження порід
//         const speciesRes = await fetch('/api/species');
//         if (!speciesRes.ok) throw new Error('Не вдалося завантажити породи');
//         const speciesData = await speciesRes.json();
//         setSpecies(speciesData);

//         // Завантаження покупок
//         const purchasesRes = await fetch('/api/purchases');
//         if (!purchasesRes.ok) throw new Error('Не вдалося завантажити покупки');
//         const purchasesData = await purchasesRes.json();
//         setPurchases(purchasesData);
//       } catch (error) {
//         console.error('Помилка завантаження даних:', error);
//         alert('Не вдалося завантажити дані.');
//       }
//     };

//     loadData();
//   }, []);

//   const debouncedSave = useMemo(() => debounce(async (data: { tables: TableData[] }) => {
//     try {
//       await Promise.all(data.tables.map(async (table) => {
//         await fetch('/api/tables', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(table),
//         });
//       }));
//     } catch (error) {
//       console.error('Помилка збереження таблиць:', error);
//       alert('Не вдалося зберегти таблиці.');
//     }
//   }, 500), []);

//   const addTable = useCallback(() => {
//     if (tables.length > 0) {
//       const lastTable = tables[tables.length - 1];
//       if (!lastTable.date) {
//         alert('Будь ласка, введіть дату для поточної таблиці, перш ніж додавати нову.');
//         return;
//       }
//     }

//     const newTable: TableData = {
//       date: '',
//       rows: [],
//     };
//     setTables(prev => [...prev, newTable]);
//   }, [tables]);

//   const deleteTable = useCallback(async (tableIdx: number) => {
//     if (confirm('Ви впевнені, що хочете видалити цю таблицю?')) {
//       const tableToDelete = tables[tableIdx];
//       try {
//         const res = await fetch('/api/tables', {
//           method: 'DELETE',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ date: tableToDelete.date }),
//         });
//         if (!res.ok) throw new Error('Не вдалося видалити таблицю');
//         const newTables = tables.filter((_, idx) => idx !== tableIdx);
//         setTables(newTables);
//       } catch (error) {
//         console.error('Помилка видалення таблиці:', error);
//         alert('Не вдалося видалити таблицю.');
//       }
//     }
//   }, [tables]);

//   return (
//     <div className="w-full overflow-x-auto p-4 sm:p-2">
//       <button
//         onClick={addTable}
//         className="mb-4 sm:mb-2 bg-green-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-green-600 sm:text-sm md:text-base cursor-pointer"
//       >
//         Додати таблицю
//       </button>
//       <TableList
//         tables={tables}
//         setTables={setTables}
//         debouncedSave={debouncedSave}
//         deleteTable={deleteTable}
//         forests={forests}
//         setForests={setForests}
//         products={products}
//         setProducts={setProducts}
//         species={species}
//         setSpecies={setSpecies}
//         purchases={purchases}
//         setPurchases={setPurchases}
//       />
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { TableData } from '../types';
import TableList from './TableList';
import TableView from './TableView';

export default function TableEditor() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [forests, setForests] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [species, setSpecies] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<{ buyer: string; product: string; species: string; volume: number; amount: number }[]>([]);

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
      }
    };

    loadData();
  }, []);

  const debouncedSave = useMemo(() => debounce(async (data: { tables: TableData[] }) => {
    try {
      await Promise.all(data.tables.map(async (table) => {
        await fetch('/api/tables', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(table),
        });
      }));
    } catch (error) {
      console.error('Помилка збереження таблиць:', error);
      alert('Не вдалося зберегти таблиці.');
    }
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

  const deleteTable = useCallback(async (tableIdx: number) => {
    if (confirm('Ви впевнені, що хочете видалити цю таблицю?')) {
      const tableToDelete = tables[tableIdx];
      try {
        const res = await fetch('/api/tables', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: tableToDelete.date }),
        });
        if (!res.ok) throw new Error('Не вдалося видалити таблицю');
        const newTables = tables.filter((_, idx) => idx !== tableIdx);
        setTables(newTables);
      } catch (error) {
        console.error('Помилка видалення таблиці:', error);
        alert('Не вдалося видалити таблицю.');
      }
    }
  }, [tables]);

  return (
    <div className="w-full overflow-x-auto p-4 sm:p-2">
      <button
        onClick={addTable}
        className="mb-4 sm:mb-2 bg-green-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-green-600 sm:text-sm md:text-base cursor-pointer"
      >
        Додати таблицю
      </button>
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
      <TableView />
    </div>
  );
}