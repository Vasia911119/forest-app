import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';
import { Row } from '../app/types';

export const exportToExcel = (tableData: { date: string; rows: Row[] }, filteredAndSortedRows: Row[], totalVolume: number, totalAmount: number) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([]);

  const header = tableData.date
    ? [`Орієнтовний план реалізації на ${new Date(tableData.date).toLocaleDateString('uk-UA')}`]
    : ['Орієнтовний план реалізації'];
  XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

  worksheet['A1'].s = {
    fill: { fgColor: { rgb: '2DDB2D' } },
    font: { bold: true, sz: 22 },
    alignment: { horizontal: 'center', vertical: 'center' }
  };
  worksheet['!merges'] = worksheet['!merges'] || [];
  worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } });

  const headers = [
    '№ п.п.',
    'Підрозділ',
    'Покупець',
    'Найменування продукції',
    'Порода',
    'Орієнтовний об’єм (m³)',
    'Орієнтовна сума без ПДВ (грн)'
  ];
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A2' });

  // Змінено: замість row.id використовуємо index + 1
  // Змінено: округлюємо volume та amount
  const data = filteredAndSortedRows.map((row, index) => [
    index + 1, // <--- Змінено на порядковий номер
    row.forest,
    row.buyer,
    row.product,
    row.species,
    Math.round(row.volume), // <--- Округлюємо
    Math.round(row.amount), // <--- Округлюємо
  ]);
  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 'A3' });

  // Змінено: округлюємо totalVolume та totalAmount
  const totalRow = ['', '', '', '', 'Всього:', Math.round(totalVolume), Math.round(totalAmount)]; // <--- Округлюємо
  XLSX.utils.sheet_add_aoa(worksheet, [totalRow], { origin: `A${3 + filteredAndSortedRows.length}` });

  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 15 },
    { wch: 35 },
    { wch: 25 },
    { wch: 15 },
    { wch: 25 },
    { wch: 30 },
  ];

  const borderStyle = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: '00B047' } },
    border: borderStyle,
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  headers.forEach((_, idx) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: idx });
    worksheet[cellAddress] = { v: headers[idx], t: 's', s: headerStyle };
  });

  data.forEach((_, rowIdx) => {
    headers.forEach((_, colIdx) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2 + rowIdx, c: colIdx });
      if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
      worksheet[cellAddress].s = { ...worksheet[cellAddress].s, border: borderStyle,
        fill: { patternType: 'solid', fgColor: { rgb: 'EFF700' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    });
  });

  totalRow.forEach((value, idx) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 2 + filteredAndSortedRows.length, c: idx });
    worksheet[cellAddress] = {
      v: value,
      t: idx < 5 ? 's' : 'n',
      s: {
        fill: { patternType: 'solid', fgColor: { rgb: '00B047' } },
        border: borderStyle,
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true }
      }
    };
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Таблиця');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const file = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(file, `таблиця_${tableData.date || 'без_дати'}.xlsx`);
};