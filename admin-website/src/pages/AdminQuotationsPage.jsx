import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User,
  MapPin,
  Calendar,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  FileCheck2,
  DollarSign,
  ShieldCheck,
  Send,
  Sliders,
  CheckSquare,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminQuotationsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [listingTypeFilter, setListingTypeFilter] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Requests' },
    { id: 'new', label: 'New Requests' },
    { id: 'under_review', label: 'Under Review' },
    { id: 'sent_to_companies', label: 'Sent to Companies' },
    { id: 'quotations_received', label: 'Quotations Received' },
    { id: 'pending_selection', label: 'Pending Selection' },
    { id: 'selected', label: 'Selected Quotations' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected / Cancelled' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      searchParams.delete('tab');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getQuotationRequests({
        status: activeTab === 'all' ? undefined : activeTab,
        search: searchQuery || undefined,
      });
      if (res.data?.success) {
        setRequests(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch quotation requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New Request
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case 'sent_to_companies':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Send className="w-3 h-3" />
            Sent to Companies
          </span>
        );
      case 'quotations_received':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <DollarSign className="w-3 h-3" />
            Quotations Received
          </span>
        );
      case 'pending_selection':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <CheckSquare className="w-3 h-3" />
            Pending Selection
          </span>
        );
      case 'selected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Quotation Selected
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <RefreshCw className="w-3 h-3 animate-spin" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            {status === 'cancelled' ? 'Cancelled' : 'Rejected'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
            {status}
          </span>
        );
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (listingTypeFilter !== 'all' && r.listingType !== listingTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#121226] via-[#1a1a36] to-[#25254d] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Centralized Quotation Management System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Quotation Requests &amp; Multi-Vendor Routing
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Review buyer RFQs, match and invite verified suppliers, compare submitted price proposals, and configure quotation selection visibility.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 transition-all self-end sm:self-auto shrink-0 shadow-sm"
          title="Refresh Quotations"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs Navigation (Module 4: 9 Sub-tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Listing Type Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, item name, buyer, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#F8FAFC]"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={listingTypeFilter}
            onChange={(e) => setListingTypeFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-[#F8FAFC] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Item Types (Products &amp; Services)</option>
            <option value="product">Physical Products</option>
            <option value="service">Professional Services</option>
          </select>
        </div>
      </div>

      {/* Quotation Requests Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Request ID &amp; Item</th>
                <th className="py-4 px-4">Requester Details</th>
                <th className="py-4 px-4">Category &amp; Qty</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Responses</th>
                <th className="py-4 px-4">Selection Mode</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading quotation requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <Layers className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No quotation requests found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeTab === 'all'
                        ? 'Users have not submitted any quotation requests yet.'
                        : `No quotation requests match status "${activeTab}".`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Request ID & Title */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[11px] font-extrabold text-indigo-600 block">
                          {req._id}
                        </span>
                        <p className="font-bold text-slate-900 text-xs max-w-xs truncate" title={req.title}>
                          {req.title}
                        </p>
                        <span className="inline-block text-[10px] text-slate-400 uppercase font-semibold">
                          Type: {req.listingType}
                        </span>
                      </div>
                    </td>

                    {/* Requester */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-xs">{req.requesterName}</p>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          {req.requesterRole}
                        </span>
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{req.requesterEmail}</p>
                      </div>
                    </td>

                    {/* Category & Qty */}
                    <td className="py-4 px-4">
                      <p className="font-medium text-slate-800">{req.category}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        Qty: {req.quantity} {req.unit || 'Units'}
                      </p>
                      {req.budget && (
                        <p className="text-[10px] text-emerald-600 font-bold">Budget: {req.budget}</p>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[130px]" title={req.location}>
                          {req.location}
                        </span>
                      </div>
                      {req.pincode && (
                        <span className="text-[10px] text-slate-400 block pl-4">PIN: {req.pincode}</span>
                      )}
                    </td>

                    {/* Responses Count */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Send className="w-3 h-3 text-indigo-500" />
                          {req.invitationsCount || 0} Invited
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block w-max">
                          <DollarSign className="w-3 h-3 text-emerald-600" />
                          {req.quotationsCount || 0} Quotes In
                        </span>
                      </div>
                    </td>

                    {/* Selection Mode */}
                    <td className="py-4 px-4">
                      {req.requesterCanSelectQuotation ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                          <CheckSquare className="w-3 h-3" />
                          Requester Select
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          <ShieldCheck className="w-3 h-3 text-indigo-500" />
                          Admin Managed
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/quotations/${req._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold text-xs transition-all shadow-2xs"
                      >
                        <span>Manage &amp; Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
