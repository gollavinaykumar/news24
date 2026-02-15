'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function BreakingNewsTicker() {
  const [breakingNews, setBreakingNews] = useState<{ id: string; title: string; slug: string }[]>([]);

  useEffect(() => {
    fetchBreakingNews();
  }, []);

  const fetchBreakingNews = async () => {
    try {
      const res = await api.get('/articles?isBreaking=true&limit=5');
      setBreakingNews(res.data.articles);
    } catch (error) {
      console.error('Failed to load breaking news');
    }
  };

  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-red-600 text-white overflow-hidden py-2 relative flex items-center">
      <div className="bg-red-800 absolute left-0 z-10 px-4 py-2 font-bold text-sm uppercase tracking-wider">
        బ్రేకింగ్ న్యూస్
      </div>
      <div className="whitespace-nowrap animate-marquee flex space-x-8 pl-32">
        {breakingNews.map((news) => (
          <Link key={news.id} href={`/news/${news.slug}`} className="hover:underline text-sm font-medium inline-block">
            {news.title}
          </Link>
        ))}
         {/* Duplicate for infinite scroll effect if needed, simpler CSS marquee for now */}
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
