import { memo, useCallback } from 'react';

interface DateInputProps {
  tableId: number;
  date: string;
  setDate: (tableId: number, date: string) => void;
}

const DateInput = memo(function DateInput({ 
  tableId, 
  date, 
  setDate 
}: DateInputProps) {
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    // Перевіряємо, чи дата є коректною
    if (newDate && !isNaN(Date.parse(newDate))) {
      setDate(tableId, newDate);
    }
  }, [tableId, setDate]);

  if (tableId < 0) {
    return null;
  }

  return (
    <div className="mb-4 sm:mb-2">
      <h2 className="text-green-900 text-xl sm:text-lg md:text-2xl font-bold mb-2 sm:mb-1 dark:text-green-100">
        Орієнтовний план реалізації на {new Date(date).toLocaleDateString('uk-UA')}
      </h2>
      <input
        type="date"
        value={date}
        aria-label="Оберіть дату для цього плану"
        onChange={handleDateChange}
        className="text-green-900 border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base dark:bg-green-900 dark:text-green-100 dark:border-green-700"
        required
        min={new Date().toISOString().split('T')[0]} // Забороняємо вибір дат у минулому
      />
    </div>
  );
});

export default DateInput;