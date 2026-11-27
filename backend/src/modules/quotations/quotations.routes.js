import { Router } from 'express';
import {
  submitQuotationRequest,
  getMyQuotationRequests,
  getQuotationRequestById,
  getRequesterVisibleQuotations,
  requesterSelectQuotation,
  requesterDecisionOnSelectedQuotation,
  cancelQuotationRequest,
  getBusinessInvitations,
  respondToInvitation,
  submitQuotation,
  getMySubmittedQuotations,
  getAdminQuotationRequests,
  getAdminQuotationRequestDetails,
  matchCompaniesForRequest,
  inviteCompaniesToRequest,
  updateQuotationVisibilitySettings,
  adminSelectQuotation,
  adminConfirmSelection,
  adminReopenRequest,
  adminUpdateRequestStatus,
} from './quotations.controller';
import {
  authenticateToken,
  requireRoles,
  requireApprovedBusiness,
} from '../../middleware/auth.middleware';

const router = Router();

// ============================================================================
// 1. Requester Routes (All Authenticated Users)
// ============================================================================
router.post('/requests', authenticateToken, submitQuotationRequest);
router.get('/my-requests', authenticateToken, getMyQuotationRequests);
router.get('/requests/:id', authenticateToken, getQuotationRequestById);
router.get('/requests/:id/quotations', authenticateToken, getRequesterVisibleQuotations);
router.post('/requests/:id/select', authenticateToken, requesterSelectQuotation);
router.post('/requests/:id/decision', authenticateToken, requesterDecisionOnSelectedQuotation);
router.post('/requests/:id/cancel', authenticateToken, cancelQuotationRequest);

// ============================================================================
// 2. Business Dashboard Routes (Approved Businessmen & Entrepreneurs)
// ============================================================================
router.get('/business/invitations', authenticateToken, requireApprovedBusiness, getBusinessInvitations);
router.post('/business/invitations/:id/respond', authenticateToken, requireApprovedBusiness, respondToInvitation);
router.post('/business/submit', authenticateToken, requireApprovedBusiness, submitQuotation);
router.get('/business/my-quotations', authenticateToken, requireApprovedBusiness, getMySubmittedQuotations);

// ============================================================================
// 3. Admin Central Quotation Coordination Routes
// ============================================================================
router.get('/admin/requests', authenticateToken, requireRoles('admin'), getAdminQuotationRequests);
router.get('/admin/requests/:id', authenticateToken, requireRoles('admin'), getAdminQuotationRequestDetails);
router.get('/admin/requests/:id/match-companies', authenticateToken, requireRoles('admin'), matchCompaniesForRequest);
router.post('/admin/requests/:id/invite', authenticateToken, requireRoles('admin'), inviteCompaniesToRequest);
router.put('/admin/requests/:id/visibility', authenticateToken, requireRoles('admin'), updateQuotationVisibilitySettings);
router.post('/admin/requests/:id/select-quotation', authenticateToken, requireRoles('admin'), adminSelectQuotation);
router.post('/admin/requests/:id/confirm-selection', authenticateToken, requireRoles('admin'), adminConfirmSelection);
router.post('/admin/requests/:id/reopen', authenticateToken, requireRoles('admin'), adminReopenRequest);
router.put('/admin/requests/:id/status', authenticateToken, requireRoles('admin'), adminUpdateRequestStatus);

export default router;
