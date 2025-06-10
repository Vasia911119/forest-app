import { memo, useCallback } from 'react';
import type { Row } from '../types';

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

  const getButtonClassName = useCallback((field: keyof Row) => {
    return `px-2 py-1 border rounded transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      sortBy === field ? 'bg-blue-100' : ''
    }`;
  }, [sortBy]);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleSort('forest')}
        className={getButtonClassName('forest')}
        type="button"
        aria-label={`Сортувати по лісництву ${sortBy === 'forest' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
      >
        Лісництво {sortBy === 'forest' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button
        onClick={() => handleSort('buyer')}
        className={getButtonClassName('buyer')}
        type="button"
        aria-label={`Сортувати по покупцю ${sortBy === 'buyer' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
      >
        Покупець {sortBy === 'buyer' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button
        onClick={() => handleSort('product')}
        className={getButtonClassName('product')}
        type="button"
        aria-label={`Сортувати по продукції ${sortBy === 'product' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
      >
        Продукція {sortBy === 'product' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button
        onClick={() => handleSort('species')}
        className={getButtonClassName('species')}
        type="button"
        aria-label={`Сортувати по породі ${sortBy === 'species' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
      >
        Порода {sortBy === 'species' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button
        onClick={() => handleSort('volume')}
        className={getButtonClassName('volume')}
        type="button"
        aria-label={`Сортувати по об'єму ${sortBy === 'volume' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
      >
        Об&apos;єм {sortBy === 'volume' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button
        onClick={() => handleSort('amount')}
        className={getButtonClassName('amount')}
        type="button"
        aria-label={`Сортувати по сумі ${sortBy === 'amount' ? (sortOrder === 'asc' ? 'за зростанням' : 'за спаданням') : ''}`}
      >
        Сума {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
    </div>
  );
});

export default SortControls; 