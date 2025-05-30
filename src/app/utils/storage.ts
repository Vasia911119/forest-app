import { TableData } from '../types/index';

export const saveRowsToStorage = (data: { tables: TableData[] }) => {
  localStorage.setItem('tables', JSON.stringify(data.tables));
};

// Для TableEditor повертаємо { tables: TableData[] }, для TableView адаптуємо до { date: string, rows: Row[] }
export const loadRowsFromStorage = () => {
  const saved = localStorage.getItem('tables');
  const parsed = saved ? JSON.parse(saved) : [];

  // Якщо це масив таблиць (новий формат для TableEditor)
  if (Array.isArray(parsed)) {
    // Для TableView беремо першу таблицю, якщо вона є, або повертаємо порожній результат
    const firstTable = parsed.length > 0 ? parsed[0] : { date: '', rows: [] };
    return {
      tables: parsed, // Для TableEditor
      date: firstTable.date || '',
      rows: firstTable.rows || [],
    };
  }

  // Старий формат для сумісності
  return {
    tables: parsed.tables || [],
    date: parsed.date || '',
    rows: parsed.rows || [],
  };
};