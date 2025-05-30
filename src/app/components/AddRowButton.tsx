interface AddRowButtonProps {
  tableId: number;
  addRow: (tableId: number) => void;
}

export default function AddRowButton({ tableId, addRow }: AddRowButtonProps) {
  return (
    <button
      onClick={() => addRow(tableId)}
      className="mb-4 sm:mb-2 bg-blue-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-blue-600 sm:text-sm md:text-base"
    >
      Додати рядок
    </button>
  );
}