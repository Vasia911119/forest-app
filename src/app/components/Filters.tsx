import { Row } from '../types';

interface FiltersProps {
  filter: { forest: string; buyer: string; species: string };
  setFilter: (filter: { forest: string; buyer: string; species: string }) => void;
  sortBy: keyof Row | null;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: keyof Row) => void;
}

export default function Filters({ filter, setFilter, sortBy, handleSort }: FiltersProps) {
  return (
    <div className="mb-4 sm:mb-2 flex flex-col sm:flex-row gap-4 sm:gap-2 flex-wrap">
      <input
        type="text"
        placeholder="Фільтр за підрозділом"
        aria-label="Фільтр за підрозділом"
        value={filter.forest}
        onChange={e => setFilter({ ...filter, forest: e.target.value })}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base"
        autoComplete="off"
      />
      <input
        type="text"
        placeholder="Фільтр за покупцем"
        aria-label="Фільтр за покупцем"
        value={filter.buyer}
        onChange={e => setFilter({ ...filter, buyer: e.target.value })}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base"
        autoComplete="off"
      />
      <input
        type="text"
        placeholder="Фільтр за породою"
        aria-label="Фільтр за породою"
        value={filter.species}
        onChange={e => setFilter({ ...filter, species: e.target.value })}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base"
        autoComplete="off"
      />
      <select
        value={sortBy || ''}
        onChange={e => handleSort(e.target.value as keyof Row)}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base"
        aria-label="Сортувати за"
      >
        <option value="">Сортувати за...</option>
        <option value="volume">Об’єм</option>
        <option value="amount">Сума</option>
      </select>
    </div>
  );
}