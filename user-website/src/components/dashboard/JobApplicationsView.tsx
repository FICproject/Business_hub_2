import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
  Search,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { IJobApplication } from '../../types';

interface JobApplicationsViewProps {
  applications: IJobApplication[];
  onRefresh?: () => void;
}

export const JobApplicationsView: React.FC<JobApplicationsViewProps> = ({ applications }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status pills and styling
  const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    applied: { label: 'Applied', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    under_review: { label: 'Under Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    shortlisted: { label: 'Shortlisted', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    interview_invited: { label: 'Interview Invited', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    selected: { label: 'Selected', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    not_selected: { label: 'Not Selected', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
  };

  const filtered = applications.filter((app) => {
    const rawStatus = (app.status || 'applied').toLowerCase().replace(' ', '_');
    const matchesFilter = filterStatus === 'all' || rawStatus === filterStatus;
    const matchesQuery =
      !searchQuery ||
      app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-navy-950">Job Application Tracking</h3>
            <p className="text-xs text-slate-500">
              Real-time recruitment status updates from verified business employers
            </p>
          </div>
          <Link
            to="/jobs"
            className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Explore More Jobs
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'applied', label: 'Applied' },
              { id: 'under_review', label: 'Under Review' },
              { id: 'shortlisted', label: 'Shortlisted' },
              { id: 'interview_invited', label: 'Interview' },
              { id: 'selected', label: 'Selected' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by job title..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-extrabold text-navy-950">No applications match your filter</p>
          <p className="text-xs text-slate-500">Apply to verified corporate positions and monitor recruitment stages here.</p>
          <Link
            to="/jobs"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
          >
            Browse Verified Openings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((app) => {
            const rawStatus = (app.status || 'applied').toLowerCase().replace(' ', '_');
            const conf = statusConfig[rawStatus] || statusConfig.applied;
            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${conf.bg} ${conf.text} ${conf.border}`}>
                        {conf.label}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-extrabold text-navy-950">
                      {app.jobTitle || 'Corporate Position'}
                    </h4>
                  </div>

                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl self-start sm:self-auto"
                  >
                    View Job Posting
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Recruiter Details & Interview Information */}
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-navy-900">Application Dossier</p>
                    <p className="text-[11px] text-slate-500">
                      Applicant: {app.fullName} ({app.email}) • Mobile: {app.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        Resume File
                      </a>
                    )}
                  </div>
                </div>

                {/* Timeline Stepper */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className={['applied', 'under_review', 'shortlisted', 'interview_invited', 'selected'].includes(rawStatus) ? 'text-teal-600' : ''}>
                      1. Applied ✓
                    </span>
                    <span className={['under_review', 'shortlisted', 'interview_invited', 'selected'].includes(rawStatus) ? 'text-teal-600' : ''}>
                      2. Under Review
                    </span>
                    <span className={['shortlisted', 'interview_invited', 'selected'].includes(rawStatus) ? 'text-teal-600' : ''}>
                      3. Shortlisted
                    </span>
                    <span className={['interview_invited', 'selected'].includes(rawStatus) ? 'text-teal-600' : ''}>
                      4. Interview
                    </span>
                    <span className={rawStatus === 'selected' ? 'text-emerald-600' : ''}>
                      5. Offer
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
