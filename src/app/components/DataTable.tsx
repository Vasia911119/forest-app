import { memo } from 'react';
import { Row } from '../types';

interface DataTableProps {
  filteredAndSortedRows: Row[];
  totalVolume: number;
  totalAmount: number;
  sortBy: keyof Row | null;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: keyof Row) => void;
}

const RowComponent = memo(({ row, idx }: { row: Row; idx: number }) => (
  <tr key={`${row.id}-${idx}`}>
    <td className="border px-2 py-1 sm:px-1 sm:py-0.5">{idx + 1}</td>
    <td className="border px-2 py-1 sm:px-1 sm:py-0.5">{row.forest}</td>
    <td className="border px-2 py-1 sm:px-1 sm:py-0.5">{row.buyer}</td>
    <td className="border px-2 py-1 sm:px-1 sm:py-0.5">{row.product}</td>
    <td className="border px-2 py-1 sm:px-1 sm:py-0.5">{row.species}</td>
    <td className="border px-2 py-1 sm:px-1 sm:py-0.5">{row.volume}</td>
    <td className="border px-2 py-1 sm:px-1 sm:py-0.5">{row.amount}</td>
  </tr>
));
RowComponent.displayName = 'RowComponent';

export default function DataTable({ filteredAndSortedRows, totalVolume, totalAmount, sortBy, sortOrder, handleSort }: DataTableProps) {
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
            <th
              className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[100px] whitespace-normal cursor-pointer select-none"
              onClick={() => handleSort('volume')}
              tabIndex={0}
              role="button"
            >
              Орієнтовний об’єм (м³) {sortBy === 'volume' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="border px-2 py-1 sm:px-1 sm:py-0.5 min-w-[120px] whitespace-normal cursor-pointer select-none"
              onClick={() => handleSort('amount')}
              tabIndex={0}
              role="button"
            >
              Орієнтовна сума без ПДВ (грн) {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedRows.map((row, idx) => (
            <RowComponent key={`${row.id}-${idx}`} row={row} idx={idx} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border px-2 py-1 sm:px-1 sm:py-0.5 font-bold" colSpan={5}>Всього:</td>
            <td className="border px-2 py-1 sm:px-1 sm:py-0.5 font-bold">{Math.round(totalVolume)}</td>
            <td className="border px-2 py-1 sm:px-1 sm:py-0.5 font-bold">{Math.round(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}