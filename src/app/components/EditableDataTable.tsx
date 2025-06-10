import EditableRow from './EditableRow';
import type { Row, Purchase } from '../types';

interface EditableDataTableProps {
  tableId: number;
  rows: Row[];
  handleFieldChange: (rowIndex: number, field: keyof Row, value: string | number) => void;
  handleBuyerChange: (rowIndex: number, buyer: string) => void;
  deleteRow: (tableId: number, rowId: number | undefined, rowIndex: number) => Promise<void>;
  forests: string[];
  purchases: Purchase[];
  products: string[];
  species: string[];
}

export default function EditableDataTable({
  tableId,
  rows,
  handleFieldChange,
  handleBuyerChange,
  deleteRow,
  forests,
  purchases,
  products,
  species,
}: EditableDataTableProps) {
  if (!rows || !Array.isArray(rows)) {
    return (
      <div className="text-center p-4 text-gray-500">
        Немає даних для відображення
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Лісництво</th>
            <th className="px-4 py-2 border">Покупець</th>
            <th className="px-4 py-2 border">Продукція</th>
            <th className="px-4 py-2 border">Порода</th>
            <th className="px-4 py-2 border">Об&apos;єм</th>
            <th className="px-4 py-2 border">Сума</th>
            <th className="px-4 py-2 border">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            console.log('EditableDataTable rendering row:', { row, index, tableId });
            return (
              <EditableRow
                key={row.id || index}
                row={row}
                rowIndex={index}
                tableId={tableId}
                handleFieldChange={(field, value) => handleFieldChange(index, field, value)}
                handleBuyerChange={buyer => handleBuyerChange(index, buyer)}
                deleteRow={(tableId, rowId) => deleteRow(tableId, rowId, index)}
                forests={forests}
                purchases={purchases}
                products={products}
                species={species}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}