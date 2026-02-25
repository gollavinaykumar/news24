import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex transition-colors duration-200">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-18 md:pt-8">
        {children}
      </main>
    </div>
  );
}
