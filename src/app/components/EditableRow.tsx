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
  rowIndex,
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
      console.log('Numeric change:', { field, value: numValue, rowIndex, tableId });
      handleFieldChange(field, numValue);
    }
  };

  const handleSelectChange = (field: keyof Row, e: ChangeEvent<HTMLSelectElement>) => {
    console.log(`${field} change:`, { value: e.target.value, rowIndex, tableId });
    handleFieldChange(field, e.target.value);
  };

  if (!row) {
    return null;
  }

  return (
    <tr>
      <td className="px-4 py-2 border">
        <select
          value={row.forest}
          onChange={(e) => handleSelectChange('forest', e)}
          className="w-full p-1 border rounded"
        >
          <option value="">Виберіть лісництво</option>
          {forests.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border">
        <select
          value={row.buyer}
          onChange={(e) => {
            console.log('Buyer change:', { value: e.target.value, rowIndex, tableId });
            handleBuyerChange(e.target.value);
          }}
          className="w-full p-1 border rounded"
        >
          <option value="">Виберіть покупця</option>
          {purchases.map(p => (
            <option key={p.buyer} value={p.buyer}>{p.buyer}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border">
        <select
          value={row.product}
          onChange={(e) => handleSelectChange('product', e)}
          className="w-full p-1 border rounded"
        >
          <option value="">Виберіть продукцію</option>
          {products.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border">
        <select
          value={row.species}
          onChange={(e) => handleSelectChange('species', e)}
          className="w-full p-1 border rounded"
        >
          <option value="">Виберіть породу</option>
          {species.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border">
        <input
          type="number"
          value={row.volume}
          onChange={(e) => handleNumericChange('volume', e.target.value)}
          className="w-full p-1 border rounded"
          min="0"
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="number"
          value={row.amount}
          onChange={(e) => handleNumericChange('amount', e.target.value)}
          className="w-full p-1 border rounded"
          min="0"
        />
      </td>
      <td className="px-4 py-2 border">
        <button
          onClick={() => {
            console.log('Delete row clicked:', { tableId, rowId: row.id, row, tableIdType: typeof tableId, rowIdType: typeof row.id });
            if (row.id) {
              deleteRow(tableId, row.id);
            }
          }}
          className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
          disabled={!row.id}
          title="Видалити рядок"
          aria-label="Видалити рядок"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
});

export default EditableRow;