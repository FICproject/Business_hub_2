import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  GraduationCap,
  Video,
  PlusCircle,
  FileText,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { educationApi } from '../../services/api';
import { RootState } from '../../store';
import { ICourse, ILiveClass, ITeacherPayment, IStudyMaterial } from '../../types';

export const TeacherDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [liveClasses, setLiveClasses] = useState<ILiveClass[]>([]);
  const [payments, setPayments] = useState<ITeacherPayment[]>([]);
  const [materials, setMaterials] = useState<IStudyMaterial[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'classes' | 'materials' | 'earnings'>('overview');

  // Course Modal
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cCat, setCCat] = useState('Software Engineering');
  const [cLevel, setCLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Live Class Modal
  const [scheduleClassOpen, setScheduleClassOpen] = useState(false);
  const [lTitle, setLTitle] = useState('');
  const [lSubject, setLSubject] = useState('Computer Science');
  const [lDesc, setLDesc] = useState('');
  const [lDate, setLDate] = useState('2026-11-30');
  const [lTime, setLTime] = useState('19:00 EST');

  const loadData = () => {
    educationApi.getCourses()
      .then((res) => setCourses(res.data.data))
      .catch((err) => console.error(err));

    educationApi.getLiveClasses()
      .then((res) => setLiveClasses(res.data.data))
      .catch((err) => console.error(err));

    educationApi.getTeacherPayments()
      .then((res) => setPayments(res.data.data))
      .catch((err) => console.error(err));

    educationApi.getMaterials()
      .then((res) => setMaterials(res.data.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await educationApi.createCourse({
        title: cTitle,
        description: cDesc,
        category: cCat,
        level: cLevel,
        modules: [
          {
            title: 'Module 1: Introduction & Foundations',
            order: 1,
            lessons: [{ title: 'Lesson 1: Overview & Principles', duration: '25 min' }],
          },
        ],
      });
      setCreateCourseOpen(false);
      setCTitle('');
      setCDesc('');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating course');
    }
  };

  const handleScheduleClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await educationApi.createLiveClass({
        title: lTitle,
        subject: lSubject,
        description: lDesc,
        scheduledDate: lDate,
        startTime: lTime,
        durationMinutes: 60,
        studentCapacity: 150,
      });
      setScheduleClassOpen(false);
      setLTitle('');
      setLDesc('');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error scheduling class');
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingStipends = payments
    .filter((p) => p.status === 'pending' || p.status === 'approved')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950/60 px-2.5 py-0.5 rounded-md">
            Teacher & Instructor Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.fullName}</h1>
          <p className="text-xs sm:text-sm text-teal-100">
            Publish free masterclasses, manage virtual live sessions, and track administrative compensation stipends.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCreateCourseOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-navy-900 font-bold text-xs shadow-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-teal-600" /> Create Course
          </button>
          <button
            onClick={() => setScheduleClassOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" /> Schedule Class
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Courses</span>
          <p className="text-2xl font-extrabold text-navy-900">{courses.length}</p>
          <p className="text-[11px] font-semibold text-teal-600">Free Published</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Live Classes</span>
          <p className="text-2xl font-extrabold text-navy-900">{liveClasses.length}</p>
          <p className="text-[11px] font-semibold text-slate-500">Interactive Sessions</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Approved Paid</span>
          <p className="text-2xl font-extrabold text-emerald-600">${totalPaid.toFixed(2)}</p>
          <p className="text-[11px] font-semibold text-slate-500">Settled to Bank</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending Stipends</span>
          <p className="text-2xl font-extrabold text-amber-600">${pendingStipends.toFixed(2)}</p>
          <p className="text-[11px] font-semibold text-amber-600">Under Admin Review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'courses', label: `Published Courses (${courses.length})` },
          { id: 'classes', label: `Live Classes (${liveClasses.length})` },
          { id: 'materials', label: `Notes (${materials.length})` },
          { id: 'earnings', label: `Compensation History (${payments.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. COURSES */}
      {(activeTab === 'overview' || activeTab === 'courses') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-navy-900">Your Free Courseware</h3>
            <button
              onClick={() => setCreateCourseOpen(true)}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div key={c._id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                <img src={c.thumbnailUrl} alt={c.title} className="w-full h-36 rounded-2xl object-cover" />
                <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md">
                  {c.category} • {c.level}
                </span>
                <h4 className="font-bold text-sm text-navy-900 line-clamp-2">{c.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span>{c.enrolledStudentsCount || 100}+ Students</span>
                  <span className="font-bold text-emerald-600">Published</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. COMPENSATION & PAYMENTS */}
      {(activeTab === 'overview' || activeTab === 'earnings') && (
        <div className="space-y-4 pt-4">
          <div>
            <h3 className="font-extrabold text-lg text-navy-900">Teacher Compensation & Payouts</h3>
            <p className="text-xs text-slate-500">
              Students attend for free. Admin reviews eligible completed classes and issues stipends with duplicate protection.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy-900">{p.classTitle}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      p.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : p.status === 'approved'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Attendance: {p.studentAttendanceCount} students • {p.notes || 'Admin approved'}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-lg font-extrabold text-navy-900">${p.amount.toFixed(2)}</span>
                  {p.transactionRef && (
                    <p className="text-[10px] font-mono text-slate-400">Ref: {p.transactionRef}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {createCourseOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-navy-900">Create Free Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={cTitle}
                  onChange={(e) => setCTitle(e.target.value)}
                  placeholder="e.g. Modern Fullstack Architecture"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={cCat}
                    onChange={(e) => setCCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Level</label>
                  <select
                    value={cLevel}
                    onChange={(e) => setCLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  placeholder="Course summary and learning outcomes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateCourseOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
                >
                  Publish Free Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Live Class Modal */}
      {scheduleClassOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-navy-900">Schedule Live Class</h3>
            <form onSubmit={handleScheduleClass} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class Title</label>
                <input
                  type="text"
                  required
                  value={lTitle}
                  onChange={(e) => setLTitle(e.target.value)}
                  placeholder="e.g. Live Q&A: System Design Masterclass"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={lSubject}
                  onChange={(e) => setLSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={lDate}
                    onChange={(e) => setLDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={lTime}
                    onChange={(e) => setLTime(e.target.value)}
                    placeholder="18:00 EST"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Overview</label>
                <textarea
                  rows={2}
                  value={lDesc}
                  onChange={(e) => setLDesc(e.target.value)}
                  placeholder="Topics covered..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleClassOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
