import { Router } from 'express';
import {
  createShareLink,
  resolveShareLink,
  getMySharedLinks,
} from './sharing.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, createShareLink);
router.get('/resolve/:code', resolveShareLink);
router.get('/my', authenticateToken, getMySharedLinks);

export default router;
