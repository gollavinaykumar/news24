'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear token
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Redirect
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 mt-4 gap-2"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}
