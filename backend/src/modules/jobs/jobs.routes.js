import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  getAllApplications,
  getApplicationById,
  getMyApplications,
  getBusinessApplications,
  updateApplicationStatus,
  updateJobStatus,
  deleteJob,
} from './jobs.controller';
import {
  authenticateToken,
  requireRoles,
  requireApprovedBusiness,
} from '../../middleware/auth.middleware';

const router = Router();

// 1. Applications Endpoints (Placed before /:id to prevent route collision)
router.get('/applications/all', authenticateToken, requireRoles('admin'), getAllApplications);
router.get('/applications/my', authenticateToken, getMyApplications);
router.get('/applications/business', authenticateToken, getBusinessApplications);
router.get('/applications/:id', authenticateToken, getApplicationById);
router.put('/applications/:id/status', authenticateToken, updateApplicationStatus);

// 2. Jobs Endpoints
router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/:id/apply', authenticateToken, applyForJob);
router.post('/', authenticateToken, requireApprovedBusiness, createJob);
router.put('/:id/status', authenticateToken, requireRoles('admin', 'businessman'), updateJobStatus);
router.delete('/:id', authenticateToken, requireRoles('admin'), deleteJob);

export default router;
