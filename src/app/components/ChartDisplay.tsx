'use client';

import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions, ChartDataset } from 'chart.js';
import { useMediaQuery } from 'react-responsive';
import { useMemo } from 'react';
import type { Row } from '../types';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartDisplayProps {
  filteredAndSortedRows: Row[];
  totalVolume: number;
  totalAmount: number;
}

interface ForestData {
    labels: string[];
  data: number[];
}

const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function ChartDisplay({ filteredAndSortedRows, totalVolume, totalAmount }: ChartDisplayProps) {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  // Групуємо дані за лісництвами
  const forestData = useMemo<ForestData>(() => {
    const forestMap = new Map<string, number>();
    
    filteredAndSortedRows.forEach(row => {
      if (row.forest && typeof row.volume === 'number') {
        const currentVolume = forestMap.get(row.forest) || 0;
        forestMap.set(row.forest, currentVolume + row.volume);
      }
    });

    return {
      labels: Array.from(forestMap.keys()),
      data: Array.from(forestMap.values())
    };
  }, [filteredAndSortedRows]);

  // Генеруємо кольори лише при зміні labels
  const randomColors = useMemo(
    () => forestData.labels.map(() => generateRandomColor()),
    [forestData.labels]
  );

  const processedChartData: ChartData<'bar', number[], string> = {
    labels: forestData.labels,
    datasets: [{
      type: 'bar' as const,
      label: 'Об\'єм (м³)',
      data: forestData.data,
      backgroundColor: randomColors,
      borderColor: '#FFFFFF',
      borderWidth: 1,
      barThickness: 30,
      categoryPercentage: 0.4,
    }] as ChartDataset<'bar', number[]>[],
  };

  const pieChartData: ChartData<'pie', number[], string> = {
    labels: forestData.labels,
    datasets: [{
      type: 'pie' as const,
      data: forestData.data,
      backgroundColor: randomColors,
      borderColor: '#FFFFFF',
      borderWidth: 1,
    }] as ChartDataset<'pie', number[]>[],
  };

  const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
        position: 'top' as const,
                labels: {
                  font: { size: 14 },
                  color: '#2E7D32',
                },
              },
              title: {
                display: true,
        text: `Об'єм за підрозділами (м³) - Всього: ${totalVolume} м³, ${totalAmount} грн`,
        font: { size: 18, weight: 'bold' as const },
                color: '#2E7D32',
              },
            },
  };

  const barOptions: ChartOptions<'bar'> = {
    ...commonOptions,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
          text: 'Об\'єм (м³)',
                  font: { size: 14 },
                  color: '#2E7D32',
                },
                ticks: {
                  font: { size: 12 },
                  color: '#4CAF50',
                },
                grid: {
                  color: '#E0F2E9',
                  lineWidth: 0.5,
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Підрозділ',
                  font: { size: 14 },
                  color: '#2E7D32',
                },
                ticks: {
                  font: { size: 12 },
                  color: '#4CAF50',
                  maxRotation: 45,
                  minRotation: 45,
                },
                grid: {
                  display: false,
                },
              },
            },
            layout: {
              padding: { top: 10, bottom: 10, left: 10, right: 10 },
            },
  };

  const pieOptions: ChartOptions<'pie'> = {
    ...commonOptions,
  };

  if (!forestData.labels.length || !forestData.data.length) {
    return (
      <div className="mt-4 h-[300px] flex items-center justify-center text-green-500 dark:text-green-400">
        Немає даних для відображення
      </div>
    );
  }

  return (
    <div className={`mt-4 ${forestData.labels.length > 5 ? 'h-[400px] sm:h-[300px]' : 'h-[300px] sm:h-[250px]'}`}>
      {isMobile ? (
        <Pie
          data={pieChartData}
          options={pieOptions}
        />
      ) : (
        <Bar
          data={processedChartData}
          options={barOptions}
        />
      )}
    </div>
  );
}