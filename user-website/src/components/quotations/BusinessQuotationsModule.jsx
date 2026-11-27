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
} from 'lucide-react';
import { quotationsApi } from '../../services/api';

export const BusinessQuotationsModule = ({ business, isApproved }) => {
  const [invitations, setInvitations] = useState([]);
  const [submittedQuotes, setSubmittedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('received'); // 'received' | 'pending' | 'submitted' | 'accepted' | 'rejected' | 'expired'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [viewRequestModal, setViewRequestModal] = useState(null);
  const [submitQuoteModal, setSubmitQuoteModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [viewSubmittedModal, setViewSubmittedModal] = useState(null);

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    unitPrice: '',
    quantity: 1,
    subtotal: 0,
    taxPercent: '18',
    taxAmount: 0,
    additionalCharges: '0',
    deliveryCharges: '0',
    totalAmount: 0,
    estimatedTime: '3-5 business days',
    validityDays: '30 days',
    terms: 'Payment 50% advance, balance upon delivery. Standard 1-year product warranty applies.',
    notes: '',
    attachments: '',
  });

  // Rejection Form State
  const [rejectForm, setRejectForm] = useState({
    reason: 'Out of stock or capacity full',
    customReason: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const loadQuotationsData = async () => {
    try {
      setLoading(true);
      const [invRes, quoteRes] = await Promise.allSettled([
        quotationsApi.getInvitations(),
        quotationsApi.getMySubmittedQuotations(),
      ]);

      if (invRes.status === 'fulfilled' && invRes.value.data?.success) {
        setInvitations(invRes.value.data.invitations || []);
      }
      if (quoteRes.status === 'fulfilled' && quoteRes.value.data?.success) {
        setSubmittedQuotes(quoteRes.value.data.quotations || []);
      }
    } catch (err) {
      console.error('Error loading quotations data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotationsData();
  }, []);

  // Filtered Invitations
  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      // Subtab filtering
      let matchesTab = true;
      if (activeSubTab === 'received') matchesTab = true;
      else if (activeSubTab === 'pending') matchesTab = inv.status === 'pending';
      else if (activeSubTab === 'submitted') matchesTab = inv.status === 'submitted' || inv.status === 'accepted';
      else if (activeSubTab === 'accepted') matchesTab = inv.status === 'selected' || inv.status === 'accepted';
      else if (activeSubTab === 'rejected') matchesTab = inv.status === 'rejected';
      else if (activeSubTab === 'expired') matchesTab = inv.status === 'expired';

      // Search filtering
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          inv._id?.toLowerCase().includes(q) ||
          inv.requestId?.toLowerCase().includes(q) ||
          inv.requestTitle?.toLowerCase().includes(q) ||
          inv.category?.toLowerCase().includes(q);
      }

      return matchesTab && matchesSearch;
    });
  }, [invitations, activeSubTab, searchQuery]);

  // Dynamic calculations for Quote Form
  const handleQuoteFieldChange = (field, value) => {
    const updated = { ...quoteForm, [field]: value };

    const uPrice = parseFloat(updated.unitPrice) || 0;
    const qty = parseFloat(updated.quantity) || 0;
    const sub = uPrice * qty;

    const tPercent = parseFloat(updated.taxPercent) || 0;
    const tAmount = (sub * tPercent) / 100;

    const addCharges = parseFloat(updated.additionalCharges) || 0;
    const delCharges = parseFloat(updated.deliveryCharges) || 0;

    const grandTotal = sub + tAmount + addCharges + delCharges;

    setQuoteForm({
      ...updated,
      subtotal: sub,
      taxAmount: tAmount,
      totalAmount: grandTotal,
    });
  };

  const openSubmitQuote = (inv) => {
    const reqQty = inv.request?.quantity || 1;
    const initialPrice = inv.request?.budget ? parseFloat(inv.request.budget) / reqQty : 1000;
    const sub = initialPrice * reqQty;
    const tax = (sub * 18) / 100;
    const grand = sub + tax;

    setQuoteForm({
      unitPrice: String(initialPrice || ''),
      quantity: reqQty,
      subtotal: sub,
      taxPercent: '18',
      taxAmount: tax,
      additionalCharges: '0',
      deliveryCharges: '0',
      totalAmount: grand,
      estimatedTime: '3-5 business days',
      validityDays: '30 days',
      terms: 'Standard supply terms, GST invoice included. Payment within 15 days of verified receipt.',
      notes: '',
      attachments: '',
    });
    setSubmitQuoteModal(inv);
  };

  const handleSubmitQuote = async (e, isDraft = false) => {
    e.preventDefault();
    if (!submitQuoteModal) return;

    if (!quoteForm.unitPrice || parseFloat(quoteForm.unitPrice) <= 0) {
      alert('Please enter a valid unit price.');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        invitationId: submitQuoteModal._id,
        requestId: submitQuoteModal.requestId,
        unitPrice: parseFloat(quoteForm.unitPrice),
        quantity: parseFloat(quoteForm.quantity),
        subtotal: quoteForm.subtotal,
        taxPercent: parseFloat(quoteForm.taxPercent) || 0,
        taxAmount: quoteForm.taxAmount,
        additionalCharges: parseFloat(quoteForm.additionalCharges) || 0,
        deliveryCharges: parseFloat(quoteForm.deliveryCharges) || 0,
        totalAmount: quoteForm.totalAmount,
        estimatedDeliveryTime: quoteForm.estimatedTime,
        validity: quoteForm.validityDays,
        terms: quoteForm.terms,
        notes: quoteForm.notes,
        attachments: quoteForm.attachments ? [quoteForm.attachments] : [],
        isDraft,
      };

      const res = await quotationsApi.submitQuotation(payload);
      if (res.data?.success) {
        setFeedbackMsg({
          type: 'success',
          text: isDraft
            ? 'Quotation saved as draft.'
            : 'Official quotation submitted to Central Admin for review!',
        });
        setSubmitQuoteModal(null);
        await loadQuotationsData();
      } else {
        alert(res.data?.message || 'Failed to submit quotation.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quotation.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectInvitation = async (e) => {
    e.preventDefault();
    if (!rejectModal) return;

    const reason =
      rejectForm.reason === 'Other' && rejectForm.customReason
        ? rejectForm.customReason
        : rejectForm.reason;

    try {
      setActionLoading(true);
      const res = await quotationsApi.respondToInvitation(rejectModal._id, {
        action: 'reject',
        reason,
      });

      if (res.data?.success) {
        setFeedbackMsg({ type: 'info', text: 'Quotation request declined.' });
        setRejectModal(null);
        await loadQuotationsData();
      } else {
        alert(res.data?.message || 'Failed to decline request.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decline request.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" />
            Pending Response
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3 h-3" />
            Quote Submitted
          </span>
        );
      case 'selected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            <Sparkles className="w-3 h-3" />
            Awarded / Selected
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3" />
            Expired
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
            Manage invitations assigned by Central Admin, submit competitive quotations, and view awarded bids.
          </p>
        </div>

        <button
          onClick={loadQuotationsData}
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
          { key: 'received', label: 'Received Requests', count: invitations.length },
          {
            key: 'pending',
            label: 'Pending Response',
            count: invitations.filter((i) => i.status === 'pending').length,
          },
          {
            key: 'submitted',
            label: 'Submitted Quotations',
            count: invitations.filter((i) => i.status === 'submitted' || i.status === 'accepted').length,
          },
          {
            key: 'accepted',
            label: 'Accepted / Awarded',
            count: invitations.filter((i) => i.status === 'selected' || i.status === 'accepted').length,
          },
          {
            key: 'rejected',
            label: 'Rejected',
            count: invitations.filter((i) => i.status === 'rejected').length,
          },
          {
            key: 'expired',
            label: 'Expired',
            count: invitations.filter((i) => i.status === 'expired').length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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
          placeholder="Search by Request ID, item title or category..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Invitations List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2 font-bold">Loading quotations data...</p>
        </div>
      ) : filteredInvitations.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <p className="text-sm font-bold text-navy-950">No quotation requests found</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeSubTab === 'received'
                ? 'When Central Admin matches your company for an RFQ, it will appear here.'
                : `No requests under "${activeSubTab}" filter.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvitations.map((inv) => (
            <div
              key={inv._id}
              className="rounded-2xl border border-slate-200/90 p-5 bg-white hover:border-blue-300 transition-all shadow-sm space-y-4"
            >
              {/* Card Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">
                    {inv.requestId || inv._id}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {inv.request?.listingType === 'service' ? 'Service RFQ' : 'Product RFQ'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {inv.category || inv.request?.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(inv.status)}
                  <span className="text-[11px] text-slate-400">
                    Received: {new Date(inv.invitedAt || inv.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Title & Core Requirements */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                  <h3 className="text-base font-extrabold text-navy-950 leading-snug">
                    {inv.request?.title || inv.requestTitle || 'Product/Service Quotation Request'}
                  </h3>

                  {inv.request?.specifications && (
                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-700 font-bold">Specs: </strong>
                      {inv.request.specifications}
                    </p>
                  )}

                  {/* Requirements Pills */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                      <span>Quantity: </span>
                      <strong className="text-navy-950">
                        {inv.request?.quantity || 1} {inv.request?.unit || 'Units'}
                      </strong>
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Location: </span>
                      <strong className="text-navy-950">{inv.request?.location || 'Direct Delivery'}</strong>
                    </span>

                    {inv.request?.expectedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Needed By: </span>
                        <strong className="text-navy-950">{inv.request.expectedDate}</strong>
                      </span>
                    )}

                    {inv.request?.budget && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                        <span>Target Budget: </span>
                        <strong className="text-navy-950">{inv.request.budget}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Deadline & Pricing Box */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Response Deadline
                    </span>
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {inv.deadline ? new Date(inv.deadline).toLocaleDateString() : 'Standard 48 Hours'}
                    </span>
                  </div>

                  {inv.quotation && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Your Submitted Quote
                      </span>
                      <span className="text-base font-black text-emerald-700">
                        ₹{inv.quotation.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewRequestModal(inv)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Specifications</span>
                </button>

                <div className="flex items-center gap-2">
                  {inv.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectForm({ reason: 'Out of stock or capacity full', customReason: '' });
                          setRejectModal(inv);
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => openSubmitQuote(inv)}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Quotation</span>
                      </button>
                    </>
                  )}

                  {inv.quotation && (
                    <button
                      type="button"
                      onClick={() => setViewSubmittedModal(inv.quotation)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View My Submitted Quote</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: VIEW FULL REQUEST DETAILS
      ========================================================================= */}
      {viewRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-navy-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Quotation Request Details</span>
              </h3>
              <button
                onClick={() => setViewRequestModal(null)}
                className="p-1 text-slate-400 hover:text-navy-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-600 uppercase font-bold block">Request ID</span>
                  <span className="font-extrabold text-blue-950 text-sm">
                    {viewRequestModal.requestId || viewRequestModal._id}
                  </span>
                </div>
                {getStatusBadge(viewRequestModal.status)}
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Item Requested</span>
                <span className="font-bold text-navy-950 text-sm">
                  {viewRequestModal.request?.title || viewRequestModal.requestTitle}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Category</span>
                  <span className="font-bold text-navy-950">{viewRequestModal.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Quantity</span>
                  <span className="font-bold text-navy-950">
                    {viewRequestModal.request?.quantity} {viewRequestModal.request?.unit || 'Units'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Delivery Location</span>
                  <span className="font-bold text-navy-950">
                    {viewRequestModal.request?.location}
                    {viewRequestModal.request?.pincode ? ` (${viewRequestModal.request.pincode})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block">Expected Date</span>
                  <span className="font-bold text-navy-950">
                    {viewRequestModal.request?.expectedDate || 'Flexible'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Required Specifications
                </span>
                <p className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {viewRequestModal.request?.specifications || 'Standard specifications as listed.'}
                </p>
              </div>

              {viewRequestModal.request?.notes && (
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                    Requester Additional Instructions
                  </span>
                  <p className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 leading-relaxed">
                    {viewRequestModal.request.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewRequestModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              {viewRequestModal.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => {
                    setViewRequestModal(null);
                    openSubmitQuote(viewRequestModal);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Prepare Quotation
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SUBMIT / PREPARE QUOTATION FORM
      ========================================================================= */}
      {submitQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-navy-950 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Submit Commercial Quotation</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Request ID: {submitQuoteModal.requestId} | {submitQuoteModal.request?.title}
                </p>
              </div>
              <button
                onClick={() => setSubmitQuoteModal(null)}
                className="p-1 text-slate-400 hover:text-navy-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleSubmitQuote(e, false)} className="space-y-4">
              {/* Financial Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={quoteForm.unitPrice}
                    onChange={(e) => handleQuoteFieldChange('unitPrice', e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quoteForm.quantity}
                    onChange={(e) => handleQuoteFieldChange('quantity', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Subtotal preview */}
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between font-bold text-slate-700">
                <span>Subtotal (Unit Price × Quantity):</span>
                <span className="text-navy-950 font-black">₹{quoteForm.subtotal?.toLocaleString()}</span>
              </div>

              {/* Tax & Additional Charges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tax / GST (%)</label>
                  <select
                    value={quoteForm.taxPercent}
                    onChange={(e) => handleQuoteFieldChange('taxPercent', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST (Standard)</option>
                    <option value="28">28% GST</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Additional / Packing Charges (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quoteForm.additionalCharges}
                    onChange={(e) => handleQuoteFieldChange('additionalCharges', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Delivery / Freight Charges (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quoteForm.deliveryCharges}
                    onChange={(e) => handleQuoteFieldChange('deliveryCharges', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Grand Total Highlight */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                    Total Quotation Amount (All Taxes &amp; Logistics Included)
                  </span>
                  <span className="text-xl font-black text-navy-950">
                    ₹{quoteForm.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span>Tax Amount: ₹{quoteForm.taxAmount?.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery & Validity Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Estimated Delivery / Service Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.estimatedTime}
                    onChange={(e) => setQuoteForm({ ...quoteForm, estimatedTime: e.target.value })}
                    placeholder="e.g. 5-7 business days"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Quotation Validity *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.validityDays}
                    onChange={(e) => setQuoteForm({ ...quoteForm, validityDays: e.target.value })}
                    placeholder="e.g. 30 days"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Terms and Conditions
                </label>
                <textarea
                  rows={2}
                  value={quoteForm.terms}
                  onChange={(e) => setQuoteForm({ ...quoteForm, terms: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Additional Notes / Value Additions
                </label>
                <textarea
                  rows={2}
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                  placeholder="Mention free installation, trial period, grade certificates, or volume discount clauses..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Supporting Docs URL */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Supporting Document / Specification Brochure Link (Optional)
                </label>
                <input
                  type="url"
                  value={quoteForm.attachments}
                  onChange={(e) => setQuoteForm({ ...quoteForm, attachments: e.target.value })}
                  placeholder="https://example.com/spec-sheet.pdf"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmitQuoteModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={(e) => handleSubmitQuote(e, true)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{actionLoading ? 'Submitting...' : 'Submit Official Quotation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DECLINE REQUEST WITH REASON
      ========================================================================= */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-rose-700 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>Decline Quotation Request</span>
              </h3>
              <button
                onClick={() => setRejectModal(null)}
                className="p-1 text-slate-400 hover:text-navy-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600">
              Please specify why your company is declining this quotation invitation. Central Admin will record this reason.
            </p>

            <form onSubmit={handleRejectInvitation} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Reason *</label>
                <select
                  value={rejectForm.reason}
                  onChange={(e) => setRejectForm({ ...rejectForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Out of stock or capacity full">Out of stock / Production capacity full</option>
                  <option value="Outside service delivery area">Outside our delivery / service coverage area</option>
                  <option value="Cannot meet technical specifications">Cannot meet required specifications</option>
                  <option value="Budget requirement mismatch">Customer budget mismatch</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              {rejectForm.reason === 'Other' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Describe Reason *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={rejectForm.customReason}
                    onChange={(e) => setRejectForm({ ...rejectForm, customReason: e.target.value })}
                    placeholder="Provide brief explanation..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Declining...' : 'Confirm Decline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: VIEW SUBMITTED QUOTATION
      ========================================================================= */}
      {viewSubmittedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-navy-950 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <span>My Submitted Quotation</span>
                </h3>
                <span className="text-[11px] text-slate-500">ID: {viewSubmittedModal._id}</span>
              </div>
              <button
                onClick={() => setViewSubmittedModal(null)}
                className="p-1 text-slate-400 hover:text-navy-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Total Quoted Amount
                </span>
                <span className="text-2xl font-black text-navy-950">
                  ₹{viewSubmittedModal.totalAmount?.toLocaleString()}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-white/70 px-2.5 py-1 rounded-lg">
                Status: {viewSubmittedModal.status}
              </span>
            </div>

            <div className="space-y-2 divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Unit Price:</span>
                <span className="font-bold text-navy-950">₹{viewSubmittedModal.unitPrice}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-bold text-navy-950">{viewSubmittedModal.quantity}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-bold text-navy-950">₹{viewSubmittedModal.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Tax / GST:</span>
                <span className="font-bold text-navy-950">₹{viewSubmittedModal.taxAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Logistics &amp; Delivery:</span>
                <span className="font-bold text-navy-950">₹{viewSubmittedModal.deliveryCharges}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Estimated Delivery Time:</span>
                <span className="font-bold text-navy-950">{viewSubmittedModal.estimatedDeliveryTime}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Quotation Validity:</span>
                <span className="font-bold text-navy-950">{viewSubmittedModal.validity}</span>
              </div>
            </div>

            {viewSubmittedModal.terms && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Terms and Conditions
                </span>
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  {viewSubmittedModal.terms}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewSubmittedModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
