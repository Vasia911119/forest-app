import { memo } from 'react';
import { Row } from '../types';
import { forests } from '../data/forests';
import { purchases } from '../data/purchases';
import { products } from '../data/products';
import { species } from '../data/species';

interface EditableRowProps {
  row: Row;
  idx: number;
  handleFieldChange: (index: number, field: keyof Row, value: string | number) => void;
  handleBuyerChange: (index: number, buyer: string) => void;
  deleteRow: (id: number) => void;
}

const EditableRow = memo(({ row, idx, handleFieldChange, handleBuyerChange, deleteRow }: EditableRowProps) => (
  <tr key={`${row.id}-${idx}`}>
    <td className="border px-2 py-1">{row.id}</td>
    <td className="border px-2 py-1">
      <select
        className="w-full border rounded"
        value={row.forest}
        onChange={e => handleFieldChange(idx, 'forest', e.target.value)}
      >
        <option value="">--</option>
        {forests.map(f => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
    </td>
    <td className="border px-2 py-1">
      <select
        className="w-full border rounded"
        value={row.buyer}
        onChange={e => handleBuyerChange(idx, e.target.value)}
      >
        <option value="">--</option>
        {purchases.map(p => (
          <option key={p.buyer} value={p.buyer}>
            {p.buyer}
          </option>
        ))}
      </select>
    </td>
    <td className="border px-2 py-1">
      <select
        className="w-full border rounded"
        value={row.product}
        onChange={e => handleFieldChange(idx, 'product', e.target.value)}
      >
        <option value="">--</option>
        {products.map(p => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </td>
    <td className="border px-2 py-1">
      <select
        className="w-full border rounded"
        value={row.species}
        onChange={e => handleFieldChange(idx, 'species', e.target.value)}
      >
        <option value="">--</option>
        {species.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </td>
    <td className="border px-2 py-1">
      <input
        type="number"
        value={row.volume}
        onChange={e => handleFieldChange(idx, 'volume', e.target.value)}
        className="w-full border rounded px-2 py-1"
        min="0"
        step="0.01"
      />
    </td>
    <td className="border px-2 py-1">
      <input
        type="number"
        value={row.amount}
        onChange={e => handleFieldChange(idx, 'amount', e.target.value)}
        className="w-full border rounded px-2 py-1"
        min="0"
        step="0.01"
      />
    </td>
    <td className="border px-2 py-1 text-center">
      <button
        className="text-red-600 hover:text-red-800"
        onClick={() => deleteRow(row.id)}
        title="Видалити рядок"
      >
        🗑️
      </button>
    </td>
  </tr>
));

EditableRow.displayName = 'EditableRow';

export default EditableRow;