import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Building,
  MapPin,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Briefcase,
  FileText,
  Eye,
  Download,
  Printer,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  ExternalLink,
  Award,
  Clock,
  Sparkles,
  FileCheck,
  Globe,
  DollarSign,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminJobsPage = () => {
  // Navigation Tabs: 'applications' | 'listings'
  const [activeTab, setActiveTab] = useState('applications');

  // Listings state
  const [jobs, setJobs] = useState([]);
  const [listingsSearch, setListingsSearch] = useState('');
  const [listingsStatusFilter, setListingsStatusFilter] = useState('all');
  const [listingsLoading, setListingsLoading] = useState(true);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsSearch, setAppsSearch] = useState('');
  const [filterJob, setFilterJob] = useState('all');
  const [filterQualification, setFilterQualification] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal inspection state
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);

  // Feedback notifications
  const [feedback, setFeedback] = useState(null);

  // Fetch Jobs Listings
  const loadJobs = () => {
    setListingsLoading(true);
    adminApi
      .getJobs()
      .then((res) => setJobs(res.data.data || []))
      .catch((err) => console.error('Error fetching jobs:', err))
      .finally(() => setListingsLoading(false));
  };

  // Fetch Applications
  const loadApplications = () => {
    setAppsLoading(true);
    adminApi
      .getJobApplications()
      .then((res) => {
        if (res.data?.success) {
          setApplications(res.data.data || []);
        }
      })
      .catch((err) => console.error('Error fetching job applications:', err))
      .finally(() => setAppsLoading(false));
  };

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  // Inspect Application Dossier (Automatically marks application as Viewed)
  const handleOpenDossier = async (application) => {
    setSelectedApplication(application);
    setDossierLoading(true);
    try {
      const res = await adminApi.getJobApplicationById(application._id);
      if (res.data?.success && res.data.data) {
        setSelectedApplication(res.data.data);
        // Reflect status change to 'Viewed' in parent table
        setApplications((prev) =>
          prev.map((app) =>
            app._id === application._id ? { ...app, status: 'Viewed', viewedAt: new Date().toISOString() } : app
          )
        );
      }
    } catch (err) {
      console.warn('Could not auto-mark viewed:', err.message);
    } finally {
      setDossierLoading(false);
    }
  };

  // Toggle job active status
  const handleToggleJobStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      await adminApi.updateJobStatus(id, newStatus);
      setFeedback(`Job status updated to ${newStatus}.`);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Delete Job Listing
  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the job listing "${title}"?`)) return;
    try {
      await adminApi.deleteJob(id);
      setFeedback(`Job "${title}" deleted.`);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Export Applications to CSV / Excel
  const handleExportCSV = () => {
    if (filteredApplications.length === 0) {
      alert('No applications available to export with current filters.');
      return;
    }

    const headers = [
      'Application ID',
      'Student Name',
      'Email',
      'Mobile',
      'Job Title',
      'Employer',
      'Highest Qualification',
      'Degree / Course',
      'Specialization',
      'College / University',
      'Graduation Year',
      'CGPA / Percentage',
      'Professional Type',
      'Experience (Years)',
      'Skills',
      'Submission Date',
      'Status',
      'Resume URL',
    ];

    const rows = filteredApplications.map((app) => [
      `"${app.applicationId || app._id}"`,
      `"${(app.personalInfo?.fullName || app.studentName || '').replace(/"/g, '""')}"`,
      `"${app.personalInfo?.email || app.studentEmail || ''}"`,
      `"${app.personalInfo?.mobile || app.studentMobile || ''}"`,
      `"${(app.jobTitle || '').replace(/"/g, '""')}"`,
      `"${(app.jobSnapshot?.businessName || app.businessName || 'Business Hub Partner').replace(/"/g, '""')}"`,
      `"${app.educationalDetails?.highestQualification || ''}"`,
      `"${(app.educationalDetails?.courseDegree || '').replace(/"/g, '""')}"`,
      `"${(app.educationalDetails?.specialization || '').replace(/"/g, '""')}"`,
      `"${(app.educationalDetails?.collegeUniversity || '').replace(/"/g, '""')}"`,
      `"${app.educationalDetails?.graduationYear || ''}"`,
      `"${app.educationalDetails?.percentageCgpa || ''}"`,
      `"${app.professionalDetails?.isFresher ? 'Fresher' : 'Experienced'}"`,
      `"${app.professionalDetails?.totalExperience || 0}"`,
      `"${(app.professionalDetails?.technicalSkills?.join('; ') || '').replace(/"/g, '""')}"`,
      `"${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ''}"`,
      `"${app.status || 'Submitted'}"`,
      `"${app.documents?.resumeUrl || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `job_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Applications Summary Report
  const handlePrintReport = () => {
    window.print();
  };

  // Distinct Qualifications for filter dropdown
  const uniqueQualifications = useMemo(() => {
    const list = new Set();
    applications.forEach((app) => {
      const q = app.educationalDetails?.highestQualification;
      if (q) list.add(q);
    });
    return Array.from(list);
  }, [applications]);

  // Distinct Job Titles for filter dropdown
  const uniqueJobTitles = useMemo(() => {
    const list = new Set();
    applications.forEach((app) => {
      const t = app.jobTitle;
      if (t) list.add(t);
    });
    return Array.from(list);
  }, [applications]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const q = appsSearch.toLowerCase();
      const matchesSearch =
        !appsSearch ||
        (app.applicationId && app.applicationId.toLowerCase().includes(q)) ||
        (app.personalInfo?.fullName && app.personalInfo.fullName.toLowerCase().includes(q)) ||
        (app.personalInfo?.email && app.personalInfo.email.toLowerCase().includes(q)) ||
        (app.jobTitle && app.jobTitle.toLowerCase().includes(q));

      const matchesJob = filterJob === 'all' || app.jobTitle === filterJob;
      const matchesQual =
        filterQualification === 'all' ||
        app.educationalDetails?.highestQualification === filterQualification;
      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;

      return matchesSearch && matchesJob && matchesQual && matchesStatus;
    });
  }, [applications, appsSearch, filterJob, filterQualification, filterStatus]);

  // Filtered Job Listings
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch =
        j.title.toLowerCase().includes(listingsSearch.toLowerCase()) ||
        (j.businessName && j.businessName.toLowerCase().includes(listingsSearch.toLowerCase())) ||
        (j.location && j.location.toLowerCase().includes(listingsSearch.toLowerCase()));
      const matchesStatus = listingsStatusFilter === 'all' || j.status === listingsStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, listingsSearch, listingsStatusFilter]);

  // Metric counts
  const totalAppsCount = applications.length;
  const submittedUnreadCount = applications.filter((a) => a.status === 'Submitted').length;
  const viewedCount = applications.filter((a) => a.status === 'Viewed').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-teal-400" />
            Jobs & Career Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain student job applications, examine candidate dossiers, and oversee platform employment opportunities.
          </p>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-sm">
            <span className="text-slate-400">Total Applications: </span>
            <span className="font-extrabold text-white ml-1">{totalAppsCount}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs shadow-sm">
            <span className="text-amber-400">Submitted (Unread): </span>
            <span className="font-extrabold text-amber-300 ml-1">{submittedUnreadCount}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs shadow-sm">
            <span className="text-teal-400">Viewed: </span>
            <span className="font-extrabold text-teal-300 ml-1">{viewedCount}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Tabs Header Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'applications'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Student Job Applications</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'applications' ? 'bg-slate-950 text-teal-400' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {totalAppsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'listings'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Job Listings & Moderation</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'listings' ? 'bg-slate-950 text-teal-400' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {jobs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: STUDENT JOB APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters, CSV Export, Print */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by student name, application ID, email, or job title..."
                value={appsSearch}
                onChange={(e) => setAppsSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Job Title Filter */}
              <select
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Jobs</option>
                {uniqueJobTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>

              {/* Qualification Filter */}
              <select
                value={filterQualification}
                onChange={(e) => setFilterQualification(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Qualifications</option>
                {uniqueQualifications.map((qual) => (
                  <option key={qual} value={qual}>
                    {qual}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Statuses</option>
                <option value="Submitted">Submitted (Unread)</option>
                <option value="Viewed">Viewed</option>
              </select>

              {/* Export to CSV */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 shadow-sm"
                title="Export applications to CSV"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>Export CSV</span>
              </button>

              {/* Print Report */}
              <button
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 shadow-sm"
                title="Print Applications Report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {appsLoading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading submitted applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-400">No student job applications found</p>
                <p className="text-xs text-slate-500">
                  {applications.length === 0
                    ? 'No students have applied for jobs yet.'
                    : 'No applications match your active search filters.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase font-bold text-[10px] tracking-wider">
                      <th className="p-4">Application ID</th>
                      <th className="p-4">Student Profile</th>
                      <th className="p-4">Target Position</th>
                      <th className="p-4">Qualification</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Dossier Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredApplications.map((app) => {
                      const isUnread = app.status === 'Submitted';
                      return (
                        <tr
                          key={app._id}
                          className={`hover:bg-slate-900/40 transition-colors ${isUnread ? 'bg-amber-500/[0.02]' : ''}`}
                        >
                          <td className="p-4 font-mono font-bold text-teal-400">
                            {app.applicationId || app._id}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">
                              {app.personalInfo?.fullName || app.studentName || 'Student Applicant'}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-500" />
                                {app.personalInfo?.email || app.studentEmail}
                              </span>
                              {app.personalInfo?.mobile && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-500" />
                                  {app.personalInfo?.mobile}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-200">{app.jobTitle || 'Career Opening'}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-500" />
                              {app.jobSnapshot?.businessName || app.businessName || 'Business Hub Partner'}
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="text-slate-300 font-medium">
                              {app.educationalDetails?.highestQualification || 'Not specified'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {app.educationalDetails?.courseDegree}
                              {app.educationalDetails?.specialization ? ` (${app.educationalDetails.specialization})` : ''}
                            </div>
                          </td>
                          <td className="p-4 text-slate-400 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {isUnread ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Clock className="w-3 h-3" />
                                SUBMITTED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-800 text-slate-300 border border-slate-700">
                                <Eye className="w-3 h-3 text-teal-400" />
                                VIEWED
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleOpenDossier(app)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold transition-all shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Dossier</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: JOB LISTINGS & MODERATION */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by job title, employer, or location..."
                value={listingsSearch}
                onChange={(e) => setListingsSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={listingsStatusFilter}
              onChange={(e) => setListingsStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>

          {/* Jobs Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {listingsLoading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading job postings...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No job listings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase font-bold text-[10px] tracking-wider">
                      <th className="p-4">Position</th>
                      <th className="p-4">Publisher / Business</th>
                      <th className="p-4">Location & Work Mode</th>
                      <th className="p-4">Salary Range</th>
                      <th className="p-4">Applications Received</th>
                      <th className="p-4">Listing Status</th>
                      <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredJobs.map((j) => (
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
                          <span className="inline-flex items-center gap-1 text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                            <Users className="w-3.5 h-3.5" />
                            {j.applicantsCount || 0} applications
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              j.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {j.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleJobStatus(j._id, j.status)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPLICATION DOSSIER MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 text-white max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded font-mono text-xs font-black bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    {selectedApplication.applicationId || selectedApplication._id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    Status: {selectedApplication.status || 'Viewed'}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mt-2">
                  Application for {selectedApplication.jobTitle || 'Career Opportunity'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submitted on{' '}
                  {selectedApplication.createdAt
                    ? new Date(selectedApplication.createdAt).toLocaleDateString()
                    : 'N/A'}
                  {' • '}
                  Employer: {selectedApplication.jobSnapshot?.businessName || selectedApplication.businessName || 'Business Hub Partner'}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Structured Dossier Sections */}
            <div className="space-y-6 text-xs">
              {/* SECTION 1: Personal Information */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <h3 className="font-extrabold text-sm text-teal-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  1. Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Full Name</span>
                    <span className="font-bold text-white text-sm">
                      {selectedApplication.personalInfo?.fullName || selectedApplication.studentName || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email Address</span>
                    <span className="font-bold text-white">
                      {selectedApplication.personalInfo?.email || selectedApplication.studentEmail || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mobile Number</span>
                    <span className="font-bold text-white">
                      {selectedApplication.personalInfo?.mobile || selectedApplication.studentMobile || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Birth</span>
                    <span className="font-semibold text-slate-200">
                      {selectedApplication.personalInfo?.dob || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gender</span>
                    <span className="font-semibold text-slate-200 capitalize">
                      {selectedApplication.personalInfo?.gender || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Residential Location</span>
                    <span className="font-semibold text-slate-200">
                      {selectedApplication.personalInfo?.city || ''},{' '}
                      {selectedApplication.personalInfo?.state || ''} -{' '}
                      {selectedApplication.personalInfo?.pincode || ''}
                    </span>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-slate-500 block">Address</span>
                    <span className="font-semibold text-slate-300">
                      {selectedApplication.personalInfo?.address || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Educational Details */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <h3 className="font-extrabold text-sm text-teal-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  2. Educational Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Highest Qualification</span>
                    <span className="font-bold text-white">
                      {selectedApplication.educationalDetails?.highestQualification || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Course / Degree</span>
                    <span className="font-bold text-white">
                      {selectedApplication.educationalDetails?.courseDegree || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Specialization</span>
                    <span className="font-semibold text-slate-200">
                      {selectedApplication.educationalDetails?.specialization || 'N/A'}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-500 block">College / University</span>
                    <span className="font-semibold text-slate-200">
                      {selectedApplication.educationalDetails?.collegeUniversity || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Graduation Year & Score</span>
                    <span className="font-semibold text-teal-400">
                      {selectedApplication.educationalDetails?.graduationYear || 'N/A'} •{' '}
                      {selectedApplication.educationalDetails?.percentageCgpa || 'N/A'}
                    </span>
                  </div>
                  {selectedApplication.educationalDetails?.additionalQualifications && (
                    <div className="md:col-span-3">
                      <span className="text-slate-500 block">Additional Qualifications</span>
                      <span className="font-semibold text-slate-300">
                        {selectedApplication.educationalDetails.additionalQualifications}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Professional Details */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <h3 className="font-extrabold text-sm text-teal-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  3. Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Experience Type</span>
                    <span className="font-bold text-white capitalize">
                      {selectedApplication.professionalDetails?.isFresher ? 'Fresher' : 'Experienced'}
                    </span>
                  </div>
                  {!selectedApplication.professionalDetails?.isFresher && (
                    <>
                      <div>
                        <span className="text-slate-500 block">Total Experience</span>
                        <span className="font-bold text-white">
                          {selectedApplication.professionalDetails?.totalExperience || 0} years
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Previous Company & Role</span>
                        <span className="font-semibold text-slate-200">
                          {selectedApplication.professionalDetails?.previousCompany || 'N/A'} (
                          {selectedApplication.professionalDetails?.previousJobRole || 'N/A'})
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Technical Skills */}
                <div>
                  <span className="text-slate-500 block mb-1.5">Technical Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplication.professionalDetails?.technicalSkills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold"
                      >
                        {skill}
                      </span>
                    )) || <span className="text-slate-500">None specified</span>}
                  </div>
                </div>

                {/* Soft Skills */}
                {selectedApplication.professionalDetails?.softSkills?.length > 0 && (
                  <div>
                    <span className="text-slate-500 block mb-1.5">Soft Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApplication.professionalDetails.softSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications & Internships */}
                {(selectedApplication.professionalDetails?.certifications ||
                  selectedApplication.professionalDetails?.internshipDetails) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
                    {selectedApplication.professionalDetails?.certifications && (
                      <div>
                        <span className="text-slate-500 block">Certifications</span>
                        <span className="text-slate-300">
                          {selectedApplication.professionalDetails.certifications}
                        </span>
                      </div>
                    )}
                    {selectedApplication.professionalDetails?.internshipDetails && (
                      <div>
                        <span className="text-slate-500 block">Internship Details</span>
                        <span className="text-slate-300">
                          {selectedApplication.professionalDetails.internshipDetails}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 4: Uploaded Documents */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <h3 className="font-extrabold text-sm text-teal-400 flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  4. Uploaded Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Resume / CV (Mandatory) */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Resume / CV</span>
                      <span className="text-[10px] text-teal-400 font-bold uppercase">Mandatory Document</span>
                    </div>
                    {selectedApplication.documents?.resumeUrl ? (
                      <a
                        href={selectedApplication.documents.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-extrabold hover:bg-teal-400 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview / Download</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">Not provided</span>
                    )}
                  </div>

                  {/* Educational Certificates */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Educational Certificate</span>
                      <span className="text-[10px] text-slate-500">Degree / Marksheet</span>
                    </div>
                    {selectedApplication.documents?.educationalCertificateUrl ? (
                      <a
                        href={selectedApplication.documents.educationalCertificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">Not uploaded</span>
                    )}
                  </div>

                  {/* Experience Certificate */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Experience Certificate</span>
                      <span className="text-[10px] text-slate-500">Service letter / Relieving</span>
                    </div>
                    {selectedApplication.documents?.experienceCertificateUrl ? (
                      <a
                        href={selectedApplication.documents.experienceCertificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">Not uploaded</span>
                    )}
                  </div>

                  {/* Portfolio Document */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Portfolio Document</span>
                      <span className="text-[10px] text-slate-500">Work sample / Case study</span>
                    </div>
                    {selectedApplication.documents?.portfolioUrl ? (
                      <a
                        href={selectedApplication.documents.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">Not uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: Additional Information */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <h3 className="font-extrabold text-sm text-teal-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  5. Additional Information & Profiles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">LinkedIn Profile</span>
                    {selectedApplication.additionalInfo?.linkedinUrl ? (
                      <a
                        href={selectedApplication.additionalInfo.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-400 hover:underline flex items-center gap-1"
                      >
                        <span>Visit Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block">GitHub Profile</span>
                    {selectedApplication.additionalInfo?.githubUrl ? (
                      <a
                        href={selectedApplication.additionalInfo.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-400 hover:underline flex items-center gap-1"
                      >
                        <span>Visit GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block">Portfolio Website</span>
                    {selectedApplication.additionalInfo?.portfolioUrl ? (
                      <a
                        href={selectedApplication.additionalInfo.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-400 hover:underline flex items-center gap-1"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block">Notice Period / Availability</span>
                    <span className="font-semibold text-slate-200">
                      {selectedApplication.additionalInfo?.noticePeriod || 'Immediate'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Expected Compensation</span>
                    <span className="font-semibold text-slate-200">
                      {selectedApplication.additionalInfo?.expectedSalary
                        ? `$${selectedApplication.additionalInfo.expectedSalary.toLocaleString()}`
                        : 'Negotiable / Standard'}
                    </span>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.additionalInfo?.coverLetter && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-slate-500 block mb-1">Cover Letter</span>
                    <div className="p-3 bg-slate-900 rounded-xl text-slate-300 whitespace-pre-line leading-relaxed">
                      {selectedApplication.additionalInfo.coverLetter}
                    </div>
                  </div>
                )}
              </div>

              {/* Administrative Policy Notice */}
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>
                  Business Hub Admin collects, views, and maintains verified student application dossiers. In
                  accordance with platform rules, candidate recruitment and interview scheduling decisions are
                  facilitated directly by hiring organizations.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
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
