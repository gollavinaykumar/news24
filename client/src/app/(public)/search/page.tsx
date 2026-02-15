'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import api from '@/lib/api';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      searchArticles(query);
    }
  }, [query]);

  const searchArticles = async (q: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/articles?search=${q}`);
      setArticles(res.data.articles);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Search Results for "{query}"
      </h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article: any) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
