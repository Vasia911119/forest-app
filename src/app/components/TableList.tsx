import { useState, useCallback, useMemo } from 'react';
import DateInput from './DateInput';
import EditableDataTable from './EditableDataTable';
import AddRowButton from './AddRowButton';
import type { Row, TableData } from '../types';

interface TableListProps {
  tables: TableData[];
  setTables: (tables: TableData[]) => void;
  debouncedSave: (data: { tables: TableData[] }) => void;
  deleteTable: (tableId: number) => void;
  forests: (string | { name: string })[];
  setForests: (forests: string[]) => void;
  products: (string | { name: string })[];
  setProducts: (products: string[]) => void;
  species: (string | { name: string })[];
  setSpecies: (species: string[]) => void;
  purchases: { buyer: string; product: string; species: string; volume: number; amount: number }[];
  setPurchases: (purchases: { buyer: string; product: string; species: string; volume: number; amount: number }[]) => void;
}

function getTableKey(table: TableData) {
  if (table.id === undefined || table.id === null) {
    if (!table._tmpId) {
      table._tmpId = `tmp-${Date.now()}-${Math.random()}`;
    }
    return table._tmpId;
  }
  return `table-${table.id}`;
}

export default function TableList({
  tables,
  setTables,
  debouncedSave,
  deleteTable,
  forests,
  setForests,
  products,
  setProducts,
  species,
  setSpecies,
  purchases,
  setPurchases,
}: TableListProps) {
  const [newForest, setNewForest] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newSpecies, setNewSpecies] = useState('');
  const [newPurchase, setNewPurchase] = useState({ buyer: '', product: '', species: '', volume: 0, amount: 0 });
  const [isManageOpen, setIsManageOpen] = useState(false);

  const [loadingForest, setLoadingForest] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [loadingPurchase, setLoadingPurchase] = useState(false);

  const mappedForests = useMemo(() => forests.map(f => (typeof f === 'string' ? f : f.name || '')), [forests]);
  const mappedProducts = useMemo(() => products.map(p => (typeof p === 'string' ? p : p.name || '')), [products]);
  const mappedSpecies = useMemo(() => species.map(s => (typeof s === 'string' ? s : s.name || '')), [species]);

  const addRow = async (tableIdx: number) => {
    const table = tables[tableIdx];
      if (!table || !table.date) {
      alert('Будь ласка, спочатку введіть дату для цієї таблиці.');
  return;
}

    let currentTable = table;
    if (!currentTable.id) {
      try {
        const res = await fetch('/api/tables/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: currentTable.date }),
        });
        if (!res.ok) throw new Error('Не вдалося створити таблицю');
        const { id } = await res.json();
        currentTable = { ...currentTable, id };
        const newTables = [...tables];
        newTables[tableIdx] = currentTable;
        setTables(newTables);
      } catch (error) {
        console.error('Помилка створення таблиці:', error);
        alert('Не вдалося створити таблицю.');
        return;
      }
    }

    const newRow: Row = {
      forest: '',
      buyer: '',
      product: '',
      species: '',
      volume: 0,
      amount: 0,
    };
    const newTables = [...tables];
    newTables[tableIdx] = { ...currentTable, rows: [...currentTable.rows, newRow] };
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const deleteRow = async (tableIdx: number, rowId?: number) => {
    if (!rowId) {
      alert('Цей рядок ще не збережений у базі або вже видалений.');
      return;
    }
    try {
      const table = tables[tableIdx];
      if (!table || !table.id) {
        alert('Таблиця не збережена в базі даних. Спочатку збережіть таблицю.');
        return;
      }
      const res = await fetch('/api/tables/delete-row', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: table.id, rowId }),
      });
      if (!res.ok) throw new Error('Не вдалося видалити рядок');
  
      const newTables = [...tables];
      if (!newTables[tableIdx]?.rows) return;
      newTables[tableIdx].rows = newTables[tableIdx].rows.filter(row => row.id !== rowId);
      setTables(newTables);
      debouncedSave({ tables: newTables });
    } catch (error) {
      console.error('Помилка видалення рядка:', error);
      alert('Не вдалося видалити рядок.');
    }
  };

  const handleFieldChange = (tableIdx: number, rowIdx: number, field: keyof Row, value: string | number) => {
    const newTables = [...tables];
    if (!newTables[tableIdx] || !newTables[tableIdx].rows[rowIdx]) return;
    (newTables[tableIdx].rows[rowIdx][field] as string | number) = value;
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const handleBuyerChange = (tableIdx: number, rowIdx: number, buyer: string) => {
    const newTables = [...tables];
    if (!newTables[tableIdx] || !newTables[tableIdx].rows[rowIdx]) return;
    const newRow = { ...newTables[tableIdx].rows[rowIdx], buyer };

    if (!buyer) {
      newRow.product = '';
      newRow.species = '';
      newRow.volume = 0;
      newRow.amount = 0;
    } else {
      const relatedPurchase = purchases.find(p => p.buyer === buyer);
      if (relatedPurchase) {
        newRow.product = relatedPurchase.product;
        newRow.species = relatedPurchase.species;
        newRow.volume = relatedPurchase.volume;
        newRow.amount = relatedPurchase.amount;
      } else {
        newRow.product = '';
        newRow.species = '';
        newRow.volume = 0;
        newRow.amount = 0;
      }
    }
    newTables[tableIdx].rows[rowIdx] = newRow;
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const setDate = useCallback(
    (tableIdx: number, newDate: string) => {
      // Перевірка унікальності дати серед інших таблиць
      if (tables.some((t, idx) => t.date === newDate && idx !== tableIdx)) {
        alert('Таблиця з такою датою вже існує!');
        return;
      }
  
      const newTables = [...tables];
      let currentTable = newTables[tableIdx];
      
      if (!currentTable) return;
      if (!currentTable.id) {
        fetch('/api/tables/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: newDate }),
        })
          .then(res => {
            if (!res.ok) throw new Error('Не вдалося створити таблицю');
            return res.json();
          })
          .then(({ id }) => {
            if (!currentTable) return;
            currentTable = { ...currentTable, id, date: newDate };
            newTables[tableIdx] = currentTable;
            setTables(newTables);
            debouncedSave({ tables: newTables });
          })
          .catch(error => {
            console.error('Помилка створення таблиці:', error);
            alert('Не вдалося створити таблицю.');
          });
      } else {
        currentTable.date = newDate;
        newTables[tableIdx] = currentTable;
        setTables(newTables);
        debouncedSave({ tables: newTables });
      }
    },
    [tables, setTables, debouncedSave]
  );

  // Forests CRUD
  const addForest = async () => {
    if (!newForest.trim()) {
      alert('Будь ласка, введіть назву лісництва.');
      return;
    }
    if (mappedForests.includes(newForest.trim())) {
      alert('Це лісництво вже існує.');
      return;
    }
    setLoadingForest(true);
    try {
      const res = await fetch('/api/forests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newForest.trim() }),
      });
      if (!res.ok) throw new Error('Не вдалося додати лісництво');
      const updatedForests = [...mappedForests, newForest.trim()];
      setForests(updatedForests);
      setNewForest('');
    } catch (error) {
      console.error('Помилка додавання лісництва:', error);
      alert('Не вдалося додати лісництво.');
    }
    setLoadingForest(false);
  };

  const deleteForest = async (forest: string) => {
    const isUsed = tables.some(table => table.rows.some(row => row.forest === forest));
    if (isUsed) {
      alert('Це лісництво використовується в таблиці. Видаліть відповідні рядки перед видаленням.');
      return;
    }
    if (confirm(`Ви впевнені, що хочете видалити лісництво "${forest}"?`)) {
      setLoadingForest(true);
      try {
        const res = await fetch('/api/forests', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: forest }),
        });
        if (!res.ok) throw new Error('Не вдалося видалити лісництво');
        const updatedForests = mappedForests.filter(f => f !== forest);
        setForests(updatedForests);
      } catch (error) {
        console.error('Помилка видалення лісництва:', error);
        alert('Не вдалося видалити лісництво.');
      }
      setLoadingForest(false);
    }
  };

  // Products CRUD
  const addProduct = async () => {
    if (!newProduct.trim()) {
      alert('Будь ласка, введіть назву продукції.');
      return;
    }
    if (mappedProducts.includes(newProduct.trim())) {
      alert('Ця продукція вже існує.');
      return;
    }
    setLoadingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProduct.trim() }),
      });
      if (!res.ok) throw new Error('Не вдалося додати продукцію');
      const updatedProducts = [...mappedProducts, newProduct.trim()];
      setProducts(updatedProducts);
      setNewProduct('');
    } catch (error) {
      console.error('Помилка додавання продукції:', error);
      alert('Не вдалося додати продукцію.');
    }
    setLoadingProduct(false);
  };

  const deleteProduct = async (product: string) => {
    const isUsed =
      tables.some(table => table.rows.some(row => row.product === product)) ||
      purchases.some(purchase => purchase.product === product);
    if (isUsed) {
      alert('Ця продукція використовується в таблиці або в інформації про покупку. Видаліть відповідні записи перед видаленням.');
      return;
    }
    if (confirm(`Ви впевнені, що хочете видалити продукцію "${product}"?`)) {
      setLoadingProduct(true);
      try {
        const res = await fetch('/api/products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: product }),
        });
        if (!res.ok) throw new Error('Не вдалося видалити продукцію');
        const updatedProducts = mappedProducts.filter(p => p !== product);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Помилка видалення продукції:', error);
        alert('Не вдалося видалити продукцію.');
      }
      setLoadingProduct(false);
    }
  };

  // Species CRUD
  const addSpecies = async () => {
    if (!newSpecies.trim()) {
      alert('Будь ласка, введіть породу.');
      return;
    }
    if (mappedSpecies.includes(newSpecies.trim())) {
      alert('Ця порода вже існує.');
      return;
    }
    setLoadingSpecies(true);
    try {
      const res = await fetch('/api/species', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSpecies.trim() }),
      });
      if (!res.ok) throw new Error('Не вдалося додати породу');
      const updatedSpecies = [...mappedSpecies, newSpecies.trim()];
      setSpecies(updatedSpecies);
      setNewSpecies('');
    } catch (error) {
      console.error('Помилка додавання породи:', error);
      alert('Не вдалося додати породу.');
    }
    setLoadingSpecies(false);
  };

  const deleteSpecies = async (specie: string) => {
    const isUsed =
      tables.some(table => table.rows.some(row => row.species === specie)) ||
      purchases.some(purchase => purchase.species === specie);
    if (isUsed) {
      alert('Ця порода використовується в таблиці або в інформації про покупку. Видаліть відповідні записи перед видаленням.');
      return;
    }
    if (confirm(`Ви впевнені, що хочете видалити породу "${specie}"?`)) {
      setLoadingSpecies(true);
      try {
        const res = await fetch('/api/species', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: specie }),
        });
        if (!res.ok) throw new Error('Не вдалося видалити породу');
        const updatedSpecies = mappedSpecies.filter(s => s !== specie);
        setSpecies(updatedSpecies);
      } catch (error) {
        console.error('Помилка видалення породи:', error);
        alert('Не вдалося видалити породу.');
      }
      setLoadingSpecies(false);
    }
  };

  // Purchases CRUD
  const addPurchase = async () => {
    if (
      !newPurchase.buyer.trim() ||
      !newPurchase.product.trim() ||
      !newPurchase.species.trim() ||
      newPurchase.volume <= 0 ||
      newPurchase.amount <= 0
    ) {
      alert('Будь ласка, заповніть усі поля для інформації про покупку.');
      return;
    }
    if (
      purchases.some(
        p =>
          p.buyer === newPurchase.buyer &&
          p.product === newPurchase.product &&
          p.species === newPurchase.species
      )
    ) {
      alert('Ця інформація про покупку вже існує.');
      return;
    }
    setLoadingPurchase(true);
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: newPurchase.buyer.trim(),
          product: newPurchase.product.trim(),
          species: newPurchase.species.trim(),
          volume: newPurchase.volume,
          amount: newPurchase.amount,
        }),
      });
      if (!res.ok) throw new Error('Не вдалося додати інформацію про покупку');
      const updatedPurchases = [...purchases, { ...newPurchase }];
      setPurchases(updatedPurchases);
      setNewPurchase({ buyer: '', product: '', species: '', volume: 0, amount: 0 });
    } catch (error) {
      console.error('Помилка додавання інформації про покупку:', error);
      alert('Не вдалося додати інформацію про покупку.');
    }
    setLoadingPurchase(false);
  };

  const deletePurchase = async (purchase: { buyer: string; product: string; species: string; volume: number; amount: number }) => {
    const isUsed = tables.some(table => table.rows.some(row => row.buyer === purchase.buyer));
    if (isUsed) {
      alert('Цей покупець використовується в таблиці. Видаліть відповідні рядки перед видаленням.');
      return;
    }
    if (
      confirm(
        `Ви впевнені, що хочете видалити інформацію про покупку "${purchase.buyer} - ${purchase.product} - ${purchase.species}"?`
      )
    ) {
      setLoadingPurchase(true);
      try {
        const res = await fetch('/api/purchases', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyer: purchase.buyer,
            product: purchase.product,
            species: purchase.species,
          }),
        });
        if (!res.ok) throw new Error('Не вдалося видалити інформацію про покупку');
        const updatedPurchases = purchases.filter(
          p =>
            !(
              p.buyer === purchase.buyer &&
              p.product === purchase.product &&
              p.species === purchase.species
            )
        );
        setPurchases(updatedPurchases);
      } catch (error) {
        console.error('Помилка видалення інформації про покупку:', error);
        alert('Не вдалося видалити інформацію про покупку.');
      }
      setLoadingPurchase(false);
    }
  };

  return (
    <>
      {tables.map((table, idx) => (
        <div key={getTableKey(table,)} className="mb-6 border rounded p-4 sm:p-2">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            <DateInput tableId={idx} date={table.date} setDate={setDate} />
            {typeof table.id === "number" && (
              <button
                onClick={() => deleteTable(table.id!)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 sm:px-3 sm:py-1 sm:text-sm md:text-base cursor-pointer"
                aria-label="Видалити таблицю"
                type="button"
              >
                Видалити таблицю
              </button>
            )}
          </div>
          <EditableDataTable
            tableId={idx}
            rows={table.rows}
            handleFieldChange={handleFieldChange}
            handleBuyerChange={handleBuyerChange}
            deleteRow={deleteRow}
            forests={mappedForests}
            purchases={purchases}
            products={mappedProducts}
            species={mappedSpecies}
          />
          <AddRowButton tableId={idx} addRow={addRow} />
        </div>
      ))}
      <div className="mt-6 p-4">
        <button
          onClick={() => setIsManageOpen(!isManageOpen)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
          type="button"
          aria-label={isManageOpen ? "Приховати керування значеннями" : "Керування значеннями"}
        >
          {isManageOpen ? 'Приховати керування значеннями' : 'Керування значеннями'}
        </button>
        {isManageOpen && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-lg font-bold mb-4">Керування значеннями</h3>
            <div className="flex flex-col gap-6">
              {/* Лісництва */}
              <div className="flex flex-col gap-2">
                <h4 className="text-md font-semibold">Лісництва</h4>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="text"
                    value={newForest}
                    onChange={e => setNewForest(e.target.value)}
                    placeholder="Нове лісництво"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                    aria-label="Додати нове лісництво"
                  />
                  <button
                    onClick={addForest}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:text-sm md:text-base cursor-pointer"
                    disabled={loadingForest}
                    type="button"
                    aria-label="Додати лісництво"
                  >
                    {loadingForest ? "Додається..." : "Додати лісництво"}
                  </button>
                </div>
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {mappedForests.map((forest) => (
                    <li key={forest} className="flex justify-between items-center py-1">
                      <span>{forest}</span>
                      <button
                        onClick={() => deleteForest(forest)}
                        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
                        title="Видалити лісництво"
                        aria-label={`Видалити лісництво ${forest}`}
                        type="button"
                        disabled={loadingForest}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Продукція */}
              <div className="flex flex-col gap-2">
                <h4 className="text-md font-semibold">Найменування продукції</h4>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="text"
                    value={newProduct}
                    onChange={e => setNewProduct(e.target.value)}
                    placeholder="Нове найменування продукції"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                    aria-label="Додати нову продукцію"
                  />
                  <button
                    onClick={addProduct}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:text-sm md:text-base cursor-pointer"
                    disabled={loadingProduct}
                    type="button"
                    aria-label="Додати продукцію"
                  >
                    {loadingProduct ? "Додається..." : "Додати найменування продукції"}
                  </button>
                </div>
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {mappedProducts.map((product) => (
                    <li key={product} className="flex justify-between items-center py-1">
                      <span>{product}</span>
                      <button
                        onClick={() => deleteProduct(product)}
                        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
                        title="Видалити продукцію"
                        aria-label={`Видалити продукцію ${product}`}
                        type="button"
                        disabled={loadingProduct}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Породи */}
              <div className="flex flex-col gap-2">
                <h4 className="text-md font-semibold">Породи</h4>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="text"
                    value={newSpecies}
                    onChange={e => setNewSpecies(e.target.value)}
                    placeholder="Нова порода"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                    aria-label="Додати нову породу"
                  />
                  <button
                    onClick={addSpecies}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:text-sm md:text-base cursor-pointer"
                    disabled={loadingSpecies}
                    type="button"
                    aria-label="Додати породу"
                  >
                    {loadingSpecies ? "Додається..." : "Додати породу"}
                  </button>
                </div>
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {mappedSpecies.map((specie) => (
                    <li key={specie} className="flex justify-between items-center py-1">
                      <span>{specie}</span>
                      <button
                        onClick={() => deleteSpecies(specie)}
                        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
                        title="Видалити породу"
                        aria-label={`Видалити породу ${specie}`}
                        type="button"
                        disabled={loadingSpecies}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Покупки */}
              <div className="flex flex-col gap-2">
                <h4 className="text-md font-semibold">Інформація про покупки</h4>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="text"
                    value={newPurchase.buyer}
                    onChange={e => setNewPurchase({ ...newPurchase, buyer: e.target.value })}
                    placeholder="Покупець"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                    aria-label="Покупець для покупки"
                  />
                  <input
                    type="text"
                    value={newPurchase.product}
                    onChange={e => setNewPurchase({ ...newPurchase, product: e.target.value })}
                    placeholder="Продукція"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                    aria-label="Продукція для покупки"
                  />
                  <input
                    type="text"
                    value={newPurchase.species}
                    onChange={e => setNewPurchase({ ...newPurchase, species: e.target.value })}
                    placeholder="Порода"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                    aria-label="Порода для покупки"
                  />
                  <input
                    type="number"
                    value={newPurchase.volume}
                    onChange={e => setNewPurchase({ ...newPurchase, volume: parseInt(e.target.value) || 0 })}
                    placeholder="Об’єм (м³)"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base w-24 cursor-pointer"
                    min="0"
                    step="1"
                    aria-label="Об’єм покупки"
                  />
                  <input
                    type="number"
                    value={newPurchase.amount}
                    onChange={e => setNewPurchase({ ...newPurchase, amount: parseInt(e.target.value) || 0 })}
                    placeholder="Сума (грн)"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base w-24 cursor-pointer"
                    min="0"
                    step="1"
                    aria-label="Сума покупки"
                  />
                  <button
                    onClick={addPurchase}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:text-sm md:text-base cursor-pointer"
                    disabled={loadingPurchase}
                    type="button"
                    aria-label="Додати інформацію про покупку"
                  >
                    {loadingPurchase ? "Додається..." : "Додати інформацію про покупку"}
                  </button>
                </div>
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {purchases.map((purchase) => (
                    <li key={`${purchase.buyer}-${purchase.product}-${purchase.species}`} className="flex justify-between items-center py-1">
                      <span>{`${purchase.buyer} - ${purchase.product} - ${purchase.species} (${purchase.volume} м³, ${purchase.amount} грн)`}</span>
                      <button
                        onClick={() => deletePurchase(purchase)}
                        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
                        title="Видалити інформацію про покупку"
                        aria-label={`Видалити інформацію про покупку: ${purchase.buyer}, ${purchase.product}, ${purchase.species}`}
                        type="button"
                        disabled={loadingPurchase}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}