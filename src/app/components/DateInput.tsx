// app/components/DateInput.tsx
// import { Row } from '../types/index';

interface DateInputProps {
  tableId: number;
  date: string;
  setDate: (tableId: number, date: string) => void;
  // saveData: (data: { tableId: number; date: string; rows: Row[] }) => void; // Цей пропс тепер не потрібен для onChange
  // rows: Row[]; // Цей пропс також не потрібен для onChange
}

export default function DateInput({ tableId, date, setDate }: DateInputProps) { // Прибираємо saveData та rows з деструктуризації
  return (
    <div className="mb-4 sm:mb-2">
      <h2 className="text-xl sm:text-lg md:text-2xl font-bold mb-2 sm:mb-1">
        Орієнтовний план реалізації (Таблиця {tableId + 1})
      </h2>
      <input
        type="date"
        value={date}
        onChange={e => {
          // Тепер setDate сама обробляє логіку перевірки та збереження
          setDate(tableId, e.target.value);
        }}
        className="border px-2 py-1 sm:px-1 sm:py-0.5 rounded text-sm sm:text-xs md:text-base"
        required // Додаємо атрибут required, щоб поле не могло бути порожнім
      />
    </div>
  );
}