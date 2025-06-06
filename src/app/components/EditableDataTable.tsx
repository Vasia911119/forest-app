import EditableRow from './EditableRow';
import { Row } from '../types';
import { useMemo } from 'react';

interface EditableDataTableProps {
  tableId: number;
  rows: Row[];
  handleFieldChange: (tableId: number, index: number, field: keyof Row, value: string | number) => void;
  handleBuyerChange: (tableId: number, index: number, buyer: string) => void;
  deleteRow: (tableId: number, id: number) => void;
  forests: (string | { name: string })[];
  purchases: { buyer: string; product: string; species: string; volume: number; amount: number }[];
  products: (string | { name: string })[];
  species: (string | { name: string })[];
}

export default function EditableDataTable({
  tableId, rows, handleFieldChange, handleBuyerChange, deleteRow, forests, purchases, products, species,
}: EditableDataTableProps) {
  // useMemo щоб не створювати масиви на кожен рендер
  const forestNames = useMemo(
    () => forests.map(f => (typeof f === 'string' ? f : f.name || '')),
    [forests]
  );
  const productNames = useMemo(
    () => products.map(p => (typeof p === 'string' ? p : p.name || '')),
    [products]
  );
  const speciesNames = useMemo(
    () => species.map(s => (typeof s === 'string' ? s : s.name || '')),
    [species]
  );

  return (
    <div className="overflow-x-auto mb-4 sm:mb-2">
      <table className="min-w-full border text-[12px] sm:text-base text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[40px] whitespace-normal">№</th>
            <th className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[100px] whitespace-normal">Лісництво</th>
            <th className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[100px] whitespace-normal">Покупець</th>
            <th className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[120px] whitespace-normal">Найменування продукції</th>
            <th className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[80px] whitespace-normal">Порода</th>
            <th className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[100px] whitespace-normal">Орієнтовний об’єм (м³)</th>
            <th className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[120px] whitespace-normal">Орієнтовна сума без ПДВ (грн)</th>
            <th className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[40px]"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <EditableRow
              key={`${row.id}-${idx}`}
              row={row}
              idx={idx}
              handleFieldChange={(index, field, value) => handleFieldChange(tableId, index, field, value)}
              handleBuyerChange={(index, buyer) => handleBuyerChange(tableId, index, buyer)}
              deleteRow={() => deleteRow(tableId, row.id)}
              forests={forestNames}
              purchases={purchases}
              products={productNames}
              species={speciesNames}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}