import * as XLSX from 'xlsx-js-style';
import type { Row } from '../app/types';

/**
 * Конфігурація стилів для Excel файлу
 */
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

/**
 * Ширина колонок в символах
 */
const COLUMN_WIDTHS = [8, 15, 35, 25, 15, 25, 30] as const;

/**
 * Заголовки колонок
 */
const HEADERS = ['№ п.п.', 'Підрозділ', 'Покупець', 'Найменування продукції', 'Порода', 'Орієнтовний об\'єм (m³)', 'Орієнтовна сума без ПДВ (грн)'];

/**
 * Інтерфейс для даних таблиці
 */
interface TableData {
  date: string;
  rows: Row[];
}

/**
 * Створює новий робочий аркуш Excel
 */
const createWorksheet = (): XLSX.WorkSheet => {
  try {
    return XLSX.utils.aoa_to_sheet([]);
  } catch (error) {
    console.error('Помилка створення робочого аркуша:', error);
    throw new Error('Не вдалося створити робочий аркуш Excel');
  }
};

/**
 * Додає заголовок до робочого аркуша
 */
const addTitle = (worksheet: XLSX.WorkSheet, date?: string): void => {
  try {
    const title = date ? `Орієнтовний план реалізації на ${new Date(date).toLocaleDateString('uk-UA')}` : 'Орієнтовний план реалізації';
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: 'A1' });
    
    worksheet['A1'].s = {
      fill: { fgColor: { rgb: EXCEL_STYLES.colors.title } },
      font: { bold: true, sz: 22 },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
    
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: HEADERS.length - 1 } }];
  } catch (error) {
    console.error('Помилка додавання заголовка:', error);
    throw new Error('Не вдалося додати заголовок до Excel файлу');
  }
};

/**
 * Додає заголовки колонок до робочого аркуша
 */
const addHeaders = (worksheet: XLSX.WorkSheet): void => {
  try {
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
  } catch (error) {
    console.error('Помилка додавання заголовків:', error);
    throw new Error('Не вдалося додати заголовки до Excel файлу');
  }
};

/**
 * Додає дані до робочого аркуша
 */
const addData = (worksheet: XLSX.WorkSheet, rows: Row[]): void => {
  try {
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
  } catch (error) {
    console.error('Помилка додавання даних:', error);
    throw new Error('Не вдалося додати дані до Excel файлу');
  }
};

/**
 * Додає підсумковий рядок до робочого аркуша
 */
const addTotalRow = (worksheet: XLSX.WorkSheet, rowCount: number, totalVolume: number, totalAmount: number): void => {
  try {
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
  } catch (error) {
    console.error('Помилка додавання підсумкового рядка:', error);
    throw new Error('Не вдалося додати підсумковий рядок до Excel файлу');
  }
};

/**
 * Експортує дані таблиці в Excel файл
 */
export const exportToExcel = (
  tableData: TableData,
  filteredAndSortedRows: Row[],
  totalVolume: number,
  totalAmount: number
): Uint8Array => {
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = createWorksheet();
    
    addTitle(worksheet, tableData.date);
    addHeaders(worksheet);
    addData(worksheet, filteredAndSortedRows);
    addTotalRow(worksheet, filteredAndSortedRows.length, totalVolume, totalAmount);
    
    worksheet['!cols'] = COLUMN_WIDTHS.map(width => ({ wch: width }));
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Таблиця');
    
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  } catch (error) {
    console.error('Помилка експорту в Excel:', error);
    throw new Error('Не вдалося експортувати дані в Excel файл');
  }
};