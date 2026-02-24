export const dynamic = 'force-dynamic';

import ArticleForm from '@/components/ArticleForm';

export default function CreateArticlePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Article</h1>
      <ArticleForm />
    </div>
  );
}
