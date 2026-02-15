'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import TagsInput from './admin/TagsInput';
import { useRouter } from 'next/navigation';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  isBreaking: z.boolean().optional(),
  showFeaturedImage: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface Props {
  initialData?: any;
  isDid?: string; // If editing, pass ID
}

export default function ArticleForm({ initialData, isDid }: Props) {
  const router = useRouter();
  const { data: categories = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(initialData?.image || '');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      categoryId: initialData?.categoryId || '',
      status: initialData?.status || 'DRAFT',
      isBreaking: initialData?.isBreaking || false,
      showFeaturedImage: initialData?.showFeaturedImage !== false, // Default true
      tags: initialData?.tags?.map((t: any) => t.id) || [],
      seoTitle: initialData?.seoTitle || '',
      seoDescription: initialData?.seoDescription || '',
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    setSubmitting(true);
    try {
      let imageUrl = previewImage;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.url;
      }

      const payload = { ...data, image: imageUrl }; // Author ID handled by backend

      if (isDid) {
        await api.put(`/articles/${isDid}`, payload);
        toast.success('Article updated');
      } else {
        await api.post('/articles', payload);
        toast.success('Article created');
      }
      router.push('/admin/articles');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-white"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug (Optional - leave empty to auto-generate from title)</label>
          <input
            {...register('slug')}
            placeholder="e.g. my-custom-article-url"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-white"
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            {...register('categoryId')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-white"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

          <label className="flex items-center space-x-2 mt-8">
            <input
              type="checkbox"
              {...register('isBreaking')}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Breaking News</span>
          </label>

          <label className="flex items-center space-x-2 mt-4 text-gray-700 dark:text-gray-300">
             <input
               type="checkbox"
               {...register('showFeaturedImage')}
               className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700"
             />
             <span className="text-sm font-medium">Show Featured Image in Post</span>
          </label>

        <div className="col-span-2">
           <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagsInput selectedTags={field.value || []} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="col-span-2">
           <label className="block text-sm font-medium text-gray-700">Featured Image</label>
           <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
           {previewImage && <img src={previewImage} alt="Preview" className="mt-2 h-40 w-auto object-cover rounded" />}
        </div>

        <div className="col-span-2">
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
        </div>

        <div className="col-span-2 border-t dark:border-gray-700 pt-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">SEO Settings</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SEO Title</label>
              <input
                {...register('seoTitle')}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SEO Description</label>
              <textarea
                {...register('seoDescription')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </form>
  );
}
