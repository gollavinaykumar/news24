'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articleCount: 0, categoryCount: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Total Articles</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.articleCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Total Categories</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.categoryCount}</p>
        </div>
      </div>
    </div>
  );
}
