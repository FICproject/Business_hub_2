import { Router } from 'express';
import { getMyNotifications, markAsRead, markAllAsRead, } from './notifications.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
const router = Router();
router.get('/', authenticateToken, getMyNotifications);
router.put('/:id/read', authenticateToken, markAsRead);
router.put('/read-all', authenticateToken, markAllAsRead);
export default router;
