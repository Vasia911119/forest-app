import DateInput from './DateInput';
import EditableDataTable from './EditableDataTable';
import AddRowButton from './AddRowButton';
import { Row, TableData } from '../types';
import { purchases } from '../data/purchases';

interface TableListProps {
  tables: TableData[];
  setTables: (tables: TableData[]) => void;
  counter: number;
  setCounter: (counter: number | ((prev: number) => number)) => void;
  debouncedSave: (data: { tables: TableData[] }) => void;
}

export default function TableList({ tables, setTables, counter, setCounter, debouncedSave }: TableListProps) {
  const addRow = (tableId: number) => {
    const tableIndex = tables.findIndex(t => t.date === tables[tableId].date);
    const newRow: Row = {
      id: counter,
      forest: '',
      buyer: '',
      product: '',
      species: '',
      volume: 0,
      amount: 0,
    };
    const newTables = [...tables];
    newTables[tableIndex].rows = [...newTables[tableIndex].rows, newRow];
    setTables(newTables);
    debouncedSave({ tables: newTables });
    setCounter(prev => prev + 1);
  };

  const deleteRow = (tableId: number, id: number) => {
    const tableIndex = tables.findIndex(t => t.date === tables[tableId].date);
    const newTables = [...tables];
    newTables[tableIndex].rows = newTables[tableIndex].rows.filter(row => row.id !== id);
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const handleBuyerChange = (tableId: number, index: number, buyer: string) => {
    const tableIndex = tables.findIndex(t => t.date === tables[tableId].date);
    const match = purchases.find(p => p.buyer === buyer);
    const newTables = [...tables];
    if (match) {
      newTables[tableIndex].rows[index] = {
        ...newTables[tableIndex].rows[index],
        buyer,
        product: match.product,
        species: match.species,
        volume: match.volume,
        amount: match.amount,
      };
    } else {
      newTables[tableIndex].rows[index] = {
        ...newTables[tableIndex].rows[index],
        buyer,
        product: '',
        species: '',
        volume: 0,
        amount: 0,
      };
    }
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const handleFieldChange = (tableId: number, index: number, field: keyof Row, value: string | number) => {
    const tableIndex = tables.findIndex(t => t.date === tables[tableId].date);
    const newTables = [...tables];
    if (field === 'volume' || field === 'amount') {
      const numericValue = Number(value);
      if (isNaN(numericValue) || numericValue < 0) return;
      newTables[tableIndex].rows[index] = { ...newTables[tableIndex].rows[index], [field]: numericValue };
    } else {
      newTables[tableIndex].rows[index] = { ...newTables[tableIndex].rows[index], [field]: value };
    }
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const setDate = (tableId: number, newDate: string) => {
    const tableIndex = tables.findIndex(t => t.date === tables[tableId].date);
    const newTables = [...tables];
    newTables[tableIndex].date = newDate;
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const saveData = (data: { tableId: number; date: string; rows: Row[] }) => {
    const { tableId, date, rows } = data;
    const tableIndex = tables.findIndex(t => t.date === tables[tableId].date);
    const newTables = [...tables];
    newTables[tableIndex] = { date, rows };
    setTables(newTables);
    debouncedSave({ tables: newTables });
  };

  const deleteTable = (tableIdx: number) => {
    if (confirm('Ви впевнені, що хочете видалити цю таблицю?')) {
      const newTables = tables.filter((_, idx) => idx !== tableIdx);
      setTables(newTables);
      debouncedSave({ tables: newTables });
    }
  };

  return (
    <>
      {tables.map((table, idx) => (
        <div key={idx} className="mb-6 border rounded p-4 sm:p-2">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            <DateInput
              tableId={idx}
              date={table.date}
              setDate={setDate}
              saveData={saveData}
              rows={table.rows}
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