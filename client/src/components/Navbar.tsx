'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';
import { Menu, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClass = "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 font-semibold";
    const inactiveClass = "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800";
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/50 fixed w-full z-50 top-0 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 md:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">APNews.in</span>
            </Link>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:space-x-6 items-center">
            <Link href="/" className={getLinkClass('/')}>
              హోమ్
            </Link>
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className={getLinkClass(`/category/${cat.slug}`)}>
                {cat.name}
              </Link>
            ))}
          </div>



          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg z-50 relative">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={() => setIsOpen(false)} className={`block ${getLinkClass('/')} text-base`}>
              హోమ్
            </Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} onClick={() => setIsOpen(false)} className={`block ${getLinkClass(`/category/${cat.slug}`)} text-base`}>
                {cat.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
}
