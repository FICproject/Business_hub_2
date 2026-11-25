import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building, Share2, CheckCircle2, ArrowLeft, Send, } from 'lucide-react';
import { jobsApi } from '../../services/api';
import { ShareModal } from '../../components/sharing/ShareModal';
export const JobDetailPage = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isShareOpen, setIsShareOpen] = useState(false);
    // Application Modal
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.mobile || '');
    const [resumeUrl, setResumeUrl] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [applied, setApplied] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            setLoading(true);
            jobsApi.getJobById(id)
                .then((res) => setJob(res.data.job))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);
    const handleApply = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!id)
            return;
        setError(null);
        setApplyLoading(true);
        try {
            const res = await jobsApi.applyForJob(id, {
                fullName,
                email,
                phone,
                resumeUrl,
                coverLetter,
            });
            if (res.data.success) {
                setApplied(true);
            }
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application.');
        }
        finally {
            setApplyLoading(false);
        }
    };
    if (loading) {
        return (<div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>);
    }
    if (!job) {
        return (<div className="max-w-md mx-auto my-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Job Not Found</h2>
        <Link to="/jobs" className="inline-block px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs">
          Return to Jobs
        </Link>
      </div>);
    }
    return (<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/jobs" className="hover:text-teal-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5"/> Back to Jobs
        </Link>
        <span>/</span>
        <span className="text-slate-800">{job.category}</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{job.title}</span>
      </div>

      {/* Main Job Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                {job.workMode.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                {job.employmentType}
              </span>
              <span className="text-xs text-slate-400">• Deadline: {job.deadline}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-snug">
              {job.title}
            </h1>

            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600"/>
              {job.businessName} • <span className="text-slate-400 font-normal">{job.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsShareOpen(true)} className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:text-teal-600 hover:bg-slate-50 transition-colors" title="Share Job">
              <Share2 className="w-4 h-4"/>
            </button>
            <button onClick={() => setApplyModalOpen(true)} className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all">
              Apply for Job
            </button>
          </div>
        </div>

        {/* Highlight Stats Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Salary Range</span>
            <p className="font-extrabold text-navy-900 text-sm mt-0.5">
              ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
            </p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Experience</span>
            <p className="font-extrabold text-navy-900 text-sm mt-0.5">{job.experienceLevel}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Work Mode</span>
            <p className="font-extrabold text-navy-900 text-sm mt-0.5 capitalize">{job.workMode}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Applicants</span>
            <p className="font-extrabold text-navy-900 text-sm mt-0.5">{job.applicantsCount || 10}+ applied</p>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-extrabold text-navy-900">About the Role</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {/* Key Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (<div className="space-y-3 pt-2">
            <h3 className="text-base font-extrabold text-navy-900">Key Responsibilities</h3>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (<li key={i} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></span>
                  <span>{r}</span>
                </li>))}
            </ul>
          </div>)}

        {/* Qualifications & Requirements */}
        {job.requirements && job.requirements.length > 0 && (<div className="space-y-3 pt-2">
            <h3 className="text-base font-extrabold text-navy-900">Required Qualifications</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (<li key={i} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0"/>
                  <span>{req}</span>
                </li>))}
            </ul>
          </div>)}

        {/* Skills Required */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-extrabold text-navy-900">Skills & Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((s) => (<span key={s} className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200/60">
                {s}
              </span>))}
          </div>
        </div>
      </div>

      {/* Instant Application Modal */}
      {applyModalOpen && (<div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                Direct Submission
              </span>
              <h3 className="text-xl font-extrabold text-navy-900 mt-1">Apply for {job.title}</h3>
              <p className="text-xs text-slate-500">Your profile and resume will be securely transmitted to {job.businessName}.</p>
            </div>

            {error && (<div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {error}
              </div>)}

            {applied ? (<div className="p-6 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto"/>
                <h4 className="font-extrabold text-navy-900 text-base">Application Submitted!</h4>
                <p className="text-xs text-slate-600">
                  You can track your interview status directly from your Student / User Dashboard under "My Applications".
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link to="/dashboard/student" className="px-5 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md">
                    View in Dashboard
                  </Link>
                  <button onClick={() => {
                    setApplyModalOpen(false);
                    setApplied(false);
                }} className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                    Done
                  </button>
                </div>
              </div>) : (<form onSubmit={handleApply} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resume Link (PDF / Portfolio URL)</label>
                  <input type="url" required value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Letter / Note</label>
                  <textarea rows={3} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Why are you a great match for this role?" className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={applyLoading} className="flex-grow py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5">
                    {applyLoading ? 'Submitting...' : 'Submit Application'}
                    {!applyLoading && <Send className="w-3.5 h-3.5"/>}
                  </button>
                  <button type="button" onClick={() => setApplyModalOpen(false)} className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
                    Cancel
                  </button>
                </div>
              </form>)}
          </div>
        </div>)}

      {/* Share Modal */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} targetType="job" targetId={job._id} title={job.title}/>
    </div>);
};
