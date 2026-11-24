import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminConnectionsPage = ({ initialTab = 'all' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnection, setSelectedConnection] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Connections' },
    { id: 'pending', label: 'Pending Connections' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getBusinessConnections({
        status: activeTab === 'all' ? undefined : activeTab,
        search: searchQuery || undefined,
      });
      if (res.data?.success) {
        setConnections(res.data.connections || []);
      }
    } catch (err) {
      console.error('Failed to fetch connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchConnections();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Response
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <CheckCircle2 className="w-3 h-3" />
            Accepted
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <RefreshCw className="w-3 h-3 animate-spin" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Rejected
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-purple-50 text-purple-700 border border-purple-100">
              Connections Hub
            </span>
            <span className="text-xs text-slate-400 font-medium">• Admin Facilitated Matchmaking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Business Connections & Assignments
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track live connections created between clients and approved businesses, monitor statuses, and manage reassignment workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/requests"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>View All Requests</span>
          </Link>
          <button
            onClick={fetchConnections}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
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

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search connections by client, business, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </form>
      </div>

      {/* Connections Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading business connections...</span>
          </div>
        ) : connections.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Building2 className="w-8 h-8 text-slate-300" />
            <span className="font-semibold text-slate-600">No connections found</span>
            <span className="text-slate-400">There are no connection records for this filter.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Connection ID</th>
                  <th className="px-5 py-3.5">User / Client</th>
                  <th className="px-5 py-3.5">Assigned Business</th>
                  <th className="px-5 py-3.5">Associated Request</th>
                  <th className="px-5 py-3.5">Assigned Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {connections.map((conn) => (
                  <tr key={conn._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-900">
                      <span className="font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[11px]">
                        {conn._id}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                          {conn.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{conn.userName}</div>
                          <div className="text-[11px] text-slate-400">{conn.userMobile || conn.userEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[11px]">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{conn.businessName}</div>
                          <div className="text-[11px] text-slate-400">{conn.businessCategory}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 block">{conn.requestId}</span>
                        <span className="font-semibold text-slate-900 truncate block mt-0.5" title={conn.requestTitle}>
                          {conn.requestTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {new Date(conn.assignedDate || conn.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(conn.status)}</td>

                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedConnection(conn)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs"
                        >
                          View Audit
                        </button>
                        <Link
                          to={`/requests/${conn.requestId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-colors"
                        >
                          <span>Open Request</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit & Timeline Modal */}
      {selectedConnection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Connection Audit Trail: {selectedConnection._id}</span>
                </h3>
                <span className="text-xs text-slate-400">Assigned by: {selectedConnection.assignedBy}</span>
              </div>
              <button
                onClick={() => setSelectedConnection(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Assignment Notes:</span>
                <p className="text-slate-700 italic">"{selectedConnection.notes || 'No admin notes recorded.'}"</p>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-2">Status Transition History:</span>
                <div className="space-y-2 border-l-2 border-purple-200 pl-3 ml-2">
                  {(selectedConnection.statusHistory || []).map((h, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 capitalize">{h.status}</span>
                        <span className="text-[10px] text-slate-400">{new Date(h.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600">{h.note}</p>
                      <span className="text-[10px] text-slate-400">Actor: {h.actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedConnection(null)}
                className="px-4 py-2 rounded-xl bg-[#121226] text-white font-bold text-xs"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminConnectionsPage;
