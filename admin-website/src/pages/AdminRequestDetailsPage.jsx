import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Send,
  X,
  Check,
  Tag,
  DollarSign,
  Layers,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminRequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [matchingBusinesses, setMatchingBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Assignment Modal State
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const [reqRes, matchRes] = await Promise.all([
        adminApi.getServiceRequestById(id),
        adminApi.getMatchingBusinesses(id),
      ]);

      if (reqRes.data?.success) {
        setRequest(reqRes.data.request);
      }
      if (matchRes.data?.success) {
        setMatchingBusinesses(matchRes.data.matchingBusinesses || []);
      }
    } catch (err) {
      console.error('Failed to load request details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleOpenAssignModal = (business) => {
    setSelectedBusiness(business);
    setAssignmentNotes(
      `Assigned by Admin based on matching category (${business.category}) and service location (${request.location}).`
    );
    setShowConfirmModal(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedBusiness) return;
    try {
      setActionLoading(true);
      const res = await adminApi.assignBusinessToRequest(request._id, {
        businessId: selectedBusiness._id,
        notes: assignmentNotes,
      });

      if (res.data?.success) {
        setNotificationMsg({
          type: 'success',
          text: `Successfully assigned request to ${selectedBusiness.businessName}! Business Connection created.`,
        });
        setShowConfirmModal(false);
        fetchRequestDetails();
      } else {
        setNotificationMsg({
          type: 'error',
          text: res.data?.message || 'Assignment failed.',
        });
      }
    } catch (err) {
      setNotificationMsg({
        type: 'error',
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setActionLoading(true);
      const res = await adminApi.updateRequestStatus(request._id, newStatus, `Status updated to ${newStatus} by Admin.`);
      if (res.data?.success) {
        setNotificationMsg({
          type: 'success',
          text: `Request status updated to ${newStatus}.`,
        });
        fetchRequestDetails();
      }
    } catch (err) {
      setNotificationMsg({
        type: 'error',
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
        <span>Loading request details and business matching engine...</span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-16 text-center text-slate-500 space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Request Not Found</h2>
        <p className="text-sm">The requested service request ID could not be loaded.</p>
        <Link
          to="/requests"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121226] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-12">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/requests')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {request._id}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  request.requestType === 'material'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {request.requestType} Request
              </span>
              <span className="text-xs text-slate-400">• Created on {new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">{request.title}</h1>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          {request.status === 'new' && (
            <button
              onClick={() => handleUpdateStatus('under_review')}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Move to Under Review
            </button>
          )}
          {request.status === 'assigned' && (
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Assigned to {request.assignedBusinessName}
            </span>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {notificationMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notificationMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notificationMsg.text}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)}>
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
      )}

      {/* Main Grid: Details (Left) + Matching Businesses (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Request Details, Client Profile & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Requirement Specification */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Full Requirement Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Category</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{request.category}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Target Location</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {request.location}
                </p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Required Quantity</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{request.quantity || 'Not specified'}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Preferred Budget</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{request.budget || 'Open for quotes'}</p>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium">Detailed Requirement Description:</span>
              <p className="text-xs text-slate-700 leading-relaxed mt-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100 font-medium whitespace-pre-line">
                {request.description || 'No additional details provided by the client.'}
              </p>
            </div>

            {request.attachments && request.attachments.length > 0 && (
              <div>
                <span className="text-xs text-slate-400 font-medium">Uploaded Attachments & Site Photos:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {request.attachments.map((imgUrl, idx) => (
                    <a
                      key={idx}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-video block bg-slate-100"
                    >
                      <img src={imgUrl} alt="Attachment" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Client Profile Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Client / Requester Information</span>
            </h2>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold text-base flex items-center justify-center border border-indigo-100">
                {request.userName?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{request.userName}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {request.userEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {request.userMobile || 'No mobile provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Request Timeline & Audit History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Workflow Timeline & History</span>
            </h2>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {(request.timeline || []).map((t, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 capitalize">{t.status.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(t.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{t.note}</p>
                    <span className="text-[10px] text-slate-400 font-medium">By: {t.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Business Matching Engine */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Matching Approved Businesses</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scored by category relevance, verified status & location
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                {matchingBusinesses.length} Matches
              </span>
            </div>

            {matchingBusinesses.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <Building2 className="w-8 h-8 text-slate-300" />
                <span className="font-semibold text-slate-600">No matching approved businesses</span>
                <span className="text-slate-400">
                  No verified businesses found matching "{request.category}".
                </span>
                <Link
                  to="/businesses"
                  className="mt-2 text-indigo-600 hover:underline font-bold text-xs"
                >
                  Review Pending Businesses →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {matchingBusinesses.map((biz) => {
                  const isAlreadyAssigned = request.assignedBusinessId === biz._id;
                  return (
                    <div
                      key={biz._id}
                      className={`p-4 rounded-xl border transition-all ${
                        isAlreadyAssigned
                          ? 'border-indigo-500 bg-indigo-50/40'
                          : 'border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-sm">{biz.businessName}</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" title="Verified Approved Business" />
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">{biz.category}</span>
                        </div>

                        {/* Match Score Badge */}
                        <div className="text-right">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {biz.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{biz.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Owner: {biz.ownerName || 'Verified Principal'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{biz.phone || biz.email} (Admin Only)</span>
                        </div>
                      </div>

                      {biz.servicesOffered && biz.servicesOffered.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {biz.servicesOffered.slice(0, 3).map((srv, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>

                        {isAlreadyAssigned ? (
                          <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Currently Assigned
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenAssignModal(biz)}
                            className="px-3 py-1.5 rounded-lg bg-[#121226] text-white hover:bg-indigo-600 font-bold text-xs transition-colors shadow-xs"
                          >
                            Assign Business →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation & Assignment Modal */}
      {showConfirmModal && selectedBusiness && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Confirm Business Assignment</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Client Request:</span>
                <p className="font-bold text-slate-800 text-sm">{request.title}</p>
                <p className="text-slate-500">Client: {request.userName} ({request.location})</p>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                <span className="text-indigo-600 font-semibold uppercase text-[10px]">Selected Approved Business:</span>
                <p className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  {selectedBusiness.businessName}
                </p>
                <p className="text-slate-600">Category: {selectedBusiness.category} • Location: {selectedBusiness.location}</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Admin Assignment Notes & Instructions:
                </label>
                <textarea
                  rows={3}
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Add notes for the businessman or internal audit log..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                <strong>Workflow notice:</strong> Once confirmed, this will create a permanent Business Connection record, notify both the user and the businessman, and transition request status to <strong>Assigned</strong>.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm & Create Connection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminRequestDetailsPage;
