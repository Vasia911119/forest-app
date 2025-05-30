'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex gap-4">
      <Link href="/">Головна</Link>
      <Link href="/input">Ввід даних</Link>
    </nav>
  );
}
