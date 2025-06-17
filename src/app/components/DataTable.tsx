import { useCallback } from 'react';
import type { Row } from '../types';

interface DataTableProps {
  filteredAndSortedRows: Row[];
  totalVolume: number;
  totalAmount: number;
  sortBy: keyof Row | null;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: keyof Row) => void;
}

export default function DataTable({ filteredAndSortedRows, totalVolume, totalAmount, sortBy, sortOrder, handleSort }: DataTableProps) {
  const handleForestSort = useCallback(() => {
    handleSort('forest');
  }, [handleSort]);

  const handleBuyerSort = useCallback(() => {
    handleSort('buyer');
  }, [handleSort]);

  const handleProductSort = useCallback(() => {
    handleSort('product');
  }, [handleSort]);

  const handleSpeciesSort = useCallback(() => {
    handleSort('species');
  }, [handleSort]);

  const handleVolumeSort = useCallback(() => {
    handleSort('volume');
  }, [handleSort]);

  const handleAmountSort = useCallback(() => {
    handleSort('amount');
  }, [handleSort]);

  if (!filteredAndSortedRows.length) {
    return (
      <div className="text-center text-green-500 my-4">
        Немає даних для відображення
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-green-400 dark:border-green-700 bg-white dark:bg-green-900 shadow-sm rounded-lg">
        <thead>
          <tr className="bg-green-50 dark:bg-green-800">
            <th scope="col" className="lg:px-2 py-2 text-left text-[6px] sm:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-400 border-b-2 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800">#</th>
            <th
              scope="col"
              className="lg:px-2 py-2 text-left text-[6px] sm:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-400 border-b-2 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800 cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700"
              onClick={handleForestSort}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleForestSort();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Сортувати за лісництвом ${sortOrder === 'asc' ? 'за зростанням' : 'за спаданням'}`}
            >
              Лісництво {sortBy === 'forest' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="lg:px-2 py-2 text-left text-[6px] sm:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-400 border-b-2 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800 cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700"
              onClick={handleBuyerSort}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBuyerSort();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Сортувати за покупцем ${sortOrder === 'asc' ? 'за зростанням' : 'за спаданням'}`}
            >
              Покупець {sortBy === 'buyer' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="lg:px-2 py-2 text-left text-[6px] sm:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-400 border-b-2 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800 cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700"
              onClick={handleProductSort}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProductSort();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Сортувати за продукцією ${sortOrder === 'asc' ? 'за зростанням' : 'за спаданням'}`}
            >
              Найменування продукції {sortBy === 'product' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="lg:px-2 py-2 text-left text-[6px] sm:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-400 border-b-2 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800 cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700"
              onClick={handleSpeciesSort}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSpeciesSort();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Сортувати за породою ${sortOrder === 'asc' ? 'за зростанням' : 'за спаданням'}`}
            >
              Порода {sortBy === 'species' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="lg:px-2 py-2 text-left text-[6px] sm:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-400 border-b-2 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800 cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700"
              onClick={handleVolumeSort}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleVolumeSort();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Сортувати за об'ємом ${sortOrder === 'asc' ? 'за зростанням' : 'за спаданням'}`}
            >
              Орієнтовний об&apos;єм (м³) {sortBy === 'volume' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="lg:px-2 py-2 text-left text-[6px] sm:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-400 border-b-2 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800 cursor-pointer select-none hover:bg-green-100 dark:hover:bg-green-700"
              onClick={handleAmountSort}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAmountSort();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Сортувати за сумою ${sortOrder === 'asc' ? 'за зростанням' : 'за спаданням'}`}
            >
              Орієнтовна сума без ПДВ (грн) {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-200 dark:divide-green-700">
          {filteredAndSortedRows.map((row, idx) => (
            <tr key={row.id ?? `row-${idx}`} className="hover:bg-green-50 dark:hover:bg-green-800 transition-colors duration-150">
              <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base text-green-900 dark:text-green-300 border-r border-green-200 dark:border-green-700 whitespace-nowrap">{idx + 1}</td>
              <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base text-green-900 dark:text-green-300 border-r border-green-200 dark:border-green-700 whitespace-nowrap">{row.forest}</td>
              <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base text-green-900 dark:text-green-300 border-r border-green-200 dark:border-green-700 whitespace-nowrap">{row.buyer}</td>
              <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base text-green-900 dark:text-green-300 border-r border-green-200 dark:border-green-700 whitespace-nowrap">{row.product}</td>
              <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base text-green-900 dark:text-green-300 border-r border-green-200 dark:border-green-700 whitespace-nowrap">{row.species}</td>
              <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base text-green-900 dark:text-green-300 border-r border-green-200 dark:border-green-700 whitespace-nowrap text-right font-medium">{row.volume}</td>
              <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base text-green-900 dark:text-green-300 whitespace-nowrap text-right font-medium">{row.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-green-50 dark:bg-green-800 border-t-2 border-green-200 dark:border-green-700">
            <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base font-bold text-green-900 dark:text-green-300 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800" colSpan={5}>Всього:</td>
            <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base font-bold text-green-900 dark:text-green-300 border-r border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-800 text-right">{Math.round(totalVolume)}</td>
            <td className="lg:px-2 py-1 text-[6px] sm:text-[10px] xl:text-base font-bold text-green-900 dark:text-green-300 bg-green-50 dark:bg-green-800 text-right">{Math.round(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}