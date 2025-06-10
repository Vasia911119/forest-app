import { NextResponse } from 'next/server';
import { exportToExcel } from '@/utils/exportToExcel';
import type { TableData, Row } from '@/app/types';

interface ExportRequest {
  tableData: TableData;
  filteredAndSortedRows: Row[];
  totalVolume: number;
  totalAmount: number;
}

interface ExportResponse {
  error?: string;
}

/**
 * Експорт даних таблиці в Excel
 */
export async function POST(request: Request): Promise<NextResponse<ExportResponse | Buffer>> {
  try {
    const { tableData, filteredAndSortedRows, totalVolume, totalAmount } = await request.json() as ExportRequest;

    if (!tableData || !filteredAndSortedRows) {
      return NextResponse.json(
        { error: 'Відсутні необхідні дані' },
        { status: 400 }
      );
    }

    const buffer = exportToExcel(tableData, filteredAndSortedRows, totalVolume, totalAmount);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="table_${tableData.date}.xlsx"`
      }
    });
  } catch (error) {
    console.error('Помилка експорту:', error);
    return NextResponse.json(
      { error: 'Не вдалося експортувати дані' },
      { status: 500 }
    );
  }
} 