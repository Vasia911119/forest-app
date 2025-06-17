'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const Navbar = memo(function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-green-800 p-4 text-white" role="navigation" aria-label="Головне меню">
      <div className="container mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start">
        <Link 
          href="/" 
          className={`px-4 py-2 rounded transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
            isActive('/') ? 'bg-green-700 font-semibold' : ''
          }`}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          Головна
        </Link>
        {/* <Link 
          href="/input" 
          className={`px-4 py-2 rounded transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
            isActive('/input') ? 'bg-green-700 font-semibold' : ''
          }`}
          aria-current={isActive('/input') ? 'page' : undefined}
        >
          Ввід даних
        </Link> */}
        <div className="flex-1" />
        <ThemeToggle />
      </div>
    </nav>
  );
});

export default Navbar;
