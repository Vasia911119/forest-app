import { memo, useCallback } from 'react';

interface FilterState {
  forest: string;
  buyer: string;
  species: string;
}

interface FilterControlsProps {
  tableIdx: number;
  filter: FilterState;
  updateFilter: (tableIdx: number, filter: FilterState) => void;
}

const FilterControls = memo(function FilterControls({ tableIdx, filter, updateFilter }: FilterControlsProps) {
  const handleChange = useCallback((field: keyof FilterState, value: string) => {
    updateFilter(tableIdx, { ...filter, [field]: value });
  }, [tableIdx, filter, updateFilter]);

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="text"
        value={filter.forest}
        onChange={(e) => handleChange('forest', e.target.value)}
        placeholder="Фільтр по лісництву"
        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        aria-label="Фільтр по лісництву"
      />
      <input
        type="text"
        value={filter.buyer}
        onChange={(e) => handleChange('buyer', e.target.value)}
        placeholder="Фільтр по покупцю"
        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        aria-label="Фільтр по покупцю"
      />
      <input
        type="text"
        value={filter.species}
        onChange={(e) => handleChange('species', e.target.value)}
        placeholder="Фільтр по породі"
        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        aria-label="Фільтр по породі"
      />
    </div>
  );
});

export default FilterControls; 