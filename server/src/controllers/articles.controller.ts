import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { ArticleStatus } from '@prisma/client';

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, image, categoryId, status, seoTitle, seoDescription, tags, isBreaking } = req.body;
    let { slug } = req.body;
    
    // Generate or sanitize slug
    if (slug && slug.trim()) {
      slug = slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    } else {
      slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug: uniqueSlug,
        content,
        image,
        categoryId,
        authorId: userId, 
        status: status || ArticleStatus.DRAFT,
        seoTitle,
        seoDescription,
        isBreaking: isBreaking || false,
        publishedAt: status === ArticleStatus.PUBLISHED ? new Date() : null,
        tags: tags ? { connect: tags.map((id: string) => ({ id })) } : undefined,
      },
    });

    res.json(article);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const { category, tag, search, isBreaking, trending, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    if (category) {
      where.category = { slug: String(category) };
    }
    
    if (tag) {
      where.tags = { some: { slug: String(tag) } };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { content: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    
    if (isBreaking === 'true') {
      where.isBreaking = true;
    }

    if (req.query.date) {
      const date = new Date(req.query.date as string);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      where.createdAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const orderBy: any = {};
    orderBy.createdAt = 'desc';
    // Prioritize published date for normal listing
    // Fallback sort if publishedAt is null (though should be filtered usually?)
    // Actually default createdAt if no query? strict logic:
    // If getting ALL for admin, we want createdAt.
    // If public, we usually filter by status=PUBLISHED. 
    // Let's add status filter if not admin (but we don't know if admin here easily without checking auth again or route separation).
    // For now, simple logic.

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: { 
          category: true, 
          author: { select: { name: true, image: true } },
          tags: true 
        },
        orderBy: Object.keys(orderBy).length ? orderBy : { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.article.count({ where }),
    ]);

    res.json({ articles, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    
    const isUuid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(slug);
    
    const where = isUuid ? { id: slug } : { slug };

    const article = await prisma.article.findUnique({
      where,
      include: { 
        category: true, 
        author: { select: { name: true, bio: true, image: true } },
        tags: true
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Views feature removed
    // if (!isUuid) {
    //   await prisma.article.update({
    //     where: { id: article.id },
    //     data: { views: { increment: 1 } },
    //   });
    // }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, content, image, categoryId, status, seoTitle, seoDescription, tags, isBreaking } = req.body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        image,
        categoryId,
        status,
        seoTitle,
        seoDescription,
        isBreaking: isBreaking,
        updatedAt: new Date(),
        tags: tags ? { set: tags.map((id: string) => ({ id })) } : undefined,
      },
    });

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.article.delete({ where: { id } });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
