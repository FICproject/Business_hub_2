import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Building,
  MapPin,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Users,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadJobs = () => {
    setLoading(true);
    adminApi.getJobs()
      .then((res) => setJobs(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      await adminApi.updateJobStatus(id, newStatus);
      setFeedback(`Job status updated to ${newStatus}.`);
      loadJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the job listing "${title}"?`)) return;
    try {
      await adminApi.deleteJob(id);
      setFeedback(`Job "${title}" deleted.`);
      loadJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.businessName && j.businessName.toLowerCase().includes(search.toLowerCase())) ||
      (j.location && j.location.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Jobs & Opportunities Moderation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, moderate, and manage career listings published by verified businesses and administrators.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <span className="text-slate-400">Total Jobs: </span>
            <span className="font-extrabold text-white">{jobs.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-emerald-400">Active: </span>
            <span className="font-extrabold text-emerald-300">
              {jobs.filter((j) => j.status === 'active').length}
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by job title, employer, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="closed">Closed Only</option>
        </select>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading job postings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Position</th>
                  <th className="p-4">Publisher / Business</th>
                  <th className="p-4">Location & Work Mode</th>
                  <th className="p-4">Salary Range</th>
                  <th className="p-4">Applicants</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">No job listings found.</td>
                  </tr>
                ) : (
                  filteredJobs.map((j) => (
                    <tr key={j._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white text-sm leading-snug">{j.title}</p>
                        <p className="text-[11px] text-teal-400 capitalize">{j.employmentType || 'Full-time'}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-medium">{j.businessName || 'Business Partner'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{j.location || 'Remote'}</span>
                          <span className="capitalize text-slate-500">({j.workMode || 'Remote'})</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-semibold">
                        ${j.salaryMin?.toLocaleString()} - ${j.salaryMax?.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-teal-400 font-bold">
                          <Users className="w-3.5 h-3.5" />
                          {j.applicantsCount || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          j.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {j.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(j._id, j.status)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title={j.status === 'active' ? 'Close Job' : 'Reactivate Job'}
                          >
                            {j.status === 'active' ? (
                              <XCircle className="w-4 h-4 text-amber-400" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(j._id, j.title)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
