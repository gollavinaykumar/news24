import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categories.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticate, createCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
