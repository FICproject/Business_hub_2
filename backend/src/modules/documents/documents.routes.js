import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { dbStore } from '../../services/storage';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { secureDocumentUpload } from './documentUpload.middleware';
import {
  getDocumentRequirements,
  createDocumentRequirement,
  updateDocumentRequirement,
  deleteDocumentRequirement,
  updateApplicationContext,
  getMyDocumentsChecklist,
  uploadVerificationDocument,
  removeUploadedDocument,
  getDocumentAccessToken,
  serveSecureDocument,
  getPendingApplicantsSummary,
  getApplicantDocumentsForAdmin,
  reviewIndividualDocument,
  decideApplicantApplication,
} from './documents.controller';

const router = Router();

/**
 * Middleware accepting either a standard logged-in User JWT OR a registration draft JWT
 */
const authenticateUserOrDraft = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication or registration session token required.' });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded.scope === 'registration_draft' && decoded.draftId) {
      const draft = (dbStore.collection.registrationDrafts || []).find((d) => d.draftId === decoded.draftId);
      if (!draft) {
        return res.status(401).json({ success: false, message: 'Registration draft session expired or not found.' });
      }
      req.draftSession = draft;
      return next();
    }

    const user = (dbStore.collection.users || []).find((u) => u._id === decoded.id || u._id === decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }
    if (user.status === 'blocked' || user.status === 'suspended') {
      return res.status(403).json({ success: false, message: `Your account is ${user.status}.` });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// Public / Registration Requirements Consultation
router.get('/requirements', getDocumentRequirements);

// Time-limited signed preview / download endpoint (self-authenticating via signed short-lived JWT)
router.get('/secure/:token', serveSecureDocument);

// Admin Document Requirements Config CRUD
router.post('/requirements', authenticateToken, requireRoles('admin'), createDocumentRequirement);
router.put('/requirements/:id', authenticateToken, requireRoles('admin'), updateDocumentRequirement);
router.delete('/requirements/:id', authenticateToken, requireRoles('admin'), deleteDocumentRequirement);

// Applicant & Draft Document Upload / Context / Checklist
router.get('/my', authenticateUserOrDraft, getMyDocumentsChecklist);
router.put('/context', authenticateUserOrDraft, updateApplicationContext);
router.post('/upload', authenticateUserOrDraft, (req, res, next) => {
  secureDocumentUpload.single('file')(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File exceeds the 5 MB maximum allowed limit.' : err.message;
      return res.status(400).json({ success: false, message: msg });
    }
    next();
  });
}, uploadVerificationDocument);
router.delete('/:id', authenticateUserOrDraft, removeUploadedDocument);

// Issue short-lived signed access link (restricted to applicant or Admin)
router.get('/:id/access-token', authenticateUserOrDraft, getDocumentAccessToken);

// Admin Document Verification & Approval
router.get('/admin/pending', authenticateToken, requireRoles('admin'), getPendingApplicantsSummary);
router.get('/admin/applicant/:userId', authenticateToken, requireRoles('admin'), getApplicantDocumentsForAdmin);
router.put('/:id/review', authenticateToken, requireRoles('admin'), reviewIndividualDocument);
router.post('/admin/applicant/:userId/decision', authenticateToken, requireRoles('admin'), decideApplicantApplication);

export default router;
