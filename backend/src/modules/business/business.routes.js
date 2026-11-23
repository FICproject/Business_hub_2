import { Router } from 'express';
import { getMyBusiness, registerOrUpdateBusiness, submitVerification, getAllBusinesses, reviewVerification, } from './business.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
const router = Router();
router.get('/me', authenticateToken, getMyBusiness);
router.post('/', authenticateToken, registerOrUpdateBusiness);
router.post('/verification', authenticateToken, submitVerification);
// Admin review routes
router.get('/', authenticateToken, requireRoles('admin'), getAllBusinesses);
router.put('/:id/review', authenticateToken, requireRoles('admin'), reviewVerification);
export default router;
