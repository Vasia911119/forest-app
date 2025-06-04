'use client';

import { TableData } from '../types';
import TableDisplayList from './TableDisplayList';

interface TableViewProps {
  tables: TableData[];
  forests: string[];
}

export default function TableView({ tables, forests }: TableViewProps) {
  return (
    <div className="p-4 sm:p-2">
      {tables.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-sm md:text-lg">
          Немає доступних таблиць для відображення.
        </p>
      ) : (
        <TableDisplayList tables={tables} forests={forests} />
      )}
    </div>
  );
}