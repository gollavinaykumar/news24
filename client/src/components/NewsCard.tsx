import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  image?: string;
  category: { name: string; slug: string };
  createdAt: string;
  seoDescription?: string;
}

interface Props {
  article: Article;
  featured?: boolean;
  variant?: 'default' | 'compact' | 'mini';
  index?: number;
}

export default function NewsCard({ article, featured = false, variant = 'default', index }: Props) {

  // Mini variant – just numbered title, for trending strip
  if (variant === 'mini') {
    return (
      <Link href={`/news/${article.slug}`} className="flex items-center gap-3 group min-w-[280px] shrink-0">
        <span className="text-2xl font-black text-white/30 group-hover:text-white/60 transition-colors">
          {String(index ?? 0).padStart(2, '0')}
        </span>
        <span className="text-sm font-medium text-white group-hover:text-white/80 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </span>
      </Link>
    );
  }

  // Compact variant – horizontal card for sidebar lists
  if (variant === 'compact') {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-3 items-start">
        <div className="relative w-24 h-18 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              చిత్రం
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h4>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
            {new Date(article.createdAt).toLocaleDateString('te-IN')}
          </span>
        </div>
      </Link>
    );
  }

  // Default / Featured variant
  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 ${featured ? 'md:grid md:grid-cols-2' : ''}`}>
      <div className={`relative ${featured ? 'h-64 md:h-full' : 'h-48'} w-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
         {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
               చిత్రం లేదు
            </div>
         )}
         {article.category && (
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2.5 py-1 rounded-full uppercase font-semibold z-10 shadow-sm">
              {article.category.name}
            </span>
         )}
      </div>
      <div className="p-5 flex flex-col justify-between">
        <div>
           <Link href={`/news/${article.slug}`} className="block">
             <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug ${featured ? 'text-2xl' : 'text-lg line-clamp-2'}`}>
               {article.title}
             </h3>
           </Link>
           {featured && article.seoDescription && (
             <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
               {article.seoDescription}
             </p>
           )}
        </div>
        <div className="mt-4 flex items-center text-xs text-gray-400 dark:text-gray-500">
          <span>{new Date(article.createdAt).toLocaleDateString('te-IN')}</span>
        </div>
      </div>
    </div>
  );
}
