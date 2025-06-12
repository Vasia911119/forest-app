import type { Metadata } from 'next';
import TableView from './components/TableView';
import ScrollToTop from './components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Головна | Forest App',
  description: 'Система обліку лісопродукції',
};

export default function Home() {
  return (
    <div className="p-4 sm:p-2">
      <h1 className="text-3xl sm:text-2xl md:text-4xl font-bold mb-4 sm:mb-2 text-center">
        Головна сторінка
      </h1>
      <TableView />
      <ScrollToTop />
    </div>
  );
}
