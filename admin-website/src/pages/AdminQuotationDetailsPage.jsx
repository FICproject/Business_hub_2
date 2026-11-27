import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Layers,
  Send,
  Building2,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  FileText,
  ShieldCheck,
  CheckSquare,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  X,
  Sliders,
  ExternalLink,
  Download,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminQuotationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [connection, setConnection] = useState(null);
  const [matchingCompanies, setMatchingCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Invitation selection state
  const [selectedBizIds, setSelectedBizIds] = useState([]);
  const [deadlineDays, setDeadlineDays] = useState(5);

  // Visibility Checkbox state (Module 7: Mandatory Feature)
  const [allowRequesterViewAndSelect, setAllowRequesterViewAndSelect] = useState(false);
  const [adminRevealCompanyIdentity, setAdminRevealCompanyIdentity] = useState(false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);

  // Status & Note update state
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getQuotationRequestById(id);
      if (res.data?.success) {
        const reqDoc = res.data.request;
        setRequest(reqDoc);
        setInvitations(res.data.invitations || []);
        setQuotations(res.data.quotations || []);
        setConnection(res.data.connection || null);
        setAllowRequesterViewAndSelect(Boolean(reqDoc.requesterCanViewAllQuotations));
        setAdminRevealCompanyIdentity(Boolean(reqDoc.adminRevealCompanyIdentity));
        setAdminNotes(reqDoc.adminNotes || '');
        setNewStatus(reqDoc.status || 'new');
      }
    } catch (err) {
      console.error('Failed to load quotation request details:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMatchingCompanies = async () => {
    try {
      setMatchingLoading(true);
      const res = await adminApi.matchCompaniesForRequest(id);
      if (res.data?.success) {
        setMatchingCompanies(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to match companies:', err);
    } finally {
      setMatchingLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
      loadMatchingCompanies();
    }
  }, [id]);

  // Handle Visibility Checkbox Toggle (Module 7)
  const handleToggleVisibility = async (checked) => {
    setAllowRequesterViewAndSelect(checked);
    setVisibilitySaving(true);
    try {
      const res = await adminApi.updateQuotationVisibility(id, {
        allowRequesterViewAndSelect: checked,
        adminRevealCompanyIdentity,
      });
      if (res.data?.success) {
        setRequest(res.data.request);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quotation visibility settings');
      setAllowRequesterViewAndSelect(!checked);
    } finally {
      setVisibilitySaving(false);
    }
  };

  // Toggle Identity Reveal
  const handleToggleIdentityReveal = async (checked) => {
    setAdminRevealCompanyIdentity(checked);
    setVisibilitySaving(true);
    try {
      const res = await adminApi.updateQuotationVisibility(id, {
        allowRequesterViewAndSelect,
        adminRevealCompanyIdentity: checked,
      });
      if (res.data?.success) {
        setRequest(res.data.request);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update identity reveal settings');
      setAdminRevealCompanyIdentity(!checked);
    } finally {
      setVisibilitySaving(false);
    }
  };

  // Invite Selected Companies
  const handleInviteCompanies = async () => {
    if (selectedBizIds.length === 0) {
      alert('Please select at least one company to invite.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminApi.inviteCompaniesToRequest(id, {
        businessIds: selectedBizIds,
        deadlineDays,
      });
      if (res.data?.success) {
        alert(res.data.message || 'Quotation requests sent to selected companies!');
        setSelectedBizIds([]);
        loadData();
        loadMatchingCompanies();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to invite companies');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Selects Quotation (Option A: Checkbox Disabled)
  const handleAdminSelectQuotation = async (quotationId) => {
    if (!window.confirm('Select this quotation and send to requester for review?')) return;
    setActionLoading(true);
    try {
      const res = await adminApi.adminSelectQuotation(id, quotationId);
      if (res.data?.success) {
        alert(res.data.message || 'Quotation selected successfully.');
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to select quotation');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Confirms Selection -> Creates Business Connection (Module 8)
  const handleConfirmSelection = async () => {
    if (!window.confirm('Officially confirm this quotation and create a verified Business Connection?')) return;
    setActionLoading(true);
    try {
      const res = await adminApi.confirmQuotationSelection(id);
      if (res.data?.success) {
        alert(res.data.message || 'Quotation selection confirmed! Business connection established.');
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm selection');
    } finally {
      setActionLoading(false);
    }
  };

  // Reopen Request
  const handleReopenRequest = async () => {
    if (!window.confirm('Reopen this quotation request for re-evaluation?')) return;
    setActionLoading(true);
    try {
      const res = await adminApi.reopenQuotationRequest(id);
      if (res.data?.success) {
        alert(res.data.message || 'Request reopened.');
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reopen request');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Admin Notes & Status Update
  const handleSaveNotes = async () => {
    setActionLoading(true);
    try {
      const res = await adminApi.updateQuotationRequestStatus(id, {
        adminNotes,
        status: newStatus !== request.status ? newStatus : undefined,
      });
      if (res.data?.success) {
        alert('Request details updated successfully.');
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading Quotation Request Details...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Quotation Request Not Found</h2>
        <Link to="/quotations" className="text-xs font-bold text-indigo-600 hover:underline">
          Return to Quotation Management
        </Link>
      </div>
    );
  }

  const selectedQuote = quotations.find((q) => q._id === request.selectedQuotationId);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/quotations"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {request._id}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {request.listingType} RFQ
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {request.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {request.status === 'selected' || request.status === 'completed' ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Awarded &amp; Connection Active
            </span>
          ) : request.selectedQuotationId ? (
            <button
              onClick={handleConfirmSelection}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Confirm Selection &amp; Connect
            </button>
          ) : null}

          {request.status !== 'new' && request.status !== 'under_review' && (
            <button
              onClick={handleReopenRequest}
              disabled={actionLoading}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reopen RFQ
            </button>
          )}
        </div>
      </div>

      {/* Grid: Request Summary Card & Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Specifications Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-indigo-600" />
              Quotation Requirements &amp; Buyer Specs
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Category</span>
                <span className="font-extrabold text-slate-900">{request.category}</span>
                {request.subcategory && (
                  <span className="text-[11px] text-slate-500 block">Sub: {request.subcategory}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Quantity Required</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {request.quantity} {request.unit || 'Units'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Budget Range</span>
                <span className="font-extrabold text-emerald-700">
                  {request.budget ? request.budget : 'Open / Best Price'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Delivery / Service Location</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {request.location}
                </span>
                {request.pincode && (
                  <span className="text-[10px] text-slate-400 block">Pincode: {request.pincode}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Expected Date</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {request.expectedDate ? new Date(request.expectedDate).toLocaleDateString() : 'Flexible'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Submission Date</span>
                <span className="font-bold text-slate-800">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Specifications Description */}
            <div className="pt-2">
              <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Required Specifications</span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                {request.specifications || 'Standard specifications as per marketplace catalog listing.'}
              </p>
            </div>

            {/* Additional Buyer Notes */}
            {request.notes && (
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Additional Buyer Notes</span>
                <p className="text-xs text-slate-600 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100 leading-relaxed">
                  {request.notes}
                </p>
              </div>
            )}
          </div>

          {/* MODULE 7: THE MANDATORY VISIBILITY & SELECTION CHECKBOX CARD */}
          <div className="bg-gradient-to-br from-indigo-900 to-[#1e1b4b] text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 border border-indigo-700/50">
            <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-indigo-200">
                  Quotation Visibility &amp; Selection Mode Control
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-indigo-300">
                Module 7 Configuration
              </span>
            </div>

            {/* THE MANDATORY CHECKBOX */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowRequesterViewAndSelect}
                  onChange={(e) => handleToggleVisibility(e.target.checked)}
                  disabled={visibilitySaving}
                  className="mt-0.5 rounded text-indigo-500 focus:ring-indigo-400 w-5 h-5 shrink-0 cursor-pointer"
                />
                <div>
                  <span className="font-extrabold text-sm text-white block">
                    Allow requester to view all received quotations and select one.
                  </span>
                  <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                    {allowRequesterViewAndSelect ? (
                      <span className="text-amber-300 font-semibold">
                        ✓ Requester Selection Mode Active: The buyer will see all submitted quotations side-by-side in their portal (prices, delivery timeline, tax, terms) and can select their preferred quotation directly.
                      </span>
                    ) : (
                      <span>
                        • Admin Selection Mode (Default): Admin coordinates and selects one proposal. Only the single selected quotation is presented to the requester for final review.
                      </span>
                    )}
                  </p>
                </div>
              </label>

              {/* Identity Disclosure Sub-option */}
              {allowRequesterViewAndSelect && (
                <div className="pt-2 pl-8 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Disclose Supplier Company Names during Comparison?</p>
                    <p className="text-[11px] text-indigo-300">
                      Default is Anonymized (Company A, Company B). Check below to show trade names.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adminRevealCompanyIdentity}
                      onChange={(e) => handleToggleIdentityReveal(e.target.checked)}
                      disabled={visibilitySaving}
                      className="rounded text-indigo-500 focus:ring-indigo-400 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-indigo-200">Reveal Names</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Requester Profile & Admin Internal Notes */}
        <div className="space-y-6">
          {/* Requester Contact Profile */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-indigo-600" />
              Requester Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Full Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{request.requesterName}</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 ml-2">
                  {request.requesterRole}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Email Address</span>
                <span className="font-medium text-slate-800">{request.requesterEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Mobile Number</span>
                <span className="font-medium text-slate-800">{request.requesterMobile}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Original Listing ID</span>
                <span className="font-mono text-slate-600 text-[11px]">
                  {request.listingId || 'Direct Marketplace RFQ'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Internal Notes & Status Manager */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Admin Coordination Notes
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-[#F8FAFC]"
                >
                  <option value="new">New Request</option>
                  <option value="under_review">Under Review</option>
                  <option value="sent_to_companies">Sent to Companies</option>
                  <option value="quotations_received">Quotations Received</option>
                  <option value="pending_selection">Pending Selection</option>
                  <option value="selected">Selected</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected / Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Private Admin Notes (Hidden from buyer &amp; companies)
                </label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about negotiation, supplier background, special requirements..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Save Status &amp; Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODULE 6: ADMIN QUOTATION COMPARISON MATRIX */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                Submitted Quotations Comparison Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side pricing, tax breakdown, delivery schedules, and proposal terms received from invited businesses.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {quotations.length} Quotation(s) Submitted
          </span>
        </div>

        {quotations.length === 0 ? (
          <div className="py-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <DollarSign className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No quotations received yet</p>
            <p className="text-xs text-slate-400">
              Select matching verified companies below and send quotation requests to receive competitive bids.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4">Subtotal</th>
                  <th className="py-3.5 px-4">Tax / GST</th>
                  <th className="py-3.5 px-4">Delivery / Extras</th>
                  <th className="py-3.5 px-4 font-black text-slate-800">Total Price</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Validity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quotations.map((q) => {
                  const isSelected = q._id === request.selectedQuotationId;
                  return (
                    <tr
                      key={q._id}
                      className={`transition-colors ${
                        isSelected ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Company Name */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-slate-900">{q.businessName}</p>
                          <span className="text-[10px] text-slate-400 font-mono block">{q._id}</span>
                          <span className="inline-block px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase bg-slate-100 text-slate-600">
                            {q.roleType}
                          </span>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-4 font-medium">${q.unitPrice?.toFixed(2)}</td>

                      {/* Subtotal */}
                      <td className="py-3.5 px-4 font-medium">${q.subtotal?.toFixed(2)}</td>

                      {/* Tax */}
                      <td className="py-3.5 px-4 text-slate-500">
                        ${q.taxAmount?.toFixed(2)} ({q.taxPercent || 0}%)
                      </td>

                      {/* Delivery */}
                      <td className="py-3.5 px-4 text-slate-500">
                        ${q.deliveryCharges?.toFixed(2)}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-black text-slate-900 block">
                          ${q.totalAmount?.toFixed(2)}
                        </span>
                      </td>

                      {/* Timeline */}
                      <td className="py-3.5 px-4 text-slate-600">{q.deliveryTimeline}</td>

                      {/* Validity */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {q.validityDate ? new Date(q.validityDate).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Selected
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            {q.status}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isSelected ? (
                          <span className="text-xs font-extrabold text-emerald-700">Active Choice</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdminSelectQuotation(q._id)}
                            disabled={actionLoading || request.status === 'completed'}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold text-xs transition-colors"
                          >
                            Select Quotation
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODULE 4.2 & 4.3: COMPANY MATCHING & INVITATION SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                Verified Company Matching &amp; RFQ Dispatch
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identify approved Businessmen and Entrepreneurs matching category "{request.category}" and location "{request.location}".
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-bold">Deadline:</span>
              <select
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(parseInt(e.target.value, 10))}
                className="px-2 py-1 rounded-lg border border-slate-200 font-bold bg-[#F8FAFC]"
              >
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
                <option value={7}>7 Days</option>
                <option value={10}>10 Days</option>
              </select>
            </div>

            <button
              onClick={handleInviteCompanies}
              disabled={selectedBizIds.length === 0 || actionLoading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send RFQ to {selectedBizIds.length} Company/Companies
            </button>
          </div>
        </div>

        {matchingLoading ? (
          <div className="py-10 text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" />
            <p className="text-xs font-bold text-slate-500">Matching verified companies in MongoDB...</p>
          </div>
        ) : matchingCompanies.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No matching approved business profiles found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingCompanies.map((biz) => {
              const isSelected = selectedBizIds.includes(biz._id);
              return (
                <div
                  key={biz._id}
                  onClick={() => {
                    if (biz.isInvited) return;
                    if (isSelected) {
                      setSelectedBizIds(selectedBizIds.filter((id) => id !== biz._id));
                    } else {
                      setSelectedBizIds([...selectedBizIds, biz._id]);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    biz.isInvited
                      ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                      : isSelected
                      ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-900 text-xs">{biz.businessName}</p>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Role: {biz.roleType}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                        {biz.matchScore}% Match
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <p><strong>Category:</strong> {biz.category} {biz.subcategory ? `(${biz.subcategory})` : ''}</p>
                      <p><strong>Location:</strong> {biz.address?.city || biz.operatingLocations || 'Regional'}</p>
                      <p><strong>Contact:</strong> {biz.email} • {biz.phone}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                    {biz.isInvited ? (
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        ✓ RFQ Already Sent
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-indigo-600">
                        {isSelected ? '✓ Selected for Invitation' : '+ Select to Invite'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Connection Card if Established */}
      {connection && (
        <div className="bg-emerald-50 rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm uppercase tracking-wide">
              Established Verified Business Connection #{connection._id}
            </h3>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            Buyer <strong>{connection.userName}</strong> ({connection.userEmail}) has been formally linked with <strong>{connection.businessName}</strong> for quotation delivery. Both parties have verified access to direct fulfillment.
          </p>
        </div>
      )}
    </div>
  );
};
