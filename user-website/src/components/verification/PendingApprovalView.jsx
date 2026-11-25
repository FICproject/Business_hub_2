import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { documentsApi, authApi } from '../../services/api';
import { updateUser, logout } from '../../store';
import { DocumentVerificationPanel } from '../verification/DocumentVerificationPanel';

export const PendingApprovalView = ({ role = 'teacher' }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isTeacher = role === 'teacher' || user?.roles?.includes('teacher');
  const isEntrepreneur = role === 'entrepreneur' || user?.roles?.includes('entrepreneur');
  const isBusinessman = role === 'businessman' || user?.roles?.includes('businessman');

  const roleLabel = isTeacher
    ? 'Teacher Workspace'
    : isEntrepreneur
    ? 'Entrepreneur Hub'
    : 'Business Portal';

  const roleIcon = isTeacher ? GraduationCap : Building2;
  const RoleIcon = roleIcon;

  const loadChecklist = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const [checklistRes, meRes] = await Promise.all([
        documentsApi.getMyChecklist(),
        authApi.getMe().catch(() => null),
      ]);

      if (checklistRes.data?.success) {
        setChecklistData(checklistRes.data);
      }
      if (meRes?.data?.success && meRes.data.user) {
        dispatch(updateUser(meRes.data.user));
      }
    } catch (err) {
      console.error('Checklist load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadChecklist();
  }, [role]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  const status = user?.verificationStatus || 'pending_approval';
  const isRejected = status === 'rejected';
  const isReplacementRequired = status === 'replacement_required';

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-6 animate-in fade-in duration-300">
      {/* Top Banner & Status Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white p-6 sm:p-10 shadow-xl border border-navy-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <RoleIcon className="w-4 h-4" />
              <span>{roleLabel} Gated</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isRejected
                ? 'Application Needs Attention / Rejected'
                : isReplacementRequired
                ? 'Document Replacement Requested by Admin'
                : 'Application Pending Admin Verification'}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {isRejected
                ? 'An administrator reviewed your application and noted issues with your submission. Please review the notes below and update your documents.'
                : isReplacementRequired
                ? 'One or more of your submitted documents requires replacement. Upload the corrected files below so Admin can complete verification and grant full dashboard access.'
                : 'Welcome to Business Hub. Your application and mandatory verification documents are currently undergoing review by our compliance team. The dashboard features will automatically unlock once Admin approves your account.'}
            </p>

            {user?.rejectionReason && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
                <span className="font-bold text-rose-300 uppercase block mb-1">Admin Note:</span>
                {user.rejectionReason}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => loadChecklist(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Checking Status...' : 'Check Approval Status'}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Progress & Verification Stats */}
      {checklistData?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Verification Status</p>
              <p className="text-sm font-extrabold text-navy-950 capitalize">
                {status.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Mandatory Documents</p>
              <p className="text-sm font-extrabold text-navy-950">
                {checklistData.summary.verifiedMandatory} of {checklistData.summary.totalMandatory} Verified
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Supported Format</p>
              <p className="text-sm font-extrabold text-navy-950">
                PDF, JPG, JPEG, PNG (5 MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Document Verification Center */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-navy-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Document Verification & Compliance Checklist
            </h2>
            <p className="text-xs text-slate-500">
              Upload any requested replacement files directly here. Supported formats include PDF and images up to 5 MB.
            </p>
          </div>
        </div>

        {checklistData ? (
          <DocumentVerificationPanel
            checklistData={checklistData}
            onChecklistUpdated={(updated) => setChecklistData(updated)}
            roles={user?.roles || [role]}
            isPostSubmission={true}
          />
        ) : loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            <span>Loading verification checklist...</span>
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-xs">
            No document checklist found. Please check back later or contact admin.
          </div>
        )}
      </div>
    </div>
  );
};
