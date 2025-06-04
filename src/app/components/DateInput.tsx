interface DateInputProps {
  tableId: number;
  date: string;
  setDate: (tableId: number, date: string) => void;
}

export default function DateInput({ tableId, date, setDate }: DateInputProps) {
  return (
    <div className="mb-4 sm:mb-2">
      <h2 className="text-xl sm:text-lg md:text-2xl font-bold mb-2 sm:mb-1">
        Орієнтовний план реалізації (Таблиця {tableId + 1})
      </h2>
      <input
        type="date"
        value={date}
        aria-label="Оберіть дату для цього плану"
        onChange={e => setDate(tableId, e.target.value)}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base"
        required
      />
    </div>
  );
}