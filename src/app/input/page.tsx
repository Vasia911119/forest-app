import type { Metadata } from 'next';
import TableEditor from '../components/TableEditor';

export const metadata: Metadata = {
  title: 'Ввід даних | Forest App',
  description: 'Сторінка для вводу даних про лісопродукцію',
};

export default function InputPage() {
  return (
    <div className="p-4 sm:p-2">
      <h1 className="text-2xl sm:text-xl md:text-3xl font-bold mb-4 sm:mb-2 text-center">
        Сторінка вводу даних
      </h1>
      <TableEditor />
    </div>
  );
}
