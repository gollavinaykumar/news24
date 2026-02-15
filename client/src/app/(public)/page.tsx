import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import TrendingStrip from '@/components/TrendingStrip';


async function getData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  
  try {
    const [latestRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/articles?limit=5`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } }),
    ]);

    const latest = await latestRes.json();
    const categories = await categoriesRes.json();

    return { latest: latest.articles, categories };
  } catch (error) {
    console.error('Failed to fetch data', error);
    return { latest: [], categories: [] };
  }
}

export default async function Home() {
  const { latest, categories } = await getData();
  const featured = latest[0];
  const sidebarArticles = latest.slice(1, 5);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'APNews.in',
    url: 'https://apnews.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://apnews.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-6 space-y-3 md:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreakingNewsTicker />
      
      <div className="flex justify-end mb-2">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('te-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
          })}
        </p>
      </div>
      
      {/* ── Hero Section ── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-6 text-gray-900 dark:text-white border-l-4 border-indigo-600 pl-4">
          తాజా వార్తలు
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured article – takes 2/3 on desktop */}
          <div className="lg:col-span-2">
            {featured && (
              <Link href={`/news/${featured.slug}`} className="group block relative rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[480px]">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
                  {featured.image && (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  {featured.category && (
                    <span className="inline-block bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 uppercase tracking-wide">
                      {featured.category.name}
                    </span>
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-2 group-hover:text-indigo-300 transition-colors">
                    {featured.title}
                  </h3>
                  {featured.seoDescription && (
                    <p className="text-gray-300 text-sm line-clamp-2 hidden md:block">
                      {featured.seoDescription}
                    </p>
                  )}
                  <span className="text-gray-400 text-xs mt-3 block">
                    {new Date(featured.createdAt).toLocaleDateString('te-IN')}
                  </span>
                </div>
              </Link>
            )}
          </div>
          
          {/* Sidebar – 4 compact articles stacked */}
          <div className="space-y-4">
            {sidebarArticles.map((article: any) => (
              <NewsCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Strip ── */}
      <TrendingStrip />

      {/* ── Category Sections ── */}
      {categories.map((cat: any, idx: number) => (
        <div key={cat.id}>
          <CategorySection category={cat} accentIndex={idx} />

        </div>
      ))}
    </div>
  );
}

async function CategorySection({ category, accentIndex }: { category: any; accentIndex: number }) {
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
   let articles: any[] = [];
   try {
      const res = await fetch(`${API_URL}/articles?category=${category.slug}&limit=9`, { next: { revalidate: 60 } });
      const data = await res.json();
      articles = data.articles;
   } catch (e) {
      console.error(`Failed to load category ${category.name}`);
   }

   if (articles.length === 0) return null;

   const mainArticle = articles[0];
   const sideArticles = articles.slice(1);

   return (
      <section className="mt-10">
        <div className={`flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3`}>
          <h2 className={`text-xl md:text-2xl font-bold text-gray-900 dark:text-white border-l-4 pl-4 category-accent-${accentIndex % 8}`}>
            {category.name}
          </h2>
          <Link href={`/category/${category.slug}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors">
            అన్ని చూడండి &rarr;
          </Link>
        </div>
        
        {/* Compact Grid Layout: 3 columns of small horizontal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </section>
   );
}
