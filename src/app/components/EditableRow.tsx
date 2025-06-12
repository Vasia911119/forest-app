import { memo } from 'react';
import type { ChangeEvent } from 'react';
import type { Row, Purchase } from '../types';

interface EditableRowProps {
  row: Row;
  rowIndex: number;
  tableId: number;
  handleFieldChange: (field: keyof Row, value: string | number) => void;
  handleBuyerChange: (buyer: string) => void;
  deleteRow: (tableId: number, id: number) => Promise<void>;
  forests: string[];
  purchases: Purchase[];
  products: string[];
  species: string[];
}

const EditableRow = memo(function EditableRow({
  row,
  tableId,
  handleFieldChange,
  handleBuyerChange,
  deleteRow,
  forests,
  purchases,
  products,
  species,
}: EditableRowProps) {
  const handleNumericChange = (field: 'volume' | 'amount', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    if (!isNaN(numValue)) {
      handleFieldChange(field, numValue);
    }
  };

  const handleSelectChange = (field: keyof Row, e: ChangeEvent<HTMLSelectElement>) => {
    handleFieldChange(field, e.target.value);
  };

  if (!row) {
    return null;
  }

  return (
    <tr>
      <td className="px-4 py-2 border dark:border-gray-700">
        <select
          value={row.forest}
          onChange={(e) => handleSelectChange('forest', e)}
          className="w-full p-1 border rounded dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="">Виберіть лісництво</option>
          {forests.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border dark:border-gray-700">
        <select
          value={row.buyer}
          onChange={(e) => {
            handleBuyerChange(e.target.value);
          }}
          className="w-full p-1 border rounded dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="">Виберіть покупця</option>
          {purchases.map(p => (
            <option key={p.buyer} value={p.buyer}>{p.buyer}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border dark:border-gray-700">
        <select
          value={row.product}
          onChange={(e) => handleSelectChange('product', e)}
          className="w-full p-1 border rounded dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="">Виберіть продукцію</option>
          {products.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border dark:border-gray-700">
        <select
          value={row.species}
          onChange={(e) => handleSelectChange('species', e)}
          className="w-full p-1 border rounded dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="">Виберіть породу</option>
          {species.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border dark:border-gray-700">
        <input
          type="number"
          value={row.volume}
          onChange={(e) => handleNumericChange('volume', e.target.value)}
          className="w-full p-1 border rounded dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
          min="0"
        />
      </td>
      <td className="px-4 py-2 border dark:border-gray-700">
        <input
          type="number"
          value={row.amount}
          onChange={(e) => handleNumericChange('amount', e.target.value)}
          className="w-full p-1 border rounded dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
          min="0"
        />
      </td>
      <td className="px-4 py-2 border dark:border-gray-700">
        <button
          onClick={() => {
            if (row.id) {
              deleteRow(tableId, row.id);
            }
          }}
          className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1 dark:bg-gray-900 dark:text-red-400 dark:hover:text-red-600"
          disabled={!row.id}
          title="Видалити рядок"
          aria-label="Видалити рядок"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
});

export default EditableRow;