import type { Metadata } from 'next';
import TableEditor from '../components/TableEditor';
import ScrollToTop from '../components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Ввід даних | Forest App',
  description: 'Система обліку лісопродукції',
};

export default function InputPage() {
  return (
    <div className="p-4 sm:p-2">
      {/* <h1 className="text-3xl sm:text-2xl md:text-4xl font-bold mb-4 sm:mb-2 text-center">
        Ввід даних
      </h1> */}
      <TableEditor />
      <ScrollToTop />
    </div>
  );
}
