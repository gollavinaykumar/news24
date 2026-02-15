import express from 'express';
import { createArticle, getArticles, getArticle, updateArticle, deleteArticle } from '../controllers/articles.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getArticles);
router.get('/:slug', getArticle);
router.post('/', authenticate, createArticle);
router.put('/:id', authenticate, updateArticle);
router.delete('/:id', authenticate, deleteArticle);

export default router;
