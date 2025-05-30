'use client';

import { useMemo, useState } from 'react';
import { exportToExcel } from '../utils/exportToExcel';
import { Row, TableData } from '../types';
import { forests } from '../data/forests';
import Filters from './Filters';
import DataTable from './DataTable';
import ChartDisplay from './ChartDisplay';
import ExportButtons from './ExportButtons';

interface TableDisplayListProps {
  tables: TableData[];
}

export default function TableDisplayList({ tables }: TableDisplayListProps) {
  const [filters, setFilters] = useState(tables.map(() => ({ forest: '', buyer: '', species: '' })));
  const [sortBys, setSortBys] = useState<(keyof Row | null)[]>(tables.map(() => null));
  const [sortOrders, setSortOrders] = useState<('asc' | 'desc')[]>(tables.map(() => 'asc'));
  const [showCharts, setShowCharts] = useState<boolean[]>(tables.map(() => false));

  const updateFilter = (tableIdx: number, newFilter: { forest: string; buyer: string; species: string }) => {
    setFilters(prev => {
      const newFilters = [...prev];
      newFilters[tableIdx] = newFilter;
      return newFilters;
    });
  };

  const updateSortBy = (tableIdx: number, newSortBy: keyof Row | null) => {
    setSortBys(prev => {
      const newSortBys = [...prev];
      newSortBys[tableIdx] = newSortBy;
      return newSortBys;
    });
  };

  const updateSortOrder = (tableIdx: number, newSortOrder: 'asc' | 'desc') => {
    setSortOrders(prev => {
      const newSortOrders = [...prev];
      newSortOrders[tableIdx] = newSortOrder;
      return newSortOrders;
    });
  };

  const updateShowChart = (tableIdx: number, newShowChart: boolean) => {
    setShowCharts(prev => {
      const newShowCharts = [...prev];
      newShowCharts[tableIdx] = newShowChart;
      return newShowCharts;
    });
  };

  const filteredAndSortedRowsList = useMemo(() => {
    return tables.map((table, tableIdx) => {
      if (!table.rows || !Array.isArray(table.rows)) {
        return [];
      }
      return table.rows
        .filter(row =>
          row &&
          row.forest?.toLowerCase().includes(filters[tableIdx].forest.toLowerCase()) &&
          row.buyer?.toLowerCase().includes(filters[tableIdx].buyer.toLowerCase()) &&
          row.species?.toLowerCase().includes(filters[tableIdx].species.toLowerCase())
        )
        .sort((a, b) => {
          const sortBy = sortBys[tableIdx];
          if (!sortBy) return 0;
          const aValue = a[sortBy];
          const bValue = b[sortBy];
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrders[tableIdx] === 'asc' ? aValue - bValue : bValue - aValue;
          }
          return sortOrders[tableIdx] === 'asc'
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        });
    });
  }, [tables, filters, sortBys, sortOrders]);

  const totalsList = useMemo(() => {
    return filteredAndSortedRowsList.map(rows => ({
      totalVolume: rows.reduce((sum, row) => sum + (row.volume || 0), 0),
      totalAmount: rows.reduce((sum, row) => sum + (row.amount || 0), 0),
    }));
  }, [filteredAndSortedRowsList]);

  const chartDataList = useMemo(() => {
    return filteredAndSortedRowsList.map(rows => {
      const forestVolumes = forests.map(forest => ({
        forest,
        volume: rows
          .filter(row => row.forest === forest)
          .reduce((sum, row) => sum + (row.volume || 0), 0),
      }));

      return {
        labels: forestVolumes.map(f => f.forest),
        datasets: [{
          label: 'Об’єм (m³)',
          data: forestVolumes.map(f => f.volume),
          backgroundColor: '#4CAF50',
          borderColor: '#2E7D32',
          borderWidth: 1,
          barThickness: 20,
          categoryPercentage: 0.5,
        }],
      };
    });
  }, [filteredAndSortedRowsList]);

  const handleSort = (tableIdx: number, field: keyof Row) => {
    if (sortBys[tableIdx] === field) {
      updateSortOrder(tableIdx, sortOrders[tableIdx] === 'asc' ? 'desc' : 'asc');
    } else {
      updateSortBy(tableIdx, field);
      updateSortOrder(tableIdx, 'asc');
    }
  };

  const handleExportToExcel = (tableIdx: number) => {
    exportToExcel(tables[tableIdx], filteredAndSortedRowsList[tableIdx], totalsList[tableIdx].totalVolume, totalsList[tableIdx].totalAmount);
  };

  return (
    <>
      {tables.map((table, idx) => (
        <div key={idx} className="mb-6 border rounded p-4 sm:p-2">
          {table.date && (
            <h2 className="text-xl sm:text-lg md:text-2xl font-bold mb-4 sm:mb-2">
              Орієнтовний план реалізації на {new Date(table.date).toLocaleDateString('uk-UA')} (Таблиця {idx + 1})
            </h2>
          )}
          <Filters
            filter={filters[idx]}
            setFilter={(newFilter) => updateFilter(idx, newFilter)}
            sortBy={sortBys[idx]}
            sortOrder={sortOrders[idx]}
            handleSort={(field) => handleSort(idx, field)}
          />
          <DataTable
            filteredAndSortedRows={filteredAndSortedRowsList[idx]}
            totalVolume={totalsList[idx].totalVolume}
            totalAmount={totalsList[idx].totalAmount}
            sortBy={sortBys[idx]}
            sortOrder={sortOrders[idx]}
            handleSort={(field) => handleSort(idx, field)}
          />
          <ExportButtons
            exportToExcel={() => handleExportToExcel(idx)}
            showChart={showCharts[idx]}
            setShowChart={(newShowChart) => updateShowChart(idx, newShowChart)}
          />
          {showCharts[idx] && <ChartDisplay chartData={chartDataList[idx]} />}
        </div>
      ))}
    </>
  );
}