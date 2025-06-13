import { memo, useCallback } from 'react';
import type { Row } from '../types';

interface FilterState {
  forest: string;
  buyer: string;
  species: string;
}

interface FiltersProps {
  filter: FilterState;
  setFilter: (filter: FilterState) => void;
  sortBy: keyof Row | null;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: keyof Row) => void;
}

const Filters = memo(function Filters({ 
  filter, 
  setFilter, 
  sortBy, 
  sortOrder,
  handleSort 
}: FiltersProps) {
  const handleFilterChange = useCallback((field: keyof FilterState, value: string) => {
    // Видаляємо зайві пробіли та переводимо в нижній регістр для кращого пошуку
    const sanitizedValue = value.trim().toLowerCase();
    setFilter({ ...filter, [field]: sanitizedValue });
  }, [filter, setFilter]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as keyof Row;
    if (value) {
      handleSort(value);
    }
  }, [handleSort]);

  return (
    <div className="mb-4 sm:mb-2 flex flex-col sm:flex-row gap-4 sm:gap-2 flex-wrap">
      <input
        type="text"
        placeholder="Фільтр за підрозділом"
        aria-label="Фільтр за підрозділом"
        value={filter.forest}
        onChange={e => handleFilterChange('forest', e.target.value)}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base dark:bg-green-900 dark:text-green-100 dark:border-green-700"
        autoComplete="off"
        maxLength={50}
      />
      <input
        type="text"
        placeholder="Фільтр за покупцем"
        aria-label="Фільтр за покупцем"
        value={filter.buyer}
        onChange={e => handleFilterChange('buyer', e.target.value)}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base dark:bg-green-900 dark:text-green-100 dark:border-green-700"
        autoComplete="off"
        maxLength={50}
      />
      <input
        type="text"
        placeholder="Фільтр за породою"
        aria-label="Фільтр за породою"
        value={filter.species}
        onChange={e => handleFilterChange('species', e.target.value)}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base dark:bg-green-900 dark:text-green-100 dark:border-green-700"
        autoComplete="off"
        maxLength={50}
      />
      <select
        value={sortBy || ''}
        onChange={handleSortChange}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base dark:bg-green-900 dark:text-green-100 dark:border-green-700"
        aria-label="Сортувати за"
      >
        <option value="">Сортувати за...</option>
        <option value="volume">Об&apos;єм {sortBy === 'volume' && (sortOrder === 'asc' ? '↑' : '↓')}</option>
        <option value="amount">Сума {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}</option>
      </select>
    </div>
  );
});

export default Filters;