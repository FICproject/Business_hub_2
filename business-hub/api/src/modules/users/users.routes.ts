import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateProfile,
  updateStatus,
  updateRoles,
} from './users.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, requireRoles('admin'), getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/profile', authenticateToken, updateProfile);
router.put('/:id/status', authenticateToken, requireRoles('admin'), updateStatus);
router.put('/:id/roles', authenticateToken, requireRoles('admin'), updateRoles);

export default router;
