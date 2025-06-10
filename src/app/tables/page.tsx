import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Таблиці | Forest App',
  description: 'Перегляд таблиць з даними про лісопродукцію',
};

export default async function TablesPage() {
  const supabase = await createClient();
  const { data: tables, error } = await supabase.from("tables").select("date, rows");

  if (error) {
    return (
      <div className="p-4 sm:p-2 text-center">
        <div className="text-red-500 mb-4">
          Помилка завантаження таблиць: {error.message}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          aria-label="Спробувати завантажити дані ще раз"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-2">
      <h1 className="text-2xl sm:text-xl md:text-3xl font-bold mb-4 sm:mb-2 text-center">
        Таблиці
      </h1>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm sm:text-xs md:text-base">
          {JSON.stringify(tables, null, 2)}
        </pre>
      </div>
    </div>
  );
}