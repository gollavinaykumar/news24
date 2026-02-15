import { notFound } from 'next/navigation';
import CategoryFeed from '@/components/CategoryFeed';

async function getCategoryNews(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const today = new Date().toISOString().split('T')[0];
  // Check if API_URL is reachable from server
  const res = await fetch(`${API_URL}/articles?category=${slug}&limit=9&page=1&date=${today}`, { next: { revalidate: 60 } });
  
  if (!res.ok) return undefined;
  
  return res.json();
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialData = await getCategoryNews(slug);
  const today = new Date().toISOString().split('T')[0];

  if (!initialData) {
    notFound();
  }
  
  // Format title
  let title = decodeURIComponent(slug);
  if (initialData && initialData.articles && initialData.articles.length > 0) {
    title = initialData.articles[0].category.name;
  } else {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-8 text-gray-900 dark:text-gray-100 border-l-4 border-indigo-600 pl-4 capitalize flex items-center justify-between">
        <span>{title} News</span>
      </h1>
      
      {initialData ? (
         <CategoryFeed initialData={initialData} slug={slug} initialDate={today} />
      ) : (
         <p className="text-gray-500">No articles found.</p>
      )}
    </div>
  );
}
