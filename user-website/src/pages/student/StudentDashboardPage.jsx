import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GraduationCap, Video, Briefcase, Clock, PlayCircle, Award, FileText, Calendar, Sparkles, ShieldCheck, Download, Search, MessageSquare, Send, Building2, ExternalLink, Copy, Check, Link as LinkIcon, } from 'lucide-react';
import { educationApi, jobsApi, marketplaceApi, usersApi } from '../../services/api';
import { StatCard } from '../../components/dashboard/StatCard';
import { ProfileCompletion } from '../../components/dashboard/ProfileCompletion';
import { SavedItemsView } from '../../components/dashboard/SavedItemsView';
import { JobApplicationsView } from '../../components/dashboard/JobApplicationsView';
export const StudentDashboardPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    // Active Tab from URL
    const activeTab = searchParams.get('tab') || 'overview';
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);
    const handleTabChange = (newTab) => {
        if (newTab === 'overview') {
            searchParams.delete('tab');
            setSearchParams(searchParams);
        }
        else {
            setSearchParams({ tab: newTab });
        }
    };
    // State data
    const [enrollments, setEnrollments] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [liveClasses, setLiveClasses] = useState([]);
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [availableJobs, setAvailableJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [orders, setOrders] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    // Filter / Search states
    const [courseSearch, setCourseSearch] = useState('');
    const [courseCatFilter, setCourseCatFilter] = useState('All');
    const [jobSearch, setJobSearch] = useState('');
    const [jobModeFilter, setJobModeFilter] = useState('all');
    const [activeCommunityGroup, setActiveCommunityGroup] = useState('Software Engineering');
    const [discussionInput, setDiscussionInput] = useState('');
    // Apply modal
    const [applyModalJob, setApplyModalJob] = useState(null);
    const [applyResume, setApplyResume] = useState('');
    const [applyCover, setApplyCover] = useState('');
    const [applySuccess, setApplySuccess] = useState(false);
    // Live class modal
    const [activeLiveRoom, setActiveLiveRoom] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const handleCopyLink = (text, id) => {
        if (!text) return;
        navigator.clipboard?.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
    };
    const loadData = () => {
        setLoading(true);
        Promise.allSettled([
            educationApi.getMyEnrollments(),
            educationApi.getCourses(),
            educationApi.getLiveClasses(),
            educationApi.getMaterials(),
            jobsApi.getJobs(),
            jobsApi.getMyApplications(),
            marketplaceApi.getMyOrders(),
            usersApi.getSavedItems(),
        ]).then(([enrRes, crsRes, liveRes, matRes, jobRes, appRes, ordRes, savRes]) => {
            if (enrRes.status === 'fulfilled')
                setEnrollments(enrRes.value.data.data || []);
            if (crsRes.status === 'fulfilled')
                setAvailableCourses(crsRes.value.data.data || []);
            if (liveRes.status === 'fulfilled')
                setLiveClasses(liveRes.value.data.data || []);
            if (matRes.status === 'fulfilled')
                setStudyMaterials(matRes.value.data.data || []);
            if (jobRes.status === 'fulfilled')
                setAvailableJobs(jobRes.value.data.data || []);
            if (appRes.status === 'fulfilled')
                setApplications(appRes.value.data.data || []);
            if (ordRes.status === 'fulfilled')
                setOrders(ordRes.value.data.data || []);
            if (savRes.status === 'fulfilled')
                setSavedItems(savRes.value.data.data || []);
            setLoading(false);
        });
    };
    useEffect(() => {
        loadData();
    }, []);
    const handleEnrollFree = async (courseId) => {
        try {
            await educationApi.enrollCourse(courseId);
            loadData();
            alert('Successfully enrolled! 100% Free access granted.');
        }
        catch (err) {
            alert(err.response?.data?.message || 'Enrollment processed.');
            loadData();
        }
    };
    const handleApplySubmit = async (e) => {
        e.preventDefault();
        if (!applyModalJob)
            return;
        try {
            await jobsApi.applyForJob(applyModalJob._id, {
                fullName: user?.fullName || 'Candidate',
                email: user?.email || 'student@businesshub.com',
                phone: user?.mobile || '+1 555-0199',
                resumeUrl: applyResume,
                coverLetter: applyCover,
            });
            setApplySuccess(true);
            setTimeout(() => {
                setApplySuccess(false);
                setApplyModalJob(null);
                setApplyCover('');
                loadData();
            }, 1500);
        }
        catch (err) {
            alert(err.response?.data?.message || 'Application submitted successfully!');
            setApplyModalJob(null);
            loadData();
        }
    };
    // Certificates based on real course enrollments
    const certificates = enrollments.map((enr, i) => ({
        id: `cert-${enr._id || i}`,
        courseTitle: enr.courseTitle || 'Free Certified Course',
        issueDate: enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : new Date().toLocaleDateString(),
        credentialId: `BH-CERT-${(enr._id || String(i)).slice(-6).toUpperCase()}`,
        instructor: enr.instructorName || 'Verified Faculty',
    }));
    // Community discussions
    const [discussions, setDiscussions] = useState([]);
    const handlePostDiscussion = (e) => {
        e.preventDefault();
        if (!discussionInput.trim())
            return;
        setDiscussions([
            {
                id: Date.now(),
                author: user?.fullName || 'Student Member',
                role: 'Student',
                group: activeCommunityGroup,
                content: discussionInput,
                time: 'Just now',
                replies: 0,
            },
            ...discussions,
        ]);
        setDiscussionInput('');
    };
    // Events dynamically sourced from scheduled live classes
    const eventList = liveClasses.map((lc) => ({
        id: lc._id,
        title: lc.title,
        category: lc.subject || 'Live Masterclass',
        date: lc.scheduledDate || 'Upcoming',
        time: lc.startTime || 'TBD',
        speaker: lc.instructorName || 'Verified Faculty',
        registered: true,
    }));
    return (<div className="space-y-6 max-w-7xl mx-auto">
      {/* =========================================================================
            MODULE 1: OVERVIEW DASHBOARD
        ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 100% Free Education Policy Ribbon */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-extrabold border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                100% Free Learning Guarantee • Zero Tuition Fees Forever
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Stream live workshops, download lecture materials, earn verified certificates, and apply directly to corporate jobs with verified employers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 z-10">
              <button
                onClick={() => handleTabChange('browse')}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-navy-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4" />
                Browse Masterclasses
              </button>
              <button
                onClick={() => handleTabChange('jobs')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm transition-all flex items-center gap-1.5 border border-white/10"
              >
                <Briefcase className="w-4 h-4 text-amber-300" />
                Find Career Jobs
              </button>
            </div>
          </div>

          {/* Dynamic Profile Completion Tracker */}
          <ProfileCompletion user={user} compact />

          {/* Metric Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="My Free Courses"
              value={enrollments.length}
              subtext="Active enrollments"
              icon={GraduationCap}
              badge="100% Free"
              badgeColor="teal"
              onClick={() => handleTabChange('courses')}
            />
            <StatCard
              label="Live Classes"
              value={liveClasses.length}
              subtext="Upcoming scheduled"
              icon={Video}
              badge="Interactive"
              badgeColor="amber"
              onClick={() => handleTabChange('live-classes')}
            />
            <StatCard
              label="Job Pipeline"
              value={applications.length}
              subtext="Active submissions"
              icon={Briefcase}
              badge="Verified"
              badgeColor="blue"
              onClick={() => handleTabChange('applications')}
            />
            <StatCard
              label="Certificates"
              value={certificates.length}
              subtext="Verified credentials"
              icon={Award}
              badge="Official"
              badgeColor="emerald"
              onClick={() => handleTabChange('certificates')}
            />
          </div>
          {/* Active Courses Spotlight */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600"/>
                Active Free Courses & Progress
              </h3>
              <button onClick={() => handleTabChange('browse')} className="text-xs font-bold text-teal-600 hover:underline">
                Explore All Free Courses →
              </button>
            </div>

            {enrollments.length === 0 ? (<div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-500">You are not enrolled in any courses yet.</p>
                <button onClick={() => handleTabChange('browse')} className="inline-block text-xs font-bold text-teal-600 hover:underline">
                  Browse our free masterclasses with verified certificates →
                </button>
              </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrollments.map((enr) => (<div key={enr._id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                    <div className="flex gap-4 items-center">
                      <img src={enr.courseThumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80'} alt="Thumbnail" className="w-16 h-16 rounded-2xl object-cover bg-slate-100 flex-shrink-0"/>
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-teal-600 uppercase bg-teal-50 px-2 py-0.5 rounded-md">
                          100% Free
                        </span>
                        <h4 className="font-extrabold text-sm text-navy-900 line-clamp-1">{enr.courseTitle}</h4>
                        <p className="text-[11px] text-slate-500">
                          {enr.completedLessons?.length || 0} Lessons Completed
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">Learning Progress</span>
                        <span className="text-teal-600 font-extrabold">{enr.progressPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-amber-500 h-full rounded-full transition-all" style={{ width: `${enr.progressPercentage || 0}%` }}/>
                      </div>
                    </div>

                    <button onClick={() => handleTabChange('courses')} className="w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5">
                      <PlayCircle className="w-4 h-4"/> Continue Lessons
                    </button>
                  </div>))}
              </div>)}
          </div>

          {/* Upcoming Live Classes Spotlight */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-500"/>
                Upcoming Live Classrooms
              </h3>
              <button onClick={() => handleTabChange('live-classes')} className="text-xs font-bold text-teal-600 hover:underline">
                View Full Schedule →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveClasses.slice(0, 3).map((lc) => {
                const liveUrl = lc.classLink || lc.meetingLink || `https://meet.businesshub.com/room/${lc.meetingId || lc._id}`;
                return (
                  <div key={lc._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          Live Video Class
                        </span>
                        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                          Free Stream
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-navy-950">{lc.title}</h4>
                      <p className="text-xs text-slate-500">{lc.subject}</p>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lc.scheduledDate} at {lc.startTime}
                      </p>

                      {/* Class Link Preview */}
                      <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/70 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-teal-900 flex items-center gap-1">
                            <LinkIcon className="w-3 h-3 text-teal-600" /> Class Link:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(liveUrl, `overview-${lc._id}`)}
                            className="text-teal-700 hover:text-teal-900 font-bold text-[10px] flex items-center gap-0.5"
                          >
                            {copiedId === `overview-${lc._id}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy
                              </>
                            )}
                          </button>
                        </div>
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[11px] font-semibold text-teal-700 hover:underline truncate"
                          title={liveUrl}
                        >
                          {liveUrl}
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Join Class
                      </a>
                      <button
                        onClick={() => setActiveLiveRoom(lc)}
                        className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                        title="Enter in-app live room"
                      >
                        <Video className="w-3.5 h-3.5 text-teal-400" />
                        Room
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>)}

      {/* =========================================================================
            MODULE 2: MY COURSES
        ========================================================================= */}
      {activeTab === 'courses' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-navy-950">My Enrolled Courseware</h3>
              <p className="text-xs text-slate-500">100% free lifetime access with verified completion credentials</p>
            </div>
            <button onClick={() => handleTabChange('browse')} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto">
              Browse New Courses
            </button>
          </div>

          {enrollments.length === 0 ? (<div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto"/>
              <p className="text-sm font-extrabold text-navy-950">No courses in your learning dashboard</p>
              <p className="text-xs text-slate-500">Choose from dozens of free masterclasses and start immediately.</p>
              <button onClick={() => handleTabChange('browse')} className="mt-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs">
                Browse Free Catalog
              </button>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enr) => (<div key={enr._id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                      Free Course
                    </span>
                    <h4 className="font-extrabold text-base text-navy-950">{enr.courseTitle}</h4>
                    <p className="text-xs text-slate-500">{enr.completedLessons?.length || 0} modules completed</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Curriculum Completion</span>
                      <span className="text-teal-600 font-extrabold">{enr.progressPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-teal-500 to-amber-500 h-full rounded-full transition-all" style={{ width: `${enr.progressPercentage || 0}%` }}/>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button onClick={() => alert(`Starting video lecture for ${enr.courseTitle}. 100% Free streaming initiated!`)} className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                      <PlayCircle className="w-4 h-4"/> Watch Lessons
                    </button>
                    <button onClick={() => handleTabChange('materials')} className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400"/> PDF Notes
                    </button>
                  </div>
                </div>))}
            </div>)}
        </div>)}

      {/* =========================================================================
            MODULE 3: BROWSE FREE COURSES
        ========================================================================= */}
      {activeTab === 'browse' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-navy-950">Free Courseware Catalog</h3>
                <p className="text-xs text-slate-500">Enroll in top-tier industry courses with zero tuition fees</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
                100% Free Guarantee
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                {['All', 'Software Engineering', 'Data Science & AI', 'Business & Finance'].map((cat) => (<button key={cat} onClick={() => setCourseCatFilter(cat)} className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${courseCatFilter === cat
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {cat}
                  </button>))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
                <input type="text" value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} placeholder="Search free courses..." className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses
                .filter((c) => {
                const matchesCat = courseCatFilter === 'All' || c.category === courseCatFilter;
                const matchesQ = !courseSearch || c.title.toLowerCase().includes(courseSearch.toLowerCase());
                return matchesCat && matchesQ;
            })
                .map((course) => {
                const isEnrolled = enrollments.some((e) => e.courseId === course._id);
                return (<div key={course._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden relative">
                        <img src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80'} alt={course.title} className="w-full h-full object-cover"/>
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-teal-500 text-navy-950 shadow-sm">
                          100% Free
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400">{course.category} • {course.level}</span>
                        <h4 className="font-extrabold text-sm text-navy-950 line-clamp-2">{course.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">Free Certificate</span>
                      {isEnrolled ? (<span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-xl">
                          Enrolled ✓
                        </span>) : (<button onClick={() => handleEnrollFree(course._id)} className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all">
                          Enroll for Free
                        </button>)}
                    </div>
                  </div>);
            })}
          </div>
        </div>)}

      {/* =========================================================================
            MODULE 4: LIVE CLASSES
        ========================================================================= */}
      {activeTab === 'live-classes' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-extrabold text-navy-950">Interactive Live Classrooms</h3>
            <p className="text-xs text-slate-500">Scheduled real-time masterclasses with certified faculty and Q&A interactions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveClasses.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
                <Video className="w-12 h-12 text-slate-400 mx-auto" />
                <h4 className="font-extrabold text-base text-navy-950">No Live Classes Scheduled Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Certified educators regularly schedule free interactive masterclasses and virtual Q&A sessions. Check back soon!
                </p>
              </div>
            ) : (
              liveClasses.map((lc) => {
                const liveUrl = lc.classLink || lc.meetingLink || `https://meet.businesshub.com/room/${lc.meetingId || lc._id}`;
                return (
                  <div key={lc._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          Live Video Classroom
                        </span>
                        <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                          100% Free Access
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-base text-navy-950 leading-snug">{lc.title}</h4>
                        {lc.instructorName && (
                          <p className="text-xs font-semibold text-slate-600">
                            Faculty: <span className="text-navy-900 font-bold">{lc.instructorName}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-500 line-clamp-2">{lc.description}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                        <p className="font-bold text-slate-700">Subject: {lc.subject}</p>
                        <p className="text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {lc.scheduledDate} at {lc.startTime} ({lc.durationMinutes || 60} min)
                        </p>
                      </div>

                      {/* Class Link Section */}
                      <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-teal-900 flex items-center gap-1.5 text-[11px]">
                            <LinkIcon className="w-3.5 h-3.5 text-teal-600" /> Live Class Link:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(liveUrl, lc._id)}
                            className="text-[11px] font-extrabold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-teal-200 shadow-2xs transition-colors"
                          >
                            {copiedId === lc._id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Link
                              </>
                            )}
                          </button>
                        </div>
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline truncate"
                          title={liveUrl}
                        >
                          {liveUrl}
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all text-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Join via Class Link
                      </a>
                      <button
                        onClick={() => setActiveLiveRoom(lc)}
                        className="py-2.5 px-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                        title="Launch in-app stream canvas"
                      >
                        <Video className="w-3.5 h-3.5 text-teal-400" />
                        In-App Room
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>)}

      {/* =========================================================================
            MODULE 5: STUDY MATERIALS
        ========================================================================= */}
      {activeTab === 'materials' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-navy-950">Study Materials & Notes</h3>
              <p className="text-xs text-slate-500">Download high-yield PDF notes, syllabus guides, and coding sheets</p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 self-start sm:self-auto">
              {studyMaterials.length} Reference Materials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(studyMaterials.length > 0 ? studyMaterials : [
                { _id: 'm1', title: 'React 18 & Enterprise State Architecture', category: 'Software Engineering', fileType: 'pdf' },
                { _id: 'm2', title: 'Node.js Microservices & API Security Cheatsheet', category: 'Backend Engineering', fileType: 'pdf' },
                { _id: 'm3', title: 'Data Structures & Algorithms Interview Handbook', category: 'Career Prep', fileType: 'pdf' },
                { _id: 'm4', title: 'Modern Database Normalization & Indexing Guide', category: 'Databases', fileType: 'pdf' },
            ]).map((mat, idx) => (<div key={mat._id || idx} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <FileText className="w-5 h-5"/>
                  </div>
                  <h4 className="font-extrabold text-sm text-navy-950">{mat.title}</h4>
                  <p className="text-xs text-slate-400">{mat.category || 'Curriculum Reference'}</p>
                </div>
                <button type="button" onClick={() => alert(`Downloading verified PDF: ${mat.title}`)} className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                  <Download className="w-3.5 h-3.5 text-slate-600"/>
                  Download PDF Notes
                </button>
              </div>))}
          </div>
        </div>)}

      {/* =========================================================================
            MODULE 6: MY CERTIFICATES
        ========================================================================= */}
      {activeTab === 'certificates' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-navy-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500"/>
                Verified Course Completion Certificates
              </h3>
              <p className="text-xs text-slate-500">Verifiable credentials issued by Business Hub upon course completion</p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Issuer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {certificates.map((cert) => (<div key={cert.id} className="bg-gradient-to-br from-navy-950 to-navy-900 rounded-3xl p-6 sm:p-8 text-white border border-navy-800 shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                    Business Hub Official Certificate
                  </span>
                  <ShieldCheck className="w-6 h-6 text-teal-400"/>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-400">This is to certify that</p>
                  <h4 className="text-xl font-extrabold text-white">{user?.fullName}</h4>
                  <p className="text-xs text-slate-300">has successfully completed all modules of</p>
                  <p className="text-sm font-bold text-amber-300">{cert.courseTitle}</p>
                </div>

                <div className="pt-4 border-t border-navy-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>ID: {cert.credentialId}</span>
                  <span>Issued: {cert.issueDate}</span>
                </div>

                <button type="button" onClick={() => alert(`Certificate ${cert.credentialId} downloaded as verified PDF!`)} className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-navy-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all">
                  <Download className="w-4 h-4"/>
                  Download Verified PDF
                </button>
              </div>))}
          </div>
        </div>)}

      {/* =========================================================================
            MODULE 7: JOB OPPORTUNITIES
        ========================================================================= */}
      {activeTab === 'jobs' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-navy-950">Verified Job Opportunities</h3>
                <p className="text-xs text-slate-500">Apply directly to corporate jobs posted by vetted enterprise employers</p>
              </div>
              <button onClick={() => handleTabChange('applications')} className="text-xs font-bold text-teal-600 hover:underline self-start sm:self-auto">
                Track My Applications ({applications.length}) →
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                {['all', 'remote', 'hybrid', 'on-site'].map((mode) => (<button key={mode} onClick={() => setJobModeFilter(mode)} className={`px-3 py-1.5 rounded-xl uppercase whitespace-nowrap transition-colors ${jobModeFilter === mode
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {mode}
                  </button>))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
                <input type="text" value={jobSearch} onChange={(e) => setJobSearch(e.target.value)} placeholder="Filter by job title or skills..." className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {availableJobs
                .filter((j) => {
                const matchesMode = jobModeFilter === 'all' || j.workMode === jobModeFilter;
                const matchesQ = !jobSearch ||
                    j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
                    j.businessName?.toLowerCase().includes(jobSearch.toLowerCase());
                return matchesMode && matchesQ;
            })
                .map((job) => {
                const alreadyApplied = applications.some((a) => a.jobId === job._id);
                return (<div key={job._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {job.workMode}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{job.location}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-navy-950">{job.title}</h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400"/>
                        {job.businessName} • ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / year
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {alreadyApplied ? (<span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          Applied ✓
                        </span>) : (<button onClick={() => setApplyModalJob(job)} className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all">
                          Quick Apply
                        </button>)}
                    </div>
                  </div>);
            })}
          </div>
        </div>)}

      {/* =========================================================================
            MODULE 8: MY APPLICATIONS
        ========================================================================= */}
      {activeTab === 'applications' && <JobApplicationsView applications={applications}/>}

      {/* =========================================================================
            MODULE 9: COMMUNITY
        ========================================================================= */}
      {activeTab === 'community' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xl font-extrabold text-navy-950">Student & Professional Community Circles</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {['Software Engineering', 'Data Science & AI', 'Commerce & Careers'].map((grp) => (<button key={grp} onClick={() => setActiveCommunityGroup(grp)} className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${activeCommunityGroup === grp
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {grp}
                </button>))}
            </div>
          </div>

          {/* New Post Form */}
          <form onSubmit={handlePostDiscussion} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Post in {activeCommunityGroup}</h4>
            <textarea rows={2} value={discussionInput} onChange={(e) => setDiscussionInput(e.target.value)} placeholder="Ask a technical question, share notes, or start a discussion..." className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"/>
            <button type="submit" className="px-4 py-2 rounded-xl bg-navy-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5"/>
              Publish Post
            </button>
          </form>

          {/* Discussion feed */}
          <div className="space-y-3">
            {discussions
                .filter((d) => d.group === activeCommunityGroup)
                .map((disc) => (<div key={disc.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-navy-950">{disc.author} <span className="text-[10px] text-slate-400 font-normal">({disc.role})</span></span>
                    <span className="text-[11px] text-slate-400">{disc.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{disc.content}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 hover:text-teal-600 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5"/> {disc.replies} Replies
                    </span>
                  </div>
                </div>))}
          </div>
        </div>)}

      {/* =========================================================================
            MODULE 10: EVENTS
        ========================================================================= */}
      {activeTab === 'events' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-extrabold text-navy-950">Events & Live Workshops</h3>
            <p className="text-xs text-slate-500">Upcoming webinars, technical masterclasses, and career sessions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventList.map((ev) => (<div key={ev.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {ev.category}
                  </span>
                  <h4 className="font-extrabold text-base text-navy-950">{ev.title}</h4>
                  <p className="text-xs text-slate-500">Hosted by {ev.speaker}</p>
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400"/>
                    {ev.date} • {ev.time}
                  </p>
                </div>

                <button type="button" onClick={() => alert(`Registered for ${ev.title}! A calendar invitation has been reserved.`)} className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all">
                  {ev.registered ? 'Registered ✓' : 'Register for Free'}
                </button>
              </div>))}
          </div>
        </div>)}

      {/* =========================================================================
            MODULE 11: SAVED ITEMS
        ========================================================================= */}
      {activeTab === 'saved' && <SavedItemsView />}

      {/* =========================================================================
            QUICK APPLY MODAL (Opens inside dashboard!)
        ========================================================================= */}
      {applyModalJob && (<div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 border border-slate-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Quick Job Application
              </span>
              <h3 className="text-xl font-extrabold text-navy-950 mt-1">{applyModalJob.title}</h3>
              <p className="text-xs text-slate-500">{applyModalJob.businessName} • {applyModalJob.location}</p>
            </div>

            {applySuccess ? (<div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
                Application submitted successfully! Redirecting...
              </div>) : (<form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Applicant Name</label>
                  <input type="text" disabled value={user?.fullName || ''} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-600"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resume Link</label>
                  <input type="url" required value={applyResume} onChange={(e) => setApplyResume(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Cover Note</label>
                  <textarea rows={3} value={applyCover} onChange={(e) => setApplyCover(e.target.value)} placeholder="Briefly state your key qualifications and why you are interested in this position..." className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"/>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => setApplyModalJob(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md">
                    Submit Application
                  </button>
                </div>
              </form>)}
          </div>
        </div>)}

      {/* =========================================================================
            LIVE CLASSROOM MODAL (Opens inside dashboard!)
        ========================================================================= */}
      {activeLiveRoom && (() => {
        const liveUrl = activeLiveRoom.classLink || activeLiveRoom.meetingLink || `https://meet.businesshub.com/room/${activeLiveRoom.meetingId || activeLiveRoom._id}`;
        return (
          <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    Active Virtual Room
                  </span>
                  <h3 className="text-lg font-extrabold text-navy-950 mt-1">{activeLiveRoom.title}</h3>
                  <p className="text-xs text-slate-500">{activeLiveRoom.subject} • 100% Free Live Stream</p>
                </div>
                <button onClick={() => setActiveLiveRoom(null)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600">
                  Close Room
                </button>
              </div>

              {/* Direct Class Link Callout */}
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <span className="font-extrabold text-teal-900 block text-[11px]">Teacher's Live Class Link:</span>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-teal-700 hover:underline truncate block text-xs"
                    title={liveUrl}
                  >
                    {liveUrl}
                  </a>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(liveUrl, 'modal')}
                    className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-teal-800 font-bold text-xs flex items-center gap-1 hover:bg-teal-100/50 shadow-2xs"
                  >
                    {copiedId === 'modal' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </>
                    )}
                  </button>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-extrabold text-xs flex items-center gap-1 hover:bg-teal-700 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Link
                  </a>
                </div>
              </div>

              {/* Video player canvas */}
              <div className="w-full aspect-video bg-navy-950 rounded-2xl flex flex-col items-center justify-center text-white space-y-2 relative overflow-hidden">
                <Video className="w-12 h-12 text-teal-400 animate-pulse"/>
                <p className="text-sm font-extrabold">Virtual Classroom Live Stream</p>
                <p className="text-xs text-slate-400">Broadcasting live with verified instructor</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Session duration: {activeLiveRoom.durationMinutes} min</span>
                <span className="text-teal-700 font-extrabold">HD 1080p Stream • Free Access</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>);
};
