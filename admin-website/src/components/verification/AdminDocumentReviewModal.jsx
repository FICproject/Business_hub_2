import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertTriangle,
  History,
  UserCheck,
  Building2,
  Lock,
} from 'lucide-react';
import { adminApi } from '../../services/api';

const STATUS_STYLE = {
  'Not Uploaded': 'bg-slate-100 text-slate-600 border-slate-200',
  Uploaded: 'bg-sky-50 text-sky-700 border-sky-200',
  'Under Verification': 'bg-amber-50 text-amber-700 border-amber-200',
  Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  'Replacement Required': 'bg-orange-50 text-orange-700 border-orange-200',
};

export const AdminDocumentReviewModal = ({ userId, onClose, onDecisionComplete }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [reasonTarget, setReasonTarget] = useState(null); // { docId, status: 'Rejected' | 'Replacement Required', name }
  const [reasonText, setReasonText] = useState('');
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [showAllAudit, setShowAllAudit] = useState(false);
  const [appRejectOpen, setAppRejectOpen] = useState(false);
  const [appRejectReason, setAppRejectReason] = useState('');
  const [toast, setToast] = useState(null);

  const loadApplicantDocs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getApplicantDocuments(userId);
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Failed to load applicant documents.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadApplicantDocs();
  }, [userId]);

  const handlePreview = async (doc) => {
    try {
      const res = await adminApi.getDocumentAccessToken(doc._id, false);
      if (res.data?.success) {
        setPreviewDoc({
          ...res.data,
          docId: doc._id,
          requirementName: doc.requirementName,
        });
        loadApplicantDocs(); // refresh audit logs
      }
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Could not generate secure preview link.' });
    }
  };

  const handleDownload = async (doc) => {
    try {
      const res = await adminApi.getDocumentAccessToken(doc._id, true);
      if (res.data?.success && res.data.url) {
        window.open(res.data.url, '_blank', 'noopener,noreferrer');
        loadApplicantDocs();
      }
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Could not generate download link.' });
    }
  };

  const handleReviewStatus = async (docId, status, reason = '') => {
    try {
      setActionLoading(true);
      const res = await adminApi.reviewDocument(docId, status, reason);
      if (res.data?.success) {
        setToast({ type: 'success', text: res.data.message });
        setReasonTarget(null);
        setReasonText('');
        await loadApplicantDocs();
        if (onDecisionComplete) onDecisionComplete();
      }
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Failed to update document status.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplicationDecision = async (decision, targetRole = null) => {
    if (decision === 'reject' && !appRejectReason.trim()) {
      setToast({ type: 'error', text: 'Please enter a rejection reason for the application.' });
      return;
    }
    try {
      setActionLoading(true);
      const res = await adminApi.decideApplicantApplication(
        userId,
        decision,
        decision === 'reject' ? appRejectReason : undefined,
        targetRole || undefined
      );
      if (res.data?.success) {
        setToast({ type: 'success', text: res.data.message });
        setAppRejectOpen(false);
        await loadApplicantDocs();
        if (onDecisionComplete) onDecisionComplete();
      }
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Application action failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const verification = data?.verification;
  const user = data?.user;
  const business = data?.business;
  const summary = verification?.summary || {};
  const canApprove = Boolean(summary.canApproveApplication);

  const renderDocSlot = (slot, isMandatory) => {
    const { requirement, document: doc, status } = slot;
    const isExpanded = expandedHistoryId === doc?._id;

    return (
      <div
        key={requirement.id}
        className={`rounded-2xl border p-4 space-y-3 ${
          status === 'Verified'
            ? 'border-emerald-200 bg-emerald-50/30'
            : status === 'Rejected' || status === 'Replacement Required'
            ? 'border-rose-200 bg-rose-50/30'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{requirement.name}</span>
              {requirement.role && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {requirement.role === 'businessman' ? 'Businessman' : requirement.role === 'entrepreneur' ? 'Entrepreneur' : requirement.role}
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  isMandatory
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isMandatory ? 'Mandatory' : 'Optional'}
              </span>
              {requirement.isConditional && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Conditional
                </span>
              )}
            </div>
            {requirement.description && (
              <p className="text-[11px] text-slate-500 mt-0.5">{requirement.description}</p>
            )}
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 self-start ${
              STATUS_STYLE[status] || STATUS_STYLE['Not Uploaded']
            }`}
          >
            {status}
          </span>
        </div>

        {doc ? (
          <div className="space-y-3">
            {/* File bar + Preview/Download */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{doc.originalName}</p>
                  <p className="text-[10.5px] text-slate-400">
                    {(doc.sizeBytes / 1024).toFixed(1)} KB • {doc.mimeType} • Uploaded{' '}
                    {new Date(doc.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handlePreview(doc)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedHistoryId(isExpanded ? null : doc._id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold"
                  title="View upload & verification history"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History ({doc.history?.length || 0})</span>
                </button>
              </div>
            </div>

            {/* Active Rejection/Replacement Note */}
            {(doc.rejectionReason || doc.replacementNote) && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                <strong>{status === 'Replacement Required' ? 'Replacement Instruction:' : 'Rejection Reason:'}</strong>{' '}
                {doc.replacementNote || doc.rejectionReason}
              </div>
            )}

            {/* Admin Verification Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {status !== 'Under Verification' && status !== 'Verified' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleReviewStatus(doc._id, 'Under Verification')}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold"
                >
                  Mark Under Verification
                </button>
              )}
              {status !== 'Verified' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleReviewStatus(doc._id, 'Verified')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Verified</span>
                </button>
              )}
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setReasonTarget({ docId: doc._id, status: 'Replacement Required', name: requirement.name });
                  setReasonText('');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Request Replacement</span>
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setReasonTarget({ docId: doc._id, status: 'Rejected', name: requirement.name });
                  setReasonText('');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Document</span>
              </button>
            </div>

            {/* Inline Reason Box if Reject / Request Replacement selected for this doc */}
            {reasonTarget?.docId === doc._id && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Enter reason for marking "{reasonTarget.name}" as {reasonTarget.status}:
                </label>
                <textarea
                  rows={2}
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  placeholder="e.g. Document image is blurry / expired / name does not match ID..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReasonTarget(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || !reasonText.trim()}
                    onClick={() => handleReviewStatus(doc._id, reasonTarget.status, reasonText)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold"
                  >
                    Confirm {reasonTarget.status}
                  </button>
                </div>
              </div>
            )}

            {/* Document History Timeline */}
            {isExpanded && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Document Audit History</p>
                <div className="space-y-2 border-l-2 border-indigo-200 pl-3 ml-1">
                  {(doc.history || []).map((h, i) => (
                    <div key={i} className="text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{h.status}</span>
                        <span className="text-slate-400">{new Date(h.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600">{h.note}</p>
                      <span className="text-[10px] text-slate-400">Actor: {h.actorName} ({h.actorRole})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Applicant has not uploaded this document yet.</p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#121226] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">
                Document Verification Review {user ? `— ${user.fullName}` : ''}
              </h2>
              <p className="text-xs text-slate-300">
                {user?.email} • Roles: {(user?.roles || []).join(', ')} • Status: {user?.verificationStatus || user?.status}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <span>Loading encrypted verification documents...</span>
            </div>
          ) : (
            <>
              {/* Applicant & Business Context Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Applicant Profile</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{user?.fullName}</p>
                  <p className="text-slate-500">{user?.mobile} • {user?.email}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Application Context</span>
                  {user?.roles?.includes('entrepreneur') && (
                    <div className="mt-1 space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                        verification?.applicationContext?.isStartupRegistered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {verification?.applicationContext?.isStartupRegistered
                          ? 'Registered Startup'
                          : 'Unregistered Startup (Declaration Provided)'}
                      </span>
                      {verification?.applicationContext?.unregisteredDeclarationAccepted && (
                        <p className="text-[11px] text-emerald-700 font-medium">✓ Unregistered Startup Declaration Signed</p>
                      )}
                    </div>
                  )}
                  {user?.roles?.includes('teacher') && (
                    <p className="mt-1 font-medium text-slate-700">
                      Teaching Qualification Applicable: {verification?.applicationContext?.hasTeachingQualification ? 'Yes' : 'No'}
                    </p>
                  )}
                  {business && (
                    <p className="mt-1 font-medium text-slate-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      {business.businessName}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Mandatory Verification Progress</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {summary.verifiedMandatory || 0} / {summary.totalMandatory || 0} Verified
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {canApprove ? 'All mandatory docs verified — Ready to Approve!' : 'Approval blocked until all mandatory docs are Verified.'}
                  </p>
                </div>
              </div>

              {/* Mandatory Documents */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Mandatory Documents ({verification?.mandatorySlots?.length || 0})
                </h3>
                <div className="space-y-3">
                  {(verification?.mandatorySlots || []).map((slot) => renderDocSlot(slot, true))}
                </div>
              </div>

              {/* Optional Documents */}
              {(verification?.optionalSlots?.length || 0) > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Optional / Supporting Documents ({verification?.optionalSlots?.length})
                  </h3>
                  <div className="space-y-3">
                    {verification.optionalSlots.map((slot) => renderDocSlot(slot, false))}
                  </div>
                </div>
              )}

              {/* Full Applicant Document Audit Log */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowAllAudit(!showAllAudit)}
                  className="w-full flex items-center justify-between text-xs font-extrabold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" />
                    Full Document Audit Trail ({data?.auditLogs?.length || 0} Events)
                  </span>
                  <span className="text-indigo-600">{showAllAudit ? 'Hide' : 'Show Log'}</span>
                </button>

                {showAllAudit && (
                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto text-[11px]">
                    {(data?.auditLogs || []).map((log) => (
                      <div key={log._id} className="py-2 flex items-start justify-between gap-4">
                        <div>
                          <span className="font-bold text-indigo-700">{log.action}</span>{' '}
                          <span className="text-slate-700">— {log.details}</span>
                          <p className="text-[10px] text-slate-400">
                            By {log.actorName} ({log.actorRole})
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Decision Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 space-y-3">
          {appRejectOpen && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={appRejectReason}
                onChange={(e) => setAppRejectReason(e.target.value)}
                placeholder="Enter overall application rejection reason..."
                className="flex-1 px-3 py-2 rounded-lg border border-rose-300 text-xs bg-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAppRejectOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleApplicationDecision('reject')}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {!canApprove && (
                <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  Approve Application is locked until all mandatory documents are Verified.
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAppRejectOpen(true)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs"
              >
                Reject Application
              </button>

              {/* Independent Role Approval Buttons */}
              {(user?.roles || []).filter((r) => ['businessman', 'entrepreneur', 'teacher'].includes(r)).map((r) => {
                const isRoleApproved = user?.roleApprovals?.[r] === 'approved';
                return (
                  <button
                    key={r}
                    type="button"
                    disabled={actionLoading || isRoleApproved}
                    onClick={() => handleApplicationDecision('approve', r)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isRoleApproved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>
                      {isRoleApproved ? `${r.toUpperCase()}: APPROVED ✓` : `Approve ${r.charAt(0).toUpperCase() + r.slice(1)}`}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                disabled={!canApprove || actionLoading || user?.status === 'active'}
                onClick={() => handleApplicationDecision('approve')}
                title={!canApprove ? 'Verify all mandatory documents first' : 'Approve applicant account'}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold text-xs shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {user?.status === 'active' ? 'Account Active' : 'Approve All Roles'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Inline Time-Limited Document Preview Lightbox */}
        {previewDoc && (
          <div className="fixed inset-0 z-[60] bg-slate-950/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{previewDoc.requirementName}</h4>
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure Signed Preview ({previewDoc.expiresInSeconds}s expiry) — {previewDoc.originalName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold"
                  >
                    Open Tab
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center overflow-auto min-h-[450px]">
                {previewDoc.mimeType === 'application/pdf' || previewDoc.originalName?.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={previewDoc.url}
                    title={previewDoc.originalName}
                    className="w-full h-[70vh] rounded-xl bg-white border border-slate-200"
                  />
                ) : (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.originalName}
                    className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-md bg-white"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
