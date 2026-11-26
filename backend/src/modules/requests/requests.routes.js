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
  getMyBusinessRequests,
  getMyBusinessConnections,
  respondToServiceRequest,
  updateRequestProgress,
} from './requests.controller';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';

const router = Router();

// Require authentication for all request endpoints
router.use(authenticateToken);

// 1. Business Owner endpoints (Businessman / Entrepreneur common dashboard)
router.get('/my-business', getMyBusinessRequests);
router.get('/my-connections', getMyBusinessConnections);
router.post('/my-business/:id/respond', respondToServiceRequest);
router.patch('/my-business/:id/progress', updateRequestProgress);

// 2. Business Connections listing & status updates
router.get('/connections', getAllBusinessConnections);
router.patch('/connections/:id/status', updateConnectionStatus);

// 3. Service Requests
router.get('/', getAllServiceRequests);
router.post('/', createServiceRequest);
router.get('/:id', getServiceRequestById);
router.patch('/:id/status', requireRoles('admin'), updateRequestStatus);

// 4. Admin Business Matching & Assignment
router.get('/:id/matching-businesses', requireRoles('admin'), getMatchingBusinesses);
router.post('/:id/assign', requireRoles('admin'), assignBusinessToRequest);

export default router;
