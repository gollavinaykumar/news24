import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const articleCount = await prisma.article.count();
    const categoryCount = await prisma.category.count();

    res.json({
      articleCount,
      categoryCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
