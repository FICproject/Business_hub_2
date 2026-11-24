import { Router } from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';

const router = Router();

// Public / Authenticated read endpoint
router.get('/', getAllCategories);

// Admin-only management endpoints
router.post('/', authenticateToken, requireRoles('admin'), createCategory);
router.put('/:id', authenticateToken, requireRoles('admin'), updateCategory);
router.delete('/:id', authenticateToken, requireRoles('admin'), deleteCategory);

export default router;
