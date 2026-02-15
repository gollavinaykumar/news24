import React from 'react';
import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex transition-colors duration-200">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col justify-between">
        <div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
        </div>
          <nav className="mt-6">
            <Link href="/admin/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
              Dashboard
            </Link>
            <Link href="/admin/articles" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
              Articles
            </Link>
            <Link href="/admin/categories" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
              Categories
            </Link>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <LogoutButton />
            </div>
          </nav>
        </div>

      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
