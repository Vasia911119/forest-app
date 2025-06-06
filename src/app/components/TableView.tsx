// 'use client';

// import { TableData } from '../types';
// import TableDisplayList from './TableDisplayList';

// interface TableViewProps {
//   tables: TableData[];
//   forests: string[];
// }

// export default function TableView({ tables = [], forests = [] }: TableViewProps) {
//   return (
//     <div className="p-4 sm:p-2">
//       {tables.length === 0 ? (
//         <p className="text-center text-gray-500 text-base sm:text-sm md:text-lg">
//           Немає доступних таблиць для відображення.
//         </p>
//       ) : (
//         <TableDisplayList tables={tables} forests={forests} />
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { TableData } from '../types';
import TableDisplayList from './TableDisplayList';

export default function TableView() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [forests, setForests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tablesRes = await fetch('/api/tables');
        if (!tablesRes.ok) throw new Error('Не вдалося завантажити таблиці');
        const tablesData = await tablesRes.json();
        setTables(tablesData);

        const forestsRes = await fetch('/api/forests');
        if (!forestsRes.ok) throw new Error('Не вдалося завантажити лісництва');
        const forestsData = await forestsRes.json();
        setForests(forestsData);
      } catch (error: any) {
        setError(error.message ?? 'Невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="p-4 sm:p-2 text-center text-gray-500">Завантаження...</div>;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-2 text-center text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          type="button"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

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