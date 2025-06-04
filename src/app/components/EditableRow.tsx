import { memo, useMemo } from 'react';
import { Row } from '../types';

interface EditableRowProps {
  row: Row;
  idx: number;
  handleFieldChange: (index: number, field: keyof Row, value: string | number) => void;
  handleBuyerChange: (index: number, buyer: string) => void;
  deleteRow: (id: number) => void;
  forests: string[];
  purchases: { buyer: string; product: string; species: string; volume: number; amount: number }[];
  products: string[];
  species: string[];
}

const EditableRow = memo(({
  row, idx, handleFieldChange, handleBuyerChange, deleteRow, forests, purchases, products, species
}: EditableRowProps) => {
  // Унікальні покупці тільки один раз, мемоізовано
  const uniqueBuyers = useMemo(
    () => [...new Set(purchases.map(p => p.buyer))],
    [purchases]
  );

  return (
    <tr key={`${row.id}-${idx}`}>
      <td className="border px-2 py-1 sm:px-1 sm:py-0.5">{idx + 1}</td>
      <td className="border px-2 py-1 sm:px-1 sm:py-0.5">
        <select
          className="w-full border rounded text-sm sm:text-xs md:text-base"
          value={row.forest}
          onChange={e => handleFieldChange(idx, 'forest', e.target.value)}
        >
          <option value="">--</option>
          {forests.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </td>
      <td className="border px-2 py-1 sm:px-1 sm:py-0.5">
        <select
          className="w-full border rounded text-sm sm:text-xs md:text-base"
          value={row.buyer}
          onChange={e => handleBuyerChange(idx, e.target.value)}
        >
          <option value="">--</option>
          {uniqueBuyers.map(buyer => (
            <option key={buyer} value={buyer}>{buyer}</option>
          ))}
        </select>
      </td>
      <td className="border px-2 py-1 sm:px-1 sm:py-0.5">
        <select
          className="w-full border rounded text-sm sm:text-xs md:text-base"
          value={row.product}
          onChange={e => handleFieldChange(idx, 'product', e.target.value)}
        >
          <option value="">--</option>
          {products.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </td>
      <td className="border px-2 py-1 sm:px-1 sm:py-0.5">
        <select
          className="w-full border rounded text-sm sm:text-xs md:text-base"
          value={row.species}
          onChange={e => handleFieldChange(idx, 'species', e.target.value)}
        >
          <option value="">--</option>
          {species.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="border px-2 py-1 sm:px-1 sm:py-0.5">
        <input
          type="number"
          value={Math.round(row.volume)}
          onChange={e => handleFieldChange(idx, 'volume', parseInt(e.target.value) || 0)}
          className="w-full border rounded px-2 py-1 text-sm sm:text-xs md:text-base"
          min="0"
          step="1"
        />
      </td>
      <td className="border px-2 py-1 sm:px-1 sm:py-0.5">
        <input
          type="number"
          value={Math.round(row.amount)}
          onChange={e => handleFieldChange(idx, 'amount', parseInt(e.target.value) || 0)}
          className="w-full border rounded px-2 py-1 text-sm sm:text-xs md:text-base"
          min="0"
          step="1"
        />
      </td>
      <td className="border px-2 py-1 text-center sm:px-1 sm:py-0.5">
        <button
          className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 p-1"
          onClick={() => deleteRow(row.id)}
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
EditableRow.displayName = 'EditableRow';

export default EditableRow;