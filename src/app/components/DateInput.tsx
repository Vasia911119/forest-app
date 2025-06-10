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
      <h2 className="text-xl sm:text-lg md:text-2xl font-bold mb-2 sm:mb-1">
        Орієнтовний план реалізації (Таблиця {tableId + 1})
      </h2>
      <input
        type="date"
        value={date}
        aria-label="Оберіть дату для цього плану"
        onChange={handleDateChange}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base"
        required
        min={new Date().toISOString().split('T')[0]} // Забороняємо вибір дат у минулому
      />
    </div>
  );
});

export default DateInput;