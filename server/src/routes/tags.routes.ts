import express from 'express';
import { getTags, createTag, deleteTag } from '../controllers/tags.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getTags);
router.post('/', authenticate, createTag);
router.delete('/:id', authenticate, deleteTag);

export default router;
