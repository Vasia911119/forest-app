interface DateInputProps {
  tableId: number;
  date: string;
  setDate: (tableId: number, date: string) => void;
  saveData: (data: { tableId: number; date: string; rows: any[] }) => void;
  rows: any[];
}

export default function DateInput({ tableId, date, setDate, saveData, rows }: DateInputProps) {
  return (
    <div className="mb-4 sm:mb-2">
      <h2 className="text-xl sm:text-lg md:text-2xl font-bold mb-2 sm:mb-1">Орієнтовний план реалізації (Таблиця {tableId + 1})</h2>
      <input
        type="date"
        value={date}
        onChange={e => {
          setDate(tableId, e.target.value);
          saveData({ tableId, date: e.target.value, rows });
        }}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base"
      />
    </div>
  );
}