import React, { useState } from 'react';
import {
  Upload,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { documentsApi } from '../../services/api';
import { DocumentPreviewModal } from './DocumentPreviewModal';

const STATUS_BADGE = {
  'Not Uploaded': 'bg-slate-100 text-slate-600 border-slate-200',
  Uploaded: 'bg-sky-50 text-sky-700 border-sky-200',
  'Under Verification': 'bg-amber-50 text-amber-700 border-amber-200',
  Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  'Replacement Required': 'bg-orange-50 text-orange-700 border-orange-200',
};

export const DocumentVerificationPanel = ({
  checklistData,
  customToken = null,
  onChecklistUpdated,
  roles = [],
  isPostSubmission = false,
}) => {
  const [uploadProgressMap, setUploadProgressMap] = useState({});
  const [uploadingMap, setUploadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);

  if (!checklistData) return null;

  const { mandatorySlots = [], optionalSlots = [], applicationContext = {}, summary = {} } = checklistData;

  const isTeacher = roles.includes('teacher');
  const isEntrepreneur = roles.includes('entrepreneur');

  const handleContextToggle = async (patch) => {
    try {
      setContextLoading(true);
      const res = await documentsApi.updateContext(patch, customToken);
      if (res.data?.success && onChecklistUpdated) {
        onChecklistUpdated(res.data);
      }
    } catch (err) {
      console.error('Context update error:', err);
    } finally {
      setContextLoading(false);
    }
  };

  const handleFileSelect = async (requirement, file) => {
    if (!file) return;
    setErrorMap((prev) => ({ ...prev, [requirement.id]: null }));

    // Client-side pre-validation before upload
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedFormats = (requirement.allowedFormats || ['pdf', 'jpg', 'jpeg', 'png']).map((f) => f.toLowerCase());
    if (!allowedFormats.includes(ext)) {
      setErrorMap((prev) => ({
        ...prev,
        [requirement.id]: `Unsupported file format ".${ext}". Allowed: ${allowedFormats.join(', ').toUpperCase()}.`,
      }));
      return;
    }

    const maxBytes = (requirement.maxSizeMB || 5) * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMap((prev) => ({
        ...prev,
        [requirement.id]: `File too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum limit is ${requirement.maxSizeMB || 5} MB.`,
      }));
      return;
    }

    try {
      setUploadingMap((prev) => ({ ...prev, [requirement.id]: true }));
      setUploadProgressMap((prev) => ({ ...prev, [requirement.id]: 0 }));

      const res = await documentsApi.uploadDocument(requirement.id, file, {
        customToken,
        onUploadProgress: (evt) => {
          if (evt.total) {
            const pct = Math.round((evt.loaded * 100) / evt.total);
            setUploadProgressMap((prev) => ({ ...prev, [requirement.id]: pct }));
          }
        },
      });

      if (res.data?.success && onChecklistUpdated) {
        onChecklistUpdated(res.data);
      }
    } catch (err) {
      setErrorMap((prev) => ({
        ...prev,
        [requirement.id]: err.response?.data?.message || 'Upload failed. Please verify file format and size.',
      }));
    } finally {
      setUploadingMap((prev) => ({ ...prev, [requirement.id]: false }));
    }
  };

  const handleRemove = async (doc, reqId) => {
    try {
      setErrorMap((prev) => ({ ...prev, [reqId]: null }));
      const res = await documentsApi.removeDocument(doc._id, customToken);
      if (res.data?.success && onChecklistUpdated) {
        onChecklistUpdated(res.data);
      }
    } catch (err) {
      setErrorMap((prev) => ({
        ...prev,
        [reqId]: err.response?.data?.message || 'Could not remove document.',
      }));
    }
  };

  const handlePreview = async (doc) => {
    try {
      const res = await documentsApi.getAccessToken(doc._id, false, customToken);
      if (res.data?.success) {
        setPreviewData({
          ...res.data,
          docId: doc._id,
          requirementName: doc.requirementName,
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not open secure document preview.');
    }
  };

  const handleDownload = async (docId) => {
    try {
      const res = await documentsApi.getAccessToken(docId, true, customToken);
      if (res.data?.success && res.data.url) {
        window.open(res.data.url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Download link failed.');
    }
  };

  const renderSlotCard = (slot, isMandatory) => {
    const { requirement, document: doc, status } = slot;
    const isUploading = Boolean(uploadingMap[requirement.id]);
    const progress = uploadProgressMap[requirement.id] || 0;
    const slotError = errorMap[requirement.id];
    const allowedStr = (requirement.allowedFormats || ['pdf', 'jpg', 'jpeg', 'png'])
      .map((f) => `.${f}`)
      .join(',');
    const canModify = !doc || (doc.status !== 'Verified' && doc.status !== 'Under Verification');
    const canReplacePostSubmit = doc && (doc.status === 'Rejected' || doc.status === 'Replacement Required' || doc.status === 'Uploaded');

    return (
      <div
        key={requirement.id}
        className={`rounded-2xl border p-4 transition-all space-y-3 ${
          status === 'Verified'
            ? 'border-emerald-200 bg-emerald-50/30'
            : status === 'Rejected' || status === 'Replacement Required'
            ? 'border-rose-200 bg-rose-50/40'
            : doc
            ? 'border-teal-200 bg-teal-50/20'
            : isMandatory
            ? 'border-slate-200 bg-white'
            : 'border-slate-200/80 bg-slate-50/50'
        }`}
      >
        {/* Top Row: Document Name + Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-bold text-slate-900">{requirement.name}</span>
              {roles.length > 1 && requirement.role && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {requirement.role === 'businessman' ? 'Businessman' : requirement.role === 'entrepreneur' ? 'Entrepreneur' : requirement.role}
                </span>
              )}
              {isMandatory ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                  Mandatory
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                  Optional
                </span>
              )}
              {requirement.isConditional && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Conditional
                </span>
              )}
            </div>
            {requirement.description && (
              <p className="text-xs text-slate-500">{requirement.description}</p>
            )}
            <p className="text-[11px] text-slate-400">
              Accepted formats: <strong>{(requirement.allowedFormats || ['pdf', 'jpg', 'jpeg', 'png']).join(', ').toUpperCase()}</strong> • Max size: <strong>{requirement.maxSizeMB || 5} MB</strong>
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 self-start ${
              STATUS_BADGE[status] || STATUS_BADGE['Not Uploaded']
            }`}
          >
            {status === 'Verified' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {(status === 'Rejected' || status === 'Replacement Required') && <AlertTriangle className="w-3.5 h-3.5" />}
            {status === 'Under Verification' && <Clock className="w-3.5 h-3.5" />}
            {status}
          </span>
        </div>

        {/* Rejection / Replacement Notice */}
        {(doc?.rejectionReason || doc?.replacementNote) && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {status === 'Replacement Required' ? 'Replacement Requested by Admin:' : 'Rejection Reason:'}
              </p>
              <p>{doc.replacementNote || doc.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Slot Error */}
        {slotError && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{slotError}</span>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-teal-700">
              <span>Encrypting & uploading securely...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Uploaded File Details + Actions OR Upload Field */}
        {doc ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{doc.originalName}</p>
                <p className="text-[10.5px] text-slate-400">
                  {(doc.sizeBytes / 1024).toFixed(1)} KB • Uploaded {new Date(doc.uploadedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handlePreview(doc)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              {(!isPostSubmission ? canModify : canReplacePostSubmit) && (
                <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold cursor-pointer transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                  <input
                    type="file"
                    accept={allowedStr}
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = '';
                      handleFileSelect(requirement, f);
                    }}
                  />
                </label>
              )}

              {!isPostSubmission && canModify && (
                <button
                  type="button"
                  onClick={() => handleRemove(doc, requirement.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}

              {doc.status === 'Verified' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  <Lock className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        ) : (
          <label className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50/70 hover:bg-teal-50/30 cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-600 shadow-xs">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Click to select document file</p>
                <p className="text-[11px] text-slate-500">
                  {(requirement.allowedFormats || ['pdf', 'jpg', 'jpeg', 'png']).join(', ').toUpperCase()} up to {requirement.maxSizeMB || 5} MB
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs">
              Upload File
            </span>
            <input
              type="file"
              accept={allowedStr}
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                handleFileSelect(requirement, f);
              }}
            />
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Conditional Role Rules Bar */}
      {(isTeacher || isEntrepreneur) && !isPostSubmission && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-950 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Role & Registration Applicability</span>
          </div>

          {isTeacher && (
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                disabled={contextLoading}
                checked={Boolean(applicationContext.hasTeachingQualification)}
                onChange={(e) => handleContextToggle({ hasTeachingQualification: e.target.checked })}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span>
                <strong>Teaching Qualification Certificate applicable:</strong> I hold a B.Ed, Teaching Diploma, or recognized educator license.
              </span>
            </label>
          )}

          {isEntrepreneur && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={contextLoading}
                  onClick={() => handleContextToggle({ isStartupRegistered: true })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    applicationContext.isStartupRegistered
                      ? 'border-teal-600 bg-white shadow-xs'
                      : 'border-slate-200 bg-white/60 hover:bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">Registered Startup / Business</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Requires Business / Startup Registration Proof
                  </p>
                </button>

                <button
                  type="button"
                  disabled={contextLoading}
                  onClick={() => handleContextToggle({ isStartupRegistered: false })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    !applicationContext.isStartupRegistered
                      ? 'border-teal-600 bg-white shadow-xs'
                      : 'border-slate-200 bg-white/60 hover:bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">Unregistered Startup (Pre-registration)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Submit declaration + Startup Details Document (No incorporation required)
                  </p>
                </button>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={contextLoading}
                  checked={Boolean(applicationContext.hasBusinessAddress)}
                  onChange={(e) => handleContextToggle({ hasBusinessAddress: e.target.checked })}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>
                  <strong>Business Address Proof applicable:</strong> My startup operates from a dedicated commercial or leased business address.
                </span>
              </label>

              {!applicationContext.isStartupRegistered && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <p className="text-xs font-bold text-amber-900">Unregistered Startup Declaration</p>
                  <label className="flex items-start gap-2.5 text-xs text-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={contextLoading}
                      checked={Boolean(applicationContext.unregisteredDeclarationAccepted)}
                      onChange={(e) => handleContextToggle({ unregisteredDeclarationAccepted: e.target.checked })}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>
                      I declare that my startup/business is not yet formally registered, and the uploaded Startup / Business Details Document accurately describes my business idea, products, or services.
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <div>
            <p className="text-xs font-bold">
              Mandatory Documents: {summary.uploadedMandatory || 0} / {summary.totalMandatory || 0} Uploaded
              {isPostSubmission ? ` • ${summary.verifiedMandatory || 0} Verified` : ''}
            </p>
            <p className="text-[11px] text-slate-400">
              All documents are encrypted in private cloud storage with time-limited Admin review access.
            </p>
          </div>
        </div>
        {summary.canSubmitApplication ? (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
            Ready to Submit ✓
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            {summary.missingMandatoryCount || 0} Mandatory Pending
          </span>
        )}
      </div>

      {/* 1. Mandatory Documents Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Mandatory Documents ({mandatorySlots.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Required for Admin Approval</span>
        </div>
        <div className="space-y-3">
          {mandatorySlots.map((slot) => renderSlotCard(slot, true))}
        </div>
      </div>

      {/* 2. Optional Documents Section */}
      {optionalSlots.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Optional / Supporting Documents ({optionalSlots.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Recommended to speed up verification</span>
          </div>
          <div className="space-y-3">
            {optionalSlots.map((slot) => renderSlotCard(slot, false))}
          </div>
        </div>
      )}

      {/* Secure Preview Modal */}
      <DocumentPreviewModal
        previewData={previewData}
        onClose={() => setPreviewData(null)}
        onDownload={() => previewData?.docId && handleDownload(previewData.docId)}
      />
    </div>
  );
};
