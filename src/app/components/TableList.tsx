'use client';
import { useState, useCallback } from 'react';
import DateInput from './DateInput';
import EditableDataTable from './EditableDataTable';
import type { Row, TableData, Purchase } from '../types';

interface TableListProps {
  tables: TableData[];
  setTables: (tables: TableData[]) => void;
  debouncedSave: (data: { tables: TableData[] }) => void;
  deleteTable: (id: number) => void;
  deleteRow: (tableId: number, rowId: number) => Promise<void>;
  addRow: (tableId: number) => Promise<void>;
  forests: string[];
  setForests: (forests: string[]) => void;
  products: string[];
  setProducts: (products: string[]) => void;
  species: string[];
  setSpecies: (species: string[]) => void;
  purchases: Purchase[];
  setPurchases: (purchases: Purchase[]) => void;
}

export default function TableList({
  tables,
  setTables,
  debouncedSave,
  deleteTable,
  deleteRow,
  addRow,
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
  const [newPurchase, setNewPurchase] = useState<Purchase>({ buyer: '', product: '', species: '', volume: 0, amount: 0 });

  const [loadingForest, setLoadingForest] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [loadingPurchase, setLoadingPurchase] = useState(false);

  const [showReferences, setShowReferences] = useState(false);

  const handleFieldChange = useCallback((tableId: number, rowIndex: number, field: keyof Row, value: string | number) => {
    const updatedTables = tables.map(table => {
      if (table.id === tableId) {
        const updatedRows = [...table.rows];
        const currentRow = updatedRows[rowIndex];
        if (!currentRow) return table;

        updatedRows[rowIndex] = {
          ...currentRow,
          [field]: value
        };
        return {
          ...table,
          rows: updatedRows
        };
}
      return table;
    });
    
    setTables(updatedTables);
    debouncedSave({ tables: updatedTables });
  }, [tables, debouncedSave, setTables]);

  const handleBuyerChange = useCallback((tableId: number, rowIndex: number, buyer: string) => {
    const updatedTables = tables.map(table => {
      if (table.id === tableId) {
        const updatedRows = [...table.rows];
        const currentRow = updatedRows[rowIndex];
        if (!currentRow) return table;

    const newRow: Row = {
          ...currentRow,
          buyer,
          forest: currentRow.forest,
      product: '',
      species: '',
      volume: 0,
      amount: 0,
    };

        if (buyer) {
      const relatedPurchase = purchases.find(p => p.buyer === buyer);
      if (relatedPurchase) {
        newRow.product = relatedPurchase.product;
        newRow.species = relatedPurchase.species;
        newRow.volume = relatedPurchase.volume;
        newRow.amount = relatedPurchase.amount;
          }
        }

        updatedRows[rowIndex] = newRow;
        return {
          ...table,
          rows: updatedRows
        };
      }
      return table;
    });
    
    setTables(updatedTables);
    debouncedSave({ tables: updatedTables });
  }, [tables, purchases, debouncedSave, setTables]);

  async function setDate(tableId: number, date: string) {
    if (!date) {
      alert('Будь ласка, вкажіть дату');
      return;
    }

    try {
      const tableIndex = tables.findIndex(t => t.id === tableId);
      if (tableIndex === -1) {
        alert('Таблиця не знайдена. Можливо, її було видалено або стан не оновився.');
        return;
      }
      const table = tables[tableIndex];
      if (!table) {
        alert('Таблиця не знайдена. Можливо, її було видалено або стан не оновився.');
        return;
      }

      // Перевіряємо чи дата унікальна
      const isDateUnique = !tables.some(t => t.id !== tableId && t.date === date);
      if (!isDateUnique) {
        throw new Error('Таблиця з такою датою вже існує');
      }
  
      const newTables = [...tables];
      const newTableData = table._tmpId
        ? { id: table.id, date, rows: table.rows, _tmpId: table._tmpId }
        : { id: table.id, date, rows: table.rows };
      newTables[tableIndex] = newTableData;
      setTables(newTables);

      if (table.id) {
        const res = await fetch('/api/tables', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tables: [{ ...table, date }] }),
        });

        if (!res.ok) {
          throw new Error('Не вдалося оновити дату таблиці');
        }
      } else {
        const res = await fetch('/api/tables/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date }),
        });

        if (!res.ok) {
          throw new Error('Не вдалося створити таблицю');
        }

        const data = await res.json();
        const newTableDataWithId = table._tmpId
          ? { id: data.id, date, rows: table.rows, _tmpId: table._tmpId }
          : { id: data.id, date, rows: table.rows };
        newTables[tableIndex] = newTableDataWithId;
        setTables(newTables);
      }

        debouncedSave({ tables: newTables });
    } catch (error) {
      console.error('Помилка оновлення дати:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося оновити дату');
    }
      }

  const addForest = async () => {
    if (!newForest.trim()) {
      alert('Будь ласка, введіть назву лісництва');
      return;
    }

    if (forests.includes(newForest.trim())) {
      alert('Таке лісництво вже існує');
      return;
    }

    setLoadingForest(true);
    try {
      const res = await fetch('/api/forests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newForest.trim() }),
      });

      if (!res.ok) {
        throw new Error('Не вдалося додати лісництво');
      }

      setForests([...forests, newForest.trim()]);
      setNewForest('');
    } catch (error) {
      console.error('Помилка додавання лісництва:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося додати лісництво');
    } finally {
      setLoadingForest(false);
    }
  };

  const deleteForest = async (forest: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити лісництво "${forest}"?`)) {
      return;
    }

      setLoadingForest(true);
      try {
        const res = await fetch('/api/forests', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: forest }),
        });

      if (!res.ok) {
        throw new Error('Не вдалося видалити лісництво');
      }

      setForests(forests.filter(f => f !== forest));
      } catch (error) {
        console.error('Помилка видалення лісництва:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося видалити лісництво');
    } finally {
      setLoadingForest(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.trim()) {
      alert('Будь ласка, введіть назву продукції');
      return;
    }

    if (products.includes(newProduct.trim())) {
      alert('Така продукція вже існує');
      return;
    }

    setLoadingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProduct.trim() }),
      });

      if (!res.ok) {
        throw new Error('Не вдалося додати продукцію');
      }

      setProducts([...products, newProduct.trim()]);
      setNewProduct('');
    } catch (error) {
      console.error('Помилка додавання продукції:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося додати продукцію');
    } finally {
      setLoadingProduct(false);
    }
  };

  const deleteProduct = async (product: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити продукцію "${product}"?`)) {
      return;
    }

      setLoadingProduct(true);
      try {
        const res = await fetch('/api/products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: product }),
        });

      if (!res.ok) {
        throw new Error('Не вдалося видалити продукцію');
      }

      setProducts(products.filter(p => p !== product));
      } catch (error) {
        console.error('Помилка видалення продукції:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося видалити продукцію');
    } finally {
      setLoadingProduct(false);
    }
  };

  const addSpecies = async () => {
    if (!newSpecies.trim()) {
      alert('Будь ласка, введіть назву породи');
      return;
    }

    if (species.includes(newSpecies.trim())) {
      alert('Така порода вже існує');
      return;
    }

    setLoadingSpecies(true);
    try {
      const res = await fetch('/api/species', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSpecies.trim() }),
      });

      if (!res.ok) {
        throw new Error('Не вдалося додати породу');
      }

      setSpecies([...species, newSpecies.trim()]);
      setNewSpecies('');
    } catch (error) {
      console.error('Помилка додавання породи:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося додати породу');
    } finally {
      setLoadingSpecies(false);
    }
  };

  const deleteSpecies = async (specie: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити породу "${specie}"?`)) {
      return;
    }

      setLoadingSpecies(true);
      try {
        const res = await fetch('/api/species', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: specie }),
        });

      if (!res.ok) {
        throw new Error('Не вдалося видалити породу');
      }

      setSpecies(species.filter(s => s !== specie));
      } catch (error) {
        console.error('Помилка видалення породи:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося видалити породу');
    } finally {
      setLoadingSpecies(false);
    }
  };

  const addPurchase = async () => {
    if (!newPurchase.buyer.trim() || !newPurchase.product.trim() || !newPurchase.species.trim()) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }

    if (newPurchase.volume <= 0 || newPurchase.amount <= 0) {
      alert('Об\'єм та сума повинні бути більше 0');
      return;
    }

    const existingPurchase = purchases.find(
      p => p.buyer === newPurchase.buyer && p.product === newPurchase.product && p.species === newPurchase.species
    );

    if (existingPurchase) {
      alert('Така покупка вже існує');
      return;
    }

    setLoadingPurchase(true);
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPurchase),
      });

      if (!res.ok) {
        throw new Error('Не вдалося додати покупку');
      }

      setPurchases([...purchases, { ...newPurchase }]);
      setNewPurchase({ buyer: '', product: '', species: '', volume: 0, amount: 0 });
    } catch (error) {
      console.error('Помилка додавання покупки:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося додати покупку');
    } finally {
    setLoadingPurchase(false);
    }
  };

  const deletePurchase = async (purchase: Purchase) => {
    if (!confirm(`Ви впевнені, що хочете видалити покупку для "${purchase.buyer}"?`)) {
      return;
    }

      setLoadingPurchase(true);
      try {
        const res = await fetch('/api/purchases', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchase),
        });

      if (!res.ok) {
        throw new Error('Не вдалося видалити покупку');
      }

      setPurchases(purchases.filter(p => 
        p.buyer !== purchase.buyer || 
        p.product !== purchase.product || 
        p.species !== purchase.species
      ));
      } catch (error) {
      console.error('Помилка видалення покупки:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося видалити покупку');
    } finally {
      setLoadingPurchase(false);
    }
  };

  return (
    <div className="space-y-8">
              <button
        className="mb-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setShowReferences(v => !v)}
                type="button"
              >
        ⇅ Вхідні дані
              </button>
      {showReferences && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Лісництва</h3>
            <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newForest}
                    onChange={e => setNewForest(e.target.value)}
                placeholder="Нова назва"
                className="flex-1 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={addForest}
                    disabled={loadingForest}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                {loadingForest ? '...' : '+'}
                  </button>
                </div>
            <ul className="space-y-1">
              {forests.map(forest => (
                <li key={forest} className="flex justify-between items-center">
                      <span>{forest}</span>
                      <button
                        onClick={() => deleteForest(forest)}
                        disabled={loadingForest}
                    className="text-red-500 hover:text-red-700"
                      >
                    ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
          <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Продукція</h3>
            <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newProduct}
                    onChange={e => setNewProduct(e.target.value)}
                placeholder="Нова назва"
                className="flex-1 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={addProduct}
                    disabled={loadingProduct}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                {loadingProduct ? '...' : '+'}
                  </button>
                </div>
            <ul className="space-y-1">
              {products.map(product => (
                <li key={product} className="flex justify-between items-center">
                      <span>{product}</span>
                      <button
                        onClick={() => deleteProduct(product)}
                        disabled={loadingProduct}
                    className="text-red-500 hover:text-red-700"
                      >
                    ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
          <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Породи</h3>
            <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSpecies}
                    onChange={e => setNewSpecies(e.target.value)}
                placeholder="Нова назва"
                className="flex-1 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={addSpecies}
                    disabled={loadingSpecies}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                {loadingSpecies ? '...' : '+'}
                  </button>
                </div>
            <ul className="space-y-1">
              {species.map(specie => (
                <li key={specie} className="flex justify-between items-center">
                      <span>{specie}</span>
                      <button
                        onClick={() => deleteSpecies(specie)}
                        disabled={loadingSpecies}
                    className="text-red-500 hover:text-red-700"
                      >
                    ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
          <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Покупки</h3>
            <div className="space-y-2 mb-2">
                  <input
                    type="text"
                    value={newPurchase.buyer}
                    onChange={e => setNewPurchase({ ...newPurchase, buyer: e.target.value })}
                    placeholder="Покупець"
                className="w-full px-2 py-1 border rounded"
                  />
              <select
                    value={newPurchase.product}
                    onChange={e => setNewPurchase({ ...newPurchase, product: e.target.value })}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="">Оберіть продукцію</option>
                {products.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
              <select
                    value={newPurchase.species}
                    onChange={e => setNewPurchase({ ...newPurchase, species: e.target.value })}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="">Оберіть породу</option>
                {species.map(specie => (
                  <option key={specie} value={specie}>{specie}</option>
                ))}
              </select>
                  <input
                    type="number"
                value={newPurchase.volume || ''}
                onChange={e => setNewPurchase({ ...newPurchase, volume: Number(e.target.value) })}
                placeholder="Об'єм"
                className="w-full px-2 py-1 border rounded"
                  />
                  <input
                    type="number"
                value={newPurchase.amount || ''}
                onChange={e => setNewPurchase({ ...newPurchase, amount: Number(e.target.value) })}
                placeholder="Сума"
                className="w-full px-2 py-1 border rounded"
                  />
                  <button
                    onClick={addPurchase}
                    disabled={loadingPurchase}
                className="w-full px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                {loadingPurchase ? 'Додавання...' : 'Додати покупку'}
                  </button>
                </div>
            <ul className="space-y-2">
              {purchases.map((purchase, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <div>
                    <div className="font-semibold">{purchase.buyer}</div>
                    <div className="text-sm text-green-600">
                      {purchase.product} - {purchase.species}
                    </div>
                    <div className="text-sm text-green-600">
                      {purchase.volume} m³ - {purchase.amount} грн
                    </div>
                  </div>
                      <button
                        onClick={() => deletePurchase(purchase)}
                        disabled={loadingPurchase}
                    className="text-red-500 hover:text-red-700"
                      >
                    ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
      )}
      <div className="space-y-4">
        {tables.map((table, tableIndex) => (
          <div key={table.id || tableIndex} className="border rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <DateInput
                tableId={table.id}
                date={table.date}
                setDate={setDate}
              />
              <button
                onClick={() => deleteTable(table.id!)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Видалити таблицю
              </button>
            </div>
            <EditableDataTable
              tableId={table.id!}
              rows={table.rows || []}
              handleFieldChange={(rowIndex, field, value) => handleFieldChange(table.id!, rowIndex, field, value)}
              handleBuyerChange={(rowIndex, buyer) => handleBuyerChange(table.id!, rowIndex, buyer)}
              deleteRow={async (tableId, rowId, rowIndex) => {
                if (!rowId) {
                  const updatedTables = tables.map((table: TableData) =>
                    table.id === tableId
                      ? { ...table, rows: table.rows.filter((_, idx) => idx !== rowIndex) }
                      : table
                  );
                  setTables(updatedTables);
                  return;
                }
                await deleteRow(tableId, rowId);
              }}
              forests={forests}
              purchases={purchases}
              products={products}
              species={species}
            />
            <button
              onClick={() => addRow(table.id!)}
              className="mt-2 mb-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1 text-sm"
              type="button"
            >
              <span className="text-base font-bold">+</span> Додати рядок
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}