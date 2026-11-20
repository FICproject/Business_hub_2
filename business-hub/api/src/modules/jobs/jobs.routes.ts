import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  getMyApplications,
  getBusinessApplications,
  updateApplicationStatus,
} from './jobs.controller';
import {
  authenticateToken,
  requireApprovedBusiness,
} from '../../middleware/auth.middleware';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', authenticateToken, requireApprovedBusiness, createJob);
router.post('/:id/apply', authenticateToken, applyForJob);
router.get('/applications/my', authenticateToken, getMyApplications);
router.get('/applications/business', authenticateToken, getBusinessApplications);
router.put('/applications/:id/status', authenticateToken, updateApplicationStatus);

export default router;
