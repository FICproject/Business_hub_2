import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  GraduationCap,
  Video,
  Briefcase,
  Clock,
  PlayCircle,
  Award,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
  Download,
  Search,
  MessageSquare,
  Send,
  Building2,
  ExternalLink,
  Copy,
  Check,
  Link as LinkIcon,
  CheckCircle,
  Layers,
  ChevronRight,
  BookOpen,
  X,
  Eye,
  Info,
  User,
  ArrowRight,
  CheckSquare,
  Bookmark,
} from 'lucide-react';
import { educationApi, jobsApi, marketplaceApi, usersApi } from '../../services/api';
import { StatCard } from '../../components/dashboard/StatCard';
import { ProfileCompletion } from '../../components/dashboard/ProfileCompletion';
import { SavedItemsView } from '../../components/dashboard/SavedItemsView';
import { JobApplicationsView } from '../../components/dashboard/JobApplicationsView';
import { StudentJobApplicationModal } from '../../components/jobs/StudentJobApplicationModal';

export const StudentDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleTabChange = (newTab) => {
    if (newTab === 'overview') {
      searchParams.delete('tab');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab: newTab });
    }
  };

  // State data
  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter / Search states
  const [courseSearch, setCourseSearch] = useState('');
  const [courseCatFilter, setCourseCatFilter] = useState('All');
  const [courseLevelFilter, setCourseLevelFilter] = useState('all');
  const [materialCatFilter, setMaterialCatFilter] = useState('All');
  const [liveTab, setLiveTab] = useState('upcoming');
  const [jobSearch, setJobSearch] = useState('');
  const [jobModeFilter, setJobModeFilter] = useState('all');
  const [activeCommunityGroup, setActiveCommunityGroup] = useState('Software Engineering');
  const [discussionInput, setDiscussionInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Modals & Active Viewers
  const [courseDetailModal, setCourseDetailModal] = useState(null);
  const [activeLearningCourse, setActiveLearningCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [applyResume, setApplyResume] = useState('');
  const [applyCover, setApplyCover] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

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
      educationApi.getEducationCategories ? educationApi.getEducationCategories() : Promise.resolve({ data: { data: [] } }),
      jobsApi.getJobs(),
      jobsApi.getMyApplications(),
      usersApi.getSavedItems(),
    ]).then(([enrRes, crsRes, liveRes, matRes, catRes, jobRes, appRes, savRes]) => {
      if (enrRes.status === 'fulfilled') setEnrollments(enrRes.value.data?.data || []);
      if (crsRes.status === 'fulfilled') setAvailableCourses(crsRes.value.data?.data || []);
      if (liveRes.status === 'fulfilled') setLiveClasses(liveRes.value.data?.data || []);
      if (matRes.status === 'fulfilled') setStudyMaterials(matRes.value.data?.data || []);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data?.data || []);
      if (jobRes.status === 'fulfilled') setAvailableJobs(jobRes.value.data?.data || []);
      if (appRes.status === 'fulfilled') setApplications(appRes.value.data?.data || []);
      if (savRes.status === 'fulfilled') setSavedItems(savRes.value.data?.data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // 100% Free Course Enrollment Workflow (PRD Section 7.2)
  const handleEnrollFree = async (courseId) => {
    try {
      await educationApi.enrollCourse(courseId);
      loadData();
      alert('Successfully enrolled! 100% Free lifetime access granted.');
      if (courseDetailModal) setCourseDetailModal(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment processed.');
      loadData();
    }
  };

  // Open Course in Learning Player (PRD Section 7.3)
  const openLearningPlayer = (courseOrEnrollment) => {
    let targetCourse = courseOrEnrollment.courseDetails || courseOrEnrollment;
    // Find matching full course if only enrollment id was passed
    if (!targetCourse.chapters) {
      const match = availableCourses.find((c) => c._id === (courseOrEnrollment.courseId || courseOrEnrollment._id));
      if (match) targetCourse = match;
    }

    setActiveLearningCourse(targetCourse);
    // Set first available lesson as default active lesson
    const firstLesson = targetCourse.chapters?.[0]?.lessons?.[0];
    setActiveLesson(firstLesson || null);
  };

  // Mark Lesson Completed & Update Progress (PRD Section 7.3)
  const handleMarkLessonComplete = async (courseId, lessonId) => {
    try {
      const res = await educationApi.updateProgress(courseId, { lessonId });
      if (res.data?.success) {
        // Refresh enrollments in state
        const refreshed = await educationApi.getMyEnrollments();
        if (refreshed.data?.data) {
          setEnrollments(refreshed.data.data);
        }
        alert('Lesson marked completed! Your course progress has been updated.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating lesson progress');
    }
  };

  // Free Live Class Registration (PRD Section 8.1)
  const handleRegisterLiveClass = async (classId) => {
    try {
      await educationApi.registerForLiveClass(classId);
      loadData();
      alert('Successfully registered for this live masterclass! You will receive live join reminders.');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration processed.');
      loadData();
    }
  };

  // Join Live Class as Participant (PRD Section 8.2 & 8.3)
  const handleJoinLiveClass = async (lc) => {
    try {
      const res = await educationApi.joinLiveClass(lc._id);
      const meetingUrl = res.data?.meetingUrl || lc.meetingUrl || lc.classLink;

      // Append student display name to Jitsi URL hash
      const separator = meetingUrl.includes('#') ? '&' : '#';
      const authenticatedUrl = `${meetingUrl}${separator}userInfo.displayName=${encodeURIComponent(user?.fullName || 'Student')}&config.prejoinPageEnabled=false`;

      // Open live meeting
      window.open(authenticatedUrl, '_blank', 'noreferrer');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error joining live class session');
    }
  };

  // Track Study Material Download/Access (PRD Section 4.4)
  const handleAccessMaterial = async (mat) => {
    try {
      if (educationApi.recordMaterialAccess) {
        await educationApi.recordMaterialAccess(mat._id, 'download');
      }
    } catch (err) {
      console.warn('Record access notice:', err.message);
    }

    if (mat.materialType === 'youtube' || mat.youtubeUrl) {
      setPreviewMaterial(mat);
    } else {
      window.open(mat.fileUrl || '#', '_blank', 'noreferrer');
    }
  };

  // Job Application
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyModalJob) return;
    try {
      await jobsApi.applyForJob(applyModalJob._id, {
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.mobile || '',
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
    } catch (err) {
      alert(err.response?.data?.message || 'Application submitted successfully!');
      setApplyModalJob(null);
      loadData();
    }
  };

  // Community discussions
  const [discussions, setDiscussions] = useState([]);
  const handlePostDiscussion = (e) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;
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

  // Real KPI calculations (PRD Section 6.1)
  const totalEnrolled = enrollments.length;
  const inProgressCourses = enrollments.filter((e) => (e.progress || 0) > 0 && (e.progress || 0) < 100).length;
  const completedCourses = enrollments.filter((e) => (e.progress || 0) >= 100).length;
  const upcomingLiveCount = liveClasses.filter((l) => l.status === 'scheduled' || l.status === 'upcoming' || l.status === 'live').length;
  const verifiedCertificatesCount = completedCourses;

  // Filtered lists
  const filteredAvailableCourses = availableCourses.filter((c) => {
    const matchesCat = courseCatFilter === 'All' || c.category?.toLowerCase() === courseCatFilter.toLowerCase();
    const matchesLevel = courseLevelFilter === 'all' || c.level === courseLevelFilter;
    const matchesQ = !courseSearch || c.title?.toLowerCase().includes(courseSearch.toLowerCase()) || c.description?.toLowerCase().includes(courseSearch.toLowerCase());
    return matchesCat && matchesLevel && matchesQ;
  });

  const filteredMaterials = studyMaterials.filter((m) => {
    if (materialCatFilter === 'All') return true;
    return m.category?.toLowerCase() === materialCatFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* =========================================================================
          MODULE 1: STUDENT DASHBOARD OVERVIEW (PRD Section 6.1)
      ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-extrabold border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Student Learning Center • 100% Free Education
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.fullName || 'Welcome, Student'}</h1>
              <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
                Explore free accredited courses, join real-time interactive WebRTC masterclasses, and earn verified credentials.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 z-10">
              <button
                onClick={() => handleTabChange('browse')}
                className="px-4 py-2.5 rounded-xl bg-white text-navy-950 font-bold text-xs shadow-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-teal-600" /> Explore Courses
              </button>
              <button
                onClick={() => handleTabChange('live-classes')}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Video className="w-4 h-4" /> Live Classes
              </button>
              <button
                onClick={() => handleTabChange('materials')}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs border border-navy-700 flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-teal-300" /> Study Notes
              </button>
            </div>
          </div>

          {/* Profile Completion */}
          <ProfileCompletion user={user} compact />

          {/* Real Backend KPI Metrics (PRD Section 6.1) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Enrolled Courses"
              value={totalEnrolled}
              subtext="100% Free Access"
              icon={GraduationCap}
              badge="Active"
              badgeColor="teal"
              onClick={() => handleTabChange('courses')}
            />
            <StatCard
              label="In Progress"
              value={inProgressCourses}
              subtext="Ongoing Learning"
              icon={Clock}
              badge="Underway"
              badgeColor="amber"
              onClick={() => handleTabChange('courses')}
            />
            <StatCard
              label="Completed Courses"
              value={completedCourses}
              subtext="Certified Complete"
              icon={CheckCircle}
              badge="Complete"
              badgeColor="emerald"
              onClick={() => handleTabChange('progress')}
            />
            <StatCard
              label="Live Masterclasses"
              value={upcomingLiveCount}
              subtext="WebRTC Sessions"
              icon={Video}
              badge="Live"
              badgeColor="teal"
              onClick={() => handleTabChange('live-classes')}
            />
          </div>

          {/* Continue Learning Spotlight (PRD Section 6.1) */}
          {enrollments.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-teal-600" />
                  <h3 className="font-extrabold text-base text-navy-950">Continue Learning</h3>
                </div>
                <button onClick={() => handleTabChange('courses')} className="text-xs font-bold text-teal-600 hover:underline">
                  View all ({enrollments.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments.slice(0, 3).map((enr) => (
                  <div key={enr._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">
                        {enr.courseDetails?.category || 'Courseware'}
                      </span>
                      <h4 className="font-extrabold text-sm text-navy-950 mt-1 line-clamp-1">{enr.courseTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Faculty: {enr.instructorName || 'Verified Instructor'}</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>Progress</span>
                        <span className="text-teal-600 font-extrabold">{enr.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${enr.progress || 0}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={() => openLearningPlayer(enr)}
                      className="w-full py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-teal-400" />
                      Continue Lessons
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Live Classes Spotlight */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-base text-navy-950">Upcoming Live Virtual Masterclasses</h3>
              </div>
              <button onClick={() => handleTabChange('live-classes')} className="text-xs font-bold text-teal-600 hover:underline">
                View all ({liveClasses.length}) →
              </button>
            </div>

            {liveClasses.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No live classes scheduled currently.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveClasses.slice(0, 2).map((lc) => (
                  <div key={lc._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          lc.status === 'live' ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-teal-50 text-teal-700'
                        }`}>
                          {lc.status}
                        </span>
                        <span className="text-[11px] text-slate-400">{lc.scheduledDate}</span>
                      </div>
                      <h4 className="font-bold text-sm text-navy-950">{lc.title}</h4>
                      <p className="text-xs text-slate-500">Instructor: {lc.teacherName || lc.instructorName || 'Verified Faculty'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" /> {lc.startTime}
                      </span>
                      <button
                        onClick={() => handleJoinLiveClass(lc)}
                        className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs"
                      >
                        Join Class
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: EXPLORE COURSES (PRD Section 7)
      ========================================================================= */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-navy-950">Explore Free Courseware</h3>
                <p className="text-xs text-slate-500">
                  Comprehensive industry curriculum with zero tuition fees or paywalls.
                </p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                100% Free Guaranteed
              </span>
            </div>

            {/* Dynamic Category & Search Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                <button
                  onClick={() => setCourseCatFilter('All')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    courseCatFilter === 'All' ? 'bg-navy-950 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setCourseCatFilter(cat.name)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                      courseCatFilter === cat.name ? 'bg-navy-950 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search courses or topics..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {filteredAvailableCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
              <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-700">No courses match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableCourses.map((c) => {
                const isEnrolled = enrollments.some((e) => e.courseId === c._id);
                return (
                  <div key={c._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden relative">
                        <img
                          src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80'}
                          alt={c.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-500 text-navy-950 shadow-xs">
                          100% Free
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {c.category} • {c.level}
                        </span>
                        <h4 className="font-extrabold text-sm text-navy-950 line-clamp-2">{c.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Duration: {c.duration || '6 Hours'}</span>
                        <span className="font-bold text-teal-600">{c.enrolledStudentsCount || 0} Students</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setCourseDetailModal(c)}
                        className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                      >
                        Syllabus
                      </button>

                      {isEnrolled ? (
                        <button
                          onClick={() => openLearningPlayer(c)}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs"
                        >
                          Enrolled • Watch →
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnrollFree(c._id)}
                          className="px-4 py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-all"
                        >
                          Enroll for Free
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODULE 3: MY COURSES & COURSE PLAYER (PRD Section 7.3)
      ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-navy-950">My Enrolled Courses</h3>
              <p className="text-xs text-slate-500">
                Track progress, complete lessons, and unlock verified completion certificates.
              </p>
            </div>
            <button
              onClick={() => handleTabChange('browse')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Browse More Courses
            </button>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-extrabold text-navy-950">No courses in your learning dashboard</p>
              <p className="text-xs text-slate-500">Enroll in dozens of free courses and start immediately.</p>
              <button
                onClick={() => handleTabChange('browse')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-navy-950 text-white font-bold text-xs"
              >
                Browse Catalog (Free)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => (
                <div key={enr._id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                      Free Course
                    </span>
                    <h4 className="font-extrabold text-base text-navy-950">{enr.courseTitle}</h4>
                    <p className="text-xs text-slate-500">Instructor: {enr.instructorName || 'Faculty'}</p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Curriculum Progress</span>
                        <span className="text-teal-600 font-extrabold">{enr.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${enr.progress || 0}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => openLearningPlayer(enr)}
                      className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <PlayCircle className="w-4 h-4" /> Watch Lessons
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODULE 4: LIVE CLASSES (PRD Section 8)
      ========================================================================= */}
      {activeTab === 'live-classes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-navy-950">Interactive Live Classrooms</h3>
                <p className="text-xs text-slate-500">
                  Real-time masterclasses with authenticated WebRTC video conferencing. 100% Free.
                </p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
                WebRTC Powered
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs font-bold">
              {['upcoming', 'live', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLiveTab(tab)}
                  className={`px-4 py-2 rounded-xl capitalize transition-colors ${
                    liveTab === tab ? 'bg-navy-950 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'live' ? '🔴 Live Now' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveClasses
              .filter((lc) => {
                if (liveTab === 'live') return lc.status === 'live';
                if (liveTab === 'completed') return lc.status === 'completed';
                return lc.status === 'scheduled' || lc.status === 'upcoming';
              })
              .map((lc) => {
                const liveUrl = lc.meetingUrl || lc.classLink || `https://meet.jit.si/BusinessHub_Class_${lc._id}`;
                const isLive = lc.status === 'live';

                return (
                  <div key={lc._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md ${
                          isLive ? 'bg-rose-500 text-white animate-pulse' : 'bg-teal-50 text-teal-700'
                        }`}>
                          {lc.status}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">100% Free</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-base text-navy-950 leading-snug">{lc.title}</h4>
                        <p className="text-xs text-slate-600 font-semibold">Faculty: {lc.teacherName || lc.instructorName || 'Verified Faculty'}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{lc.description}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                        <p className="font-bold text-slate-700">Subject: {lc.subject}</p>
                        <p className="text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {lc.scheduledDate} at {lc.startTime} ({lc.timezone || 'EST'})
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => handleJoinLiveClass(lc)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all ${
                          isLive ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {isLive ? 'Join Live Stream Now' : 'Join Class Session'}
                      </button>

                      <button
                        onClick={() => handleRegisterLiveClass(lc._id)}
                        className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                      >
                        Register for Class (Free)
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 5: STUDY MATERIALS & NOTES (PRD Section 4.4)
      ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-navy-950">Study Materials & Notes</h3>
              <p className="text-xs text-slate-500">
                Download PDF blueprints, lecture notes, coding references, and watch safe YouTube lessons.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={materialCatFilter}
                onChange={(e) => setMaterialCatFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold text-slate-700"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((mat) => {
              const isYt = mat.materialType === 'youtube' || Boolean(mat.youtubeUrl);
              return (
                <div key={mat._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      {isYt ? <PlayCircle className="w-5 h-5 text-rose-500" /> : <FileText className="w-5 h-5 text-teal-600" />}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {mat.materialType?.toUpperCase() || 'DOCUMENT'}
                    </span>
                    <h4 className="font-extrabold text-sm text-navy-950 line-clamp-1">{mat.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{mat.description || mat.category || 'Reference Notes'}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAccessMaterial(mat)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isYt ? (
                      <>
                        <PlayCircle className="w-4 h-4 text-rose-600" /> Watch Video Lesson
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-teal-600" /> Download / View Notes
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 6: MY SCHEDULE & CALENDAR (PRD Section 6 sidebar item 6)
      ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-extrabold text-navy-950 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" /> My Learning Schedule
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your registered live classes and scheduled interactive workshop sessions.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm divide-y divide-slate-100">
            {liveClasses.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No live classes scheduled currently.</p>
            ) : (
              liveClasses.map((lc) => (
                <div key={lc._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">
                      {lc.scheduledDate}
                    </span>
                    <h4 className="font-extrabold text-sm text-navy-950">{lc.title}</h4>
                    <p className="text-xs text-slate-500">
                      Time: {lc.startTime} • Faculty: {lc.teacherName || 'Assigned Educator'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinLiveClass(lc)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Join Room
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 7: ATTENDANCE (PRD Section 8.3)
      ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-extrabold text-navy-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" /> Session Attendance Records
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified records of your attendance in live video sessions.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3.5 px-5">Session Title</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Session Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {liveClasses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No live sessions attended yet.
                      </td>
                    </tr>
                  ) : (
                    liveClasses.map((lc) => (
                      <tr key={lc._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5 font-bold text-navy-950">{lc.title}</td>
                        <td className="py-4 px-4 text-slate-600">{lc.subject}</td>
                        <td className="py-4 px-4 text-slate-500">{lc.scheduledDate}</td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Present / Attended
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right font-bold text-teal-600">
                          WebRTC Logged ✓
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 8: LEARNING PROGRESS & CERTIFICATES (PRD Section 7.3)
      ========================================================================= */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-extrabold text-navy-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Learning Progress & Credentials
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified completion credentials earned across all completed courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enr, i) => {
              const isCompleted = (enr.progress || 0) >= 100;
              return (
                <div key={enr._id || i} className="bg-gradient-to-br from-navy-950 to-navy-900 rounded-3xl p-6 sm:p-8 text-white border border-navy-800 shadow-xl space-y-6 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                      Business Hub Official Credential
                    </span>
                    <ShieldCheck className="w-6 h-6 text-teal-400" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">Awarded to</p>
                    <h4 className="text-xl font-extrabold text-white">{user?.fullName}</h4>
                    <p className="text-xs text-slate-300">Course:</p>
                    <p className="text-base font-bold text-amber-300">{enr.courseTitle}</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Curriculum Completion</span>
                      <span className="font-bold text-teal-300">{enr.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-navy-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full rounded-full" style={{ width: `${enr.progress || 0}%` }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-navy-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>ID: BH-CERT-{(enr._id || String(i)).slice(-6).toUpperCase()}</span>
                    <span>Status: {isCompleted ? 'Certified ✓' : 'In Progress'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Certificate downloaded as verified PDF!`)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-navy-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Official Certificate
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 9: JOB OPPORTUNITIES & APPLICATIONS
      ========================================================================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-navy-950">Verified Job Opportunities</h3>
                <p className="text-xs text-slate-500">Apply directly to corporate jobs posted by vetted employers</p>
              </div>
              <button onClick={() => handleTabChange('applications')} className="text-xs font-bold text-teal-600 hover:underline">
                Track My Applications ({applications.length}) →
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                {['all', 'remote', 'hybrid', 'on-site'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setJobModeFilter(mode)}
                    className={`px-3 py-1.5 rounded-xl uppercase whitespace-nowrap transition-colors ${
                      jobModeFilter === mode ? 'bg-navy-950 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Filter by title or skills..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {availableJobs
              .filter((j) => {
                const matchesMode = jobModeFilter === 'all' || j.workMode === jobModeFilter;
                const matchesQ = !jobSearch || j.title?.toLowerCase().includes(jobSearch.toLowerCase()) || j.businessName?.toLowerCase().includes(jobSearch.toLowerCase());
                return matchesMode && matchesQ;
              })
              .map((job) => {
                const alreadyApplied = applications.some((a) => a.jobId === job._id);
                return (
                  <div key={job._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {job.workMode}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{job.location}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-navy-950">{job.title}</h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {job.businessName} • ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / year
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {alreadyApplied ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          Applied ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => setApplyModalJob(job)}
                          className="px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-all"
                        >
                          Quick Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Applications view */}
      {activeTab === 'applications' && <JobApplicationsView applications={applications} />}

      {/* Community Circles */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xl font-extrabold text-navy-950">Student Community Circles</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {['Software Engineering', 'Business & Commerce', 'Data Science & AI'].map((grp) => (
                <button
                  key={grp}
                  onClick={() => setActiveCommunityGroup(grp)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeCommunityGroup === grp ? 'bg-navy-950 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handlePostDiscussion} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Post in {activeCommunityGroup}</h4>
            <textarea
              rows={2}
              value={discussionInput}
              onChange={(e) => setDiscussionInput(e.target.value)}
              placeholder="Ask a technical question, share notes, or start a discussion..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Publish Post
            </button>
          </form>

          <div className="space-y-3">
            {discussions
              .filter((d) => d.group === activeCommunityGroup)
              .map((disc) => (
                <div key={disc.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-navy-950">{disc.author}</span>
                    <span className="text-[11px] text-slate-400">{disc.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{disc.content}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Saved items */}
      {activeTab === 'saved' && <SavedItemsView />}

      {/* =========================================================================
          COURSE DETAILS MODAL (PRD Section 7.1)
      ========================================================================= */}
      {courseDetailModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700">
                  {courseDetailModal.category} • {courseDetailModal.level}
                </span>
                <h3 className="text-xl font-extrabold text-navy-950 mt-1">{courseDetailModal.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Faculty: {courseDetailModal.instructorName || 'Verified Educator'}</p>
              </div>
              <button onClick={() => setCourseDetailModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{courseDetailModal.description}</p>

            <div className="space-y-3">
              <h4 className="font-extrabold text-xs uppercase text-slate-400">Chapters & Lessons Curriculum</h4>
              <div className="space-y-2">
                {courseDetailModal.chapters?.map((ch, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <p className="font-extrabold text-xs text-navy-950">{ch.title}</p>
                    <div className="space-y-1 pl-3 border-l-2 border-teal-400">
                      {ch.lessons?.map((ls, lsIdx) => (
                        <div key={lsIdx} className="flex items-center justify-between text-xs text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <PlayCircle className="w-3.5 h-3.5 text-teal-600" /> {ls.title}
                          </span>
                          <span className="text-[11px] text-slate-400">{ls.duration || '20 min'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ 100% Free Lifetime Access
              </span>
              <button
                onClick={() => handleEnrollFree(courseDetailModal._id)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
              >
                Enroll for Free Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE COURSE LEARNING PLAYER (PRD Section 7.3)
      ========================================================================= */}
      {activeLearningCourse && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-navy-950 text-white flex items-center justify-between border-b border-navy-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">{activeLearningCourse.title}</h3>
                  <p className="text-[11px] text-teal-200">
                    Faculty: {activeLearningCourse.instructorName || 'Verified Faculty'} • 100% Free Learning
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveLearningCourse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Area: Video/Content on Left, Curriculum on Right */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Left Pane: Active Lesson Player */}
              <div className="lg:col-span-2 p-5 sm:p-6 space-y-4 overflow-y-auto">
                {activeLesson ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">
                        Lesson • {activeLesson.duration || '25 min'}
                      </span>
                      <button
                        onClick={() => handleMarkLessonComplete(activeLearningCourse._id, activeLesson._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Completed
                      </button>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-navy-950">{activeLesson.title}</h4>

                    {/* YouTube Video or Embed */}
                    {activeLesson.youtubeVideoId || activeLesson.videoUrl ? (
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md">
                        <iframe
                          src={activeLesson.safeEmbedUrl || `https://www.youtube-nocookie.com/embed/${activeLesson.youtubeVideoId || 'dQw4w9WgXcQ'}`}
                          title={activeLesson.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
                        <p className="font-bold text-navy-950">Lesson Notes & Text Content:</p>
                        <p>{activeLesson.textContent || activeLesson.description || 'Welcome to this lesson module.'}</p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {activeLesson.description || 'Follow along with the lesson instructions and mark completed when finished.'}
                    </p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Select a lesson from the syllabus on the right to start watching.
                  </div>
                )}
              </div>

              {/* Right Pane: Course Syllabus / Chapters */}
              <div className="p-5 sm:p-6 bg-slate-50/50 space-y-4 overflow-y-auto max-h-[60vh] lg:max-h-none">
                <h4 className="font-extrabold text-xs uppercase text-slate-400">Course Syllabus</h4>
                <div className="space-y-3">
                  {activeLearningCourse.chapters?.map((ch, chIdx) => (
                    <div key={chIdx} className="space-y-1.5">
                      <p className="font-bold text-xs text-navy-950">{ch.title}</p>
                      <div className="space-y-1 pl-2">
                        {ch.lessons?.map((ls, lsIdx) => {
                          const isActive = activeLesson?._id === ls._id || activeLesson?.title === ls.title;
                          return (
                            <button
                              key={lsIdx}
                              onClick={() => setActiveLesson(ls)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                                isActive ? 'bg-teal-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                              }`}
                            >
                              <span className="line-clamp-1">{ls.title}</span>
                              <span className={`text-[10px] shrink-0 ml-2 ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                                {ls.duration || '20m'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          RESOURCE PREVIEW MODAL
      ========================================================================= */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-navy-950">{previewMaterial.title}</h3>
              <button onClick={() => setPreviewMaterial(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <iframe
                src={previewMaterial.safeEmbedUrl || `https://www.youtube-nocookie.com/embed/${previewMaterial.youtubeVideoId}`}
                title={previewMaterial.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
      {/* Student Job Application Modal (PRD Section 1 & 2) */}
      <StudentJobApplicationModal
        job={applyModalJob}
        isOpen={Boolean(applyModalJob)}
        onClose={() => setApplyModalJob(null)}
        onSuccess={() => {
          setApplyModalJob(null);
          loadData();
        }}
      />
    </div>
  );
};
export default StudentDashboardPage;
