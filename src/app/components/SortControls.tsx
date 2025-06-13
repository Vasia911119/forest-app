import { memo, useCallback } from 'react';
import type { Row } from '../types';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface SortControlsProps {
  tableIdx: number;
  sortBy: keyof Row | null;
  sortOrder: 'asc' | 'desc';
  updateSortBy: (tableIdx: number, sortBy: keyof Row | null) => void;
  updateSortOrder: (tableIdx: number, sortOrder: 'asc' | 'desc') => void;
}

const SortControls = memo(function SortControls({
  tableIdx,
  sortBy,
  sortOrder,
  updateSortBy,
  updateSortOrder,
}: SortControlsProps) {
  const handleSort = useCallback((field: keyof Row) => {
    if (sortBy === field) {
      updateSortOrder(tableIdx, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      updateSortBy(tableIdx, field);
      updateSortOrder(tableIdx, 'asc');
    }
  }, [tableIdx, sortBy, sortOrder, updateSortBy, updateSortOrder]);

  const getButtonClassName = (field: keyof Row) => {
    const isActive = sortBy === field;
    return `relative px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? 'text-green-600 dark:text-green-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-green-600 dark:after:bg-green-400 font-semibold'
        : 'text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-transparent hover:after:bg-green-200 dark:hover:after:bg-green-700'
    }`;
  };

  const getSortIcon = (field: keyof Row) => {
    if (sortBy !== field) {
      return <FaSort className="w-4 h-4 opacity-40" />;
    }
    return sortOrder === 'asc' ? <FaSortUp className="w-4 h-4" /> : <FaSortDown className="w-4 h-4" />;
  };

  return (
    <div className="relative flex items-center border-b-2 border-green-200 dark:border-green-700 mb-4">
      <div className="flex items-center">
        <button
          onClick={() => handleSort('forest')}
          className={getButtonClassName('forest')}
          type="button"
          aria-label={`Сортувати по лісництву ${sortBy === 'forest' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
        >
          <span>Лісництво</span>
          {getSortIcon('forest')}
        </button>
        <button
          onClick={() => handleSort('buyer')}
          className={getButtonClassName('buyer')}
          type="button"
          aria-label={`Сортувати по покупцю ${sortBy === 'buyer' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
        >
          <span>Покупець</span>
          {getSortIcon('buyer')}
        </button>
        <button
          onClick={() => handleSort('product')}
          className={getButtonClassName('product')}
          type="button"
          aria-label={`Сортувати по продукції ${sortBy === 'product' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
        >
          <span>Продукція</span>
          {getSortIcon('product')}
        </button>
        <button
          onClick={() => handleSort('species')}
          className={getButtonClassName('species')}
          type="button"
          aria-label={`Сортувати по породі ${sortBy === 'species' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
        >
          <span>Порода</span>
          {getSortIcon('species')}
        </button>
        <button
          onClick={() => handleSort('volume')}
          className={getButtonClassName('volume')}
          type="button"
          aria-label={`Сортувати за об'ємом ${sortBy === 'volume' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
        >
          <span>Об&apos;єм</span>
          {getSortIcon('volume')}
        </button>
        <button
          onClick={() => handleSort('amount')}
          className={getButtonClassName('amount')}
          type="button"
          aria-label={`Сортувати за сумою ${sortBy === 'amount' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
        >
          <span>Сума</span>
          {getSortIcon('amount')}
        </button>
      </div>
    </div>
  );
});

export default SortControls; 