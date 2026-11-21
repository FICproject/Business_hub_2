import React, { useState, useEffect } from 'react';
import {
  Share2,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MousePointerClick,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminReferralsPage: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [search, setSearch] = useState('');
  const [targetFilter, setTargetFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    adminApi.getAllSharedLinks()
      .then((res) => {
        setLinks(res.data.data || []);
        setTotalClicks(res.data.totalClicks || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (url: string, code: string) => {
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredLinks = links.filter((l) => {
    const matchesSearch =
      (l.title && l.title.toLowerCase().includes(search.toLowerCase())) ||
      (l.code && l.code.toLowerCase().includes(search.toLowerCase())) ||
      (l.targetType && l.targetType.toLowerCase().includes(search.toLowerCase()));
    const matchesTarget = targetFilter === 'all' || l.targetType === targetFilter;
    return matchesSearch && matchesTarget;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Referrals & Clean Sharing</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor product, service, and job shared links and verified click attribution.
          </p>
        </div>

        {/* PRD Compliance Banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Zero-Commission Policy Enforced (No MLM / Affiliate cuts)</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Generated Links</p>
            <p className="text-2xl font-black text-white mt-0.5">{links.length}</p>
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Tracked Clicks</p>
            <p className="text-2xl font-black text-white mt-0.5">{totalClicks}</p>
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Avg Clicks / Link</p>
            <p className="text-2xl font-black text-white mt-0.5">
              {links.length > 0 ? (totalClicks / links.length).toFixed(1) : '0'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by link title, code, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <select
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
        >
          <option value="all">All Resource Types</option>
          <option value="product">Products</option>
          <option value="service">Services</option>
          <option value="job">Jobs</option>
        </select>
      </div>

      {/* Shared Links Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading referral records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Target Resource</th>
                  <th className="p-4">Resource Type</th>
                  <th className="p-4">Share Code</th>
                  <th className="p-4">Tracked Clicks</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Direct Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No share links recorded yet.</td>
                  </tr>
                ) : (
                  filteredLinks.map((l) => (
                    <tr key={l._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-white">{l.title || 'Platform Resource'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          l.targetType === 'product'
                            ? 'bg-blue-500/10 text-blue-400'
                            : l.targetType === 'job'
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {l.targetType}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-300">{l.code}</td>
                      <td className="p-4">
                        <span className="font-extrabold text-teal-400">{l.clickCount || 0}</span> clicks
                      </td>
                      <td className="p-4 text-slate-400">
                        {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleCopy(l.fullUrl || `http://localhost:3000/share/${l.code}`, l.code)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
                        >
                          {copiedCode === l.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
