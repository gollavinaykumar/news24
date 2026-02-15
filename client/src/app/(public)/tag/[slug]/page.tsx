import NewsCard from '@/components/NewsCard';
import { notFound } from 'next/navigation';

async function getTagNews(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const res = await fetch(`${API_URL}/articles?tag=${slug}&limit=20`, { next: { revalidate: 60 } });
  
  if (!res.ok) return undefined;
  
  return res.json();
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getTagNews(slug);

  if (!data || data.articles.length === 0) {
      // Could show empty
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-indigo-600 pl-4 capitalize flex items-center">
        <span className="text-gray-500 mr-2">#</span>
        {slug.replace('-', ' ')}
      </h1>
      
      {data && data.articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.articles.map((article: any) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No articles found with this tag.</p>
      )}
    </div>
  );
}
