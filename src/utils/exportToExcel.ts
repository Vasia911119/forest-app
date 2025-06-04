import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Row } from '../app/types';

// Конфігурація стилів
const EXCEL_STYLES = {
  colors: {
    header: '00B047',
    data: 'EFF700',
    total: '00B047',
    title: '2DDB2D'
  },
  borders: {
    thin: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
  }
} as const;

const COLUMN_WIDTHS = [8, 15, 35, 25, 15, 25, 30];
const HEADERS = ['№ п.п.', 'Підрозділ', 'Покупець', 'Найменування продукції', 'Порода', 'Орієнтовний об\'єм (m³)', 'Орієнтовна сума без ПДВ (грн)'];

const createWorksheet = () => XLSX.utils.aoa_to_sheet([]);

const addTitle = (worksheet: XLSX.WorkSheet, date?: string) => {
  const title = date ? `Орієнтовний план реалізації на ${new Date(date).toLocaleDateString('uk-UA')}` : 'Орієнтовний план реалізації';
  XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });
  
  // Стиль заголовка
  worksheet['A1'].s = {
    fill: { fgColor: { rgb: EXCEL_STYLES.colors.title } },
    font: { bold: true, sz: 22 },
    alignment: { horizontal: 'center', vertical: 'center' }
  };
  
  // Об'єднання комірок
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: HEADERS.length - 1 } }];
};

const addHeaders = (worksheet: XLSX.WorkSheet) => {
  XLSX.utils.sheet_add_aoa(worksheet, [HEADERS], { origin: 'A2' });
  
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: EXCEL_STYLES.colors.header } },
    border: EXCEL_STYLES.borders.thin,
    alignment: { horizontal: 'center', vertical: 'center' }
  };
  
  HEADERS.forEach((header, idx) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: idx });
    worksheet[cellAddress] = { v: header, t: 's', s: headerStyle };
  });
};

const addData = (worksheet: XLSX.WorkSheet, rows: Row[]) => {
  const data = rows.map((row, index) => [
    index + 1,
    row.forest,
    row.buyer,
    row.product,
    row.species,
    Math.round(row.volume),
    Math.round(row.amount)
  ]);
  
  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 'A3' });
  
  // Стилі для даних
  const dataStyle = {
    border: EXCEL_STYLES.borders.thin,
    fill: { fgColor: { rgb: EXCEL_STYLES.colors.data } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };
  
  data.forEach((_, rowIdx) => {
    HEADERS.forEach((_, colIdx) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2 + rowIdx, c: colIdx });
      if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
      worksheet[cellAddress].s = dataStyle;
    });
  });
};

const addTotalRow = (worksheet: XLSX.WorkSheet, rowCount: number, totalVolume: number, totalAmount: number) => {
  const totalRow = ['', '', '', '', 'Всього:', Math.round(totalVolume), Math.round(totalAmount)];
  const totalRowIndex = 2 + rowCount;
  
  XLSX.utils.sheet_add_aoa(worksheet, [totalRow], { origin: `A${totalRowIndex + 1}` });
  
  const totalStyle = {
    fill: { fgColor: { rgb: EXCEL_STYLES.colors.total } },
    border: EXCEL_STYLES.borders.thin,
    alignment: { horizontal: 'center', vertical: 'center' },
    font: { bold: true }
  };
  
  totalRow.forEach((value, idx) => {
    const cellAddress = XLSX.utils.encode_cell({ r: totalRowIndex, c: idx });
    worksheet[cellAddress] = {
      v: value,
      t: idx < 5 ? 's' : 'n',
      s: totalStyle
    };
  });
};

export const exportToExcel = (
  tableData: { date: string; rows: Row[] }, 
  filteredAndSortedRows: Row[], 
  totalVolume: number, 
  totalAmount: number
) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = createWorksheet();
  
  addTitle(worksheet, tableData.date);
  addHeaders(worksheet);
  addData(worksheet, filteredAndSortedRows);
  addTotalRow(worksheet, filteredAndSortedRows.length, totalVolume, totalAmount);
  
  // Ширина колонок
  worksheet['!cols'] = COLUMN_WIDTHS.map(width => ({ wch: width }));
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Таблиця');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const file = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  
  const fileName = `таблиця_${tableData.date || 'без_дати'}.xlsx`;
  saveAs(file, fileName);
};