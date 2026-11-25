import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
import { PRIVATE_DOCS_DIR } from './documentUpload.middleware';
import {
  DEFAULT_DOCUMENT_REQUIREMENTS,
  DOCUMENT_STATUSES,
  evaluateRequirementsForApplicant,
} from './documentRequirements.defaults';

export const ensureDocumentRequirementsSeeded = () => {
  if (!dbStore.collection.documentRequirements || dbStore.collection.documentRequirements.length === 0) {
    dbStore.collection.documentRequirements = JSON.parse(JSON.stringify(DEFAULT_DOCUMENT_REQUIREMENTS));
    dbStore.save();
  }
  return dbStore.collection.documentRequirements;
};

const addDocAuditLog = ({ userId, draftId, documentId, requirementId, documentName, action, actorId, actorName, actorRole, details }) => {
  if (!dbStore.collection.documentAuditLogs) {
    dbStore.collection.documentAuditLogs = [];
  }
  const entry = {
    _id: uuidv4(),
    userId: userId || null,
    draftId: draftId || null,
    documentId: documentId || null,
    requirementId: requirementId || null,
    documentName: documentName || '',
    action,
    actorId: actorId || 'system',
    actorName: actorName || 'System',
    actorRole: actorRole || 'user',
    details: details || '',
    createdAt: new Date().toISOString(),
  };
  dbStore.collection.documentAuditLogs.unshift(entry);
  logAudit(actorId || 'system', actorName || 'System', actorRole || 'user', action, 'VerificationDocument', documentId || userId || 'config', details);
  return entry;
};

const sanitizeDocument = (doc) => {
  if (!doc) return null;
  // Never expose raw server storage path or internal storageKey publicly
  const { storagePath, storageKey, ...safe } = doc;
  return safe;
};

/**
 * Helper: evaluate an applicant's complete verification checklist and readiness
 */
export const buildApplicantVerificationSummary = (user, draftSession = null, targetRole = null) => {
  const allReqs = ensureDocumentRequirementsSeeded();
  let roles = user ? user.roles : draftSession?.roles || [];
  if (targetRole) {
    roles = [targetRole];
  }
  const context = user ? user.applicationContext || {} : draftSession?.applicationContext || {};
  const evaluated = evaluateRequirementsForApplicant(allReqs, roles, context);

  const ownerDocs = (dbStore.collection.verificationDocuments || []).filter((d) =>
    user ? d.userId === user._id : d.draftId === draftSession?.draftId
  );

  const mergeSlot = (reqItem) => {
    let doc = ownerDocs.find((d) => d.requirementId === reqItem.id);
    // Allow sharing common identity proof and profile photos across roles
    if (!doc) {
      if (reqItem.id === 'ent_id_proof') {
        doc = ownerDocs.find((d) => d.requirementId === 'biz_owner_id_proof' || d.requirementId === 'teacher_id_proof');
      } else if (reqItem.id === 'biz_owner_id_proof') {
        doc = ownerDocs.find((d) => d.requirementId === 'ent_id_proof' || d.requirementId === 'teacher_id_proof');
      } else if (reqItem.id === 'ent_profile_photo') {
        doc = ownerDocs.find((d) => d.requirementId === 'biz_owner_photo' || d.requirementId === 'teacher_profile_photo');
      } else if (reqItem.id === 'biz_owner_photo') {
        doc = ownerDocs.find((d) => d.requirementId === 'ent_profile_photo' || d.requirementId === 'teacher_profile_photo');
      }
    }

    if (!doc) {
      return {
        requirement: reqItem,
        document: null,
        status: 'Not Uploaded',
      };
    }
    return {
      requirement: reqItem,
      document: sanitizeDocument(doc),
      status: doc.status,
    };
  };

  const mandatorySlots = evaluated.mandatory.map(mergeSlot);
  const optionalSlots = evaluated.optional.map(mergeSlot);

  const missingMandatory = mandatorySlots.filter((s) => !s.document || s.status === 'Not Uploaded');
  const rejectedOrReplacement = [...mandatorySlots, ...optionalSlots].filter(
    (s) => s.status === 'Rejected' || s.status === 'Replacement Required'
  );
  const unverifiedMandatory = mandatorySlots.filter((s) => s.status !== 'Verified');

  const isEntrepreneur = roles.includes('entrepreneur');
  const unregisteredMissingDecl =
    isEntrepreneur && !context.isStartupRegistered && !context.unregisteredDeclarationAccepted;

  const allMandatoryUploaded = missingMandatory.length === 0 && !unregisteredMissingDecl;
  const allMandatoryVerified = unverifiedMandatory.length === 0 && !unregisteredMissingDecl;

  return {
    requiresVerification: evaluated.requiresVerification,
    roles,
    targetRole: targetRole || null,
    applicationContext: context,
    mandatorySlots,
    optionalSlots,
    summary: {
      totalMandatory: mandatorySlots.length,
      uploadedMandatory: mandatorySlots.filter((s) => s.document).length,
      verifiedMandatory: mandatorySlots.filter((s) => s.status === 'Verified').length,
      missingMandatoryCount: missingMandatory.length,
      unverifiedMandatoryCount: unverifiedMandatory.length,
      rejectedOrReplacementCount: rejectedOrReplacement.length,
      totalOptional: optionalSlots.length,
      uploadedOptional: optionalSlots.filter((s) => s.document).length,
      allMandatoryUploaded,
      allMandatoryVerified,
      unregisteredDeclarationRequired: isEntrepreneur && !context.isStartupRegistered,
      unregisteredDeclarationAccepted: Boolean(context.unregisteredDeclarationAccepted),
      canSubmitApplication: allMandatoryUploaded,
      canApproveApplication: evaluated.requiresVerification ? allMandatoryVerified : true,
      unverifiedMandatoryNames: unverifiedMandatory.map((s) => s.requirement.name),
      missingMandatoryNames: missingMandatory.map((s) => s.requirement.name),
    },
  };
};

// ======================================================
// 1. CONFIGURABLE DOCUMENT REQUIREMENTS
// ======================================================

export const getDocumentRequirements = async (req, res) => {
  try {
    const allReqs = ensureDocumentRequirementsSeeded();
    const { role, roles, context } = req.query;

    let parsedContext = {};
    if (context) {
      try {
        parsedContext = typeof context === 'string' ? JSON.parse(context) : context;
      } catch {
        parsedContext = {};
      }
    }

    if (roles || role) {
      const roleList = roles
        ? String(roles).split(',').map((r) => r.trim())
        : [String(role).trim()];
      const evaluated = evaluateRequirementsForApplicant(allReqs, roleList, parsedContext);
      return res.json({
        success: true,
        requiresVerification: evaluated.requiresVerification,
        mandatory: evaluated.mandatory,
        optional: evaluated.optional,
        requirements: evaluated.all,
      });
    }

    return res.json({
      success: true,
      requirements: [...allReqs].sort((a, b) => (a.order || 0) - (b.order || 0)),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDocumentRequirement = async (req, res) => {
  try {
    const allReqs = ensureDocumentRequirementsSeeded();
    const {
      role,
      name,
      description,
      category,
      isConditional,
      conditionKey,
      conditionLabel,
      allowedFormats,
      maxSizeMB,
      isActive,
      order,
    } = req.body;

    if (!role || !['teacher', 'businessman', 'entrepreneur'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Valid role (teacher, businessman, entrepreneur) is required.' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Document name is required.' });
    }

    const newReq = {
      id: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      role,
      name: name.trim(),
      description: description || '',
      category: category === 'optional' ? 'optional' : 'mandatory',
      isConditional: Boolean(isConditional),
      conditionKey: isConditional ? conditionKey || 'customCondition' : null,
      conditionLabel: isConditional ? conditionLabel || '' : '',
      allowedFormats: Array.isArray(allowedFormats) && allowedFormats.length > 0 ? allowedFormats : ['pdf', 'jpg', 'jpeg', 'png'],
      maxSizeMB: Number(maxSizeMB) > 0 ? Number(maxSizeMB) : 5,
      isActive: isActive !== false,
      order: Number(order) || allReqs.filter((r) => r.role === role).length + 1,
    };

    allReqs.push(newReq);
    dbStore.save();

    addDocAuditLog({
      action: 'DOC_REQUIREMENT_CREATED',
      requirementId: newReq.id,
      documentName: newReq.name,
      actorId: req.user._id,
      actorName: req.user.fullName,
      actorRole: 'admin',
      details: `Added ${newReq.category} requirement "${newReq.name}" for role ${newReq.role}`,
    });

    return res.status(201).json({ success: true, message: 'Document requirement created.', requirement: newReq });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDocumentRequirement = async (req, res) => {
  try {
    const allReqs = ensureDocumentRequirementsSeeded();
    const { id } = req.params;
    const target = allReqs.find((r) => r.id === id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Document requirement not found.' });
    }

    const {
      name,
      description,
      category,
      isConditional,
      conditionKey,
      conditionLabel,
      allowedFormats,
      maxSizeMB,
      isActive,
      order,
    } = req.body;

    if (name !== undefined) target.name = String(name).trim();
    if (description !== undefined) target.description = String(description);
    if (category !== undefined) target.category = category === 'optional' ? 'optional' : 'mandatory';
    if (isConditional !== undefined) target.isConditional = Boolean(isConditional);
    if (conditionKey !== undefined) target.conditionKey = conditionKey || null;
    if (conditionLabel !== undefined) target.conditionLabel = conditionLabel || '';
    if (Array.isArray(allowedFormats) && allowedFormats.length > 0) target.allowedFormats = allowedFormats;
    if (maxSizeMB !== undefined && Number(maxSizeMB) > 0) target.maxSizeMB = Number(maxSizeMB);
    if (isActive !== undefined) target.isActive = Boolean(isActive);
    if (order !== undefined) target.order = Number(order);

    dbStore.save();

    addDocAuditLog({
      action: 'DOC_REQUIREMENT_UPDATED',
      requirementId: target.id,
      documentName: target.name,
      actorId: req.user._id,
      actorName: req.user.fullName,
      actorRole: 'admin',
      details: `Updated requirement "${target.name}" (${target.role}) -> ${target.category}, active=${target.isActive}`,
    });

    return res.json({ success: true, message: 'Document requirement updated.', requirement: target });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDocumentRequirement = async (req, res) => {
  try {
    const allReqs = ensureDocumentRequirementsSeeded();
    const idx = allReqs.findIndex((r) => r.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Document requirement not found.' });
    }
    const removed = allReqs.splice(idx, 1)[0];
    dbStore.save();

    addDocAuditLog({
      action: 'DOC_REQUIREMENT_DELETED',
      requirementId: removed.id,
      documentName: removed.name,
      actorId: req.user._id,
      actorName: req.user.fullName,
      actorRole: 'admin',
      details: `Removed document requirement "${removed.name}" for role ${removed.role}`,
    });

    return res.json({ success: true, message: 'Document requirement deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// 2. APPLICANT UPLOAD / DRAFT / PREVIEW / REPLACEMENT
// ======================================================

export const updateApplicationContext = async (req, res) => {
  try {
    const context = req.body.applicationContext || req.body;
    if (req.draftSession) {
      req.draftSession.applicationContext = {
        ...(req.draftSession.applicationContext || {}),
        ...context,
      };
      req.draftSession.updatedAt = new Date().toISOString();
      dbStore.save();
      const summary = buildApplicantVerificationSummary(null, req.draftSession);
      return res.json({ success: true, ...summary });
    }

    if (req.user) {
      const user = dbStore.collection.users.find((u) => u._id === req.user._id);
      user.applicationContext = {
        ...(user.applicationContext || {}),
        ...context,
      };
      user.updatedAt = new Date().toISOString();
      dbStore.save();
      const summary = buildApplicantVerificationSummary(user);
      return res.json({ success: true, ...summary });
    }

    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyDocumentsChecklist = async (req, res) => {
  try {
    if (req.draftSession) {
      const summary = buildApplicantVerificationSummary(null, req.draftSession);
      return res.json({ success: true, ...summary });
    }
    if (req.user) {
      const summary = buildApplicantVerificationSummary(req.user);
      const history = (dbStore.collection.documentAuditLogs || []).filter((l) => l.userId === req.user._id);
      return res.json({ success: true, ...summary, auditLogs: history });
    }
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadVerificationDocument = async (req, res) => {
  const uploadedFile = req.file;
  const cleanupUploadedFile = () => {
    if (uploadedFile && uploadedFile.path && fs.existsSync(uploadedFile.path)) {
      try {
        fs.unlinkSync(uploadedFile.path);
      } catch {
        // ignore cleanup error
      }
    }
  };

  try {
    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: 'No document file uploaded.' });
    }

    const { requirementId } = req.body;
    if (!requirementId) {
      cleanupUploadedFile();
      return res.status(400).json({ success: false, message: 'requirementId is required.' });
    }

    const allReqs = ensureDocumentRequirementsSeeded();
    const reqConfig = allReqs.find((r) => r.id === requirementId && r.isActive !== false);
    if (!reqConfig) {
      cleanupUploadedFile();
      return res.status(400).json({ success: false, message: 'Invalid or inactive document requirement.' });
    }

    // Validate extension and size against requirement configuration
    const ext = path.extname(uploadedFile.originalname).toLowerCase().replace('.', '');
    const allowedFormats = (reqConfig.allowedFormats || ['pdf', 'jpg', 'jpeg', 'png']).map((f) => f.toLowerCase());
    if (!allowedFormats.includes(ext)) {
      cleanupUploadedFile();
      return res.status(400).json({
        success: false,
        message: `Format ".${ext}" is not allowed for "${reqConfig.name}". Supported formats: ${allowedFormats.join(', ').toUpperCase()}.`,
      });
    }

    const maxBytes = (reqConfig.maxSizeMB || 5) * 1024 * 1024;
    if (uploadedFile.size > maxBytes) {
      cleanupUploadedFile();
      return res.status(400).json({
        success: false,
        message: `File size exceeds the ${reqConfig.maxSizeMB || 5} MB limit for "${reqConfig.name}".`,
      });
    }

    if (!dbStore.collection.verificationDocuments) {
      dbStore.collection.verificationDocuments = [];
    }

    const ownerUserId = req.user ? req.user._id : null;
    const ownerDraftId = req.draftSession ? req.draftSession.draftId : null;
    const actorName = req.user ? req.user.fullName : req.draftSession?.fullName || 'Applicant';
    const actorRole = req.user ? req.user.roles[0] || 'applicant' : req.draftSession?.roles?.[0] || 'applicant';

    // Check if there's an existing document for this slot
    const existingIndex = dbStore.collection.verificationDocuments.findIndex(
      (d) =>
        d.requirementId === requirementId &&
        ((ownerUserId && d.userId === ownerUserId) || (ownerDraftId && d.draftId === ownerDraftId))
    );

    const now = new Date().toISOString();
    let docRecord;

    if (existingIndex !== -1) {
      const existing = dbStore.collection.verificationDocuments[existingIndex];
      // Prevent overwriting an already Verified document unless Admin marked it Replacement Required / Rejected
      if (existing.status === 'Verified') {
        cleanupUploadedFile();
        return res.status(403).json({
          success: false,
          message: 'Verified documents cannot be overwritten by applicant.',
        });
      }

      // Remove old physical file securely
      if (existing.storageKey) {
        const oldPath = path.join(PRIVATE_DOCS_DIR, path.basename(existing.storageKey));
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch {
            // ignore
          }
        }
      }

      existing.originalName = uploadedFile.originalname;
      existing.mimeType = uploadedFile.mimetype;
      existing.extension = ext;
      existing.sizeBytes = uploadedFile.size;
      existing.storageKey = uploadedFile.filename;
      // Applicants can NEVER set status to Verified - always resets to Uploaded
      existing.status = 'Uploaded';
      existing.rejectionReason = null;
      existing.replacementNote = null;
      existing.uploadedAt = now;
      existing.updatedAt = now;
      existing.history = [
        ...(existing.history || []),
        {
          status: 'Uploaded',
          action: 'DOCUMENT_REPLACED',
          actorId: ownerUserId || ownerDraftId,
          actorName,
          actorRole,
          note: `Replaced document with "${uploadedFile.originalname}" (${(uploadedFile.size / 1024).toFixed(1)} KB).`,
          timestamp: now,
        },
      ];
      docRecord = existing;
    } else {
      docRecord = {
        _id: uuidv4(),
        userId: ownerUserId,
        draftId: ownerDraftId,
        requirementId: reqConfig.id,
        requirementName: reqConfig.name,
        role: reqConfig.role,
        originalName: uploadedFile.originalname,
        mimeType: uploadedFile.mimetype,
        extension: ext,
        sizeBytes: uploadedFile.size,
        storageKey: uploadedFile.filename,
        status: 'Uploaded',
        rejectionReason: null,
        replacementNote: null,
        reviewedBy: null,
        reviewedAt: null,
        uploadedAt: now,
        updatedAt: now,
        history: [
          {
            status: 'Uploaded',
            action: 'DOCUMENT_UPLOADED',
            actorId: ownerUserId || ownerDraftId,
            actorName,
            actorRole,
            note: `Uploaded "${uploadedFile.originalname}" (${(uploadedFile.size / 1024).toFixed(1)} KB).`,
            timestamp: now,
          },
        ],
      };
      dbStore.collection.verificationDocuments.push(docRecord);
    }

    // If an existing pending/rejected user replaced a document, set overall status back to pending_approval
    if (req.user && (req.user.verificationStatus === 'replacement_required' || req.user.verificationStatus === 'rejected')) {
      const userObj = dbStore.collection.users.find((u) => u._id === req.user._id);
      if (userObj) {
        userObj.verificationStatus = 'pending_approval';
        userObj.status = 'pending';
        userObj.updatedAt = now;
      }
    }

    dbStore.save();

    addDocAuditLog({
      userId: ownerUserId,
      draftId: ownerDraftId,
      documentId: docRecord._id,
      requirementId: reqConfig.id,
      documentName: reqConfig.name,
      action: existingIndex !== -1 ? 'DOCUMENT_REPLACED' : 'DOCUMENT_UPLOADED',
      actorId: ownerUserId || ownerDraftId,
      actorName,
      actorRole,
      details: `${existingIndex !== -1 ? 'Replaced' : 'Uploaded'} "${reqConfig.name}" (${uploadedFile.originalname})`,
    });

    const summary = buildApplicantVerificationSummary(req.user || null, req.draftSession || null);
    return res.status(201).json({
      success: true,
      message: `${reqConfig.name} uploaded securely.`,
      document: sanitizeDocument(docRecord),
      ...summary,
    });
  } catch (error) {
    cleanupUploadedFile();
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeUploadedDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const docs = dbStore.collection.verificationDocuments || [];
    const idx = docs.findIndex((d) => d._id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    const doc = docs[idx];
    const isOwner =
      (req.user && doc.userId === req.user._id) ||
      (req.draftSession && doc.draftId === req.draftSession.draftId);
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only remove your own documents.' });
    }

    // Only allow removing during registration draft OR before verification (not Verified docs)
    if (doc.status === 'Verified' || doc.status === 'Under Verification') {
      return res.status(403).json({
        success: false,
        message: `Cannot remove document in status "${doc.status}".`,
      });
    }

    if (doc.storageKey) {
      const filePath = path.join(PRIVATE_DOCS_DIR, path.basename(doc.storageKey));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore
        }
      }
    }

    docs.splice(idx, 1);
    dbStore.save();

    addDocAuditLog({
      userId: doc.userId,
      draftId: doc.draftId,
      documentId: doc._id,
      requirementId: doc.requirementId,
      documentName: doc.requirementName,
      action: 'DOCUMENT_REMOVED',
      actorId: req.user?._id || req.draftSession?.draftId,
      actorName: req.user?.fullName || req.draftSession?.fullName || 'Applicant',
      actorRole: req.user?.roles?.[0] || 'applicant',
      details: `Removed uploaded document "${doc.requirementName}" (${doc.originalName})`,
    });

    const summary = buildApplicantVerificationSummary(req.user || null, req.draftSession || null);
    return res.json({ success: true, message: 'Document removed.', ...summary });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// 3. SECURE TIME-LIMITED DOCUMENT PREVIEW & DOWNLOAD
// ======================================================

export const getDocumentAccessToken = async (req, res) => {
  try {
    const { id } = req.params;
    const download = req.query.download === 'true';
    const doc = (dbStore.collection.verificationDocuments || []).find((d) => d._id === id);

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    const isAdmin = Boolean(req.user && req.user.roles.includes('admin'));
    const isApplicant = Boolean(
      (req.user && doc.userId === req.user._id) ||
        (req.draftSession && doc.draftId === req.draftSession.draftId)
    );

    if (!isAdmin && !isApplicant) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the applicant and authorized Admin can access this document.',
      });
    }

    const actorId = req.user ? req.user._id : req.draftSession.draftId;
    const actorName = req.user ? req.user.fullName : req.draftSession.fullName || 'Applicant';
    const actorRole = isAdmin ? 'admin' : req.user?.roles?.[0] || 'applicant';

    const accessToken = jwt.sign(
      {
        purpose: 'document_access',
        docId: doc._id,
        actorId,
        actorRole,
        disposition: download ? 'attachment' : 'inline',
      },
      config.jwtSecret,
      { expiresIn: '120s' }
    );

    addDocAuditLog({
      userId: doc.userId,
      draftId: doc.draftId,
      documentId: doc._id,
      requirementId: doc.requirementId,
      documentName: doc.requirementName,
      action: download ? 'DOCUMENT_DOWNLOAD_LINK_ISSUED' : 'DOCUMENT_PREVIEW_LINK_ISSUED',
      actorId,
      actorName,
      actorRole,
      details: `Issued 120s time-limited ${download ? 'download' : 'preview'} link for "${doc.requirementName}"`,
    });

    return res.json({
      success: true,
      accessToken,
      expiresInSeconds: 120,
      mimeType: doc.mimeType,
      originalName: doc.originalName,
      url: `${config.apiUrl}/api/documents/secure/${accessToken}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const serveSecureDocument = async (req, res) => {
  try {
    const { token } = req.params;
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch {
      return res.status(401).json({ success: false, message: 'Document access link has expired or is invalid.' });
    }

    if (decoded.purpose !== 'document_access' || !decoded.docId) {
      return res.status(403).json({ success: false, message: 'Invalid document access token scope.' });
    }

    const doc = (dbStore.collection.verificationDocuments || []).find((d) => d._id === decoded.docId);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document no longer exists.' });
    }

    const safeFileName = path.basename(doc.storageKey || '');
    const filePath = path.join(PRIVATE_DOCS_DIR, safeFileName);
    if (!safeFileName || !fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Stored document file is unavailable.' });
    }

    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `${decoded.disposition === 'attachment' ? 'attachment' : 'inline'}; filename="${encodeURIComponent(doc.originalName || safeFileName)}"`
    );
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    return res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// 4. ADMIN DOCUMENT VERIFICATION & APPLICATION APPROVAL
// ======================================================

export const getPendingApplicantsSummary = async (req, res) => {
  try {
    const users = (dbStore.collection.users || []).filter((u) => {
      const hasVerifiableRole = u.roles.some((r) => ['teacher', 'businessman', 'entrepreneur'].includes(r));
      const isPendingOrNeedsReview =
        u.status === 'pending' ||
        ['pending_approval', 'rejected', 'replacement_required'].includes(u.verificationStatus);
      return hasVerifiableRole && isPendingOrNeedsReview;
    });

    const data = users.map((u) => {
      const { password, ...safeUser } = u;
      const summary = buildApplicantVerificationSummary(u);
      const business = (dbStore.collection.businesses || []).find((b) => b.ownerId === u._id) || null;
      return {
        user: safeUser,
        business,
        verification: summary,
      };
    });

    return res.json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicantDocumentsForAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = (dbStore.collection.users || []).find((u) => u._id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Applicant user not found.' });
    }

    const { password, ...safeUser } = user;
    const verification = buildApplicantVerificationSummary(user);
    const business = (dbStore.collection.businesses || []).find((b) => b.ownerId === user._id) || null;
    const auditLogs = (dbStore.collection.documentAuditLogs || []).filter((l) => l.userId === user._id);

    return res.json({
      success: true,
      user: safeUser,
      business,
      verification,
      auditLogs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewIndividualDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const allowedReviewStatuses = ['Under Verification', 'Verified', 'Rejected', 'Replacement Required'];
    if (!allowedReviewStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid review status. Allowed: ${allowedReviewStatuses.join(', ')}`,
      });
    }

    if ((status === 'Rejected' || status === 'Replacement Required') && (!reason || !String(reason).trim())) {
      return res.status(400).json({
        success: false,
        message: `A clear reason is required when marking a document as "${status}".`,
      });
    }

    const doc = (dbStore.collection.verificationDocuments || []).find((d) => d._id === id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    const now = new Date().toISOString();
    doc.status = status;
    doc.reviewedBy = req.user.fullName;
    doc.reviewedById = req.user._id;
    doc.reviewedAt = now;
    doc.updatedAt = now;

    if (status === 'Rejected') {
      doc.rejectionReason = String(reason).trim();
      doc.replacementNote = null;
    } else if (status === 'Replacement Required') {
      doc.replacementNote = String(reason).trim();
      doc.rejectionReason = null;
    } else if (status === 'Verified') {
      doc.rejectionReason = null;
      doc.replacementNote = null;
    }

    doc.history = [
      ...(doc.history || []),
      {
        status,
        action: `ADMIN_MARKED_${status.toUpperCase().replace(/\s+/g, '_')}`,
        actorId: req.user._id,
        actorName: req.user.fullName,
        actorRole: 'admin',
        note: reason ? `${status}: ${String(reason).trim()}` : `Admin marked document as ${status}.`,
        timestamp: now,
      },
    ];

    // Update applicant verification status & notify applicant
    const applicant = (dbStore.collection.users || []).find((u) => u._id === doc.userId);
    if (applicant) {
      if (status === 'Replacement Required') {
        applicant.verificationStatus = 'replacement_required';
      }
      if (status === 'Rejected' || status === 'Replacement Required') {
        dbStore.collection.notifications.push({
          _id: uuidv4(),
          userId: applicant._id,
          title: `Document ${status}: ${doc.requirementName}`,
          message: `Admin reviewed "${doc.requirementName}" as ${status}. Reason: ${reason}`,
          type: 'warning',
          link: applicant.roles.includes('teacher') ? '/dashboard/teacher?tab=verification' : '/dashboard/business?tab=verification',
          isRead: false,
          createdAt: now,
        });
      }
    }

    dbStore.save();

    addDocAuditLog({
      userId: doc.userId,
      documentId: doc._id,
      requirementId: doc.requirementId,
      documentName: doc.requirementName,
      action: `DOC_STATUS_${status.toUpperCase().replace(/\s+/g, '_')}`,
      actorId: req.user._id,
      actorName: req.user.fullName,
      actorRole: 'admin',
      details: `Marked "${doc.requirementName}" as ${status}${reason ? ` (Reason: ${reason})` : ''}`,
    });

    const verification = applicant ? buildApplicantVerificationSummary(applicant) : null;

    return res.json({
      success: true,
      message: `Document marked as "${status}".`,
      document: sanitizeDocument(doc),
      verification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const decideApplicantApplication = async (req, res) => {
  try {
    const { userId } = req.params;
    const { decision, reason, targetRole } = req.body; // 'approve' | 'reject', optional targetRole: 'businessman' | 'entrepreneur' | 'teacher'

    const user = (dbStore.collection.users || []).find((u) => u._id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Applicant user not found.' });
    }

    const summary = buildApplicantVerificationSummary(user, null, targetRole || null);
    const now = new Date().toISOString();

    if (decision === 'approve') {
      if (!summary.summary.canApproveApplication) {
        return res.status(400).json({
          success: false,
          message: `Application approval blocked. All mandatory documents${targetRole ? ` for ${targetRole}` : ''} must be verified first. Unverified: ${summary.summary.unverifiedMandatoryNames.join(', ')}`,
          unverifiedMandatoryNames: summary.summary.unverifiedMandatoryNames,
        });
      }

      user.roleApprovals = user.roleApprovals || {};
      const rolesToApprove = targetRole ? [targetRole] : (user.roles || []);
      rolesToApprove.forEach((r) => {
        user.roleApprovals[r] = 'approved';
      });

      const userVerifiableRoles = (user.roles || []).filter((r) => ['teacher', 'businessman', 'entrepreneur'].includes(r));
      const allRolesApproved = userVerifiableRoles.every((r) => user.roleApprovals[r] === 'approved');

      user.status = 'active';
      user.verificationStatus = allRolesApproved ? 'approved' : 'partially_approved';
      user.rejectionReason = undefined;
      user.verifiedAt = now;
      user.verifiedBy = req.user.fullName;
      user.updatedAt = now;

      // Update matching businesses
      const matchingBusinesses = (dbStore.collection.businesses || []).filter(
        (b) => b.ownerId === user._id && (!targetRole || b.roleType === targetRole)
      );
      matchingBusinesses.forEach((b) => {
        b.verificationStatus = 'approved';
        b.rejectionReason = undefined;
        b.updatedAt = now;
      });

      dbStore.collection.notifications.push({
        _id: uuidv4(),
        userId: user._id,
        title: targetRole ? `${targetRole.charAt(0).toUpperCase() + targetRole.slice(1)} Verification Approved!` : 'Application Approved! Welcome to Business Hub',
        message: targetRole
          ? `Your ${targetRole} application documents have been verified and approved.`
          : 'All your submitted documents have been verified and your account is now active.',
        type: 'success',
        link: user.roles.includes('teacher') ? '/dashboard/teacher' : '/dashboard/business',
        isRead: false,
        createdAt: now,
      });

      dbStore.save();

      addDocAuditLog({
        userId: user._id,
        action: 'APPLICATION_APPROVED',
        actorId: req.user._id,
        actorName: req.user.fullName,
        actorRole: 'admin',
        details: `Approved ${targetRole ? `role "${targetRole}" for` : ''} applicant ${user.fullName} after verifying all ${summary.summary.totalMandatory} mandatory documents.`,
      });

      const { password, ...safeUser } = user;
      return res.json({
        success: true,
        message: `Application for ${user.fullName} ${targetRole ? `(${targetRole}) ` : ''}approved successfully.`,
        user: safeUser,
        verification: buildApplicantVerificationSummary(user),
      });
    }

    if (decision === 'reject') {
      if (!reason || !String(reason).trim()) {
        return res.status(400).json({ success: false, message: 'A rejection reason is required.' });
      }

      user.roleApprovals = user.roleApprovals || {};
      if (targetRole) {
        user.roleApprovals[targetRole] = 'rejected';
      } else {
        (user.roles || []).forEach((r) => {
          user.roleApprovals[r] = 'rejected';
        });
      }

      const userVerifiableRoles = (user.roles || []).filter((r) => ['teacher', 'businessman', 'entrepreneur'].includes(r));
      const allRolesRejected = userVerifiableRoles.every((r) => user.roleApprovals[r] === 'rejected');

      if (allRolesRejected) {
        user.verificationStatus = 'rejected';
      }
      user.rejectionReason = String(reason).trim();
      user.updatedAt = now;

      // Update matching businesses
      const matchingBusinesses = (dbStore.collection.businesses || []).filter(
        (b) => b.ownerId === user._id && (!targetRole || b.roleType === targetRole)
      );
      matchingBusinesses.forEach((b) => {
        b.verificationStatus = 'rejected';
        b.rejectionReason = String(reason).trim();
        b.updatedAt = now;
      });

      dbStore.collection.notifications.push({
        _id: uuidv4(),
        userId: user._id,
        title: targetRole ? `${targetRole.charAt(0).toUpperCase() + targetRole.slice(1)} Verification Rejected` : 'Application Verification Rejected',
        message: `Your ${targetRole ? `${targetRole} ` : ''}application was not approved. Reason: ${String(reason).trim()}`,
        type: 'warning',
        link: user.roles.includes('teacher') ? '/dashboard/teacher?tab=verification' : '/dashboard/business?tab=verification',
        isRead: false,
        createdAt: now,
      });

      dbStore.save();

      addDocAuditLog({
        userId: user._id,
        action: 'APPLICATION_REJECTED',
        actorId: req.user._id,
        actorName: req.user.fullName,
        actorRole: 'admin',
        details: `Rejected ${targetRole ? `role "${targetRole}" for ` : ''}applicant ${user.fullName}. Reason: ${reason}`,
      });

      const { password, ...safeUser } = user;
      return res.json({
        success: true,
        message: `Application for ${user.fullName} ${targetRole ? `(${targetRole}) ` : ''}marked as rejected.`,
        user: safeUser,
        verification: buildApplicantVerificationSummary(user),
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid decision. Use "approve" or "reject".' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
