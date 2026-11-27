import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  GraduationCap,
  Video,
  PlusCircle,
  FileText,
  DollarSign,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Check,
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle,
  PlayCircle,
  Trash2,
  Edit3,
  Search,
  Eye,
  BookOpen,
  Layers,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Award,
  Info,
  Send,
  Upload,
} from 'lucide-react';
import { educationApi, documentsApi } from '../../services/api';
import { StatCard } from '../../components/dashboard/StatCard';
import { ProfileCompletion } from '../../components/dashboard/ProfileCompletion';
import { CommunityView } from '../../components/dashboard/CommunityView';
import { EventsView } from '../../components/dashboard/EventsView';
import { DocumentVerificationPanel } from '../../components/verification/DocumentVerificationPanel';

export const TeacherDashboardPage = () => {
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

  // Main state collections
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [docChecklist, setDocChecklist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search / Filters
  const [courseFilter, setCourseFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Course Builder Modal State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cCategory, setCCategory] = useState('');
  const [cSubcategory, setCSubcategory] = useState('');
  const [cLevel, setCLevel] = useState('beginner');
  const [cLanguage, setCLanguage] = useState('English');
  const [cDuration, setCDuration] = useState('8 Hours');
  const [cThumbnail, setCThumbnail] = useState('');
  const [cTargetAudience, setCTargetAudience] = useState('Students & Working Professionals');
  const [cObjectives, setCObjectives] = useState('Master core practical concepts and build complete end-to-end projects.');
  const [cPrerequisites, setCPrerequisites] = useState('Basic domain understanding or beginner curiosity.');
  const [cChapters, setCChapters] = useState([
    {
      title: 'Chapter 1: Foundations & Architecture',
      description: 'Core concepts and environment orientation.',
      order: 1,
      lessons: [
        {
          title: 'Lesson 1.1: Overview & Tools',
          description: 'Introduction to fundamentals and setup.',
          contentType: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '25 min',
          order: 1,
        },
      ],
    },
  ]);

  // Live Class Scheduling Modal State
  const [scheduleClassOpen, setScheduleClassOpen] = useState(false);
  const [lTitle, setLTitle] = useState('');
  const [lSubject, setLSubject] = useState('');
  const [lDesc, setLDesc] = useState('');
  const [lDate, setLDate] = useState('2026-12-05');
  const [lTime, setLTime] = useState('18:00 EST');
  const [lEndTime, setLEndTime] = useState('19:30 EST');
  const [lCapacity, setLCapacity] = useState(100);
  const [lRelatedCourse, setLRelatedCourse] = useState('');

  // Study Material Upload Modal State
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mCategory, setMCategory] = useState('');
  const [mType, setMType] = useState('pdf');
  const [mFileUrl, setMFileUrl] = useState('');
  const [mCourseId, setMCourseId] = useState('');

  // Roster Modal State
  const [activeRosterClass, setActiveRosterClass] = useState(null);
  const [rosterData, setRosterData] = useState({ registrations: [], attendance: [] });
  const [loadingRoster, setLoadingRoster] = useState(false);

  // Video / Resource Preview Modal
  const [previewResource, setPreviewResource] = useState(null);

  const handleCopyLink = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [crsRes, liveRes, payRes, matRes, stuRes, catRes, docRes] = await Promise.allSettled([
        educationApi.getMyTeacherCourses ? educationApi.getMyTeacherCourses() : educationApi.getCourses(),
        educationApi.getLiveClasses(),
        educationApi.getTeacherPayments(),
        educationApi.getMyTeacherMaterials ? educationApi.getMyTeacherMaterials() : educationApi.getMaterials(),
        educationApi.getTeacherStudents ? educationApi.getTeacherStudents() : Promise.resolve({ data: { data: [] } }),
        educationApi.getEducationCategories ? educationApi.getEducationCategories() : Promise.resolve({ data: { data: [] } }),
        documentsApi.getMyChecklist(),
      ]);

      if (crsRes.status === 'fulfilled') setCourses(crsRes.value.data?.data || []);
      if (liveRes.status === 'fulfilled') setLiveClasses(liveRes.value.data?.data || []);
      if (payRes.status === 'fulfilled') setPayments(payRes.value.data?.data || []);
      if (matRes.status === 'fulfilled') setMaterials(matRes.value.data?.data || []);
      if (stuRes.status === 'fulfilled') setStudents(stuRes.value.data?.data || []);
      if (catRes.status === 'fulfilled') {
        const fetchedCats = catRes.value.data?.data || [];
        setCategories(fetchedCats);
        if (fetchedCats.length > 0) {
          if (!cCategory) setCCategory(fetchedCats[0].name);
          if (!lSubject) setLSubject(fetchedCats[0].name);
          if (!mCategory) setMCategory(fetchedCats[0].name);
        }
      }
      if (docRes.status === 'fulfilled' && docRes.value.data?.success) {
        setDocChecklist(docRes.value.data);
      }
    } catch (err) {
      console.error('Error loading teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync tab navigation with modals if opened via URL query
  useEffect(() => {
    if (activeTab === 'create-course') {
      openCreateCourseModal();
    } else if (activeTab === 'schedule-class') {
      setScheduleClassOpen(true);
    }
  }, [activeTab]);

  // Open Course Modal (Create or Edit)
  const openCreateCourseModal = (course = null) => {
    if (course) {
      setEditingCourseId(course._id);
      setCTitle(course.title || '');
      setCDesc(course.description || '');
      setCCategory(course.category || (categories[0]?.name || 'Computer Science & Software Engineering'));
      setCSubcategory(course.subcategory || '');
      setCLevel(course.level || 'beginner');
      setCLanguage(course.language || 'English');
      setCDuration(course.duration || '8 Hours');
      setCThumbnail(course.thumbnailUrl || '');
      setCTargetAudience(course.targetAudience || 'Students & Working Professionals');
      setCObjectives(Array.isArray(course.objectives) ? course.objectives.join('\n') : (course.objectives || ''));
      setCPrerequisites(Array.isArray(course.prerequisites) ? course.prerequisites.join('\n') : (course.prerequisites || ''));
      setCChapters(course.chapters && course.chapters.length > 0 ? course.chapters : [
        {
          title: 'Chapter 1: Foundations',
          description: 'Introduction and setup.',
          order: 1,
          lessons: [{ title: 'Lesson 1.1: Core Concepts', contentType: 'text', textContent: 'Course overview', duration: '20 min', order: 1 }],
        },
      ]);
    } else {
      setEditingCourseId(null);
      setCTitle('');
      setCDesc('');
      setCCategory(categories[0]?.name || 'Computer Science & Software Engineering');
      setCSubcategory('');
      setCLevel('beginner');
      setCLanguage('English');
      setCDuration('8 Hours');
      setCThumbnail('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');
      setCTargetAudience('Students & Working Professionals');
      setCObjectives('Master core practical concepts and build complete end-to-end projects.');
      setCPrerequisites('Basic domain understanding or beginner curiosity.');
      setCChapters([
        {
          title: 'Chapter 1: Foundations & Architecture',
          description: 'Core concepts and environment orientation.',
          order: 1,
          lessons: [
            {
              title: 'Lesson 1.1: Overview & Tools',
              description: 'Introduction to fundamentals and setup.',
              contentType: 'video',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              duration: '25 min',
              order: 1,
            },
          ],
        },
      ]);
    }
    setCourseModalOpen(true);
  };

  // Chapter & Lesson Helpers
  const handleAddChapter = () => {
    setCChapters([
      ...cChapters,
      {
        title: `Chapter ${cChapters.length + 1}: Next Phase`,
        description: 'Detailed practical exercises and modules.',
        order: cChapters.length + 1,
        lessons: [
          {
            title: `Lesson ${cChapters.length + 1}.1: Deep Dive`,
            description: 'Core topic exploration and implementation.',
            contentType: 'text',
            textContent: '',
            duration: '30 min',
            order: 1,
          },
        ],
      },
    ]);
  };

  const handleRemoveChapter = (chIdx) => {
    if (cChapters.length <= 1) {
      alert('A course must contain at least one chapter.');
      return;
    }
    setCChapters(cChapters.filter((_, idx) => idx !== chIdx));
  };

  const handleAddLesson = (chIdx) => {
    const updated = [...cChapters];
    const targetLessons = updated[chIdx].lessons || [];
    targetLessons.push({
      title: `Lesson ${chIdx + 1}.${targetLessons.length + 1}: Practical Application`,
      description: 'Hands-on practice.',
      contentType: 'video',
      videoUrl: '',
      textContent: '',
      duration: '25 min',
      order: targetLessons.length + 1,
    });
    updated[chIdx].lessons = targetLessons;
    setCChapters(updated);
  };

  const handleRemoveLesson = (chIdx, lsIdx) => {
    const updated = [...cChapters];
    if (updated[chIdx].lessons.length <= 1) {
      alert('Each chapter must contain at least one lesson.');
      return;
    }
    updated[chIdx].lessons = updated[chIdx].lessons.filter((_, idx) => idx !== lsIdx);
    setCChapters(updated);
  };

  const handleLessonChange = (chIdx, lsIdx, field, val) => {
    const updated = [...cChapters];
    updated[chIdx].lessons[lsIdx][field] = val;
    setCChapters(updated);
  };

  const handleSaveCourse = async (submitForApproval = false) => {
    if (!cTitle.trim() || !cDesc.trim() || !cCategory) {
      alert('Please fill out Course Title, Description, and Category.');
      return;
    }

    try {
      const payload = {
        title: cTitle.trim(),
        description: cDesc.trim(),
        category: cCategory,
        subcategory: cSubcategory,
        level: cLevel,
        language: cLanguage,
        duration: cDuration,
        thumbnailUrl: cThumbnail.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        targetAudience: cTargetAudience,
        objectives: cObjectives.split('\n').filter(Boolean),
        prerequisites: cPrerequisites.split('\n').filter(Boolean),
        chapters: cChapters,
        submitForApproval,
        isFree: true, // 100% Free
      };

      if (editingCourseId) {
        await educationApi.updateCourse(editingCourseId, payload);
        alert(submitForApproval ? 'Course updated and submitted to Admin for review!' : 'Course draft saved successfully!');
      } else {
        await educationApi.createCourse(payload);
        alert(submitForApproval ? 'Course submitted to Admin for approval!' : 'Course draft saved successfully!');
      }

      setCourseModalOpen(false);
      loadData();
      handleTabChange('courses');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving course');
    }
  };

  // Schedule Live Class
  const handleScheduleClass = async (e) => {
    e.preventDefault();
    if (!lTitle.trim() || !lSubject.trim() || !lDate) {
      alert('Please complete all required fields for the live class.');
      return;
    }

    try {
      await educationApi.createLiveClass({
        title: lTitle.trim(),
        subject: lSubject.trim(),
        description: lDesc.trim(),
        scheduledDate: lDate,
        startTime: lTime,
        endTime: lEndTime,
        timezone: 'UTC-5 (EST)',
        courseId: lRelatedCourse || undefined,
        meetingProvider: 'Jitsi Meet (WebRTC)',
        maxParticipants: parseInt(lCapacity) || 100,
        isFree: true,
      });

      setScheduleClassOpen(false);
      setLTitle('');
      setLDesc('');
      loadData();
      alert('Live Class scheduled successfully! Students can now register for free.');
      handleTabChange('live-classes');
    } catch (err) {
      alert(err.response?.data?.message || 'Error scheduling class');
    }
  };

  // End Class Trigger (marks completed and records attendance)
  const handleEndClass = async (classId) => {
    if (!window.confirm('Are you sure you want to end this live class? This marks the session Completed and records student attendance for Admin stipend evaluation.')) {
      return;
    }
    try {
      await educationApi.endLiveClass(classId);
      loadData();
      alert('Live Class successfully ended and marked Completed! Attendance recorded for Admin compensation review.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error concluding live class');
    }
  };

  // View Class Roster & Attendance
  const handleViewRoster = async (lc) => {
    setActiveRosterClass(lc);
    setLoadingRoster(true);
    try {
      const res = await educationApi.getClassRoster(lc._id);
      if (res.data?.success) {
        setRosterData(res.data);
      }
    } catch (err) {
      console.error('Error fetching roster:', err);
    } finally {
      setLoadingRoster(false);
    }
  };

  // Upload Study Material
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!mTitle.trim() || !mCategory) {
      alert('Material title and category are required.');
      return;
    }
    try {
      await educationApi.uploadMaterial({
        title: mTitle.trim(),
        description: mDesc.trim(),
        category: mCategory,
        materialType: mType,
        fileUrl: mFileUrl.trim() || (mType === 'pdf' ? '/uploads/documents/lecture_notes.pdf' : ''),
        youtubeUrl: mType === 'youtube' ? mFileUrl.trim() : '',
        courseId: mCourseId || undefined,
        isFree: true,
      });

      setMaterialModalOpen(false);
      setMTitle('');
      setMDesc('');
      setMFileUrl('');
      loadData();
      alert('Study Material uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading study material');
    }
  };

  // Filtered lists
  const filteredCourses = courses.filter((c) => {
    if (courseFilter === 'all') return true;
    return c.status === courseFilter;
  });

  const filteredStudents = students.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return s.studentName?.toLowerCase().includes(q) || s.courseTitle?.toLowerCase().includes(q) || s.studentEmail?.toLowerCase().includes(q);
  });

  // Overview stats calculation
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.status === 'published').length;
  const pendingCourses = courses.filter((c) => c.status === 'pending_approval' || c.status === 'under_review').length;
  const totalEnrolledStudents = students.length || courses.reduce((acc, c) => acc + (c.enrolledStudentsCount || 0), 0);
  const totalMaterials = materials.length;
  const upcomingClasses = liveClasses.filter((l) => l.status === 'scheduled' || l.status === 'upcoming').length;
  const completedClasses = liveClasses.filter((l) => l.status === 'completed').length;
  const totalAttendance = liveClasses.reduce((acc, l) => acc + (l.actualAttendanceCount || l.attendeesCount || 0), 0);

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingStipends = payments
    .filter((p) => p.status === 'pending' || p.status === 'approved')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Pending Approval / Verification Alert */}
      {(user?.status === 'pending' || docChecklist?.summary?.rejectedOrReplacementCount > 0) && activeTab !== 'verification' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-extrabold text-amber-950">
                {docChecklist?.summary?.rejectedOrReplacementCount > 0
                  ? 'Action Required: Document Replacement Requested by Admin'
                  : 'Teacher Profile Under Admin Verification'}
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Your profile credentials and KYC documents are under review ({docChecklist?.summary?.verifiedMandatory || 0}/{docChecklist?.summary?.totalMandatory || 0} verified). Publishing privileges unlock once approved.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleTabChange('verification')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 shadow-xs transition-colors"
          >
            Review Verification Docs →
          </button>
        </div>
      )}

      {/* =========================================================================
          MODULE 1: DASHBOARD OVERVIEW (PRD Section 2.1)
      ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-extrabold border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Teacher & Faculty Workspace • 100% Free for Students
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.fullName || 'Educator Portal'}</h1>
              <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
                Author free structured courses, broadcast live WebRTC classes, publish study notes, and receive custom administrative stipends.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 z-10">
              <button
                onClick={() => openCreateCourseModal()}
                className="px-4 py-2.5 rounded-xl bg-white text-navy-950 font-bold text-xs shadow-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-teal-600" /> Create Course
              </button>
              <button
                onClick={() => setScheduleClassOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4" /> Schedule Live Class
              </button>
              <button
                onClick={() => setMaterialModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs border border-navy-700 flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-teal-300" /> Upload Notes
              </button>
            </div>
          </div>

          {/* Profile Completion Widget */}
          <ProfileCompletion user={user} compact />

          {/* 8 Stats from Actual Backend Data (PRD 2.1) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Total Courses"
              value={totalCourses}
              subtext={`${publishedCourses} Published • ${pendingCourses} Pending`}
              icon={GraduationCap}
              badge="Courseware"
              badgeColor="teal"
              onClick={() => handleTabChange('courses')}
            />
            <StatCard
              label="Enrolled Students"
              value={totalEnrolledStudents}
              subtext="Active Learners"
              icon={Users}
              badge="100% Free"
              badgeColor="emerald"
              onClick={() => handleTabChange('students')}
            />
            <StatCard
              label="Study Materials"
              value={totalMaterials}
              subtext="PDF, Docs & YouTube"
              icon={FileText}
              badge="Resources"
              badgeColor="teal"
              onClick={() => handleTabChange('materials')}
            />
            <StatCard
              label="Live Classes"
              value={liveClasses.length}
              subtext={`${upcomingClasses} Upcoming • ${completedClasses} Done`}
              icon={Video}
              badge="WebRTC"
              badgeColor="amber"
              onClick={() => handleTabChange('live-classes')}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Total Attendance"
              value={totalAttendance}
              subtext="Student Session Joins"
              icon={CheckCircle}
              badge="Verified"
              badgeColor="emerald"
              onClick={() => handleTabChange('attendance')}
            />
            <StatCard
              label="Completed Classes"
              value={completedClasses}
              subtext="Eligible for Stipends"
              icon={Award}
              badge="Stipends"
              badgeColor="teal"
              onClick={() => handleTabChange('payments')}
            />
            <StatCard
              label="Approved Stipends"
              value={`$${totalPaid.toFixed(2)}`}
              subtext="Disbursed by Admin"
              icon={DollarSign}
              badge="Paid"
              badgeColor="emerald"
              onClick={() => handleTabChange('payments')}
            />
            <StatCard
              label="Pending Stipends"
              value={`$${pendingStipends.toFixed(2)}`}
              subtext="Under Admin Review"
              icon={Clock}
              badge="Audit"
              badgeColor="rose"
              onClick={() => handleTabChange('payments')}
            />
          </div>

          {/* Recent Upcoming Classes & Courseware Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Live Classes Spotlight */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-teal-600" />
                  <h3 className="font-extrabold text-base text-navy-950">Upcoming Live Classes</h3>
                </div>
                <button onClick={() => handleTabChange('live-classes')} className="text-xs font-bold text-teal-600 hover:underline">
                  View all ({liveClasses.length}) →
                </button>
              </div>

              {liveClasses.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No upcoming classes scheduled yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {liveClasses.slice(0, 3).map((lc) => (
                    <div key={lc._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            lc.status === 'live' ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-teal-50 text-teal-700'
                          }`}>
                            {lc.status}
                          </span>
                          <h4 className="font-bold text-xs text-navy-950">{lc.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {lc.scheduledDate} • {lc.startTime} ({lc.timezone || 'EST'}) • {lc.registeredStudentsCount || 0} Registered
                        </p>
                      </div>
                      <a
                        href={lc.meetingUrl || lc.classLink || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs"
                      >
                        <ExternalLink className="w-3 h-3 text-teal-400" /> Host
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Courseware Spotlight */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-600" />
                  <h3 className="font-extrabold text-base text-navy-950">Authored Courses</h3>
                </div>
                <button onClick={() => handleTabChange('courses')} className="text-xs font-bold text-teal-600 hover:underline">
                  View all ({courses.length}) →
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No courses authored yet. Click "Create Course" to build one!
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.slice(0, 3).map((c) => (
                    <div key={c._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={c.thumbnailUrl} alt={c.title} className="w-12 h-12 rounded-xl object-cover bg-slate-200" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              c.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : c.status === 'pending_approval'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {c.status?.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400">{c.level}</span>
                          </div>
                          <h4 className="font-bold text-xs text-navy-950 mt-0.5 line-clamp-1">{c.title}</h4>
                        </div>
                      </div>
                      <button
                        onClick={() => openCreateCourseModal(c)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs shrink-0 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-teal-600" /> Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: MY COURSES & CURRICULUM MANAGEMENT (PRD Section 3)
      ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-xl text-navy-950">Course Management & Curriculum</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Organize multi-chapter courses, embed YouTube videos, attach study materials. 100% Free for students.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold text-slate-600">
                {['all', 'published', 'pending_approval', 'draft'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setCourseFilter(st)}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                      courseFilter === st ? 'bg-white text-navy-950 shadow-xs' : 'hover:text-navy-950'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => openCreateCourseModal()}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Create Course
              </button>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-700">No courses match the selected filter.</p>
              <button
                onClick={() => openCreateCourseModal()}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
              >
                Create First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((c) => {
                const totalLessons = c.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0;
                return (
                  <div key={c._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="relative">
                        <img src={c.thumbnailUrl} alt={c.title} className="w-full h-40 rounded-2xl object-cover bg-slate-100" />
                        <span className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs ${
                          c.status === 'published'
                            ? 'bg-emerald-500 text-white'
                            : c.status === 'pending_approval'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-700 text-white'
                        }`}>
                          {c.status?.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          {c.category} • {c.level}
                        </span>
                        <h4 className="font-extrabold text-sm text-navy-950 line-clamp-2 mt-1">{c.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded-xl bg-slate-50">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Chapters</p>
                          <p className="font-extrabold text-navy-950 mt-0.5">{c.chapters?.length || 1}</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Lessons</p>
                          <p className="font-extrabold text-navy-950 mt-0.5">{totalLessons}</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Students</p>
                          <p className="font-extrabold text-teal-600 mt-0.5">{c.enrolledStudentsCount || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => openCreateCourseModal(c)}
                        className="flex-1 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Curriculum
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODULE 3: STUDY MATERIALS & NOTES (PRD Section 4)
      ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-xl text-navy-950">Study Materials & Notes</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload lecture slides, PDF blueprints, Word docs, and YouTube learning links with download metrics.
              </p>
            </div>
            <button
              onClick={() => setMaterialModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" /> Upload Material
            </button>
          </div>

          {materials.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-700">No study materials uploaded yet.</p>
              <button
                onClick={() => setMaterialModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
              >
                Upload First Material
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {materials.map((m) => {
                const isYt = m.materialType === 'youtube' || Boolean(m.youtubeUrl);
                return (
                  <div key={m._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                          isYt ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {m.materialType?.toUpperCase() || 'DOCUMENT'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">{m.category}</span>
                      </div>

                      <h4 className="font-extrabold text-sm text-navy-950 line-clamp-1">{m.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{m.description || 'Reference notes for students.'}</p>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>{m.fileSize || 'Digital Resource'}</span>
                        <span className="font-bold text-teal-600">{m.downloadsCount || m.viewsCount || 0} Accesses</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      {isYt ? (
                        <button
                          onClick={() => setPreviewResource(m)}
                          className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Watch Preview
                        </button>
                      ) : (
                        <a
                          href={m.fileUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview / Download
                        </a>
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
          MODULE 4: LIVE CLASSES (PRD Section 5)
      ========================================================================= */}
      {activeTab === 'live-classes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-xl text-navy-950">Live Virtual Classrooms (WebRTC)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Host real-time online classes with student rosters, automated reconnect attendance, and end-of-class triggers.
              </p>
            </div>
            <button
              onClick={() => setScheduleClassOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" /> Schedule New Class
            </button>
          </div>

          {liveClasses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
              <Video className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-700">No live classes scheduled yet.</p>
              <button
                onClick={() => setScheduleClassOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
              >
                Schedule First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveClasses.map((lc) => {
                const liveUrl = lc.meetingUrl || lc.classLink || `https://meet.jit.si/BusinessHub_Class_${lc._id}`;
                const isLive = lc.status === 'live';
                const isDone = lc.status === 'completed';

                return (
                  <div key={lc._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          isLive
                            ? 'bg-rose-500 text-white animate-pulse'
                            : isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {lc.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">Cap: {lc.maxParticipants || 100}</span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-base text-navy-950">{lc.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{lc.subject}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" /> {lc.scheduledDate}
                          </span>
                          <span className="flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-teal-600" /> {lc.startTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                          <span>{lc.registeredStudentsCount || 0} Registered</span>
                          <span className="font-bold text-teal-700">{lc.actualAttendanceCount || 0} Attended</span>
                        </div>
                      </div>

                      {/* WebRTC Room Link Box */}
                      <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200/60 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-600 flex items-center gap-1">
                            <LinkIcon className="w-3 h-3 text-teal-600" /> Jitsi Meeting:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(liveUrl, lc._id)}
                            className="text-teal-600 hover:text-teal-700 font-extrabold flex items-center gap-1 text-[10px]"
                          >
                            {copiedId === lc._id ? (
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
                        <span className="block text-xs font-mono text-slate-500 truncate" title={liveUrl}>
                          {liveUrl}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex gap-2">
                        {!isDone && (
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                            {isLive ? 'Enter Room' : 'Start Stream (Host)'}
                          </a>
                        )}
                        {!isDone && (
                          <button
                            onClick={() => handleEndClass(lc._id)}
                            className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
                            title="Conclude live class and trigger attendance calculation"
                          >
                            End Class
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleViewRoster(lc)}
                        className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-teal-600" /> View Roster & Attendance
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODULE 5: MY STUDENTS (PRD Section 2 sidebar item 5)
      ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-xl text-navy-950">My Students Roster</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students enrolled in your free courses with their live completion progress.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students or courses..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white text-xs rounded-xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3.5 px-5">Student Name</th>
                    <th className="py-3.5 px-4">Course Enrolled</th>
                    <th className="py-3.5 px-4">Progress</th>
                    <th className="py-3.5 px-4">Enrolled Date</th>
                    <th className="py-3.5 px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No enrolled students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr key={st._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <p className="font-bold text-navy-950">{st.studentName}</p>
                          <p className="text-[11px] text-slate-400">{st.studentEmail}</p>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-800">{st.courseTitle}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${st.progress || 0}%` }} />
                            </div>
                            <span className="font-bold text-slate-600 text-[11px]">{st.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500">{st.enrolledAt ? new Date(st.enrolledAt).toLocaleDateString() : 'Active'}</td>
                        <td className="py-4 px-5 text-right">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Enrolled (Free)
                          </span>
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
          MODULE 6: ATTENDANCE (PRD Section 2 sidebar item 6 & Section 5.5)
      ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-extrabold text-xl text-navy-950">Class Attendance Log & Audit Roster</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live classroom attendance records used by Admin to audit and determine teacher class stipends.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-navy-950">Conducted Live Classes</h4>
            <div className="divide-y divide-slate-100">
              {liveClasses.map((lc) => (
                <div key={lc._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-navy-950">{lc.title}</p>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        lc.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {lc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lc.scheduledDate} • {lc.startTime} • Max Capacity: {lc.maxParticipants || 100} Seats
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-xs text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                      {lc.actualAttendanceCount || 0} Attended
                    </span>
                    <button
                      onClick={() => handleViewRoster(lc)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                    >
                      View Sheet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 7: TEACHER PAYMENTS & STIPENDS (PRD Section 10)
      ========================================================================= */}
      {(activeTab === 'payments' || activeTab === 'stipends') && (
        <div className="space-y-6">
          <div>
            <h3 className="font-extrabold text-xl text-navy-950">Teacher Compensation & Stipends</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero cost for students. Admin individually reviews completed classes, student attendance, and issues compensation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Total Settled Stipends</p>
              <p className="text-2xl font-black text-emerald-600">${totalPaid.toFixed(2)}</p>
              <p className="text-[11px] text-slate-500">Paid directly by Platform Admin</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Under Review / Pending</p>
              <p className="text-2xl font-black text-amber-600">${pendingStipends.toFixed(2)}</p>
              <p className="text-[11px] text-slate-500">Awaiting Admin final disbursement</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Eligible Completed Classes</p>
              <p className="text-2xl font-black text-navy-950">{completedClasses}</p>
              <p className="text-[11px] text-slate-500">Live sessions concluded</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3.5 px-5">Class Title</th>
                    <th className="py-3.5 px-4">Attendance Count</th>
                    <th className="py-3.5 px-4">Stipend Amount</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4">Admin Audit Notes</th>
                    <th className="py-3.5 px-5 text-right">Transaction Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No payment records found. Completed live classes will appear here for Admin evaluation.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5 font-bold text-navy-950">{p.classTitle}</td>
                        <td className="py-4 px-4 font-semibold text-teal-600">{p.studentAttendanceCount || 0} students</td>
                        <td className="py-4 px-4 font-black text-navy-950 text-sm">${(p.amount || 0).toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            p.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'approved'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500">{p.adminNotes || p.notes || 'Admin reviewed'}</td>
                        <td className="py-4 px-5 text-right font-mono text-[11px] text-slate-400">
                          {p.transactionReference || p.transactionRef || 'Pending Settlement'}
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
          MODULE 8: COMMUNITY & EVENTS (Legacy & Platform Features)
      ========================================================================= */}
      {activeTab === 'community' && <CommunityView role="teacher" />}
      {activeTab === 'events' && <EventsView role="teacher" onSchedule={() => setScheduleClassOpen(true)} />}

      {/* =========================================================================
          MODULE 9: VERIFICATION DOCUMENTS
      ========================================================================= */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h3 className="font-extrabold text-lg text-navy-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Teacher Document Verification Center
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track compliance vetting status and upload required replacement documents requested by platform administrators.
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
              user?.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              Account: {user?.verificationStatus?.replace('_', ' ') || user?.status}
            </span>
          </div>

          {docChecklist ? (
            <DocumentVerificationPanel
              checklistData={docChecklist}
              onChecklistUpdated={(updated) => setDocChecklist(updated)}
              roles={user?.roles || ['teacher']}
              isPostSubmission={true}
            />
          ) : (
            <p className="text-xs text-slate-400">Loading verification checklist...</p>
          )}
        </div>
      )}

      {/* =========================================================================
          COMPREHENSIVE COURSE CURRICULUM BUILDER MODAL (PRD Section 3)
      ========================================================================= */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-navy-950">
                  {editingCourseId ? 'Edit Course & Curriculum' : 'Create Free Structured Course'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-chapter syllabus builder with YouTube embeds and study material attachments.
                </p>
              </div>
              <button
                onClick={() => setCourseModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Basic Course Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={cTitle}
                    onChange={(e) => setCTitle(e.target.value)}
                    placeholder="e.g. Distributed Cloud Systems & Microservices"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Category *</label>
                  <select
                    value={cCategory}
                    onChange={(e) => setCCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Computer Science & Software Engineering">Computer Science & Software Engineering</option>
                        <option value="Business, Management & Commerce">Business, Management & Commerce</option>
                        <option value="Engineering & Construction">Engineering & Construction</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Subcategory (Optional)</label>
                  <input
                    type="text"
                    value={cSubcategory}
                    onChange={(e) => setCSubcategory(e.target.value)}
                    placeholder="e.g. React & Node Backend"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Level</label>
                    <select
                      value={cLevel}
                      onChange={(e) => setCLevel(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Language</label>
                    <input
                      type="text"
                      value={cLanguage}
                      onChange={(e) => setCLanguage(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Duration</label>
                    <input
                      type="text"
                      value={cDuration}
                      onChange={(e) => setCDuration(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Course Description *</label>
                <textarea
                  rows={3}
                  required
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  placeholder="Outline course learning outcomes and comprehensive description..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={cThumbnail}
                  onChange={(e) => setCThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Curriculum Multi-Chapter & Lesson Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    Chapters & Lessons Curriculum
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddChapter}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Chapter
                  </button>
                </div>

                <div className="space-y-4">
                  {cChapters.map((ch, chIdx) => (
                    <div key={chIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={ch.title}
                            onChange={(e) => {
                              const updated = [...cChapters];
                              updated[chIdx].title = e.target.value;
                              setCChapters(updated);
                            }}
                            className="font-bold text-xs text-navy-950 bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-full"
                            placeholder="Chapter Title..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveChapter(chIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Lessons list under this chapter */}
                      <div className="space-y-2.5 pl-3 border-l-2 border-teal-400">
                        {ch.lessons?.map((ls, lsIdx) => (
                          <div key={lsIdx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={ls.title}
                                onChange={(e) => handleLessonChange(chIdx, lsIdx, 'title', e.target.value)}
                                className="font-semibold text-xs text-slate-900 border-b border-slate-100 focus:border-teal-500 outline-hidden flex-1"
                                placeholder="Lesson Title..."
                              />
                              <div className="flex items-center gap-2">
                                <select
                                  value={ls.contentType || 'video'}
                                  onChange={(e) => handleLessonChange(chIdx, lsIdx, 'contentType', e.target.value)}
                                  className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50"
                                >
                                  <option value="video">YouTube Video</option>
                                  <option value="text">Text Lesson</option>
                                  <option value="pdf">PDF Material</option>
                                  <option value="doc">Document</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLesson(chIdx, lsIdx)}
                                  className="text-slate-400 hover:text-rose-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Video / YouTube input */}
                            {ls.contentType === 'video' ? (
                              <div className="space-y-1">
                                <input
                                  type="url"
                                  value={ls.videoUrl || ''}
                                  onChange={(e) => handleLessonChange(chIdx, lsIdx, 'videoUrl', e.target.value)}
                                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                                />
                                {ls.videoUrl && (
                                  <p className="text-[10px] text-teal-600 font-semibold">
                                    ✓ YouTube video linked: safe embedded player enabled
                                  </p>
                                )}
                              </div>
                            ) : (
                              <textarea
                                rows={2}
                                value={ls.textContent || ''}
                                onChange={(e) => handleLessonChange(chIdx, lsIdx, 'textContent', e.target.value)}
                                placeholder="Lesson text notes and markdown..."
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                              />
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleAddLesson(chIdx)}
                          className="text-[11px] font-bold text-teal-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <PlusCircle className="w-3 h-3" /> Add Lesson to Chapter {chIdx + 1}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                ✓ 100% Free Platform: Zero Paywalls for Students
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCourse(false)}
                  className="px-4 py-2 rounded-xl border border-teal-600 text-teal-700 font-bold text-xs hover:bg-teal-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCourse(true)}
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-500"
                >
                  Submit for Admin Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCHEDULE LIVE CLASS MODAL (PRD Section 5)
      ========================================================================= */}
      {scheduleClassOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-navy-950">Schedule Live Class (WebRTC)</h3>
              <button onClick={() => setScheduleClassOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleClass} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Class Title *</label>
                <input
                  type="text"
                  required
                  value={lTitle}
                  onChange={(e) => setLTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Live Coding Masterclass"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Subject / Category *</label>
                <select
                  value={lSubject}
                  onChange={(e) => setLSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Class Date *</label>
                  <input
                    type="date"
                    required
                    value={lDate}
                    onChange={(e) => setLDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={lTime}
                    onChange={(e) => setLTime(e.target.value)}
                    placeholder="18:00 EST"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">End Time</label>
                  <input
                    type="text"
                    value={lEndTime}
                    onChange={(e) => setLEndTime(e.target.value)}
                    placeholder="19:30 EST"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Max Student Limit</label>
                  <input
                    type="number"
                    value={lCapacity}
                    onChange={(e) => setLCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Description & Objectives</label>
                <textarea
                  rows={2}
                  value={lDesc}
                  onChange={(e) => setLDesc(e.target.value)}
                  placeholder="Outline key topics to be covered during this live interactive session..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200/80 text-xs text-teal-900 space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" /> WebRTC Jitsi Meeting Auto-Assigned
                </p>
                <p className="text-[11px] text-teal-800">
                  A high-performance secure room with host controls for you and participant restrictions for students will be created automatically.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScheduleClassOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-500"
                >
                  Publish Live Class (Free)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          UPLOAD STUDY MATERIAL MODAL (PRD Section 4)
      ========================================================================= */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-navy-950">Upload Study Material</h3>
              <button onClick={() => setMaterialModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Material Title *</label>
                <input
                  type="text"
                  required
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  placeholder="e.g. Distributed Database Architecture Notes"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Material Type *</label>
                  <select
                    value={mType}
                    onChange={(e) => setMType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="ppt">PowerPoint (PPT/PPTX)</option>
                    <option value="doc">Word Document (DOC/DOCX)</option>
                    <option value="youtube">YouTube Video Link</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Category *</label>
                  <select
                    value={mCategory}
                    onChange={(e) => setMCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  {mType === 'youtube' ? 'YouTube Video URL *' : 'File URL / Path *'}
                </label>
                <input
                  type="url"
                  required
                  value={mFileUrl}
                  onChange={(e) => setMFileUrl(e.target.value)}
                  placeholder={mType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://... or /uploads/lecture.pdf'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  placeholder="Summary of notes or learning content..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-500"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW ROSTER & ATTENDANCE MODAL (PRD Section 5.5)
      ========================================================================= */}
      {activeRosterClass && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-navy-950">{activeRosterClass.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registration Roster & Attendance Verification Sheet
                </p>
              </div>
              <button onClick={() => setActiveRosterClass(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingRoster ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading attendee roster...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-extrabold text-xs uppercase text-slate-400 mb-2">
                    Registered Students ({rosterData.registrations?.length || 0})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                    {rosterData.registrations?.length === 0 ? (
                      <p className="text-xs text-slate-400 p-4 text-center">No students registered yet.</p>
                    ) : (
                      rosterData.registrations?.map((r) => (
                        <div key={r._id} className="p-3 flex items-center justify-between text-xs">
                          <span className="font-bold text-navy-950">{r.studentName}</span>
                          <span className="text-slate-400 text-[11px]">
                            {new Date(r.registrationDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs uppercase text-slate-400 mb-2">
                    Verified Attendance ({rosterData.attendance?.length || 0})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                    {rosterData.attendance?.length === 0 ? (
                      <p className="text-xs text-slate-400 p-4 text-center">No attendance logged yet for this session.</p>
                    ) : (
                      rosterData.attendance?.map((att) => (
                        <div key={att._id} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-navy-950">{att.studentName}</p>
                            <p className="text-[10px] text-slate-400">Joined: {new Date(att.joinTime).toLocaleTimeString()}</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">
                            {att.status} ({att.attendanceDurationMinutes || 0} mins)
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          RESOURCE / VIDEO PREVIEW MODAL
      ========================================================================= */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-navy-950">{previewResource.title}</h3>
              <button onClick={() => setPreviewResource(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {previewResource.safeEmbedUrl || previewResource.youtubeVideoId ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={previewResource.safeEmbedUrl || `https://www.youtube-nocookie.com/embed/${previewResource.youtubeVideoId}`}
                  title={previewResource.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="text-xs text-slate-500">Video source URL: {previewResource.youtubeUrl || previewResource.fileUrl}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default TeacherDashboardPage;
