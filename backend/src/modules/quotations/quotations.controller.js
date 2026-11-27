import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';

// Counter / ID generator for Quotation Requests: QREQ-2026-XXXXX
const generateQuotationRequestId = () => {
  const year = new Date().getFullYear();
  const existingCount = (dbStore.collection.quotationRequests || []).length;
  const seq = String(existingCount + 1).padStart(5, '0');
  const rand = Math.floor(100 + Math.random() * 900);
  return `QREQ-${year}-${seq.slice(-4)}${rand.toString().slice(-1)}`;
};

const generateQuotationId = () => {
  const year = new Date().getFullYear();
  const existingCount = (dbStore.collection.quotations || []).length;
  const seq = String(existingCount + 1).padStart(5, '0');
  return `QUOT-${year}-${seq}`;
};

const generateInvitationId = () => {
  return `QINV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const createNotification = (userId, title, message, type = 'info', link = '/dashboard') => {
  if (!dbStore.collection.notifications) {
    dbStore.collection.notifications = [];
  }
  const notif = {
    _id: uuidv4(),
    userId,
    title,
    message,
    type,
    link,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  dbStore.collection.notifications.unshift(notif);
};

// ============================================================================
// 1. REQUESTER APIs (Submit RFQ, Track, View Permitted Quotations, Select)
// ============================================================================

/**
 * Submit Quotation Request (RFQ) for any eligible user
 */
export const submitQuotationRequest = async (req, res) => {
  try {
    const {
      listingId,
      listingType = 'product', // 'product' | 'service'
      title,
      category,
      subcategory,
      quantity,
      unit = 'Units',
      specifications,
      location,
      pincode,
      expectedDate,
      budget,
      notes,
      attachments = [],
    } = req.body;

    if (!title || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Product/Service Title, Category, and Delivery/Service Location are required.',
      });
    }

    // Business self-request restriction: A business cannot request a quotation for its own listing
    let originalListing = null;
    let originalBusiness = null;

    if (listingId) {
      if (listingType === 'service') {
        originalListing = (dbStore.collection.services || []).find((s) => s._id === listingId);
      } else {
        originalListing = (dbStore.collection.products || []).find((p) => p._id === listingId);
      }

      if (originalListing) {
        originalBusiness = (dbStore.collection.businesses || []).find(
          (b) => b._id === originalListing.businessId
        );
        if (originalBusiness && originalBusiness.ownerId === req.user._id) {
          return res.status(400).json({
            success: false,
            message: 'You cannot request a quotation for your own business listing.',
          });
        }
      }
    }

    const requestId = generateQuotationRequestId();
    const now = new Date().toISOString();

    const newRequest = {
      _id: requestId,
      requesterId: req.user._id,
      requesterName: req.user.fullName,
      requesterEmail: req.user.email,
      requesterMobile: req.user.mobile,
      requesterRole: (req.user.roles || [])[0] || 'user',
      listingId: listingId || null,
      listingType: listingType || 'product',
      title: title || originalListing?.title || originalListing?.name,
      category: category || originalListing?.category || 'General',
      subcategory: subcategory || originalListing?.subcategory || '',
      originalBusinessId: originalBusiness ? originalBusiness._id : null,
      originalBusinessName: originalBusiness ? originalBusiness.businessName : null,
      quantity: quantity ? parseFloat(quantity) : 1,
      unit: unit || 'Units',
      specifications: specifications || '',
      location,
      pincode: pincode || '',
      expectedDate: expectedDate || '',
      budget: budget || '',
      notes: notes || '',
      attachments: Array.isArray(attachments) ? attachments : [],
      status: 'new', // 'new' | 'under_review' | 'sent_to_companies' | 'quotations_received' | 'pending_selection' | 'selected' | 'in_progress' | 'completed' | 'rejected' | 'cancelled'
      selectionMode: 'ADMIN', // 'ADMIN' | 'REQUESTER'
      requesterCanViewAllQuotations: false,
      requesterCanSelectQuotation: false,
      adminRevealCompanyIdentity: false,
      selectedQuotationId: null,
      selectedBusinessId: null,
      selectedBusinessName: null,
      adminNotes: '',
      timeline: [
        {
          status: 'new',
          timestamp: now,
          note: `Quotation request submitted by ${req.user.fullName}. Awaiting central Admin review.`,
          actor: req.user.fullName,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    if (!dbStore.collection.quotationRequests) {
      dbStore.collection.quotationRequests = [];
    }
    dbStore.collection.quotationRequests.unshift(newRequest);

    // Notify Admins
    const adminUsers = (dbStore.collection.users || []).filter((u) => u.roles?.includes('admin'));
    adminUsers.forEach((admin) => {
      createNotification(
        admin._id,
        'New Quotation Request Received',
        `Request ${requestId} submitted by ${req.user.fullName} for "${newRequest.title}".`,
        'info',
        `/quotations/${requestId}`
      );
    });

    // Notify Requester
    createNotification(
      req.user._id,
      'Quotation Request Submitted',
      `Your quotation request ${requestId} has been submitted. Our team will coordinate with verified suppliers.`,
      'success',
      `/dashboard/user?tab=quotations`
    );

    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      req.user.roles[0] || 'user',
      'QUOTATION_REQUEST_SUBMITTED',
      'QuotationRequest',
      requestId,
      `Submitted quotation request ${requestId} for ${newRequest.title}`
    );

    return res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully! An Admin coordinator will review and route your request.',
      request: newRequest,
    });
  } catch (error) {
    console.error('submitQuotationRequest error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Requester's Quotation Requests
 */
export const getMyQuotationRequests = async (req, res) => {
  try {
    const { status, search } = req.query;
    let requests = (dbStore.collection.quotationRequests || []).filter(
      (r) => r.requesterId === req.user._id
    );

    if (status && status !== 'all') {
      requests = requests.filter((r) => r.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      requests = requests.filter(
        (r) =>
          r._id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Single Quotation Request Details (for Requester or Admin)
 */
export const getQuotationRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Quotation request not found.' });
    }

    const isAdmin = req.user.roles?.includes('admin');
    const isOwner = request.requesterId === req.user._id;

    // Check if business user has an invitation for this request
    const myBizIds = (dbStore.collection.businesses || [])
      .filter((b) => b.ownerId === req.user._id)
      .map((b) => b._id);
    const hasInvitation = (dbStore.collection.quotationInvitations || []).some(
      (inv) => inv.requestId === id && myBizIds.includes(inv.businessId)
    );

    if (!isAdmin && !isOwner && !hasInvitation) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this quotation request.',
      });
    }

    // Business users viewing invitation receive sanitized requirements without competitor or buyer direct info
    if (!isAdmin && !isOwner && hasInvitation) {
      return res.json({
        success: true,
        request: {
          _id: request._id,
          title: request.title,
          category: request.category,
          subcategory: request.subcategory,
          quantity: request.quantity,
          unit: request.unit,
          specifications: request.specifications,
          location: request.location,
          pincode: request.pincode,
          expectedDate: request.expectedDate,
          notes: request.notes,
          attachments: request.attachments,
          status: request.status,
          createdAt: request.createdAt,
        },
      });
    }

    // Requester view: Do not expose admin internal notes
    if (isOwner && !isAdmin) {
      const { adminNotes, ...safeRequest } = request;
      return res.json({ success: true, request: safeRequest });
    }

    // Admin view
    return res.json({ success: true, request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Quotations visible to Requester (Module 7: Strict Permission Rules & Anonymity)
 */
export const getRequesterVisibleQuotations = async (req, res) => {
  try {
    const { id } = req.params;
    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Quotation request not found.' });
    }

    if (request.requesterId !== req.user._id && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const allSubmitted = (dbStore.collection.quotations || []).filter(
      (q) => q.requestId === id && ['submitted', 'selected', 'not_selected'].includes(q.status)
    );

    let visibleQuotations = [];

    if (request.requesterCanViewAllQuotations) {
      // Option B: Requester can view all received quotations for side-by-side comparison
      visibleQuotations = allSubmitted.map((q, index) => {
        const anonymousLabel = `Company ${String.fromCharCode(65 + (index % 26))}${
          index >= 26 ? Math.floor(index / 26) + 1 : ''
        }`;

        return {
          _id: q._id,
          requestId: q.requestId,
          companyDisplayName: request.adminRevealCompanyIdentity ? q.businessName : anonymousLabel,
          unitPrice: q.unitPrice,
          quantity: q.quantity,
          subtotal: q.subtotal,
          taxPercent: q.taxPercent,
          taxAmount: q.taxAmount,
          additionalCharges: q.additionalCharges,
          deliveryCharges: q.deliveryCharges,
          totalAmount: q.totalAmount,
          deliveryTimeline: q.deliveryTimeline,
          validityDate: q.validityDate,
          termsAndConditions: q.termsAndConditions,
          additionalNotes: q.additionalNotes,
          documents: q.documents || [],
          status: q.status,
          isSelected: q._id === request.selectedQuotationId,
          createdAt: q.createdAt,
        };
      });
    } else if (request.selectedQuotationId) {
      // Option A: Admin Selection Mode - Requester only sees the single selected quotation chosen by Admin
      const selected = allSubmitted.find((q) => q._id === request.selectedQuotationId);
      if (selected) {
        visibleQuotations = [
          {
            _id: selected._id,
            requestId: selected.requestId,
            companyDisplayName: request.adminRevealCompanyIdentity
              ? selected.businessName
              : 'Selected Verified Supplier',
            unitPrice: selected.unitPrice,
            quantity: selected.quantity,
            subtotal: selected.subtotal,
            taxPercent: selected.taxPercent,
            taxAmount: selected.taxAmount,
            additionalCharges: selected.additionalCharges,
            deliveryCharges: selected.deliveryCharges,
            totalAmount: selected.totalAmount,
            deliveryTimeline: selected.deliveryTimeline,
            validityDate: selected.validityDate,
            termsAndConditions: selected.termsAndConditions,
            additionalNotes: selected.additionalNotes,
            documents: selected.documents || [],
            status: selected.status,
            isSelected: true,
            createdAt: selected.createdAt,
          },
        ];
      }
    }

    return res.json({
      success: true,
      canSelect: Boolean(request.requesterCanSelectQuotation),
      selectionMode: request.selectionMode,
      selectedQuotationId: request.selectedQuotationId,
      data: visibleQuotations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Requester selects one quotation (when requesterCanSelectQuotation is true)
 */
export const requesterSelectQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotationId } = req.body;

    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.requesterId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (!request.requesterCanSelectQuotation) {
      return res.status(403).json({
        success: false,
        message: 'Quotation selection by requester is currently disabled by Admin for this request.',
      });
    }

    const quotation = (dbStore.collection.quotations || []).find(
      (q) => q._id === quotationId && q.requestId === id
    );
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found for this request.' });
    }

    request.selectedQuotationId = quotation._id;
    request.selectedBusinessId = quotation.businessId;
    request.selectedBusinessName = quotation.businessName;
    request.status = 'pending_selection';
    request.updatedAt = new Date().toISOString();

    request.timeline.push({
      status: 'pending_selection',
      timestamp: new Date().toISOString(),
      note: `Requester selected quotation ${quotation._id}. Awaiting Admin final confirmation.`,
      actor: req.user.fullName,
    });

    // Notify Admins
    const adminUsers = (dbStore.collection.users || []).filter((u) => u.roles?.includes('admin'));
    adminUsers.forEach((admin) => {
      createNotification(
        admin._id,
        'Requester Selected a Quotation',
        `${req.user.fullName} selected quotation ${quotation._id} for request ${id}. Please review and confirm.`,
        'info',
        `/quotations/${id}`
      );
    });

    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      'user',
      'QUOTATION_SELECTED_BY_REQUESTER',
      'QuotationRequest',
      id,
      `Requester selected quotation ${quotation._id}`
    );

    return res.json({
      success: true,
      message: 'Your quotation selection has been submitted for Admin confirmation.',
      request,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Requester accepts or rejects the quotation chosen by Admin (Admin Selection Mode)
 */
export const requesterDecisionOnSelectedQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, reason } = req.body; // decision: 'accept' | 'reject'

    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
    if (request.requesterId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (!request.selectedQuotationId) {
      return res.status(400).json({ success: false, message: 'No quotation has been selected yet.' });
    }

    const quotation = (dbStore.collection.quotations || []).find(
      (q) => q._id === request.selectedQuotationId
    );

    const now = new Date().toISOString();

    if (decision === 'accept') {
      request.status = 'selected';
      request.updatedAt = now;
      request.timeline.push({
        status: 'selected',
        timestamp: now,
        note: `Requester accepted the selected quotation (${quotation?._id}). Business connection created.`,
        actor: req.user.fullName,
      });

      // Create Business Connection
      const newConnection = {
        _id: 'CONN-' + Math.floor(100000 + Math.random() * 900000),
        requestId: request._id,
        quotationId: quotation?._id,
        userId: request.requesterId,
        userName: request.requesterName,
        userEmail: request.requesterEmail,
        userMobile: request.requesterMobile,
        businessId: quotation?.businessId,
        businessName: quotation?.businessName,
        roleType: quotation?.roleType,
        ownerId: quotation?.ownerId,
        connectionType: 'quotation_award',
        status: 'accepted',
        totalAmount: quotation?.totalAmount,
        deliveryTimeline: quotation?.deliveryTimeline,
        notes: `Business connection established via accepted quotation on ${new Date().toLocaleDateString()}.`,
        createdAt: now,
        updatedAt: now,
      };

      if (!dbStore.collection.businessConnections) {
        dbStore.collection.businessConnections = [];
      }
      dbStore.collection.businessConnections.unshift(newConnection);

      // Notify Business
      if (quotation?.ownerId) {
        createNotification(
          quotation.ownerId,
          'Your Quotation Was Accepted!',
          `Quotation ${quotation._id} for request ${request._id} has been accepted. A verified business connection is now active.`,
          'success',
          `/dashboard/business?tab=quotations`
        );
      }

      // Notify Admins
      const adminUsers = (dbStore.collection.users || []).filter((u) => u.roles?.includes('admin'));
      adminUsers.forEach((admin) => {
        createNotification(
          admin._id,
          'Quotation Accepted by Requester',
          `Requester ${req.user.fullName} accepted quotation ${quotation?._id}. Connection established.`,
          'success',
          `/quotations/${id}`
        );
      });

      dbStore.save();
      return res.json({
        success: true,
        message: 'Quotation accepted! A verified business connection has been established.',
        request,
        connection: newConnection,
      });
    } else {
      // Rejection
      request.status = 'under_review';
      request.selectedQuotationId = null;
      request.updatedAt = now;
      request.timeline.push({
        status: 'under_review',
        timestamp: now,
        note: `Requester declined the quotation. Reason: "${reason || 'Not specified'}". Returned to Admin.`,
        actor: req.user.fullName,
      });

      // Notify Admins
      const adminUsers = (dbStore.collection.users || []).filter((u) => u.roles?.includes('admin'));
      adminUsers.forEach((admin) => {
        createNotification(
          admin._id,
          'Selected Quotation Declined by Requester',
          `Requester declined quotation for request ${id} (${reason || 'No reason specified'}). Returned for review.`,
          'warning',
          `/quotations/${id}`
        );
      });

      dbStore.save();
      return res.json({
        success: true,
        message: 'Quotation rejected. The request has been returned to Admin for reassessment.',
        request,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Cancel Request by Requester
 */
export const cancelQuotationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
    if (request.requesterId !== req.user._id && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (['completed', 'cancelled'].includes(request.status)) {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    request.status = 'cancelled';
    request.updatedAt = new Date().toISOString();
    request.timeline.push({
      status: 'cancelled',
      timestamp: new Date().toISOString(),
      note: `Request cancelled by ${req.user.fullName}.`,
      actor: req.user.fullName,
    });

    dbStore.save();
    return res.json({ success: true, message: 'Quotation request cancelled.', request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 2. BUSINESS DASHBOARD APIs (Received RFQs, Quotation Submissions)
// ============================================================================

/**
 * Get Invitations received by the authenticated businessman/entrepreneur
 */
export const getBusinessInvitations = async (req, res) => {
  try {
    const { status } = req.query;
    const myBusinesses = (dbStore.collection.businesses || []).filter(
      (b) => b.ownerId === req.user._id
    );
    const myBizIds = myBusinesses.map((b) => b._id);

    if (myBizIds.length === 0 && !req.user.roles?.includes('admin')) {
      return res.json({ success: true, count: 0, data: [] });
    }

    let invitations = (dbStore.collection.quotationInvitations || []).filter((inv) =>
      myBizIds.includes(inv.businessId)
    );

    if (status && status !== 'all') {
      invitations = invitations.filter((inv) => inv.status === status);
    }

    // Attach request summary to each invitation
    const enriched = invitations.map((inv) => {
      const reqDoc = (dbStore.collection.quotationRequests || []).find((r) => r._id === inv.requestId);
      const submittedQuote = (dbStore.collection.quotations || []).find(
        (q) => q.invitationId === inv._id
      );

      return {
        ...inv,
        request: reqDoc
          ? {
              _id: reqDoc._id,
              title: reqDoc.title,
              category: reqDoc.category,
              subcategory: reqDoc.subcategory,
              quantity: reqDoc.quantity,
              unit: reqDoc.unit,
              specifications: reqDoc.specifications,
              location: reqDoc.location,
              pincode: reqDoc.pincode,
              expectedDate: reqDoc.expectedDate,
              notes: reqDoc.notes,
              attachments: reqDoc.attachments,
              status: reqDoc.status,
              createdAt: reqDoc.createdAt,
            }
          : null,
        quotation: submittedQuote || null,
      };
    });

    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Respond to Invitation (Accept to quote or Reject with reason)
 */
export const respondToInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'accept' | 'reject'

    const invitation = (dbStore.collection.quotationInvitations || []).find((inv) => inv._id === id);
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found.' });
    }

    const myBusinesses = (dbStore.collection.businesses || []).filter(
      (b) => b.ownerId === req.user._id
    );
    const myBizIds = myBusinesses.map((b) => b._id);

    if (!myBizIds.includes(invitation.businessId) && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const now = new Date().toISOString();
    invitation.responseDate = now;
    invitation.updatedAt = now;

    if (action === 'reject') {
      invitation.status = 'rejected';
      invitation.rejectionReason = reason || 'Unable to fulfill requirements at this time.';

      // Notify Admins
      const adminUsers = (dbStore.collection.users || []).filter((u) => u.roles?.includes('admin'));
      adminUsers.forEach((admin) => {
        createNotification(
          admin._id,
          'Company Declined Quotation Invitation',
          `${invitation.businessName} declined RFQ ${invitation.requestId}. Reason: ${invitation.rejectionReason}`,
          'warning',
          `/quotations/${invitation.requestId}`
        );
      });
    } else {
      invitation.status = 'accepted';
    }

    dbStore.save();
    return res.json({
      success: true,
      message: `Invitation ${action === 'reject' ? 'declined' : 'accepted'}.`,
      invitation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Submit Quotation by Invited Business
 */
export const submitQuotation = async (req, res) => {
  try {
    const {
      invitationId,
      unitPrice,
      quantity,
      taxPercent = 0,
      additionalCharges = 0,
      deliveryCharges = 0,
      deliveryTimeline,
      validityDate,
      termsAndConditions,
      additionalNotes,
      documents = [],
    } = req.body;

    if (!invitationId) {
      return res.status(400).json({ success: false, message: 'Invitation ID is required.' });
    }

    const invitation = (dbStore.collection.quotationInvitations || []).find(
      (inv) => inv._id === invitationId
    );
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation record not found.' });
    }

    const myBusinesses = (dbStore.collection.businesses || []).filter(
      (b) => b.ownerId === req.user._id
    );
    const myBiz = myBusinesses.find((b) => b._id === invitation.businessId);

    if (!myBiz && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Not authorized for this business invitation.' });
    }

    const parsedUnitPrice = parseFloat(unitPrice);
    const parsedQty = parseFloat(quantity || 1);
    if (isNaN(parsedUnitPrice) || parsedUnitPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid unit price.' });
    }

    // Server-side financial calculations
    const subtotal = Math.round(parsedUnitPrice * parsedQty * 100) / 100;
    const parsedTaxPct = parseFloat(taxPercent) || 0;
    const taxAmount = Math.round(((subtotal * parsedTaxPct) / 100) * 100) / 100;
    const parsedAddCharges = parseFloat(additionalCharges) || 0;
    const parsedDelivery = parseFloat(deliveryCharges) || 0;
    const totalAmount = Math.round((subtotal + taxAmount + parsedAddCharges + parsedDelivery) * 100) / 100;

    const quotationId = generateQuotationId();
    const now = new Date().toISOString();

    const newQuotation = {
      _id: quotationId,
      requestId: invitation.requestId,
      invitationId: invitation._id,
      businessId: invitation.businessId,
      businessName: invitation.businessName,
      ownerId: myBiz ? myBiz.ownerId : req.user._id,
      ownerName: req.user.fullName,
      roleType: invitation.roleType || 'businessman',
      unitPrice: parsedUnitPrice,
      quantity: parsedQty,
      subtotal,
      taxPercent: parsedTaxPct,
      taxAmount,
      additionalCharges: parsedAddCharges,
      deliveryCharges: parsedDelivery,
      totalAmount,
      deliveryTimeline: deliveryTimeline || 'Standard delivery (5-7 business days)',
      validityDate: validityDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      termsAndConditions: termsAndConditions || 'Payment on delivery / Standard warranty terms.',
      additionalNotes: additionalNotes || '',
      documents: Array.isArray(documents) ? documents : [],
      status: 'submitted', // 'submitted' | 'selected' | 'not_selected' | 'rejected' | 'revision_requested'
      revisionHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    if (!dbStore.collection.quotations) {
      dbStore.collection.quotations = [];
    }
    dbStore.collection.quotations.unshift(newQuotation);

    // Update Invitation Status
    invitation.status = 'submitted';
    invitation.responseDate = now;
    invitation.updatedAt = now;

    // Update Request Status to 'quotations_received' if it was 'sent_to_companies'
    const request = (dbStore.collection.quotationRequests || []).find(
      (r) => r._id === invitation.requestId
    );
    if (request && ['new', 'under_review', 'sent_to_companies'].includes(request.status)) {
      request.status = 'quotations_received';
      request.updatedAt = now;
      request.timeline.push({
        status: 'quotations_received',
        timestamp: now,
        note: `Quotation received from ${invitation.businessName}.`,
        actor: req.user.fullName,
      });
    }

    // Notify Admins
    const adminUsers = (dbStore.collection.users || []).filter((u) => u.roles?.includes('admin'));
    adminUsers.forEach((admin) => {
      createNotification(
        admin._id,
        'New Quotation Submitted',
        `${invitation.businessName} submitted quotation ${quotationId} for request ${invitation.requestId} (Total: $${totalAmount}).`,
        'success',
        `/quotations/${invitation.requestId}`
      );
    });

    // Notify Company
    createNotification(
      req.user._id,
      'Quotation Submitted Successfully',
      `Your quotation ${quotationId} for request ${invitation.requestId} was submitted for review.`,
      'success',
      `/dashboard/business?tab=quotations`
    );

    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      'business',
      'QUOTATION_SUBMITTED',
      'Quotation',
      quotationId,
      `Submitted quotation for request ${invitation.requestId} (Total: $${totalAmount})`
    );

    return res.status(201).json({
      success: true,
      message: 'Quotation submitted successfully to the central admin coordinator.',
      quotation: newQuotation,
    });
  } catch (error) {
    console.error('submitQuotation error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all quotations submitted by current business
 */
export const getMySubmittedQuotations = async (req, res) => {
  try {
    const myBusinesses = (dbStore.collection.businesses || []).filter(
      (b) => b.ownerId === req.user._id
    );
    const myBizIds = myBusinesses.map((b) => b._id);

    const quotations = (dbStore.collection.quotations || []).filter((q) =>
      myBizIds.includes(q.businessId)
    );

    // Enrich with request title & category
    const enriched = quotations.map((q) => {
      const reqDoc = (dbStore.collection.quotationRequests || []).find((r) => r._id === q.requestId);
      return {
        ...q,
        requestTitle: reqDoc?.title || 'Quotation Request',
        requestCategory: reqDoc?.category || 'General',
        requestStatus: reqDoc?.status || 'active',
      };
    });

    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 3. ADMIN QUOTATION MANAGEMENT APIs (Modules 4, 6, 7, 8)
// ============================================================================

/**
 * Get All Quotation Requests (Admin)
 */
export const getAdminQuotationRequests = async (req, res) => {
  try {
    const { status, search } = req.query;
    let requests = [...(dbStore.collection.quotationRequests || [])];

    if (status && status !== 'all') {
      requests = requests.filter((r) => r.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      requests = requests.filter(
        (r) =>
          r._id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.requesterName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    // Attach invited company count and submitted quotation count
    const enriched = requests.map((r) => {
      const invitations = (dbStore.collection.quotationInvitations || []).filter(
        (inv) => inv.requestId === r._id
      );
      const quotations = (dbStore.collection.quotations || []).filter(
        (q) => q.requestId === r._id
      );
      return {
        ...r,
        invitationsCount: invitations.length,
        quotationsCount: quotations.length,
      };
    });

    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Full Admin Request Details with Company Match List and Quotation Comparison Matrix
 */
export const getAdminQuotationRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Quotation request not found.' });
    }

    const invitations = (dbStore.collection.quotationInvitations || []).filter(
      (inv) => inv.requestId === id
    );

    const quotations = (dbStore.collection.quotations || []).filter(
      (q) => q.requestId === id
    );

    const connection = (dbStore.collection.businessConnections || []).find(
      (c) => c.requestId === id
    );

    return res.json({
      success: true,
      request,
      invitations,
      quotations,
      connection: connection || null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Search Matching Approved Companies (Module 4.2)
 */
export const matchCompaniesForRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { search, category, location } = req.query;

    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    const targetCategory = category || request?.category || '';
    const targetLocation = location || request?.location || '';

    // Filter approved businesses
    let businesses = (dbStore.collection.businesses || []).filter(
      (b) => b.verificationStatus === 'approved'
    );

    // Exclude requester's own business if applicable
    if (request?.requesterId) {
      businesses = businesses.filter((b) => b.ownerId !== request.requesterId);
    }

    if (search) {
      const q = search.toLowerCase();
      businesses = businesses.filter(
        (b) =>
          b.businessName?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.subcategory?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }

    // Calculate match score
    const scored = businesses.map((b) => {
      let score = 50; // base score for approved status
      if (targetCategory && b.category?.toLowerCase().includes(targetCategory.toLowerCase())) {
        score += 30;
      }
      if (targetLocation && (b.address?.city?.toLowerCase()?.includes(targetLocation.toLowerCase()) || b.operatingLocations?.toLowerCase()?.includes(targetLocation.toLowerCase()))) {
        score += 20;
      }

      // Check if already invited
      const isInvited = (dbStore.collection.quotationInvitations || []).some(
        (inv) => inv.requestId === id && inv.businessId === b._id
      );

      return {
        _id: b._id,
        businessName: b.businessName,
        ownerId: b.ownerId,
        roleType: b.roleType,
        category: b.category,
        subcategory: b.subcategory,
        businessType: b.businessType,
        address: b.address,
        operatingLocations: b.operatingLocations,
        phone: b.phone,
        email: b.email,
        verificationStatus: b.verificationStatus,
        matchScore: score,
        isInvited,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({ success: true, count: scored.length, data: scored });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send Quotation Requests to Selected Companies (Module 4.3)
 */
export const inviteCompaniesToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessIds = [], deadlineDays = 5 } = req.body;

    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (!Array.isArray(businessIds) || businessIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one company to invite.' });
    }

    const now = new Date().toISOString();
    const deadlineDate = new Date(Date.now() + deadlineDays * 86400000).toISOString();
    const createdInvitations = [];

    if (!dbStore.collection.quotationInvitations) {
      dbStore.collection.quotationInvitations = [];
    }

    businessIds.forEach((bizId) => {
      // Prevent duplicate invitations
      const exists = dbStore.collection.quotationInvitations.some(
        (inv) => inv.requestId === id && inv.businessId === bizId
      );
      if (!exists) {
        const biz = (dbStore.collection.businesses || []).find((b) => b._id === bizId);
        if (biz) {
          const invId = generateInvitationId();
          const inv = {
            _id: invId,
            requestId: id,
            businessId: biz._id,
            businessName: biz.businessName,
            ownerId: biz.ownerId,
            ownerName: biz.ownerName || '',
            roleType: biz.roleType || 'businessman',
            status: 'sent',
            rejectionReason: '',
            sentDate: now,
            deadlineDate,
            responseDate: null,
            createdAt: now,
            updatedAt: now,
          };
          dbStore.collection.quotationInvitations.push(inv);
          createdInvitations.push(inv);

          // Notify invited business owner
          createNotification(
            biz.ownerId,
            'New Quotation Request Received',
            `You have been invited by Admin to submit a quotation for "${request.title}" (Request ID: ${id}).`,
            'info',
            `/dashboard/business?tab=quotations`
          );
        }
      }
    });

    if (createdInvitations.length > 0) {
      request.status = 'sent_to_companies';
      request.updatedAt = now;
      request.timeline.push({
        status: 'sent_to_companies',
        timestamp: now,
        note: `Admin sent quotation request to ${createdInvitations.length} company/companies.`,
        actor: req.user.fullName,
      });

      // Notify Requester
      createNotification(
        request.requesterId,
        'Quotation Request Sent to Verified Companies',
        `Your request ${id} has been forwarded to ${createdInvitations.length} verified companies for quotations.`,
        'info',
        `/dashboard/user?tab=quotations`
      );
    }

    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'QUOTATION_COMPANIES_INVITED',
      'QuotationRequest',
      id,
      `Invited ${createdInvitations.length} companies to quote on request ${id}`
    );

    return res.json({
      success: true,
      message: `Quotation request successfully dispatched to ${createdInvitations.length} companies.`,
      invitationsCount: createdInvitations.length,
      request,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * MANDATORY FEATURE (Module 7): Admin Quotation Visibility Checkbox
 * [ ] Allow requester to view all received quotations and select one.
 */
export const updateQuotationVisibilitySettings = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      allowRequesterViewAndSelect,
      adminRevealCompanyIdentity = false,
    } = req.body;

    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const isEnabled = Boolean(allowRequesterViewAndSelect);
    const now = new Date().toISOString();

    request.requesterCanViewAllQuotations = isEnabled;
    request.requesterCanSelectQuotation = isEnabled;
    request.selectionMode = isEnabled ? 'REQUESTER' : 'ADMIN';
    request.adminRevealCompanyIdentity = Boolean(adminRevealCompanyIdentity);
    request.updatedAt = now;

    request.timeline.push({
      status: request.status,
      timestamp: now,
      note: isEnabled
        ? 'Admin enabled requester comparison & quotation selection mode.'
        : 'Admin set quotation selection mode to Admin-managed.',
      actor: req.user.fullName,
    });

    if (isEnabled) {
      // Notify Requester that comparison is now unlocked!
      createNotification(
        request.requesterId,
        'Quotations Available for Comparison!',
        `Admin has opened received quotations for your request ${id}. You can now compare prices and select your preferred supplier.`,
        'success',
        `/dashboard/user?tab=quotations&requestId=${id}`
      );
    }

    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'QUOTATION_VISIBILITY_UPDATED',
      'QuotationRequest',
      id,
      `Updated quotation visibility: Requester Select Mode = ${isEnabled}`
    );

    return res.json({
      success: true,
      message: `Quotation comparison visibility updated (Selection Mode: ${request.selectionMode}).`,
      request,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin Selects Quotation (Option A: Checkbox Disabled - Admin Selection Mode)
 */
export const adminSelectQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotationId } = req.body;

    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const quotation = (dbStore.collection.quotations || []).find(
      (q) => q._id === quotationId && q.requestId === id
    );
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found for this request.' });
    }

    const now = new Date().toISOString();
    request.selectedQuotationId = quotation._id;
    request.selectedBusinessId = quotation.businessId;
    request.selectedBusinessName = quotation.businessName;
    request.status = 'pending_selection';
    request.updatedAt = now;

    request.timeline.push({
      status: 'pending_selection',
      timestamp: now,
      note: `Admin selected quotation ${quotation._id} from ${quotation.businessName}. Sent to requester for review.`,
      actor: req.user.fullName,
    });

    // Notify Requester
    createNotification(
      request.requesterId,
      'Quotation Selected by Admin for Your Review',
      `Admin has vetted and selected a quotation (Total: $${quotation.totalAmount}) for request ${id}. Please review and confirm acceptance.`,
      'info',
      `/dashboard/user?tab=quotations&requestId=${id}`
    );

    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'ADMIN_SELECTED_QUOTATION',
      'QuotationRequest',
      id,
      `Admin selected quotation ${quotation._id} for request ${id}`
    );

    return res.json({
      success: true,
      message: `Selected quotation ${quotation._id}. Requester has been notified to review and accept.`,
      request,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin Confirms Final Selection -> Creates Business Connection (Module 8)
 */
export const adminConfirmSelection = async (req, res) => {
  try {
    const { id } = req.params;
    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (!request.selectedQuotationId) {
      return res.status(400).json({
        success: false,
        message: 'No quotation has been selected yet. Select a quotation first.',
      });
    }

    const selectedQuotation = (dbStore.collection.quotations || []).find(
      (q) => q._id === request.selectedQuotationId
    );
    if (!selectedQuotation) {
      return res.status(404).json({ success: false, message: 'Selected quotation record missing.' });
    }

    const now = new Date().toISOString();

    // 1. Mark selected quotation as 'selected'
    selectedQuotation.status = 'selected';
    selectedQuotation.updatedAt = now;

    // 2. Mark other submitted quotations for this request as 'not_selected'
    (dbStore.collection.quotations || []).forEach((q) => {
      if (q.requestId === id && q._id !== selectedQuotation._id) {
        q.status = 'not_selected';
        q.updatedAt = now;
      }
    });

    // 3. Update Request Status
    request.status = 'selected';
    request.updatedAt = now;
    request.timeline.push({
      status: 'selected',
      timestamp: now,
      note: `Admin officially confirmed quotation ${selectedQuotation._id}. Business connection created.`,
      actor: req.user.fullName,
    });

    // 4. Create Business Connection record
    const newConnection = {
      _id: 'CONN-' + Math.floor(100000 + Math.random() * 900000),
      requestId: request._id,
      quotationId: selectedQuotation._id,
      userId: request.requesterId,
      userName: request.requesterName,
      userEmail: request.requesterEmail,
      userMobile: request.requesterMobile,
      businessId: selectedQuotation.businessId,
      businessName: selectedQuotation.businessName,
      roleType: selectedQuotation.roleType,
      ownerId: selectedQuotation.ownerId,
      connectionType: 'quotation_award',
      status: 'accepted',
      totalAmount: selectedQuotation.totalAmount,
      deliveryTimeline: selectedQuotation.deliveryTimeline,
      notes: `Business connection created via confirmed quotation selection on ${new Date().toLocaleDateString()}.`,
      createdAt: now,
      updatedAt: now,
    };

    if (!dbStore.collection.businessConnections) {
      dbStore.collection.businessConnections = [];
    }
    dbStore.collection.businessConnections.unshift(newConnection);

    // 5. Notifications
    // Notify Selected Company
    createNotification(
      selectedQuotation.ownerId,
      'Congratulations! Your Quotation Was Selected & Confirmed',
      `Your quotation ${selectedQuotation._id} for request ${id} has been confirmed. A new business connection is active.`,
      'success',
      `/dashboard/business?tab=connections`
    );

    // Notify Non-selected Companies
    (dbStore.collection.quotations || [])
      .filter((q) => q.requestId === id && q._id !== selectedQuotation._id)
      .forEach((q) => {
        if (q.ownerId) {
          createNotification(
            q.ownerId,
            'Quotation Status Update',
            `Thank you for submitting a quotation for request ${id}. Another proposal was selected for this project.`,
            'info',
            `/dashboard/business?tab=quotations`
          );
        }
      });

    // Notify Requester with business details
    createNotification(
      request.requesterId,
      'Quotation Confirmed! Business Connection Established',
      `Your project connection with ${selectedQuotation.businessName} has been confirmed. You can now coordinate directly.`,
      'success',
      `/dashboard/user?tab=quotations`
    );

    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'QUOTATION_SELECTION_CONFIRMED',
      'QuotationRequest',
      id,
      `Confirmed quotation ${selectedQuotation._id} and created connection ${newConnection._id}`
    );

    return res.json({
      success: true,
      message: 'Quotation selection confirmed and Business Connection created successfully!',
      request,
      quotation: selectedQuotation,
      connection: newConnection,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Reopen Selection
 */
export const adminReopenRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const now = new Date().toISOString();
    request.status = 'under_review';
    request.selectedQuotationId = null;
    request.updatedAt = now;

    // Reset quotations to submitted
    (dbStore.collection.quotations || []).forEach((q) => {
      if (q.requestId === id) {
        q.status = 'submitted';
        q.updatedAt = now;
      }
    });

    request.timeline.push({
      status: 'under_review',
      timestamp: now,
      note: 'Admin reopened quotation request for re-evaluation.',
      actor: req.user.fullName,
    });

    dbStore.save();
    return res.json({ success: true, message: 'Quotation request reopened for re-evaluation.', request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Request Status & Notes (Admin)
 */
export const adminUpdateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, note } = req.body;

    const request = (dbStore.collection.quotationRequests || []).find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const now = new Date().toISOString();
    if (status) request.status = status;
    if (adminNotes !== undefined) request.adminNotes = adminNotes;
    request.updatedAt = now;

    if (note || status) {
      request.timeline.push({
        status: request.status,
        timestamp: now,
        note: note || `Status updated to ${request.status}.`,
        actor: req.user.fullName,
      });
    }

    dbStore.save();
    return res.json({ success: true, message: 'Request updated.', request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
