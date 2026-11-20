import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Share2,
  CheckCircle2,
  Building,
  ArrowRight,
} from 'lucide-react';
import { jobsApi } from '../../services/api';
import { IJob } from '../../types';
import { ShareModal } from '../../components/sharing/ShareModal';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Share modal state
  const [shareJob, setShareJob] = useState<IJob | null>(null);

  const navigate = useNavigate();

  const loadJobs = () => {
    setLoading(true);
    jobsApi.getJobs({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      workMode: selectedWorkMode !== 'all' ? selectedWorkMode : undefined,
      search: search || undefined,
    })
      .then((res) => setJobs(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, [selectedCategory, selectedWorkMode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
          Verified Employers
        </span>
        <h1 className="text-3xl font-extrabold text-navy-900 mt-2">Career & Job Opportunities</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore positions published directly by verified corporate partners and fast-growing startups.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadJobs()}
            placeholder="Search job titles or skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="software development">Software Development</option>
            <option value="data science">Data Science</option>
            <option value="digital marketing">Digital Marketing</option>
            <option value="business management">Business Management</option>
          </select>

          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Work Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">No Job Openings Match Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or explore other categories.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                    {job.workMode.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {job.employmentType}
                  </span>
                  <span className="text-xs text-slate-400">• Deadline: {job.deadline}</span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-navy-900 group-hover:text-teal-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-teal-600" />
                    {job.businessName} • <span className="text-slate-400 font-normal">{job.location}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:text-right flex flex-col md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                <span className="text-xl font-extrabold text-navy-900">
                  ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-normal">/ yr</span>
                </span>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareJob(job);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-teal-600 hover:bg-slate-50 transition-colors"
                    title="Share Job"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-xl bg-teal-600 group-hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    View & Apply <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {shareJob && (
        <ShareModal
          isOpen={!!shareJob}
          onClose={() => setShareJob(null)}
          targetType="job"
          targetId={shareJob._id}
          title={shareJob.title}
        />
      )}
    </div>
  );
};
