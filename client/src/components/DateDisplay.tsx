'use client';

import { useState, useEffect } from 'react';

export default function DateDisplay() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString('te-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
      })
    );
  }, []);

  if (!dateStr) return null;

  return (
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {dateStr}
    </p>
  );
}
