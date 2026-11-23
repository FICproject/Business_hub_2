import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateProfile,
  changePassword,
  updateStatus,
  updateRoles,
  getSavedItems,
  addSavedItem,
  removeSavedItem,
  searchAll,
} from './users.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, requireRoles('admin'), getUsers);
router.get('/search', searchAll);
router.get('/saved-items', authenticateToken, getSavedItems);
router.post('/saved-items', authenticateToken, addSavedItem);
router.delete('/saved-items/:id', authenticateToken, removeSavedItem);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id/status', authenticateToken, requireRoles('admin'), updateStatus);
router.put('/:id/roles', authenticateToken, requireRoles('admin'), updateRoles);

export default router;
