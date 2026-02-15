import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const BASE_URL = 'https://apnews.in';

  let articles = [];
  try {
    const res = await fetch(`${API_URL}/articles?limit=100`);
    const data = await res.json();
    articles = data.articles;
  } catch (error) {
    console.error('Failed to fetch articles for sitemap');
  }

  const articleUrls = articles.map((article: any) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...articleUrls,
  ];
}
