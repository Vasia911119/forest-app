import { useState } from 'react';
import DateInput from './DateInput';
import EditableDataTable from './EditableDataTable';
import AddRowButton from './AddRowButton';
import { Row, TableData } from '../types';

interface TableListProps {
  tables: TableData[];
  setTables: (tables: TableData[]) => void;
  debouncedSave: (data: { tables: TableData[] }) => void;
  deleteTable: (tableIdx: number) => void;
  forests: string[];
  setForests: (forests: string[]) => void;
  products: string[];
  setProducts: (products: string[]) => void;
  species: string[];
  setSpecies: (species: string[]) => void;
  purchases: { buyer: string; product: string; species: string; volume: number; amount: number }[];
  setPurchases: (purchases: { buyer: string; product: string; species: string; volume: number; amount: number }[]) => void;
}

export default function TableList({ tables, setTables, debouncedSave, deleteTable, forests, setForests, products, setProducts, species, setSpecies, purchases, setPurchases }: TableListProps) {
  const [newForest, setNewForest] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newSpecies, setNewSpecies] = useState('');
  const [newPurchase, setNewPurchase] = useState({ buyer: '', product: '', species: '', volume: 0, amount: 0 });
  const [isManageOpen, setIsManageOpen] = useState(false);

  const addRow = (tableId: number) => {
    if (!tables[tableId].date) {
      alert('Будь ласка, спочатку введіть дату для цієї таблиці.');
      return;
    }

    const newRow: Row = {
      id: Date.now(),
      forest: '',
      buyer: '',
      product: '',
      species: '',
      volume: 0,
      amount: 0,
    };
    const newTables = [...tables];
    newTables[tableId].rows = [...newTables[tableId].rows, newRow];
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const deleteRow = (tableId: number, id: number) => {
    const newTables = [...tables];
    newTables[tableId].rows = newTables[tableId].rows.filter(row => row.id !== id);
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const handleFieldChange = (tableId: number, index: number, field: keyof Row, value: string | number) => {
    const newTables = [...tables];
    (newTables[tableId].rows[index][field] as string | number) = value;
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const handleBuyerChange = (tableId: number, index: number, buyer: string) => {
    const newTables = [...tables];
    const newRow = { ...newTables[tableId].rows[index], buyer };

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
    newTables[tableId].rows[index] = newRow;
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const setDate = (tableId: number, newDate: string) => {
    if (!newDate) {
      alert('Дата таблиці не може бути порожньою.');
      return;
    }

    const isDateTaken = tables.some((table, idx) =>
      idx !== tableId && table.date === newDate
    );

    if (isDateTaken) {
      alert(`Таблиця на дату "${new Date(newDate).toLocaleDateString('uk-UA')}" вже існує.`);
      return;
    }

    const newTables = [...tables];
    const currentTable = newTables[tableId];
    newTables[tableId] = { ...currentTable, date: newDate };

    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const addForest = async () => {
    if (!newForest.trim()) {
      alert('Будь ласка, введіть назву лісництва.');
      return;
    }
    if (forests.includes(newForest.trim())) {
      alert('Це лісництво вже існує.');
      return;
    }
    try {
      const res = await fetch('/api/forests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newForest.trim() }),
      });
      if (!res.ok) throw new Error('Не вдалося додати лісництво');
      const updatedForests = [...forests, newForest.trim()];
      setForests(updatedForests);
      setNewForest('');
    } catch (error) {
      console.error('Помилка додавання лісництва:', error);
      alert('Не вдалося додати лісництво.');
    }
  };

  const deleteForest = async (forest: string) => {
    const isUsed = tables.some(table =>
      table.rows.some(row => row.forest === forest)
    );
    if (isUsed) {
      alert('Це лісництво використовується в таблиці. Видаліть відповідні рядки перед видаленням.');
      return;
    }
    if (confirm(`Ви впевнені, що хочете видалити лісництво "${forest}"?`)) {
      try {
        const res = await fetch('/api/forests', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: forest }),
        });
        if (!res.ok) throw new Error('Не вдалося видалити лісництво');
        const updatedForests = forests.filter(f => f !== forest);
        setForests(updatedForests);
      } catch (error) {
        console.error('Помилка видалення лісництва:', error);
        alert('Не вдалося видалити лісництво.');
      }
    }
  };

  const addProduct = async () => {
    if (!newProduct.trim()) {
      alert('Будь ласка, введіть найменування продукції.');
      return;
    }
    if (products.includes(newProduct.trim())) {
      alert('Ця продукція вже існує.');
      return;
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProduct.trim() }),
      });
      if (!res.ok) throw new Error('Не вдалося додати продукцію');
      const updatedProducts = [...products, newProduct.trim()];
      setProducts(updatedProducts);
      setNewProduct('');
    } catch (error) {
      console.error('Помилка додавання продукції:', error);
      alert('Не вдалося додати продукцію.');
    }
  };

  const deleteProduct = async (product: string) => {
    const isUsed = tables.some(table =>
      table.rows.some(row => row.product === product)
    ) || purchases.some(purchase => purchase.product === product);
    if (isUsed) {
      alert('Ця продукція використовується в таблиці або в інформації про покупку. Видаліть відповідні записи перед видаленням.');
      return;
    }
    if (confirm(`Ви впевнені, що хочете видалити продукцію "${product}"?`)) {
      try {
        const res = await fetch('/api/products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: product }),
        });
        if (!res.ok) throw new Error('Не вдалося видалити продукцію');
        const updatedProducts = products.filter(p => p !== product);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Помилка видалення продукції:', error);
        alert('Не вдалося видалити продукцію.');
      }
    }
  };

  const addSpecies = async () => {
    if (!newSpecies.trim()) {
      alert('Будь ласка, введіть породу.');
      return;
    }
    if (species.includes(newSpecies.trim())) {
      alert('Ця порода вже існує.');
      return;
    }
    try {
      const res = await fetch('/api/species', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSpecies.trim() }),
      });
      if (!res.ok) throw new Error('Не вдалося додати породу');
      const updatedSpecies = [...species, newSpecies.trim()];
      setSpecies(updatedSpecies);
      setNewSpecies('');
    } catch (error) {
      console.error('Помилка додавання породи:', error);
      alert('Не вдалося додати породу.');
    }
  };

  const deleteSpecies = async (specie: string) => {
    const isUsed = tables.some(table =>
      table.rows.some(row => row.species === specie)
    ) || purchases.some(purchase => purchase.species === specie);
    if (isUsed) {
      alert('Ця порода використовується в таблиці або в інформації про покупку. Видаліть відповідні записи перед видаленням.');
      return;
    }
    if (confirm(`Ви впевнені, що хочете видалити породу "${specie}"?`)) {
      try {
        const res = await fetch('/api/species', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: specie }),
        });
        if (!res.ok) throw new Error('Не вдалося видалити породу');
        const updatedSpecies = species.filter(s => s !== specie);
        setSpecies(updatedSpecies);
      } catch (error) {
        console.error('Помилка видалення породи:', error);
        alert('Не вдалося видалити породу.');
      }
    }
  };

  const addPurchase = async () => {
    if (!newPurchase.buyer.trim() || !newPurchase.product.trim() || !newPurchase.species.trim() || newPurchase.volume <= 0 || newPurchase.amount <= 0) {
      alert('Будь ласка, заповніть усі поля для інформації про покупку.');
      return;
    }
    if (purchases.some(p => p.buyer === newPurchase.buyer && p.product === newPurchase.product && p.species === newPurchase.species)) {
      alert('Ця інформація про покупку вже існує.');
      return;
    }
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
      const updatedPurchases = [...purchases, {
        buyer: newPurchase.buyer.trim(),
        product: newPurchase.product.trim(),
        species: newPurchase.species.trim(),
        volume: newPurchase.volume,
        amount: newPurchase.amount,
      }];
      setPurchases(updatedPurchases);
      setNewPurchase({ buyer: '', product: '', species: '', volume: 0, amount: 0 });
    } catch (error) {
      console.error('Помилка додавання інформації про покупку:', error);
      alert('Не вдалося додати інформацію про покупку.');
    }
  };

  const deletePurchase = async (purchase: { buyer: string; product: string; species: string; volume: number; amount: number }) => {
    const isUsed = tables.some(table =>
      table.rows.some(row => row.buyer === purchase.buyer)
    );
    if (isUsed) {
      alert('Цей покупець використовується в таблиці. Видаліть відповідні рядки перед видаленням.');
      return;
    }
    if (confirm(`Ви впевнені, що хочете видалити інформацію про покупку "${purchase.buyer} - ${purchase.product} - ${purchase.species}"?`)) {
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
        const updatedPurchases = purchases.filter(p =>
          !(p.buyer === purchase.buyer && p.product === purchase.product && p.species === purchase.species)
        );
        setPurchases(updatedPurchases);
      } catch (error) {
        console.error('Помилка видалення інформації про покупку:', error);
        alert('Не вдалося видалити інформацію про покупку.');
      }
    }
  };

  return (
    <>
      {tables.map((table, idx) => (
        <div key={idx} className="mb-6 border rounded p-4 sm:p-2">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            <DateInput
              tableId={idx}
              date={table.date}
              setDate={setDate}
            />
            <button
              onClick={() => deleteTable(idx)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 sm:px-3 sm:py-1 sm:text-sm md:text-base cursor-pointer"
            >
              Видалити таблицю
            </button>
          </div>
          <EditableDataTable
            tableId={idx}
            rows={table.rows}
            handleFieldChange={handleFieldChange}
            handleBuyerChange={handleBuyerChange}
            deleteRow={deleteRow}
            forests={forests}
            purchases={purchases}
            products={products}
            species={species}
          />
          <AddRowButton tableId={idx} addRow={addRow} />
        </div>
      ))}
      <div className="mt-6 p-4">
        <button
          onClick={() => setIsManageOpen(!isManageOpen)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          {isManageOpen ? 'Приховати керування значеннями' : 'Керування значеннями'}
        </button>
        {isManageOpen && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-lg font-bold mb-4">Керування значеннями</h3>
            <div className="flex flex-col gap-6">
              {/* Лісництво */}
              <div className="flex flex-col gap-2">
                <h4 className="text-md font-semibold">Лісництва</h4>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="text"
                    value={newForest}
                    onChange={e => setNewForest(e.target.value)}
                    placeholder="Нове лісництво"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                  />
                  <button
                    onClick={addForest}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:text-sm md:text-base cursor-pointer"
                  >
                    Додати лісництво
                  </button>
                </div>
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {forests.map(forest => (
                    <li key={forest} className="flex justify-between items-center py-1">
                      <span>{forest}</span>
                      <button
                        onClick={() => deleteForest(forest)}
                        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
                        title="Видалити лісництво"
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
                  />
                  <button
                    onClick={addProduct}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:text-sm md:text-base cursor-pointer"
                  >
                    Додати найменування продукції
                  </button>
                </div>
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {products.map(product => (
                    <li key={product} className="flex justify-between items-center py-1">
                      <span>{product}</span>
                      <button
                        onClick={() => deleteProduct(product)}
                        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
                        title="Видалити продукцію"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Порода */}
              <div className="flex flex-col gap-2">
                <h4 className="text-md font-semibold">Породи</h4>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="text"
                    value={newSpecies}
                    onChange={e => setNewSpecies(e.target.value)}
                    placeholder="Нова порода"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                  />
                  <button
                    onClick={addSpecies}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:text-sm md:text-base cursor-pointer"
                  >
                    Додати породу
                  </button>
                </div>
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {species.map(specie => (
                    <li key={specie} className="flex justify-between items-center py-1">
                      <span>{specie}</span>
                      <button
                        onClick={() => deleteSpecies(specie)}
                        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
                        title="Видалити породу"
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
                  />
                  <input
                    type="text"
                    value={newPurchase.product}
                    onChange={e => setNewPurchase({ ...newPurchase, product: e.target.value })}
                    placeholder="Продукція"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newPurchase.species}
                    onChange={e => setNewPurchase({ ...newPurchase, species: e.target.value })}
                    placeholder="Порода"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base flex-grow cursor-pointer"
                  />
                  <input
                    type="number"
                    value={newPurchase.volume}
                    onChange={e => setNewPurchase({ ...newPurchase, volume: parseInt(e.target.value) || 0 })}
                    placeholder="Об’єм (м³)"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base w-24 cursor-pointer"
                    min="0"
                    step="1"
                  />
                  <input
                    type="number"
                    value={newPurchase.amount}
                    onChange={e => setNewPurchase({ ...newPurchase, amount: parseInt(e.target.value) || 0 })}
                    placeholder="Сума (грн)"
                    className="border px-2 py-1 rounded text-sm sm:text-xs md:text-base w-24 cursor-pointer"
                    min="0"
                    step="1"
                  />
                  <button
                    onClick={addPurchase}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 sm:text-sm md:text-base cursor-pointer"
                  >
                    Додати інформацію про покупку
                  </button>
                </div>
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2">
                  {purchases.map((purchase, idx) => (
                    <li key={idx} className="flex justify-between items-center py-1">
                      <span>{`${purchase.buyer} - ${purchase.product} - ${purchase.species} (${purchase.volume} м³, ${purchase.amount} грн)`}</span>
                      <button
                        onClick={() => deletePurchase(purchase)}
                        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
                        title="Видалити інформацію про покупку"
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