import EditableRow from './EditableRow';
import type { Row, Purchase } from '../types';
import { useState, useMemo } from 'react';

interface EditableDataTableProps {
  tableId: number;
  rows: Row[];
  handleFieldChange: (rowIndex: number, field: keyof Row, value: string | number) => void;
  handleBuyerChange: (rowIndex: number, buyer: string) => void;
  deleteRow: (tableId: number, rowId: number | undefined, rowIndex: number) => Promise<void>;
  forests: string[];
  purchases: Purchase[];
  products: string[];
  species: string[];
}

export default function EditableDataTable({
  tableId,
  rows,
  handleFieldChange,
  handleBuyerChange,
  deleteRow,
  forests,
  purchases,
  products,
  species,
}: EditableDataTableProps) {
  const [sortBy, setSortBy] = useState<keyof Row | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedRows = useMemo(() => {
    if (!sortBy) return rows;
    return [...rows].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return sortOrder === 'asc'
        ? String(aValue ?? '').localeCompare(String(bValue ?? ''))
        : String(bValue ?? '').localeCompare(String(aValue ?? ''));
    });
  }, [rows, sortBy, sortOrder]);

  const handleSort = (field: keyof Row) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (!rows || !Array.isArray(rows)) {
    return (
      <div className="text-center p-4 text-green-500">
        Немає даних для відображення
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse bg-white dark:bg-green-900">
        <thead>
          <tr className="bg-green-50 dark:bg-green-800">
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-green-600 dark:text-green-300 border-b border-green-200 dark:border-green-700 border-r cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700" 
              onClick={() => handleSort('forest')}
            >
              Лісництво {sortBy === 'forest' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-green-600 dark:text-green-300 border-b border-green-200 dark:border-green-700 border-r cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700" 
              onClick={() => handleSort('buyer')}
            >
              Покупець {sortBy === 'buyer' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-green-600 dark:text-green-300 border-b border-green-200 dark:border-green-700 border-r cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700" 
              onClick={() => handleSort('product')}
            >
              Найменування продукції {sortBy === 'product' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-green-600 dark:text-green-300 border-b border-green-200 dark:border-green-700 border-r cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700" 
              onClick={() => handleSort('species')}
            >
              Порода {sortBy === 'species' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-green-600 dark:text-green-300 border-b border-green-200 dark:border-green-700 border-r cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700" 
              onClick={() => handleSort('volume')}
            >
              Орієнтовний об&apos;єм (м³) {sortBy === 'volume' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-medium text-green-600 dark:text-green-300 border-b border-green-200 dark:border-green-700 border-r cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700" 
              onClick={() => handleSort('amount')}
            >
              Орієнтовна сума без ПДВ (грн) {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-green-600 dark:text-green-300 border-b border-green-200 dark:border-green-700">
              Дії
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, index) => (
            <EditableRow
              key={row.id || index}
              row={row}
              rowIndex={index}
              tableId={tableId}
              handleFieldChange={(field, value) => handleFieldChange(index, field, value)}
              handleBuyerChange={buyer => handleBuyerChange(index, buyer)}
              deleteRow={(tableId, rowId) => deleteRow(tableId, rowId, index)}
              forests={forests}
              purchases={purchases}
              products={products}
              species={species}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}