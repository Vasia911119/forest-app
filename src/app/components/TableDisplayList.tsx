'use client';

import { useMemo, useState, useCallback, memo } from 'react';
import type { Row, TableData } from '../types';
import DataTable from './DataTable';
import FilterControls from './FilterControls';
import SortControls from './SortControls';
import ChartDisplay from './ChartDisplay';
import { FaRegCalendarAlt } from 'react-icons/fa';

interface TableDisplayListProps {
  tables: TableData[];
}

interface FilterState {
  forest: string;
  buyer: string;
  species: string;
}

interface Totals {
  totalVolume: number;
  totalAmount: number;
}

const TableDisplayList = memo(function TableDisplayList({ tables }: TableDisplayListProps) {
  const [filters, setFilters] = useState<FilterState[]>(tables.map(() => ({ forest: '', buyer: '', species: '' })));
  const [sortBys, setSortBys] = useState<(keyof Row | null)[]>(tables.map(() => null));
  const [sortOrders, setSortOrders] = useState<('asc' | 'desc')[]>(tables.map(() => 'asc'));
  const [showCharts, setShowCharts] = useState<boolean[]>(tables.map(() => false));
  const [isExporting, setIsExporting] = useState<boolean[]>(tables.map(() => false));

  const updateFilter = useCallback((tableIdx: number, newFilter: FilterState) => {
    setFilters(prev => {
      const newFilters = [...prev];
      newFilters[tableIdx] = newFilter;
      return newFilters;
    });
  }, []);

  const updateSortBy = useCallback((tableIdx: number, newSortBy: keyof Row | null) => {
    setSortBys(prev => {
      const newSortBys = [...prev];
      newSortBys[tableIdx] = newSortBy;
      return newSortBys;
    });
  }, []);

  const updateSortOrder = useCallback((tableIdx: number, newSortOrder: 'asc' | 'desc') => {
    setSortOrders(prev => {
      const newSortOrders = [...prev];
      newSortOrders[tableIdx] = newSortOrder;
      return newSortOrders;
    });
  }, []);

  const updateShowChart = useCallback((tableIdx: number, newShowChart: boolean) => {
    setShowCharts(prev => {
      const newShowCharts = [...prev];
      newShowCharts[tableIdx] = newShowChart;
      return newShowCharts;
    });
  }, []);

  const filteredAndSortedRowsList = useMemo(() => {
    if (!Array.isArray(tables)) return [];
    
    return tables.map((table, tableIdx) => {
      if (!table?.rows || !Array.isArray(table.rows)) return [];
      
      const currentFilter = filters[tableIdx] ?? { forest: '', buyer: '', species: '' };
      
      return table.rows
        .filter(row => {
          if (!row) return false;
          return (
            row.forest?.toLowerCase().includes(currentFilter.forest.toLowerCase()) &&
            row.buyer?.toLowerCase().includes(currentFilter.buyer.toLowerCase()) &&
            row.species?.toLowerCase().includes(currentFilter.species.toLowerCase())
          );
        })
        .sort((a, b) => {
          const sortBy = sortBys[tableIdx];
          if (!sortBy || !a || !b) return 0;
          
          const aValue = a[sortBy];
          const bValue = b[sortBy];
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrders[tableIdx] === 'asc' ? aValue - bValue : bValue - aValue;
          }
          
          return sortOrders[tableIdx] === 'asc'
            ? String(aValue ?? '').localeCompare(String(bValue ?? ''))
            : String(bValue ?? '').localeCompare(String(aValue ?? ''));
        });
    });
  }, [tables, filters, sortBys, sortOrders]);

  const totalsList = useMemo<Totals[]>(() => {
    return filteredAndSortedRowsList.map(rows => ({
      totalVolume: rows.reduce((sum, row) => sum + (row?.volume ?? 0), 0),
      totalAmount: rows.reduce((sum, row) => sum + (row?.amount ?? 0), 0),
    }));
  }, [filteredAndSortedRowsList]);

  const handleExport = useCallback(async (tableIdx: number) => {
    const table = tables[tableIdx];
    if (!table?.rows) {
      console.error('Немає даних для експорту');
      return;
    }

    try {
      setIsExporting(prev => {
        const newState = [...prev];
        newState[tableIdx] = true;
        return newState;
      });

      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableData: table,
          filteredAndSortedRows: filteredAndSortedRowsList[tableIdx] ?? [],
          totalVolume: totalsList[tableIdx]?.totalVolume ?? 0,
          totalAmount: totalsList[tableIdx]?.totalAmount ?? 0,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Не вдалося експортувати дані: ${errorText}`);
    }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `table_${table.date}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Помилка експорту:', error);
      alert(error instanceof Error ? error.message : 'Не вдалося експортувати дані');
    } finally {
      setIsExporting(prev => {
        const newState = [...prev];
        newState[tableIdx] = false;
        return newState;
      });
    }
  }, [tables, filteredAndSortedRowsList, totalsList]);

  if (!Array.isArray(tables) || tables.length === 0) {
    return (
      <div className="text-center text-green-500 my-4">
        Немає таблиць для відображення
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {tables.map((table, idx) => (
        <div
          key={table.id ?? table._tmpId ?? idx}
          className={`relative flex flex-col gap-4 p-2 sm:p-8 bg-white dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700 ${
            idx === 0 ? 'mt-16' : ''
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-200 dark:from-green-700 dark:via-green-500 dark:to-green-700"></div>
          
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
            <FaRegCalendarAlt className="w-6 h-6 text-green-600 dark:text-green-400" />
            Орієнтовний план реалізації на {new Date(table.date).toLocaleDateString('uk-UA')}
      </h2>
          
          <div className="w-full mb-4 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full">
                <FilterControls
                  tableIdx={idx}
      filter={filters[idx] ?? { forest: '', buyer: '', species: '' }}
                  updateFilter={updateFilter}
                  forests={Array.from(new Set(table.rows.map(row => row.forest)))}
                  buyers={Array.from(new Set(table.rows.map(row => row.buyer)))}
                  speciesList={Array.from(new Set(table.rows.map(row => row.species)))}
                />
              </div>
              <div className="w-full">
                <SortControls
                  tableIdx={idx}
      sortBy={sortBys[idx] ?? null}
      sortOrder={sortOrders[idx] ?? 'asc'}
                  updateSortBy={updateSortBy}
                  updateSortOrder={updateSortOrder}
    />
              </div>
            </div>
          </div>

          <div className="mt-4">
    <DataTable
      filteredAndSortedRows={filteredAndSortedRowsList[idx] ?? []}
      totalVolume={totalsList[idx]?.totalVolume ?? 0}
      totalAmount={totalsList[idx]?.totalAmount ?? 0}
      sortBy={sortBys[idx] ?? null}
      sortOrder={sortOrders[idx] ?? 'asc'}
              handleSort={(field: keyof Row) => {
                if (sortBys[idx] === field) {
                  updateSortOrder(idx, sortOrders[idx] === 'asc' ? 'desc' : 'asc');
                } else {
                  updateSortBy(idx, field);
                  updateSortOrder(idx, 'asc');
                }
              }}
    />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => updateShowChart(idx, !showCharts[idx])}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              type="button"
              aria-label={showCharts[idx] ? 'Приховати графік' : 'Показати графік'}
            >
              {showCharts[idx] ? 'Приховати графік' : 'Показати графік'}
            </button>

            <button
              onClick={() => handleExport(idx)}
              disabled={isExporting[idx]}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                isExporting[idx] ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="button"
              aria-label={isExporting[idx] ? 'Експорт в процесі...' : 'Експортувати в Excel'}
            >
              {isExporting[idx] ? 'Експорт...' : 'Експортувати в Excel'}
            </button>
          </div>

          {showCharts[idx] && (
            <div className="mt-4">
              <ChartDisplay
                filteredAndSortedRows={filteredAndSortedRowsList[idx] ?? []}
                totalVolume={totalsList[idx]?.totalVolume ?? 0}
                totalAmount={totalsList[idx]?.totalAmount ?? 0}
              />
            </div>
          )}
  </div>
))}
    </div>
  );
});

export default TableDisplayList;