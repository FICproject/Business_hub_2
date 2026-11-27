import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Video,
  FileText,
  FolderTree,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle,
  XCircle,
  Edit3,
  Users,
  Eye,
  Clock,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  X,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminEducationPage = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Course Review Modal
  const [reviewModalCourse, setReviewModalCourse] = useState(null);
  const [reviewAction, setReviewAction] = useState('approved');
  const [reviewNote, setReviewNote] = useState('');

  // Class Roster Modal
  const [activeRosterClass, setActiveRosterClass] = useState(null);
  const [rosterData, setRosterData] = useState({ registrations: [], attendance: [] });
  const [loadingRoster, setLoadingRoster] = useState(false);

  // Category Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSubcategories, setCatSubcategories] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const loadAllEducationData = () => {
    setLoading(true);
    Promise.allSettled([
      adminApi.getCourses(),
      adminApi.getLiveClasses(),
      adminApi.getMaterials(),
      adminApi.getEducationCategories ? adminApi.getEducationCategories() : Promise.resolve({ data: { data: [] } }),
      adminApi.getTeacherPayments ? adminApi.getTeacherPayments() : Promise.resolve({ data: { data: [] } }),
      adminApi.getUsers ? adminApi.getUsers({ role: 'teacher' }) : Promise.resolve({ data: { data: [] } }),
    ])
      .then(([cRes, lRes, mRes, catRes, pRes, uRes]) => {
        if (cRes.status === 'fulfilled') setCourses(cRes.value.data?.data || cRes.value.data?.courses || []);
        if (lRes.status === 'fulfilled') setLiveClasses(lRes.value.data?.data || lRes.value.data?.liveClasses || []);
        if (mRes.status === 'fulfilled') setMaterials(mRes.value.data?.data || mRes.value.data?.materials || []);
        if (catRes.status === 'fulfilled') setCategories(catRes.value.data?.data || []);
        if (pRes.status === 'fulfilled') setPayments(pRes.value.data?.data || []);
        if (uRes.status === 'fulfilled') setTeachers(uRes.value.data?.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAllEducationData();
  }, []);

  // Course Review Handler (Approve / Reject / Changes Requested)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalCourse) return;
    try {
      await adminApi.reviewCourse(reviewModalCourse._id, {
        status: reviewAction,
        note: reviewNote.trim() || `Course marked ${reviewAction} by Platform Administrator`,
      });
      alert(`Course "${reviewModalCourse.title}" successfully updated to ${reviewAction}!`);
      setReviewModalCourse(null);
      setReviewNote('');
      loadAllEducationData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating course review');
    }
  };

  // Inspect Class Roster
  const handleViewRoster = async (lc) => {
    setActiveRosterClass(lc);
    setLoadingRoster(true);
    try {
      const res = await adminApi.getClassRoster(lc._id);
      if (res.data?.success) {
        setRosterData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoster(false);
    }
  };

  // Create Education Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      const subs = catSubcategories
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name, i) => ({ id: `sub-${i + 1}`, name, slug: name.toLowerCase().replace(/\s+/g, '-') }));

      await adminApi.createEducationCategory({
        name: catName.trim(),
        description: catDesc.trim(),
        subcategories: subs,
      });

      setCategoryModalOpen(false);
      setCatName('');
      setCatDesc('');
      setCatSubcategories('');
      loadAllEducationData();
      alert('Education Category created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    }
  };

  // Delete Material
  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study material?')) return;
    try {
      await adminApi.deleteMaterial(id);
      loadAllEducationData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing material');
    }
  };

  // Overview metrics (PRD Section 9.1)
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.status === 'published').length;
  const pendingApprovals = courses.filter((c) => c.status === 'pending_approval' || c.status === 'under_review').length;
  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrolledStudentsCount || 0), 0);
  const totalMaterials = materials.length;
  const scheduledClasses = liveClasses.filter((l) => l.status === 'scheduled' || l.status === 'upcoming').length;
  const completedClasses = liveClasses.filter((l) => l.status === 'completed').length;
  const totalAttendance = liveClasses.reduce((acc, l) => acc + (l.actualAttendanceCount || l.attendeesCount || 0), 0);

  // Tabs matching PRD Section 9
  const tabs = [
    { key: 'overview', label: 'Education Overview', icon: Layers, count: null },
    { key: 'courses', label: 'Courses', icon: GraduationCap, count: courses.length },
    { key: 'live-classes', label: 'Live Classes', icon: Video, count: liveClasses.length },
    { key: 'study-materials', label: 'Study Materials / Notes', icon: FileText, count: materials.length },
    { key: 'categories', label: 'Categories', icon: FolderTree, count: categories.length },
    { key: 'teachers', label: 'Teachers', icon: Users, count: teachers.length },
    { key: 'content-reports', label: 'Content Reports', icon: AlertTriangle, count: reports.length },
  ];

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-indigo-600" />
            Education & Academy Management
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Oversee 100% free courseware, WebRTC live classes, faculty stipends, categories, and moderation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search education content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white text-xs rounded-xl border border-slate-200 shadow-xs focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          1. EDUCATION OVERVIEW (PRD Section 9.1)
      ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Courseware
              </span>
              <h3 className="text-2xl font-black text-slate-900">{totalCourses}</h3>
              <p className="text-xs text-slate-500">
                {publishedCourses} Published • {pendingApprovals} Pending Review
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Enrollments
              </span>
              <h3 className="text-2xl font-black text-slate-900">{totalEnrollments}</h3>
              <p className="text-xs text-slate-500">100% Free Lifetime Access</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Live Classes
              </span>
              <h3 className="text-2xl font-black text-slate-900">{liveClasses.length}</h3>
              <p className="text-xs text-slate-500">
                {scheduledClasses} Scheduled • {completedClasses} Completed
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                Total Attendance
              </span>
              <h3 className="text-2xl font-black text-slate-900">{totalAttendance}</h3>
              <p className="text-xs text-slate-500">WebRTC Student Joins Logged</p>
            </div>
          </div>

          {/* Pending Course Approvals Queue */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">Pending Course Approvals Queue</h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {pendingApprovals} Awaiting Moderation
              </span>
            </div>

            {courses.filter((c) => c.status === 'pending_approval' || c.status === 'under_review').length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No courses currently waiting for approval.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {courses
                  .filter((c) => c.status === 'pending_approval' || c.status === 'under_review')
                  .map((c) => (
                    <div key={c._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <img src={c.thumbnailUrl} alt={c.title} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
                              {c.status?.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-400">{c.category}</span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">{c.title}</h4>
                          <p className="text-xs text-slate-500">
                            Instructor: {c.instructorName || c.teacherName} • {c.chapters?.length || 1} Chapters
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setReviewModalCourse(c);
                          setReviewAction('approved');
                          setReviewNote('');
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shrink-0"
                      >
                        Review & Approve →
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          2. COURSES (PRD Section 9.2)
      ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Courseware Catalog (100% Free)</h2>
              <p className="text-xs text-slate-500">Approve, reject with feedback, or manage publication statuses.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Zero Tuition Platform
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100 pb-3">
                  <th className="pb-3 px-2">Course Title</th>
                  <th className="pb-3 px-2">Instructor</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Chapters</th>
                  <th className="pb-3 px-2">Students</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 text-right px-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No courses found.
                    </td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="line-clamp-1">{c.title}</span>
                      </td>
                      <td className="py-3.5 px-2 text-slate-600">{c.instructorName || c.teacherName || 'Faculty'}</td>
                      <td className="py-3.5 px-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-slate-600">{c.chapters?.length || 1} Chapters</td>
                      <td className="py-3.5 px-2 font-bold text-indigo-600">{c.enrolledStudentsCount || 0}</td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          c.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : c.status === 'pending_approval'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => {
                            setReviewModalCourse(c);
                            setReviewAction(c.status === 'published' ? 'published' : 'approved');
                          }}
                          className="px-3 py-1 rounded-lg text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                        >
                          Review / Moderate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. LIVE CLASSES (PRD Section 9.4)
      ========================================================================= */}
      {activeTab === 'live-classes' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Scheduled & Completed Live Classes (WebRTC)</h2>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Jitsi Video Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {liveClasses.map((live) => (
              <div key={live._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      live.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : live.status === 'live'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {live.status}
                    </span>
                    <span className="text-xs text-slate-400">{live.scheduledDate}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{live.title}</h3>
                  <p className="text-xs text-slate-500">Instructor: {live.teacherName || live.instructorName}</p>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-semibold">{live.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registrations:</span>
                      <span className="font-semibold text-indigo-600">{live.registeredStudentsCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attendance:</span>
                      <span className="font-bold text-emerald-600">{live.actualAttendanceCount || 0} Present</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => handleViewRoster(live)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
                  >
                    View Roster
                  </button>
                  <a
                    href={live.meetingUrl || live.classLink || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  >
                    Room Link
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. STUDY MATERIALS (PRD Section 9.3)
      ========================================================================= */}
      {activeTab === 'study-materials' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Study Materials & Notes Moderation</h2>
            <span className="text-xs text-slate-500">{materials.length} Uploaded Assets</span>
          </div>

          <div className="space-y-3 pt-2">
            {materials.map((mat) => (
              <div key={mat._id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{mat.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      {mat.materialType?.toUpperCase()} • {mat.category} • By {mat.teacherName || 'Faculty'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-indigo-600">{mat.downloadsCount || 0} Downloads</span>
                  <button
                    onClick={() => handleDeleteMaterial(mat._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. CATEGORIES (PRD Section 11)
      ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Dynamic Education Categories & Taxonomy</h2>
              <p className="text-xs text-slate-500">Categories used by teachers for courses and students for filtering.</p>
            </div>
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {categories.map((cat) => (
              <div key={cat._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-indigo-600" />
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{cat.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {cat.subcategories?.map((sub, sIdx) => (
                    <span key={sIdx} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          6. TEACHERS (PRD Section 9.5)
      ========================================================================= */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Verified Teaching Faculty</h2>
            <span className="text-xs text-slate-500">{teachers.length} Faculty Members</span>
          </div>

          <div className="divide-y divide-slate-100">
            {teachers.map((t) => (
              <div key={t._id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{t.fullName}</h4>
                  <p className="text-[11px] text-slate-400">{t.email} • {t.mobile}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  t.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {t.verificationStatus || t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          7. CONTENT REPORTS QUEUE
      ========================================================================= */}
      {activeTab === 'content-reports' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 text-center py-12 text-slate-400 text-xs">
          No content reports in queue. Educational content is clean and compliant.
        </div>
      )}

      {/* =========================================================================
          COURSE REVIEW & MODERATION MODAL (PRD Section 9.2)
      ========================================================================= */}
      {reviewModalCourse && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  Course Review & Audit
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">{reviewModalCourse.title}</h3>
                <p className="text-xs text-slate-500">Instructor: {reviewModalCourse.instructorName || reviewModalCourse.teacherName}</p>
              </div>
              <button onClick={() => setReviewModalCourse(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <p className="font-bold text-slate-800">Course Description:</p>
              <p className="text-slate-600 leading-relaxed">{reviewModalCourse.description}</p>
              <div className="pt-2 flex items-center gap-4 text-slate-500 text-[11px]">
                <span>Category: {reviewModalCourse.category}</span>
                <span>Level: {reviewModalCourse.level}</span>
                <span>Chapters: {reviewModalCourse.chapters?.length || 1}</span>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Review Decision *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'approved', label: 'Approve & Publish' },
                    { val: 'changes_requested', label: 'Request Changes' },
                    { val: 'rejected', label: 'Reject Course' },
                  ].map((act) => (
                    <button
                      key={act.val}
                      type="button"
                      onClick={() => setReviewAction(act.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        reviewAction === act.val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Administrator Audit Notes</label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="State any specific guidance, feedback, or approval confirmation note..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewModalCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CLASS ROSTER MODAL
      ========================================================================= */}
      {activeRosterClass && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{activeRosterClass.title}</h3>
                <p className="text-xs text-slate-500">Live Session Attendee Roster</p>
              </div>
              <button onClick={() => setActiveRosterClass(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingRoster ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading roster...</p>
            ) : (
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-700">
                  Registered Participants ({rosterData.registrations?.length || 0})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {rosterData.registrations?.map((r) => (
                    <div key={r._id} className="p-2.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{r.studentName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(r.registrationDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          CREATE CATEGORY MODAL (PRD Section 11)
      ========================================================================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Education Category</h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Healthcare & Medical Sciences"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Curriculum summary..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Subcategories (One per line)</label>
                <textarea
                  rows={3}
                  value={catSubcategories}
                  onChange={(e) => setCatSubcategories(e.target.value)}
                  placeholder="Clinical Pharmacology&#10;Emergency Medicine&#10;Nursing Care"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminEducationPage;
