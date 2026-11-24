import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
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
  Plus,
  Tag,
  Layers,
  Sparkles,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminRequestsPage = ({ initialTab = 'all' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'service' | 'material'
  const [categoryFilter, setCategoryFilter] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Requests' },
    { id: 'new', label: 'New Requests' },
    { id: 'under_review', label: 'Under Review' },
    { id: 'assigned', label: 'Assigned Requests' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected / Cancelled' },
  ];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getServiceRequests({
        status: activeTab === 'all' ? undefined : activeTab,
        type: typeFilter === 'all' ? undefined : typeFilter,
        search: searchQuery || undefined,
      });
      if (res.data?.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('Failed to fetch service requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            New Request
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">
            <Building2 className="w-3 h-3" />
            Assigned
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-600 border border-sky-200">
            <CheckCircle2 className="w-3 h-3" />
            Accepted
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
            <RefreshCw className="w-3 h-3 animate-spin" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            {status === 'rejected' ? 'Rejected' : 'Cancelled'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
              Core Module
            </span>
            <span className="text-xs text-slate-400 font-medium">• User Request → Matching → Connection</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Service & Material Requests
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review incoming requests from users, inspect requirements, and manually connect with approved businesses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/requests/connections"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all shadow-sm"
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>View Business Connections</span>
          </Link>
          <button
            onClick={fetchRequests}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#121226] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, user, requirement, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('service')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                typeFilter === 'service' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setTypeFilter('material')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                typeFilter === 'material' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Materials
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading service requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-slate-300" />
            <span className="font-semibold text-slate-600">No requests found</span>
            <span className="text-slate-400">There are no requests matching the selected status or filters.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Request ID</th>
                  <th className="px-5 py-3.5">User / Client</th>
                  <th className="px-5 py-3.5">Category & Requirement</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Assigned Business</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                          {req._id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            req.requestType === 'material'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {req.requestType}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                          {req.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{req.userName}</div>
                          <div className="text-[11px] text-slate-400">{req.userMobile || req.userEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {req.category}
                        </div>
                        <div className="font-semibold text-slate-900 truncate mt-0.5" title={req.title}>
                          {req.title}
                        </div>
                        {req.quantity && (
                          <div className="text-[11px] text-slate-400">Qty: {req.quantity}</div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{req.location}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(req.status)}</td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {req.assignedBusinessName ? (
                        <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{req.assignedBusinessName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Not assigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <Link
                        to={`/requests/${req._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all shadow-xs"
                      >
                        <span>Review & Match</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminRequestsPage;
