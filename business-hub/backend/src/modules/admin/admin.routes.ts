import { Router } from 'express';
import {
  getDashboardMetrics,
  getAuditLogs,
  getPlatformSettings,
  updatePlatformSettings,
} from './admin.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken, requireRoles('admin'));

router.get('/metrics', getDashboardMetrics);
router.get('/audit-logs', getAuditLogs);
router.get('/settings', getPlatformSettings);
router.put('/settings', updatePlatformSettings);

export default router;
