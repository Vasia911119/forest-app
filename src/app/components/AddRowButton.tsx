import { memo } from 'react';

interface AddRowButtonProps {
  tableId: number;
  addRow: (tableId: number) => void;
  disabled?: boolean;
}

const AddRowButton = memo(function AddRowButton({ 
  tableId, 
  addRow, 
  disabled = false 
}: AddRowButtonProps) {
  const handleClick = () => {
    addRow(tableId);
  };

  return (
    <button
      onClick={handleClick}
      className="mb-4 sm:mb-2 bg-blue-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-blue-600 sm:text-sm md:text-base disabled:opacity-50"
      aria-label="Додати рядок"
      disabled={disabled}
      type="button"
    >
      ➕ Додати рядок
    </button>
  );
});

export default AddRowButton;