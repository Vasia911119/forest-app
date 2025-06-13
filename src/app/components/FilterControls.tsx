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
  forests: string[];
  buyers: string[];
  speciesList: string[];
}

const FilterControls = memo(function FilterControls({ tableIdx, filter, updateFilter, forests, buyers, speciesList }: FilterControlsProps) {
  const handleChange = useCallback((field: keyof FilterState, value: string) => {
    updateFilter(tableIdx, { ...filter, [field]: value });
  }, [tableIdx, filter, updateFilter]);

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filter.forest}
        onChange={(e) => handleChange('forest', e.target.value)}
        className="px-3 py-2 text-sm bg-white dark:bg-green-800 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 min-w-[150px]"
      >
        <option value="">Всі лісництва</option>
        {forests.map(forest => (
          <option key={forest} value={forest}>{forest}</option>
        ))}
      </select>
      <select
        value={filter.buyer}
        onChange={(e) => handleChange('buyer', e.target.value)}
        className="px-3 py-2 text-sm bg-white dark:bg-green-800 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 min-w-[150px]"
      >
        <option value="">Всі покупці</option>
        {buyers.map(buyer => (
          <option key={buyer} value={buyer}>{buyer}</option>
        ))}
      </select>
      <select
        value={filter.species}
        onChange={(e) => handleChange('species', e.target.value)}
        className="px-3 py-2 text-sm bg-white dark:bg-green-800 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 min-w-[150px]"
      >
        <option value="">Всі породи</option>
        {speciesList.map(species => (
          <option key={species} value={species}>{species}</option>
        ))}
      </select>
    </div>
  );
});

export default FilterControls; 