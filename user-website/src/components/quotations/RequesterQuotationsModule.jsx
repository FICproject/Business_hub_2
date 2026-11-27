import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  DollarSign,
  Calendar,
  MapPin,
  Package,
  Layers,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  ShieldCheck,
  Building2,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  X,
  FileCheck,
  Award,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { quotationsApi } from '../../services/api';

export const RequesterQuotationsModule = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Inspection
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [visibleQuotations, setVisibleQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const loadMyRequests = async () => {
    try {
      setLoading(true);
      const res = await quotationsApi.getMyRequests();
      if (res.data?.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('Error loading my quotation requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyRequests();
  }, []);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      let matchesTab = true;
      if (activeSubTab === 'all') matchesTab = true;
      else if (activeSubTab === 'new') matchesTab = req.status === 'new';
      else if (activeSubTab === 'under_review') matchesTab = req.status === 'under_review';
      else if (activeSubTab === 'sent_to_companies') matchesTab = req.status === 'sent_to_companies';
      else if (activeSubTab === 'quotations_received') matchesTab = req.status === 'quotations_received';
      else if (activeSubTab === 'pending_selection') matchesTab = req.status === 'pending_selection';
      else if (activeSubTab === 'selected') matchesTab = req.status === 'selected';
      else if (activeSubTab === 'in_progress') matchesTab = req.status === 'in_progress';
      else if (activeSubTab === 'completed') matchesTab = req.status === 'completed';
      else if (activeSubTab === 'cancelled')
        matchesTab = req.status === 'cancelled' || req.status === 'rejected';

      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          req._id?.toLowerCase().includes(q) ||
          req.title?.toLowerCase().includes(q) ||
          req.category?.toLowerCase().includes(q) ||
          req.location?.toLowerCase().includes(q);
      }

      return matchesTab && matchesSearch;
    });
  }, [requests, activeSubTab, searchQuery]);

  // Open details & load permitted quotations
  const handleOpenDetails = async (req) => {
    setSelectedRequest(req);
    setVisibleQuotations([]);

    try {
      setLoadingQuotations(true);
      const res = await quotationsApi.getVisibleQuotations(req._id);
      if (res.data?.success) {
        setVisibleQuotations(res.data.quotations || []);
      }
    } catch (err) {
      console.error('Error loading visible quotations:', err);
    } finally {
      setLoadingQuotations(false);
    }
  };

  // Select quotation (Mode B: Requester selection)
  const handleSelectQuotation = async (quotationId) => {
    if (!selectedRequest) return;
    if (
      !window.confirm(
        'Confirm selection of this quotation? Central Admin will finalize the verified business connection.'
      )
    )
      return;

    try {
      setActionLoading(true);
      const res = await quotationsApi.selectQuotation(selectedRequest._id, quotationId);
      if (res.data?.success) {
        setFeedbackMsg({
          type: 'success',
          text: 'Quotation selected successfully! Admin has been notified to confirm the connection.',
        });
        setSelectedRequest(res.data.request);
        await loadMyRequests();
      } else {
        alert(res.data?.message || 'Failed to select quotation.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to select quotation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Accept / Decline single quotation (Mode A: Admin selected)
  const handleDecision = async (decision) => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      const res = await quotationsApi.submitDecision(selectedRequest._id, decision);
      if (res.data?.success) {
        setFeedbackMsg({
          type: 'success',
          text:
            decision === 'accept'
              ? 'Quotation accepted! Verified business connection initiated.'
              : 'Quotation declined. Central Admin will review next steps.',
        });
        setSelectedRequest(res.data.request);
        await loadMyRequests();
      } else {
        alert(res.data?.message || 'Failed to submit decision.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit decision.');
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel Request
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this quotation request?')) return;
    try {
      setActionLoading(true);
      const res = await quotationsApi.cancelRequest(requestId);
      if (res.data?.success) {
        setFeedbackMsg({ type: 'info', text: 'Quotation request cancelled.' });
        if (selectedRequest?._id === requestId) {
          setSelectedRequest(null);
        }
        await loadMyRequests();
      } else {
        alert(res.data?.message || 'Failed to cancel request.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
            <Sparkles className="w-3 h-3" />
            New Request
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" />
            Admin Reviewing
          </span>
        );
      case 'sent_to_companies':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
            <Send className="w-3 h-3" />
            Sent to Companies
          </span>
        );
      case 'quotations_received':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
            <Layers className="w-3 h-3" />
            Quotations Received
          </span>
        );
      case 'pending_selection':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3" />
            Awaiting Selection
          </span>
        );
      case 'selected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            <Award className="w-3 h-3" />
            Quotation Selected
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
            <RefreshCw className="w-3 h-3" />
            Order In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" />
            Cancelled / Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-navy-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>My Quotation Requests</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track quotation requests, compare competitive proposals from verified companies, and finalize deals.
          </p>
        </div>

        <button
          onClick={loadMyRequests}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Sub-tabs Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-slate-100 pb-3">
        {[
          { key: 'all', label: 'All Requests', count: requests.length },
          { key: 'new', label: 'New', count: requests.filter((r) => r.status === 'new').length },
          {
            key: 'under_review',
            label: 'Under Review',
            count: requests.filter((r) => r.status === 'under_review').length,
          },
          {
            key: 'sent_to_companies',
            label: 'Sent to Companies',
            count: requests.filter((r) => r.status === 'sent_to_companies').length,
          },
          {
            key: 'quotations_received',
            label: 'Quotations Received',
            count: requests.filter((r) => r.status === 'quotations_received').length,
          },
          {
            key: 'pending_selection',
            label: 'Awaiting Selection',
            count: requests.filter((r) => r.status === 'pending_selection').length,
          },
          {
            key: 'selected',
            label: 'Selected',
            count: requests.filter((r) => r.status === 'selected').length,
          },
          {
            key: 'in_progress',
            label: 'In Progress',
            count: requests.filter((r) => r.status === 'in_progress').length,
          },
          {
            key: 'completed',
            label: 'Completed',
            count: requests.filter((r) => r.status === 'completed').length,
          },
          {
            key: 'cancelled',
            label: 'Cancelled',
            count: requests.filter((r) => r.status === 'cancelled' || r.status === 'rejected').length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeSubTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Request ID, title, or location..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2 font-bold">Loading your quotation requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <p className="text-sm font-bold text-navy-950">No quotation requests found</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse products or services in the Marketplace and click &quot;Request Quotation&quot; to initiate a request.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="rounded-2xl border border-slate-200/90 p-5 bg-white hover:border-blue-300 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">
                    {req._id}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {req.listingType === 'service' ? 'Service' : 'Product'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{req.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(req.status)}
                  <span className="text-[11px] text-slate-400">
                    Submitted: {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                  <h3 className="text-base font-extrabold text-navy-950 leading-snug">{req.title}</h3>

                  {req.specifications && (
                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-700 font-bold">Specs: </strong>
                      {req.specifications}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                      <span>Quantity: </span>
                      <strong className="text-navy-950">
                        {req.quantity} {req.unit || 'Units'}
                      </strong>
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Location: </span>
                      <strong className="text-navy-950">{req.location}</strong>
                    </span>

                    {req.expectedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Expected: </span>
                        <strong className="text-navy-950">{req.expectedDate}</strong>
                      </span>
                    )}

                    {req.budget && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                        <span>Budget: </span>
                        <strong className="text-navy-950">{req.budget}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Coordination Box */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Coordination Mode
                    </span>
                    <span className="text-xs font-bold text-navy-950 block mt-0.5">
                      {req.requesterCanViewAllQuotations
                        ? 'Requester Comparison & Direct Selection'
                        : 'Central Admin Curated Selection'}
                    </span>
                  </div>

                  {req.selectedQuotation && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                        Selected Quotation
                      </span>
                      <span className="text-base font-black text-emerald-800">
                        ₹{req.selectedQuotation.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDetails(req)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Track Request &amp; View Quotations</span>
                  </button>

                  {(req.status === 'new' || req.status === 'under_review') && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleCancelRequest(req._id)}
                      className="px-3 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          MODAL: REQUEST DETAILS, TIMELINE & QUOTATION COMPARISON
      ========================================================================= */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto text-xs">
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded text-xs">
                    {selectedRequest._id}
                  </span>
                  <h2 className="text-lg font-black text-navy-950">{selectedRequest.title}</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Category: {selectedRequest.category} | Created:{' '}
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(selectedRequest.status)}
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-navy-950 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Timeline Progress Tracker */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-3">
                Quotation Workflow Status
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                {[
                  { key: 'new', label: '1. Submitted' },
                  { key: 'under_review', label: '2. Admin Review' },
                  { key: 'sent_to_companies', label: '3. Sent to Companies' },
                  { key: 'quotations_received', label: '4. Quotes Received' },
                  { key: 'selected', label: '5. Selection' },
                  { key: 'completed', label: '6. Confirmed' },
                ].map((step, idx) => {
                  const isCurrent = selectedRequest.status === step.key;
                  return (
                    <div key={step.key} className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>{step.label}</span>
                      </div>
                      {idx < 5 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Summary Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/60 border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Quantity</span>
                <span className="font-extrabold text-navy-950">
                  {selectedRequest.quantity} {selectedRequest.unit || 'Units'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
                <span className="font-extrabold text-navy-950">{selectedRequest.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Expected Date</span>
                <span className="font-extrabold text-navy-950">
                  {selectedRequest.expectedDate || 'Flexible'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget</span>
                <span className="font-extrabold text-navy-950">
                  {selectedRequest.budget || 'Not specified'}
                </span>
              </div>
            </div>

            {selectedRequest.specifications && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Required Specifications
                </span>
                <p className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedRequest.specifications}
                </p>
              </div>
            )}

            {/* =========================================================================
                QUOTATIONS COMPARISON & SELECTION SECTION
            ========================================================================= */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-navy-950 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span>Commercial Quotations &amp; Proposals</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedRequest.requesterCanViewAllQuotations
                      ? 'Admin has authorized you to compare all submitted quotations side-by-side and select your preferred supplier.'
                      : 'Admin central coordinator mode: Admin coordinates directly with verified suppliers to select the best quotation for you.'}
                  </p>
                </div>
              </div>

              {loadingQuotations ? (
                <div className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 mt-2 font-bold">Loading quotations...</p>
                </div>
              ) : selectedRequest.requesterCanViewAllQuotations ? (
                /* MODE B: REQUESTER COMPARISON MATRIX */
                visibleQuotations.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-navy-950">
                      No quotations received from invited companies yet.
                    </p>
                    <p className="text-xs text-slate-500">
                      Central Admin has invited verified companies. As soon as companies submit their quotes, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleQuotations.map((quot, idx) => {
                      const isSelected = selectedRequest.selectedQuotationId === quot._id;
                      return (
                        <div
                          key={quot._id}
                          className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                            isSelected
                              ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500 shadow-md'
                              : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-navy-950 text-xs flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                <span>{quot.supplierLabel || `Supplier ${idx + 1}`}</span>
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                                  Selected
                                </span>
                              )}
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Total Quotation Amount
                              </span>
                              <span className="text-xl font-black text-navy-950">
                                ₹{quot.totalAmount?.toLocaleString()}
                              </span>
                            </div>

                            <div className="space-y-1.5 text-[11px] divide-y divide-slate-100">
                              <div className="flex justify-between py-1">
                                <span className="text-slate-500">Unit Price:</span>
                                <span className="font-bold text-navy-950">₹{quot.unitPrice}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-slate-500">Subtotal:</span>
                                <span className="font-bold text-navy-950">₹{quot.subtotal?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-slate-500">Tax / GST:</span>
                                <span className="font-bold text-navy-950">₹{quot.taxAmount?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-slate-500">Logistics &amp; Delivery:</span>
                                <span className="font-bold text-navy-950">₹{quot.deliveryCharges}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-slate-500">Delivery Timeline:</span>
                                <span className="font-bold text-navy-950">{quot.estimatedDeliveryTime}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-slate-500">Validity:</span>
                                <span className="font-bold text-navy-950">{quot.validity}</span>
                              </div>
                            </div>

                            {quot.notes && (
                              <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                                <strong className="text-navy-950">Note: </strong> {quot.notes}
                              </p>
                            )}

                            {quot.terms && (
                              <p className="text-[11px] text-slate-500 italic">
                                Terms: {quot.terms}
                              </p>
                            )}
                          </div>

                          <div className="pt-3 border-t border-slate-100">
                            {isSelected ? (
                              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>You Selected This Quotation</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={actionLoading || selectedRequest.status === 'completed'}
                                onClick={() => handleSelectQuotation(quot._id)}
                                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                              >
                                <Award className="w-4 h-4" />
                                <span>Select This Quotation</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : selectedRequest.selectedQuotation ? (
                /* MODE A: ADMIN SELECTED A QUOTATION */
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-emerald-50/60 border border-blue-200 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>Admin has selected the best verified commercial quotation for your review:</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Total Amount
                      </span>
                      <span className="text-2xl font-black text-navy-950">
                        ₹{selectedRequest.selectedQuotation.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Unit Price &amp; Quantity
                      </span>
                      <span className="font-bold text-navy-950">
                        ₹{selectedRequest.selectedQuotation.unitPrice} × {selectedRequest.selectedQuotation.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Delivery Timeline
                      </span>
                      <span className="font-bold text-navy-950">
                        {selectedRequest.selectedQuotation.estimatedDeliveryTime}
                      </span>
                    </div>
                  </div>

                  {selectedRequest.selectedQuotation.terms && (
                    <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                      <strong className="text-navy-950">Terms: </strong>
                      {selectedRequest.selectedQuotation.terms}
                    </p>
                  )}

                  {selectedRequest.status === 'pending_selection' && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleDecision('reject')}
                        className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleDecision('accept')}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Quotation &amp; Proceed</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* WAITING ON ADMIN REVIEW */
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto" />
                  <p className="text-sm font-bold text-navy-950">
                    Central Admin is coordinating with verified suppliers
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    The platform central quotation team is vetting suppliers and collecting competitive quotations on your behalf. You will be notified as soon as quotations are ready.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Close */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
