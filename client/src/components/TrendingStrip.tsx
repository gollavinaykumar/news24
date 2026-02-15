'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import NewsCard from './NewsCard';
import { TrendingUp } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  image?: string;
  category: { name: string; slug: string };
  createdAt: string;
}

export default function TrendingStrip() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await api.get('/articles?limit=5');
      setArticles(res.data.articles);
    } catch (error) {
      console.error('Failed to load trending');
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className="trending-gradient rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <TrendingUp className="w-5 h-5 text-white" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">ట్రెండింగ్</h3>
      </div>
      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-1">
        {articles.map((article, i) => (
          <NewsCard key={article.id} article={article} variant="mini" index={i + 1} />
        ))}
      </div>
    </div>
  );
}
