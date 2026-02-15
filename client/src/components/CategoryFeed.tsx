'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import NewsCard from '@/components/NewsCard';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  image?: string;
  createdAt: string;
  category: { name: string; slug: string };
  author: { name: string };
}

interface CategoryFeedProps {
  initialData: any;
  slug: string;
  initialDate?: string;
}

export default function CategoryFeed({ initialData, slug, initialDate }: CategoryFeedProps) {
  const [dateFilter, setDateFilter] = useState<string>(initialDate || new Date().toISOString().split('T')[0]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['category', slug, dateFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/articles?category=${slug}&limit=9&page=${pageParam}&date=${dateFilter}`);
      return res.data;
    },
    initialPageParam: 1,
    initialData: dateFilter === initialDate ? {
      pages: [initialData],
      pageParams: [1],
    } : undefined,
    getNextPageParam: (lastPage: any) => {
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined;
    },
  });

  return (
    <div>
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="date-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter Date:
          </label>
          <input
            type="date"
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page: any, i: number) => (
          page.articles.map((article: Article) => (
            <NewsCard key={`${article.id}-${i}`} article={article} variant="compact" />
          ))
        ))}
      </div>

      {isPending && (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      )}

      {status === 'success' && data?.pages[0].articles.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No articles found for this date.
        </div>
      )}

      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Stories'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
