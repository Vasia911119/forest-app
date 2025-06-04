interface ExportButtonsProps {
  exportToExcel: () => void;
  showChart: boolean;
  setShowChart: (show: boolean) => void;
}

export default function ExportButtons({ exportToExcel, showChart, setShowChart }: ExportButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
      <button
        onClick={exportToExcel}
        className="bg-green-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-green-600 sm:text-sm md:text-base"
        aria-label="Завантажити в Excel"
        type="button"
      >
        ⬇️ Завантажити в Excel
      </button>
      <button
        onClick={() => setShowChart(!showChart)}
        className="bg-blue-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded hover:bg-blue-600 sm:text-sm md:text-base"
        aria-label={showChart ? "Приховати графік" : "Показати графік"}
        type="button"
      >
        📊 {showChart ? 'Приховати графік' : 'Показати графік'}
      </button>
    </div>
  );
}