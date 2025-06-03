'use client';

import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useMediaQuery } from 'react-responsive';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartDisplayProps {
  chartData: {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string | string[]; borderColor: string; borderWidth: number; barThickness?: number; categoryPercentage?: number }[];
  };
}

// Функція для генерації випадкового кольору у форматі HEX
const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function ChartDisplay({ chartData }: ChartDisplayProps) {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  // Дані для стовпчикового графіка
  const processedChartData = {
    labels: chartData.labels,
    datasets: chartData.datasets.map(dataset => ({
      ...dataset,
      barThickness: 30,
      categoryPercentage: 0.4,
    })),
  };

  // Генерація випадкових кольорів для кожного підрозділу
  const randomColors = chartData.labels.map(() => generateRandomColor());

  // Дані для кругового графіка з випадковими кольорами
  const pieChartData = {
    labels: chartData.labels,
    datasets: [{
      data: chartData.datasets[0].data,
      backgroundColor: randomColors,
      borderColor: '#FFFFFF',
      borderWidth: 1,
    }],
  };

  return (
    <div className={`mt-4 ${chartData.labels.length > 5 ? 'h-[400px] sm:h-[300px]' : 'h-[300px] sm:h-[250px]'}`}>
      {isMobile ? (
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  font: { size: 14 },
                  color: '#2E7D32',
                },
              },
              title: {
                display: true,
                text: 'Об’єм за підрозділами (м³)',
                font: { size: 18, weight: 'bold' },
                color: '#2E7D32',
              },
            },
          }}
        />
      ) : (
        <Bar
          data={processedChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  font: { size: 14 },
                  color: '#2E7D32',
                },
              },
              title: {
                display: true,
                text: 'Об’єм за підрозділами (м³)',
                font: { size: 18, weight: 'bold' },
                color: '#2E7D32',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Об’єм (м³)',
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
          }}
        />
      )}
    </div>
  );
}