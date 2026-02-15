import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.tag.delete({ where: { id } });
    res.json({ message: 'Tag deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
