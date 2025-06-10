import { memo } from 'react';

interface ExportButtonProps {
  tableIdx: number;
  handleExport: (tableIdx: number) => Promise<void>;
  isExporting: boolean;
}

const ExportButton = memo(function ExportButton({ tableIdx, handleExport, isExporting }: ExportButtonProps) {
  return (
    <button
      onClick={() => handleExport(tableIdx)}
      disabled={isExporting}
      className={`px-2 py-1 border rounded ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isExporting ? 'Експорт...' : 'Експорт в Excel'}
    </button>
  );
});

export default ExportButton; 