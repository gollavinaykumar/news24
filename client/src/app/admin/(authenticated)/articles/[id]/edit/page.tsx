'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/ArticleForm';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { use } from 'react';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await api.get(`/articles/${id}`);
      setArticle(res.data);
    } catch (error) {
      toast.error('Failed to load article');
      router.push('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>;

  if (!article) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Article</h1>
      <ArticleForm initialData={article} isDid={id} />
    </div>
  );
}
