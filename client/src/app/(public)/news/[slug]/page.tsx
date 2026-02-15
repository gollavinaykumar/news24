import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NewsCard from '@/components/NewsCard';

import ShareButtons from '@/components/ShareButtons';
import { ChevronRight, Clock, Calendar, User } from 'lucide-react';

async function getArticle(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const res = await fetch(`${API_URL}/articles/${slug}`, { next: { revalidate: 60 } });
  
  if (!res.ok) return undefined;
  
  return res.json();
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  // Telugu avg ~150 words per minute reading speed
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 150));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.title,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.title,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const readingTime = estimateReadingTime(article.content);
  const articleUrl = `https://apnews.in/news/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.seoTitle || article.title,
    image: article.image ? [article.image] : [],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: [{
      '@type': 'Person',
      name: article.author.name,
      url: `https://apnews.in/author/${article.author.name}`
    }],
    publisher: {
      '@type': 'Organization',
      name: 'APNews.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://apnews.in/logo.png'
      }
    },
    description: article.seoDescription || article.title,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-6 flex-wrap">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          హోమ్
        </Link>
        <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
        <Link href={`/category/${article.category.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          {article.category.name}
        </Link>
        <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{article.title}</span>
      </nav>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content – 2/3 */}
        <article className="lg:col-span-2">
          <header className="mb-2 md:mb-8">
            {/* Meta info */}
            <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 px-3 py-1 rounded-full font-medium text-xs">
                {article.category.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.createdAt).toLocaleDateString('te-IN')}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {article.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} నిమి. చదివేకాలం
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              {article.title}
            </h1>

            {article.image && article.showFeaturedImage !== false && (
              <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          {/* Share buttons - above content */}
          <ShareButtons url={articleUrl} title={article.title} />

          {/* Article content */}
          <div
            className="prose prose-lg max-w-none article-content text-black dark:text-gray-100 dark:prose-invert prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black dark:prose-p:text-gray-100 dark:prose-headings:text-white dark:prose-strong:text-white dark:prose-li:text-gray-100 mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ట్యాగ్‌లు:</span>
              {article.tags.map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Share buttons - below content */}
          <ShareButtons url={articleUrl} title={article.title} />

          {/* Author Bio */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-4">
            {article.author.image ? (
              <img src={article.author.image} alt={article.author.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold shrink-0">
                {article.author.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{article.author.name}</h3>
              {article.author.bio && <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">{article.author.bio}</p>}
            </div>
          </div>

          {/* Related Articles - below main content on mobile */}
          <section className="mt-12 lg:hidden">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-l-4 border-indigo-600 pl-4">సంబంధిత వార్తలు</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RelatedArticles categorySlug={article.category.slug} currentId={article.id} />
            </div>
          </section>
        </article>

        {/* Sidebar – 1/3, sticky on desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-8">
            {/* Related Articles */}
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-l-4 border-indigo-600 pl-3">
                సంబంధిత వార్తలు
              </h3>
              <div className="space-y-4">
                <RelatedArticles categorySlug={article.category.slug} currentId={article.id} />
              </div>
            </div>

            {/* Ad slot removed */}
          </div>
        </aside>
      </div>
    </div>
  );
}

async function RelatedArticles({ categorySlug, currentId }: { categorySlug: string, currentId: string }) {
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
   let articles: any[] = [];
   try {
      const res = await fetch(`${API_URL}/articles?category=${categorySlug}&limit=4`, { next: { revalidate: 60 } });
      const data = await res.json();
      articles = data.articles.filter((a: any) => a.id !== currentId).slice(0, 3);
   } catch(e) {}

   if (articles.length === 0) return <p className="text-gray-500 dark:text-gray-400 text-sm">సంబంధిత వార్తలు లేవు.</p>;

   return (
     <>
       {articles.map((article: any) => (
         <NewsCard key={article.id} article={article} variant="compact" />
       ))}
     </>
   );
}
