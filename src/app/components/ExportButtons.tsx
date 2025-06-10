import { memo, useCallback } from 'react';

interface ExportButtonsProps {
  exportToExcel: () => void;
  showChart: boolean;
  setShowChart: (show: boolean) => void;
  isExporting?: boolean;
}

const ExportButtons = memo(function ExportButtons({ 
  exportToExcel, 
  showChart, 
  setShowChart,
  isExporting = false 
}: ExportButtonsProps) {
  const handleExport = useCallback(async () => {
    try {
      await exportToExcel();
    } catch (error) {
      console.error('Помилка при експорті:', error);
      alert('Не вдалося експортувати дані. Спробуйте ще раз.');
    }
  }, [exportToExcel]);

  const handleChartToggle = useCallback(() => {
    setShowChart(!showChart);
  }, [showChart, setShowChart]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
      <button
        onClick={handleExport}
        className="bg-green-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-green-600 sm:text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Завантажити в Excel"
        type="button"
        disabled={isExporting}
      >
        {isExporting ? '⏳ Експорт...' : '⬇️ Завантажити в Excel'}
      </button>
      <button
        onClick={handleChartToggle}
        className="bg-blue-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-blue-600 sm:text-sm md:text-base"
        aria-label={showChart ? "Приховати графік" : "Показати графік"}
        type="button"
      >
        📊 {showChart ? 'Приховати графік' : 'Показати графік'}
      </button>
    </div>
  );
});

export default ExportButtons;