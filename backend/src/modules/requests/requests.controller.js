import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';

/**
 * 1. Submit a Service or Material Request (User)
 */
export const createServiceRequest = async (req, res) => {
  try {
    const {
      requestType, // 'service' | 'material'
      category,    // e.g. 'Civil Engineer', 'Architect', 'Cement', 'Steel'
      title,
      description,
      quantity,
      budget,
      location,
      preferredDate,
      attachments,
    } = req.body;

    if (!title || !category || !location) {
      return res.status(400).json({ success: false, message: 'Title, category, and location are required.' });
    }

    const newRequest = {
      _id: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
      userId: req.user._id,
      userName: req.user.fullName,
      userEmail: req.user.email,
      userMobile: req.user.mobile,
      requestType: requestType || 'service',
      category,
      title,
      description: description || '',
      quantity: quantity || '',
      budget: budget || '',
      location,
      preferredDate: preferredDate || '',
      attachments: attachments || [],
      status: 'new', // 'new' | 'under_review' | 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled'
      assignedBusinessId: null,
      assignedBusinessName: null,
      timeline: [
        {
          status: 'new',
          timestamp: new Date().toISOString(),
          note: 'Request created and submitted for Admin review.',
          actor: req.user.fullName,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.collection.serviceRequests.unshift(newRequest);
    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      req.user.roles[0] || 'user',
      'SERVICE_REQUEST_CREATED',
      'ServiceRequest',
      newRequest._id,
      `Created ${newRequest.requestType} request: ${newRequest.title}`
    );

    return res.status(201).json({ success: true, message: 'Request submitted successfully.', request: newRequest });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Get All Service Requests (Admin with filtering)
 */
export const getAllServiceRequests = async (req, res) => {
  try {
    const { status, type, category, search } = req.query;
    let requests = [...dbStore.collection.serviceRequests];

    if (status && status !== 'all') {
      requests = requests.filter((r) => r.status === status);
    }
    if (type && type !== 'all') {
      requests = requests.filter((r) => r.requestType === type);
    }
    if (category && category !== 'all') {
      requests = requests.filter((r) => r.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      requests = requests.filter(
        (r) =>
          r._id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.userName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Get Single Service Request Details
 */
export const getServiceRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = dbStore.collection.serviceRequests.find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    // Also find any connection associated with this request
    const connection = dbStore.collection.businessConnections.find((c) => c.requestId === id);

    return res.json({ success: true, request, connection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Update Request Status (Admin)
 */
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const request = dbStore.collection.serviceRequests.find((r) => r._id === id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    request.status = status;
    request.updatedAt = new Date().toISOString();
    request.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}.`,
      actor: req.user.fullName,
    });

    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'SERVICE_REQUEST_STATUS_UPDATED',
      'ServiceRequest',
      request._id,
      `Status changed to ${status}`
    );

    return res.json({ success: true, message: 'Status updated successfully.', request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Business Matching: Find approved businesses relevant to a request
 */
export const getMatchingBusinesses = async (req, res) => {
  try {
    const { id } = req.params;
    const request = dbStore.collection.serviceRequests.find((r) => r._id === id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    // Only APPROVED businesses can be matched
    const approvedBusinesses = dbStore.collection.businesses.filter(
      (b) => b.verificationStatus === 'approved'
    );

    // Score businesses based on category match, location, description
    const scored = approvedBusinesses.map((b) => {
      let score = 0;
      const bCat = (b.businessCategory || b.businessType || '').toLowerCase();
      const rCat = request.category.toLowerCase();

      if (bCat.includes(rCat) || rCat.includes(bCat)) score += 50;

      // Check services offered
      const services = b.servicesOffered || [];
      if (services.some((s) => s.toLowerCase().includes(rCat))) score += 40;

      // Location match
      const bLoc = typeof b.address === 'object' ? `${b.address?.city || ''} ${b.address?.state || ''}` : String(b.address || '');
      const locationsServed = b.serviceLocations || [];
      if (
        bLoc.toLowerCase().includes(request.location.toLowerCase()) ||
        locationsServed.some((loc) => request.location.toLowerCase().includes(loc.toLowerCase()))
      ) {
        score += 30;
      }

      return {
        ...b,
        matchScore: score,
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({ success: true, matchingBusinesses: scored });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. Assign Business to Request (Admin Action)
 * Creates a Business Connection and updates request to 'assigned'
 */
export const assignBusinessToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { businessId, assignmentNotes } = req.body;

    const request = dbStore.collection.serviceRequests.find((r) => r._id === requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    const business = dbStore.collection.businesses.find((b) => b._id === businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Selected business not found.' });
    }

    if (business.verificationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign unapproved or suspended business. Business must be verified.',
      });
    }

    // Update Request
    request.status = 'assigned';
    request.assignedBusinessId = business._id;
    request.assignedBusinessName = business.businessName;
    request.updatedAt = new Date().toISOString();
    request.timeline.push({
      status: 'assigned',
      timestamp: new Date().toISOString(),
      note: `Assigned to ${business.businessName}. Notes: ${assignmentNotes || 'N/A'}`,
      actor: req.user.fullName,
    });

    // Create Connection Record
    const connectionId = 'CONN-' + Math.floor(100000 + Math.random() * 900000);
    const newConnection = {
      _id: connectionId,
      requestId: request._id,
      requestTitle: request.title,
      requestType: request.requestType,
      category: request.category,
      location: request.location,
      userId: request.userId,
      userName: request.userName,
      userEmail: request.userEmail,
      userMobile: request.userMobile,
      businessId: business._id,
      businessName: business.businessName,
      businessEmail: business.email,
      businessPhone: business.phone,
      assignedBy: req.user.fullName,
      assignedById: req.user._id,
      assignedAt: new Date().toISOString(),
      assignmentNotes: assignmentNotes || '',
      status: 'pending_acceptance', // 'pending_acceptance' | 'accepted' | 'in_progress' | 'completed' | 'rejected'
      statusHistory: [
        {
          status: 'pending_acceptance',
          timestamp: new Date().toISOString(),
          note: `Admin assigned business ${business.businessName}. Awaiting confirmation.`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.collection.businessConnections.unshift(newConnection);
    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'BUSINESS_ASSIGNED',
      'BusinessConnection',
      newConnection._id,
      `Assigned ${business.businessName} to request ${request._id}`
    );

    return res.json({
      success: true,
      message: `Business ${business.businessName} successfully assigned to request.`,
      request,
      connection: newConnection,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 7. Get All Business Connections (Admin)
 */
export const getAllBusinessConnections = async (req, res) => {
  try {
    const { status, search } = req.query;
    let connections = [...dbStore.collection.businessConnections];

    if (status && status !== 'all') {
      connections = connections.filter((c) => c.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      connections = connections.filter(
        (c) =>
          c._id.toLowerCase().includes(q) ||
          c.requestId.toLowerCase().includes(q) ||
          c.userName.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: connections.length, connections });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 8. Update Business Connection Status (Businessman or Admin)
 */
export const updateConnectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, rejectionReason } = req.body;

    const connection = dbStore.collection.businessConnections.find((c) => c._id === id);
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found.' });
    }

    connection.status = status;
    connection.updatedAt = new Date().toISOString();
    if (rejectionReason) connection.rejectionReason = rejectionReason;

    connection.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || (rejectionReason ? `Rejected: ${rejectionReason}` : `Status updated to ${status}`),
    });

    // Mirror status update on the parent request
    const request = dbStore.collection.serviceRequests.find((r) => r._id === connection.requestId);
    if (request) {
      if (status === 'rejected') {
        // Return request to 'under_review' so Admin can reassign
        request.status = 'under_review';
        request.assignedBusinessId = null;
        request.assignedBusinessName = null;
        request.timeline.push({
          status: 'under_review',
          timestamp: new Date().toISOString(),
          note: `Businessman declined: ${rejectionReason || 'No reason provided'}. Returned to Under Review for Admin reassignment.`,
          actor: req.user.fullName,
        });
      } else if (status === 'accepted') {
        request.status = 'accepted';
        request.timeline.push({
          status: 'accepted',
          timestamp: new Date().toISOString(),
          note: `Businessman accepted request. Work preparation started.`,
          actor: req.user.fullName,
        });
      } else if (status === 'in_progress') {
        request.status = 'in_progress';
        request.timeline.push({
          status: 'in_progress',
          timestamp: new Date().toISOString(),
          note: `Work currently in progress.`,
          actor: req.user.fullName,
        });
      } else if (status === 'completed') {
        request.status = 'completed';
        request.timeline.push({
          status: 'completed',
          timestamp: new Date().toISOString(),
          note: `Work successfully completed.`,
          actor: req.user.fullName,
        });
      }
    }

    dbStore.save();

    return res.json({ success: true, message: 'Connection status updated.', connection, request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 9. Get Service Requests assigned to the logged-in Business (Businessman / Entrepreneur)
 */
export const getMyBusinessRequests = async (req, res) => {
  try {
    const { status, search, businessId, roleType } = req.query;
    const myBusinesses = dbStore.collection.businesses.filter((b) => b.ownerId === req.user._id);
    if (myBusinesses.length === 0 && !req.user.roles.includes('admin')) {
      return res.json({
        success: true,
        businessId: null,
        businessName: null,
        metrics: {
          totalRequests: 0,
          newRequests: 0,
          pendingResponses: 0,
          acceptedRequests: 0,
          inProgressRequests: 0,
          completedRequests: 0,
          rejectedRequests: 0,
          totalConnections: 0,
        },
        requests: [],
      });
    }

    let targetBusiness = null;
    if (businessId) {
      targetBusiness = myBusinesses.find((b) => b._id === businessId);
    } else if (roleType) {
      targetBusiness = myBusinesses.find((b) => b.roleType === roleType);
    }
    if (!targetBusiness) {
      targetBusiness = myBusinesses[0];
    }

    const targetBizId = targetBusiness ? targetBusiness._id : null;
    const targetBizIds = targetBizId ? [targetBizId] : myBusinesses.map((b) => b._id);

    // Get all requests assigned to this business
    let assignedRequests = dbStore.collection.serviceRequests.filter((r) =>
      targetBizIds.includes(r.assignedBusinessId)
    );

    // Calculate metrics before status filter
    const totalRequests = assignedRequests.length;
    const newRequests = assignedRequests.filter((r) => r.status === 'assigned' || r.status === 'new').length;
    const pendingResponses = assignedRequests.filter((r) => r.status === 'assigned').length;
    const acceptedRequests = assignedRequests.filter((r) => r.status === 'accepted').length;
    const inProgressRequests = assignedRequests.filter((r) => r.status === 'in_progress').length;
    const completedRequests = assignedRequests.filter((r) => r.status === 'completed').length;
    const rejectedRequests = assignedRequests.filter((r) => r.status === 'rejected').length;

    // Total connections count
    const connections = dbStore.collection.businessConnections.filter((c) =>
      targetBizIds.includes(c.businessId)
    );
    const totalConnections = connections.length;

    // Status filtering
    if (status && status !== 'all') {
      if (status === 'new') {
        assignedRequests = assignedRequests.filter((r) => r.status === 'assigned' || r.status === 'new');
      } else if (status === 'pending_response') {
        assignedRequests = assignedRequests.filter((r) => r.status === 'assigned');
      } else {
        assignedRequests = assignedRequests.filter((r) => r.status === status);
      }
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      assignedRequests = assignedRequests.filter(
        (r) =>
          r._id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.userName && r.userName.toLowerCase().includes(q)) ||
          r.location.toLowerCase().includes(q)
      );
    }

    // Attach connection info to requests
    const enriched = assignedRequests.map((r) => {
      const conn = connections.find((c) => c.requestId === r._id);
      return {
        ...r,
        connectionId: conn?._id || null,
        connectionStatus: conn?.status || null,
        rejectionReason: conn?.rejectionReason || null,
      };
    });

    return res.json({
      success: true,
      businessId: targetBusiness?._id || null,
      businessName: targetBusiness?.businessName || null,
      roleType: targetBusiness?.roleType || null,
      metrics: {
        totalRequests,
        newRequests,
        pendingResponses,
        acceptedRequests,
        inProgressRequests,
        completedRequests,
        rejectedRequests,
        totalConnections,
      },
      requests: enriched,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 10. Get Business Connections for logged-in Business
 */
export const getMyBusinessConnections = async (req, res) => {
  try {
    const { status, search, businessId, roleType } = req.query;
    const myBusinesses = dbStore.collection.businesses.filter((b) => b.ownerId === req.user._id);
    if (myBusinesses.length === 0 && !req.user.roles.includes('admin')) {
      return res.json({ success: true, count: 0, connections: [] });
    }

    let targetBusiness = null;
    if (businessId) {
      targetBusiness = myBusinesses.find((b) => b._id === businessId);
    } else if (roleType) {
      targetBusiness = myBusinesses.find((b) => b.roleType === roleType);
    }
    if (!targetBusiness) {
      targetBusiness = myBusinesses[0];
    }

    const targetBizId = targetBusiness ? targetBusiness._id : null;
    const targetBizIds = targetBizId ? [targetBizId] : myBusinesses.map((b) => b._id);

    let connections = dbStore.collection.businessConnections.filter((c) =>
      targetBizIds.includes(c.businessId)
    );

    if (status && status !== 'all') {
      connections = connections.filter((c) => c.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      connections = connections.filter(
        (c) =>
          c._id.toLowerCase().includes(q) ||
          c.requestId.toLowerCase().includes(q) ||
          c.userName.toLowerCase().includes(q) ||
          c.requestTitle.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      businessId: targetBusiness?._id || null,
      businessName: targetBusiness?.businessName || null,
      count: connections.length,
      connections,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 11. Respond to a Service Request (Accept or Reject)
 */
export const respondToServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'accept' | 'reject'

    const myBusinesses = dbStore.collection.businesses.filter((b) => b.ownerId === req.user._id);
    const myBizIds = myBusinesses.map((b) => b._id);

    const request = dbStore.collection.serviceRequests.find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    if (!req.user.roles.includes('admin') && !myBizIds.includes(request.assignedBusinessId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. This request is not assigned to your business.',
      });
    }

    const connection = dbStore.collection.businessConnections.find((c) => c.requestId === id);
    const now = new Date().toISOString();

    if (action === 'accept') {
      request.status = 'accepted';
      request.updatedAt = now;
      request.timeline.push({
        status: 'accepted',
        timestamp: now,
        note: `Request accepted by ${request.assignedBusinessName}. Service preparation started.`,
        actor: req.user.fullName,
      });

      if (connection) {
        connection.status = 'accepted';
        connection.updatedAt = now;
        connection.statusHistory.push({
          status: 'accepted',
          timestamp: now,
          note: `Business accepted request assignment.`,
        });
      }

      // Customer notification
      dbStore.collection.notifications.push({
        _id: uuidv4(),
        userId: request.userId,
        title: 'Request Accepted!',
        message: `${request.assignedBusinessName} has accepted your request "${request.title}". They will connect with you shortly.`,
        type: 'success',
        link: '/dashboard/user?tab=orders',
        isRead: false,
        createdAt: now,
      });

      dbStore.save();
      logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'REQUEST_ACCEPTED', 'ServiceRequest', request._id, `Accepted request ${request._id}`);
      return res.json({ success: true, message: 'Request accepted successfully!', request, connection });
    }

    if (action === 'reject') {
      if (!reason || !String(reason).trim()) {
        return res.status(400).json({ success: false, message: 'A rejection reason is required.' });
      }

      const prevBizName = request.assignedBusinessName;
      request.status = 'under_review'; // returned to Under Review so Admin can assign to another provider
      request.assignedBusinessId = null;
      request.assignedBusinessName = null;
      request.updatedAt = now;
      request.timeline.push({
        status: 'under_review',
        timestamp: now,
        note: `Declined by ${prevBizName}. Reason: ${reason}. Returned to Under Review for Admin reassignment.`,
        actor: req.user.fullName,
      });

      if (connection) {
        connection.status = 'rejected';
        connection.rejectionReason = String(reason).trim();
        connection.updatedAt = now;
        connection.statusHistory.push({
          status: 'rejected',
          timestamp: now,
          note: `Business declined: ${reason}`,
        });
      }

      dbStore.save();
      logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'REQUEST_REJECTED', 'ServiceRequest', request._id, `Declined request ${request._id}. Reason: ${reason}`);
      return res.json({ success: true, message: 'Request declined.', request, connection });
    }

    return res.status(400).json({ success: false, message: 'Invalid action. Use "accept" or "reject".' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 12. Update Service Request Progress (in_progress or completed)
 */
export const updateRequestProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progressNote } = req.body; // status: 'in_progress' | 'completed'

    const myBusinesses = dbStore.collection.businesses.filter((b) => b.ownerId === req.user._id);
    const myBizIds = myBusinesses.map((b) => b._id);

    const request = dbStore.collection.serviceRequests.find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    if (!req.user.roles.includes('admin') && !myBizIds.includes(request.assignedBusinessId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. This request is not assigned to your business.',
      });
    }

    const connection = dbStore.collection.businessConnections.find((c) => c.requestId === id);
    const now = new Date().toISOString();

    request.status = status;
    request.updatedAt = now;
    request.timeline.push({
      status,
      timestamp: now,
      note: progressNote || `Progress updated to ${status}.`,
      actor: req.user.fullName,
    });

    if (connection) {
      connection.status = status;
      connection.updatedAt = now;
      connection.statusHistory.push({
        status,
        timestamp: now,
        note: progressNote || `Status updated to ${status}`,
      });
    }

    // Customer Notification
    dbStore.collection.notifications.push({
      _id: uuidv4(),
      userId: request.userId,
      title: status === 'completed' ? 'Service Request Completed!' : 'Work In Progress',
      message: status === 'completed'
        ? `Your request "${request.title}" has been marked completed by ${request.assignedBusinessName}.`
        : `Work on "${request.title}" is now in progress. Note: ${progressNote || 'Underway'}`,
      type: 'info',
      link: '/dashboard/user?tab=orders',
      isRead: false,
      createdAt: now,
    });

    dbStore.save();
    logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'REQUEST_PROGRESS_UPDATED', 'ServiceRequest', request._id, `Updated status to ${status}`);
    return res.json({ success: true, message: `Request updated to ${status}.`, request, connection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
