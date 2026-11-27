import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  ExternalLink,
  Search,
  FileText,
  Eye,
  CheckCircle,
  X,
  User,
  GraduationCap,
  Download,
  Building2,
} from 'lucide-react';

export const JobApplicationsView = ({ applications }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectModalApp, setInspectModalApp] = useState(null);

  // Status pills strictly for "Submitted" and "Viewed" (PRD Section 4)
  const statusConfig = {
    submitted: {
      label: 'Submitted',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
    viewed: {
      label: 'Viewed',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
    },
  };

  const filtered = (applications || []).filter((app) => {
    const rawStatus = (app.status || 'submitted').toLowerCase();
    const matchesFilter = filterStatus === 'all' || rawStatus === filterStatus.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-navy-950">My Job Applications</h3>
            <p className="text-xs text-slate-500">
              Track applications submitted directly to Business Hub Admin.
            </p>
          </div>
          <Link
            to="/jobs"
            className="px-4 py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Explore More Jobs
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Status Tabs: all, Submitted, Viewed (PRD Section 4) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {[
              { id: 'all', label: 'All Applications' },
              { id: 'submitted', label: 'Submitted' },
              { id: 'viewed', label: 'Viewed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-navy-950 text-white shadow-xs'
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
              placeholder="Search by job title or app ID..."
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
          <p className="text-xs text-slate-500">Apply to verified corporate positions and view your submitted dossiers here.</p>
          <Link to="/jobs" className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-navy-950 text-white font-bold text-xs">
            Browse Verified Openings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((app) => {
            const rawStatus = (app.status || 'submitted').toLowerCase();
            const conf = statusConfig[rawStatus] || statusConfig.submitted;

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${conf.bg} ${conf.text} ${conf.border}`}>
                        {conf.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: {app.applicationId || app._id}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        Submitted on {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-navy-950">
                      {app.jobTitle || 'Career Opening'}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.businessName || 'Business Hub Partner'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => setInspectModalApp(app)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" /> View Application
                    </button>
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl"
                    >
                      Job Details <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Dossier Preview Summary */}
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-navy-950">
                      Applicant: {app.fullName} ({app.highestQualification || 'Graduate'})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Contact: {app.email} • {app.mobile || app.phone} • Experience: {app.totalExperience || 'Fresher'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-600" /> View Resume
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          APPLICATION DOSSIER MODAL (Student Read-only Inspection)
      ========================================================================= */}
      {inspectModalApp && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl p-6 sm:p-8 space-y-5 my-auto max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800">
                  Application ID: {inspectModalApp.applicationId || inspectModalApp._id}
                </span>
                <h3 className="text-xl font-extrabold text-navy-950 mt-1">{inspectModalApp.jobTitle}</h3>
                <p className="text-xs text-slate-500">
                  Applied on {new Date(inspectModalApp.appliedAt).toLocaleDateString()} • Status: {inspectModalApp.status}
                </p>
              </div>
              <button
                onClick={() => setInspectModalApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Personal Information */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-extrabold text-xs uppercase text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" /> Personal Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                  <div><span className="text-slate-400">Name:</span> <span className="font-bold">{inspectModalApp.fullName}</span></div>
                  <div><span className="text-slate-400">Email:</span> <span className="font-bold">{inspectModalApp.email}</span></div>
                  <div><span className="text-slate-400">Mobile:</span> <span className="font-bold">{inspectModalApp.mobile || inspectModalApp.phone}</span></div>
                  <div><span className="text-slate-400">DOB:</span> <span>{inspectModalApp.dob || 'N/A'}</span></div>
                  <div><span className="text-slate-400">Gender:</span> <span>{inspectModalApp.gender || 'N/A'}</span></div>
                  <div><span className="text-slate-400">Location:</span> <span>{inspectModalApp.city}, {inspectModalApp.state} ({inspectModalApp.pincode})</span></div>
                </div>
              </div>

              {/* Educational Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-extrabold text-xs uppercase text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" /> Educational Qualifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                  <div><span className="text-slate-400">Degree:</span> <span className="font-bold">{inspectModalApp.highestQualification}</span></div>
                  <div><span className="text-slate-400">Course:</span> <span>{inspectModalApp.courseDegree}</span></div>
                  <div><span className="text-slate-400">Specialization:</span> <span>{inspectModalApp.specialization}</span></div>
                  <div><span className="text-slate-400">College:</span> <span>{inspectModalApp.collegeUniversity}</span></div>
                  <div><span className="text-slate-400">Year:</span> <span>{inspectModalApp.graduationYear}</span></div>
                  <div><span className="text-slate-400">Score / CGPA:</span> <span className="font-bold text-teal-600">{inspectModalApp.percentageCgpa}</span></div>
                </div>
              </div>

              {/* Professional Experience */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-extrabold text-xs uppercase text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" /> Experience & Technical Skills
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><span className="text-slate-400">Category:</span> <span className="capitalize font-bold">{inspectModalApp.experienceType}</span></div>
                  <div><span className="text-slate-400">Total Experience:</span> <span className="font-bold">{inspectModalApp.totalExperience}</span></div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Technical Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(inspectModalApp.technicalSkills) ? (
                      inspectModalApp.technicalSkills.map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span>{inspectModalApp.technicalSkills || 'N/A'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-extrabold text-xs uppercase text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" /> Uploaded Documents
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {inspectModalApp.resumeUrl && (
                    <a
                      href={inspectModalApp.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-teal-700 font-bold flex items-center gap-1.5 hover:bg-slate-100 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Resume / CV (Verified)
                    </a>
                  )}
                  {inspectModalApp.educationalCertificatesUrl && (
                    <a
                      href={inspectModalApp.educationalCertificatesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center gap-1.5 hover:bg-slate-100 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Educational Certificate
                    </a>
                  )}
                  {inspectModalApp.portfolioDocumentsUrl && (
                    <a
                      href={inspectModalApp.portfolioDocumentsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center gap-1.5 hover:bg-slate-100 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Portfolio Document
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setInspectModalApp(null)}
                className="px-5 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default JobApplicationsView;
