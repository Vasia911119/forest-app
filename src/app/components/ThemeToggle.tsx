import { useEffect, useState } from 'react';
import { FaTree } from 'react-icons/fa';
import { MdForest } from 'react-icons/md';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed z-50 sm:static sm:ml-2 right-4 top-4 sm:top-auto p-2 rounded-full border border-green-400 dark:border-green-700 bg-white dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 transition-colors shadow"
      aria-label="Перемкнути тему"
      title={theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'}
    >
      {theme === 'light' ? (
        <FaTree className="w-6 h-6 text-green-700" title="Світла тема: ліс" />
      ) : (
        <MdForest className="w-6 h-6 text-green-300" title="Темна тема: ліс" />
      )}
    </button>
  );
} 