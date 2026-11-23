import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Search, MapPin, DollarSign, Share2, CheckCircle2, Building, ArrowRight, Sparkles, ShieldCheck, Code, LineChart, Compass, } from 'lucide-react';
import { jobsApi } from '../../services/api';
import { ShareModal } from '../../components/sharing/ShareModal';
import { Breadcrumb } from '../../components/common/Breadcrumb';
export const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedWorkMode, setSelectedWorkMode] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [titleQuery, setTitleQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [loading, setLoading] = useState(true);
    // Share modal state
    const [shareJob, setShareJob] = useState(null);
    const navigate = useNavigate();
    const loadJobs = () => {
        setLoading(true);
        jobsApi
            .getJobs({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            workMode: selectedWorkMode !== 'all' ? selectedWorkMode : undefined,
            search: titleQuery || undefined,
        })
            .then((res) => {
            if (res.data?.data) {
                setJobs(res.data.data);
            }
        })
            .catch((err) => console.error('Jobs load error:', err.message))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        loadJobs();
    }, [selectedCategory, selectedWorkMode]);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadJobs();
    };
    const careerCategories = [
        { label: 'All Fields', value: 'all', icon: Compass },
        { label: 'Software Development', value: 'software development', icon: Code },
        { label: 'Data Science & AI', value: 'data science', icon: LineChart },
        { label: 'Digital Marketing', value: 'digital marketing', icon: Sparkles },
        { label: 'Business Management', value: 'business management', icon: Building },
    ];
    // Filtering based on active tab and location query
    const filteredJobs = jobs.filter((job) => {
        // Location filter
        if (locationQuery.trim()) {
            const locMatch = job.location.toLowerCase().includes(locationQuery.toLowerCase().trim());
            if (!locMatch)
                return false;
        }
        // Tab filter
        if (activeTab === 'internships') {
            return job.employmentType === 'internship';
        }
        if (activeTab === 'fresher') {
            const exp = (job.experienceLevel || '').toLowerCase();
            const title = job.title.toLowerCase();
            return (exp.includes('entry') ||
                exp.includes('junior') ||
                exp.includes('fresher') ||
                title.includes('junior') ||
                title.includes('intern') ||
                title.includes('trainee'));
        }
        if (activeTab === 'remote') {
            return job.workMode === 'remote';
        }
        return true;
    });
    return (<div className="bg-white min-h-screen text-[#0A255C] font-sans pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb currentPage="Jobs & Careers"/>

        {/* =====================================================================
            1. CAREER HERO SECTION
        ====================================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white shadow-2xl overflow-hidden mb-12">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"/>

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <Briefcase className="w-3.5 h-3.5"/>
              <span>Verified Corporate Job Board</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Launch Your Career at <br />
              <span className="text-[#FFB800]">Verified Companies</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              Direct recruitment from verified enterprise partners and high-growth ventures. Zero fake job scams, transparent salary bands, and direct candidate-to-employer applications.
            </p>

            {/* Quick Multi-Field Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                <input type="text" value={titleQuery} onChange={(e) => setTitleQuery(e.target.value)} placeholder="Job title, skills or keywords..." className="w-full pl-10 pr-3 py-3 rounded-xl bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFB800]"/>
              </div>

              <div className="sm:col-span-4 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                <input type="text" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} placeholder="City, state, or 'Remote'..." className="w-full pl-10 pr-3 py-3 rounded-xl bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFB800]"/>
              </div>

              <div className="sm:col-span-2">
                <button type="submit" className="w-full h-full py-3 px-4 rounded-xl bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5">
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5 font-bold"/>
                </button>
              </div>
            </form>

            {/* Trust Points */}
            <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400"/>
                <span>100% Verified Employers</span>
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400"/>
                <span>Transparent Salary Bands</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400"/>
                <span>Direct Application Tracking</span>
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. CAREER CATEGORIES
        ====================================================================== */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Career Categories</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Explore high-demand tracks and open vacancies</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {careerCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (<button key={cat.value} type="button" onClick={() => setSelectedCategory(cat.value)} className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all group ${isSelected
                    ? 'bg-[#0A255C] text-white border-[#0A255C] shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300 shadow-sm'}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${isSelected ? 'bg-white/10 text-[#FFB800]' : 'bg-slate-100 text-slate-700'}`}>
                    <Icon className="w-5 h-5"/>
                  </div>
                  <span className="text-xs font-bold leading-tight">{cat.label}</span>
                </button>);
        })}
          </div>
        </section>

        {/* =====================================================================
            3. JOB TYPE TABS (All, Latest, Internships, Fresher Jobs, Remote)
        ====================================================================== */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Quick Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full md:w-auto">
            <button type="button" onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'all' ? 'bg-[#0A255C] text-white shadow-sm' : 'text-slate-600 hover:text-[#0A255C]'}`}>
              All Openings ({jobs.length})
            </button>
            <button type="button" onClick={() => setActiveTab('latest')} className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'latest' ? 'bg-[#0A255C] text-white shadow-sm' : 'text-slate-600 hover:text-[#0A255C]'}`}>
              Latest Openings
            </button>
            <button type="button" onClick={() => setActiveTab('internships')} className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'internships'
            ? 'bg-[#0A255C] text-white shadow-sm'
            : 'text-slate-600 hover:text-[#0A255C]'}`}>
              Internships
            </button>
            <button type="button" onClick={() => setActiveTab('fresher')} className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'fresher' ? 'bg-[#0A255C] text-white shadow-sm' : 'text-slate-600 hover:text-[#0A255C]'}`}>
              Fresher Jobs
            </button>
            <button type="button" onClick={() => setActiveTab('remote')} className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'remote' ? 'bg-[#0A255C] text-white shadow-sm' : 'text-slate-600 hover:text-[#0A255C]'}`}>
              Remote Roles
            </button>
          </div>

          {/* Work Mode Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <select value={selectedWorkMode} onChange={(e) => setSelectedWorkMode(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A255C]">
              <option value="all">All Work Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>
        </div>

        {/* =====================================================================
            4. JOB LISTINGS
        ====================================================================== */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">
              {activeTab === 'internships'
            ? 'Internship Opportunities'
            : activeTab === 'fresher'
                ? 'Fresher & Entry-Level Roles'
                : activeTab === 'remote'
                    ? 'Remote & Work From Home Openings'
                    : 'Current Job Openings'}
            </h2>
            <span className="text-xs text-slate-500 font-semibold">{filteredJobs.length} positions found</span>
          </div>

          {loading ? (<div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (<div key={n} className="h-36 bg-slate-100 rounded-3xl animate-pulse"/>))}
            </div>) : filteredJobs.length === 0 ? (<div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto"/>
              <h3 className="font-extrabold text-[#0A255C] text-lg">No Job Openings Match Your Filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your filters or exploring different categories or work modes.
              </p>
              <button type="button" onClick={() => {
                setActiveTab('all');
                setSelectedCategory('all');
                setSelectedWorkMode('all');
                setTitleQuery('');
                setLocationQuery('');
            }} className="px-5 py-2.5 rounded-full bg-[#0A255C] text-white font-bold text-xs">
                Reset All Filters
              </button>
            </div>) : (<div className="space-y-4">
              {filteredJobs.map((job) => (<div key={job._id} onClick={() => navigate(`/jobs/${job._id}`)} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60">
                        {job.workMode.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md capitalize">
                        {job.employmentType}
                      </span>
                      {job.experienceLevel && (<span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md capitalize">
                          {job.experienceLevel}
                        </span>)}
                      <span className="text-xs text-slate-400">• Deadline: {job.deadline}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-[#0A255C] group-hover:text-amber-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 mt-0.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-teal-600"/>
                        <span>{job.businessName}</span>
                        <span className="text-slate-400 font-normal">• {job.location}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-2xl">{job.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.map((skill) => (<span key={skill} className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                          {skill}
                        </span>))}
                    </div>
                  </div>

                  <div className="md:text-right flex flex-col md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Annual Compensation</span>
                      <p className="text-xl font-extrabold text-[#0A255C] leading-none mt-0.5">
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k{' '}
                        <span className="text-xs text-slate-400 font-normal">/ yr</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    setShareJob(job);
                }} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#0A255C] hover:bg-slate-50 transition-colors" title="Share Job Link">
                        <Share2 className="w-4 h-4"/>
                      </button>

                      <button type="button" className="px-6 py-2.5 rounded-xl bg-[#0A255C] group-hover:bg-[#071B42] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5">
                        <span>View &amp; Apply</span>
                        <ArrowRight className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>
                </div>))}
            </div>)}
        </section>

        {/* =====================================================================
            5. EMPLOYER HIRING BANNER
        ====================================================================== */}
        <section className="bg-gradient-to-r from-[#0A255C] to-[#153A8A] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Looking for qualified students and professionals?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Approved businesses can post verified openings, review resumes, and hire candidates directly.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/business" className="px-6 py-3 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-md transition-all">
              Post a Job With Us
            </Link>
          </div>
        </section>
      </div>

      {/* Share Modal */}
      {shareJob && (<ShareModal isOpen={!!shareJob} onClose={() => setShareJob(null)} targetType="job" targetId={shareJob._id} title={shareJob.title}/>)}
    </div>);
};
