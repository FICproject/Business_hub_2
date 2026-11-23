import { Router } from 'express';
import { createShareLink, resolveShareLink, getMySharedLinks, getAllSharedLinks, } from './sharing.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
const router = Router();
router.post('/', authenticateToken, createShareLink);
router.get('/resolve/:code', resolveShareLink);
router.get('/my', authenticateToken, getMySharedLinks);
router.get('/admin/all', authenticateToken, requireRoles('admin'), getAllSharedLinks);
export default router;
