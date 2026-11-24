import { Router } from 'express';
import {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateRequestStatus,
  getMatchingBusinesses,
  assignBusinessToRequest,
  getAllBusinessConnections,
  updateConnectionStatus,
} from './requests.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';

const router = Router();

// Require authentication for all request endpoints
router.use(authenticateToken);

// 1. Business Connections listing & status updates
router.get('/connections', getAllBusinessConnections);
router.patch('/connections/:id/status', updateConnectionStatus);

// 2. Service Requests
router.get('/', getAllServiceRequests);
router.post('/', createServiceRequest);
router.get('/:id', getServiceRequestById);
router.patch('/:id/status', requireRoles('admin'), updateRequestStatus);

// 3. Admin Business Matching & Assignment
router.get('/:id/matching-businesses', requireRoles('admin'), getMatchingBusinesses);
router.post('/:id/assign', requireRoles('admin'), assignBusinessToRequest);

export default router;
