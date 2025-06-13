import { memo } from 'react';
import type { Row } from '../types';

interface ChartControlsProps {
  tableIdx: number;
  showChart: boolean;
  updateShowChart: (tableIdx: number, showChart: boolean) => void;
  rows: Row[];
  totals: {
    totalVolume: number;
    totalAmount: number;
  };
}

const ChartControls = memo(function ChartControls({ tableIdx, showChart, updateShowChart, totals }: ChartControlsProps) {
  const handleToggleChart = () => {
    updateShowChart(tableIdx, !showChart);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={handleToggleChart}
        className={`px-2 py-1 border rounded dark:bg-green-900 dark:text-green-100 dark:border-green-700 ${showChart ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
      >
        {showChart ? 'Сховати графік' : 'Показати графік'}
      </button>
      {showChart && (
        <div className="text-sm dark:text-green-300">
          <div>Загальний об&apos;єм: {Math.round(totals.totalVolume)} m³</div>
          <div>Загальна сума: {Math.round(totals.totalAmount)} грн</div>
        </div>
      )}
    </div>
  );
});

export default ChartControls; 