'use client';

import { useEffect, useState } from 'react';
import ArticleForm from '@/components/ArticleForm';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    try {
      const res = await api.get(`/articles/${params.id}`);
      setArticle(res.data);
    } catch (error) {
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
      {article && <ArticleForm initialData={article} isDid={params.id} />}
    </div>
  );
}
