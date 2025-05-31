// app/components/TableList.tsx
import DateInput from './DateInput';
import EditableDataTable from './EditableDataTable';
import AddRowButton from './AddRowButton';
import { Row, TableData } from '../types';
import { purchases } from '../data/purchases';

interface TableListProps {
  tables: TableData[];
  setTables: (tables: TableData[]) => void;
  debouncedSave: (data: { tables: TableData[] }) => void;
  deleteTable: (tableIdx: number) => void;
}

export default function TableList({ tables, setTables, debouncedSave, deleteTable }: TableListProps) {
  const addRow = (tableId: number) => {
    if (!tables[tableId].date) {
      alert('Будь ласка, спочатку введіть дату для цієї таблиці.');
      return;
    }

    const newRow: Row = {
      id: Date.now(),
      forest: '',
      buyer: '',
      product: '',
      species: '',
      volume: 0,
      amount: 0,
    };
    const newTables = [...tables];
    newTables[tableId].rows = [...newTables[tableId].rows, newRow];
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const deleteRow = (tableId: number, id: number) => {
    const newTables = [...tables];
    newTables[tableId].rows = newTables[tableId].rows.filter(row => row.id !== id);
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const handleFieldChange = (tableId: number, index: number, field: keyof Row, value: string | number) => {
    const newTables = [...tables];
    (newTables[tableId].rows[index][field] as string | number) = value;
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const handleBuyerChange = (tableId: number, index: number, buyer: string) => {
    const newTables = [...tables];
    const newRow = { ...newTables[tableId].rows[index], buyer };

    if (!buyer) {
      newRow.product = '';
      newRow.species = '';
      newRow.volume = 0;
      newRow.amount = 0;
    } else {
      const relatedPurchase = purchases.find(p => p.buyer === buyer);
      if (relatedPurchase) {
        newRow.product = relatedPurchase.product;
        newRow.species = relatedPurchase.species;
        newRow.volume = relatedPurchase.volume;
        newRow.amount = relatedPurchase.amount;
      } else {
        newRow.product = '';
        newRow.species = '';
        newRow.volume = 0;
        newRow.amount = 0;
      }
    }
    newTables[tableId].rows[index] = newRow;
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const setDate = (tableId: number, newDate: string) => {
    if (!newDate) {
      alert('Дата таблиці не може бути порожньою.');
      return;
    }

    const isDateTaken = tables.some((table, idx) =>
      idx !== tableId && table.date === newDate
    );

    if (isDateTaken) {
      alert(`Таблиця на дату "${new Date(newDate).toLocaleDateString('uk-UA')}" вже існує.`);
      return;
    }

    const newTables = [...tables];
    const currentTable = newTables[tableId];
    newTables[tableId] = { ...currentTable, date: newDate };

    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const saveData = (data: { tableId: number; date: string; rows: Row[] }) => {
    const { tableId, date, rows } = data;
    if (!date) {
      console.warn("Attempted to save table with empty date.");
      return;
    }

    const newTables = [...tables];
    newTables[tableId] = { date, rows };
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  return (
    <> {/* Виправлено тут: замість <>> тепер <> */}
      {tables.map((table, idx) => (
        <div key={idx} className="mb-6 border rounded p-4 sm:p-2">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            <DateInput
              tableId={idx}
              date={table.date}
              setDate={setDate}
            />
            <button
              onClick={() => deleteTable(idx)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 sm:px-3 sm:py-1 sm:text-sm md:text-base"
            >
              Видалити таблицю
            </button>
          </div>
          <EditableDataTable
            tableId={idx}
            rows={table.rows}
            handleFieldChange={handleFieldChange}
            handleBuyerChange={handleBuyerChange}
            deleteRow={deleteRow}
          />
          <AddRowButton tableId={idx} addRow={addRow} />
        </div>
      ))}
    </>
  );
}