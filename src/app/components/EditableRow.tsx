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
    <tr className="border-b border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-800">
      <td className="px-4 py-2 border-r border-green-200 dark:border-green-700">
        <select
          value={row.forest}
          onChange={(e) => handleSelectChange('forest', e)}
          className="w-full p-1.5 text-sm text-green-700 dark:text-green-300 bg-transparent border border-green-300 dark:border-green-600 rounded focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-400 dark:focus:border-green-500"
        >
          <option value="">Виберіть лісництво</option>
          {forests.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border-r border-green-200 dark:border-green-700">
        <select
          value={row.buyer}
          onChange={(e) => {
            handleBuyerChange(e.target.value);
          }}
          className="w-full p-1.5 text-sm text-green-700 dark:text-green-300 bg-transparent border border-green-300 dark:border-green-600 rounded focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-400 dark:focus:border-green-500"
        >
          <option value="">Виберіть покупця</option>
          {purchases.map(p => (
            <option key={p.buyer} value={p.buyer}>{p.buyer}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border-r border-green-200 dark:border-green-700">
        <select
          value={row.product}
          onChange={(e) => handleSelectChange('product', e)}
          className="w-full p-1.5 text-sm text-green-700 dark:text-green-300 bg-transparent border border-green-300 dark:border-green-600 rounded focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-400 dark:focus:border-green-500"
        >
          <option value="">Виберіть продукцію</option>
          {products.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border-r border-green-200 dark:border-green-700">
        <select
          value={row.species}
          onChange={(e) => handleSelectChange('species', e)}
          className="w-full p-1.5 text-sm text-green-700 dark:text-green-300 bg-transparent border border-green-300 dark:border-green-600 rounded focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-400 dark:focus:border-green-500"
        >
          <option value="">Виберіть породу</option>
          {species.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border-r border-green-200 dark:border-green-700">
        <input
          type="number"
          value={row.volume || ''}
          onChange={(e) => handleNumericChange('volume', e.target.value)}
          className="w-full p-1.5 text-sm text-green-700 dark:text-green-300 bg-transparent border border-green-300 dark:border-green-600 rounded focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-400 dark:focus:border-green-500"
        />
      </td>
      <td className="px-4 py-2 border-r border-green-200 dark:border-green-700">
        <input
          type="number"
          value={row.amount || ''}
          onChange={(e) => handleNumericChange('amount', e.target.value)}
          className="w-full p-1.5 text-sm text-green-700 dark:text-green-300 bg-transparent border border-green-300 dark:border-green-600 rounded focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500 focus:border-green-400 dark:focus:border-green-500"
        />
      </td>
      <td className="px-4 py-2">
        <button
          onClick={() => deleteRow(tableId, row.id || 0)}
          className="p-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
          aria-label="Видалити рядок"
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