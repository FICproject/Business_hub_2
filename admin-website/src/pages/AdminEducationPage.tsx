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
  CheckCircle,
  Eye,
  BookOpen,
  Filter,
} from 'lucide-react';
import api from '../services/api';

type TabType = 'courses' | 'live-classes' | 'study-materials' | 'categories' | 'content-reports';

export const AdminEducationPage: React.FC<{ initialTab?: TabType }> = ({ initialTab = 'courses' }) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [courses, setCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'Web Development',
    'Data Science & AI',
    'Mobile App Dev',
    'Cloud & DevOps',
    'UI/UX Design',
    'Business & Marketing',
  ]);
  const [reports, setReports] = useState<any[]>([
    {
      id: 'rep-1',
      title: 'Inappropriate audio during live session',
      reportedItem: 'WebRTC Masterclass: Node.js Performance',
      itemType: 'Live Class',
      reportedBy: 'student@businesshub.com',
      date: '2026-11-20',
      status: 'pending',
    },
    {
      id: 'rep-2',
      title: 'Outdated slide notes on Docker compose',
      reportedItem: 'DevOps & Containers Slide Pack.pdf',
      itemType: 'Study Material',
      reportedBy: 'user@businesshub.com',
      date: '2026-11-19',
      status: 'resolved',
    },
  ]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/education/courses').catch(() => ({ data: { courses: [] } })),
      api.get('/education/live-classes').catch(() => ({ data: { liveClasses: [] } })),
      api.get('/education/materials').catch(() => ({ data: { materials: [] } })),
    ])
      .then(([cRes, lRes, mRes]) => {
        if (cRes.data?.courses) setCourses(cRes.data.courses);
        if (lRes.data?.liveClasses) setLiveClasses(lRes.data.liveClasses);
        if (mRes.data?.materials) setMaterials(mRes.data.materials);
      })
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: 'courses' as TabType, label: 'Courses', icon: GraduationCap, count: courses.length || 3 },
    { key: 'live-classes' as TabType, label: 'Live Classes', icon: Video, count: liveClasses.length || 2 },
    { key: 'study-materials' as TabType, label: 'Study Materials / Notes', icon: FileText, count: materials.length || 4 },
    { key: 'categories' as TabType, label: 'Categories', icon: FolderTree, count: categories.length },
    { key: 'content-reports' as TabType, label: 'Content Reports', icon: AlertTriangle, count: reports.length },
  ];

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-indigo-600" />
            Education Management
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Oversee 100% free courses, live WebRTC masterclasses, notes, course categories, and moderation.
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
              className="pl-9 pr-4 py-2 bg-white text-xs rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:border-indigo-500 w-64"
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
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. Courses View */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">All Published Courses (100% Free)</h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Zero Tuition Platform
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100 pb-3">
                  <th className="pb-3">Course Title</th>
                  <th className="pb-3">Instructor</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Modules</th>
                  <th className="pb-3">Enrolled Students</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(courses.length > 0
                  ? courses
                  : [
                      {
                        _id: 'c-1',
                        title: 'Modern Full-Stack React & Node.js',
                        instructorName: 'Dr. Jane Smith',
                        category: 'Web Development',
                        modulesCount: 8,
                        enrolledCount: 1420,
                      },
                      {
                        _id: 'c-2',
                        title: 'Python for AI & Deep Learning Masterclass',
                        instructorName: 'Alex Turner',
                        category: 'Data Science & AI',
                        modulesCount: 12,
                        enrolledCount: 2890,
                      },
                      {
                        _id: 'c-3',
                        title: 'Mobile Architecture with React Native',
                        instructorName: 'Sarah Connor',
                        category: 'Mobile App Dev',
                        modulesCount: 6,
                        enrolledCount: 950,
                      },
                    ]
                ).map((c: any) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span>{c.title}</span>
                    </td>
                    <td className="py-3.5 text-slate-600">{c.instructorName || 'Verified Faculty'}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                        {c.category || 'Engineering'}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium">{c.modulesCount || 8} Modules</td>
                    <td className="py-3.5 font-bold text-indigo-600">{c.enrolledCount?.toLocaleString() || '1,200'}</td>
                    <td className="py-3.5 text-right">
                      <button className="px-3 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-indigo-600 border border-slate-200 hover:bg-indigo-50">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Live Classes View */}
      {activeTab === 'live-classes' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Scheduled & Completed Live Classes</h2>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              WebRTC Powered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              {
                id: 'live-1',
                title: 'High-Concurrency Backend with Go',
                instructor: 'Prof. David Vance',
                time: 'Today, 4:00 PM IST',
                status: 'Upcoming',
                attendees: '250 Registered',
              },
              {
                id: 'live-2',
                title: 'UI/UX Interactive Figma Systems',
                instructor: 'Elena Rostova',
                time: 'Yesterday',
                status: 'Completed',
                attendees: '410 Attended',
              },
            ].map((live) => (
              <div key={live.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      live.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {live.status}
                  </span>
                  <span className="text-xs text-slate-400">{live.time}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{live.title}</h3>
                <p className="text-xs text-slate-500">Instructor: {live.instructor}</p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">{live.attendees}</span>
                  <button className="text-indigo-600 font-bold hover:underline">View Session</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Study Materials View */}
      {activeTab === 'study-materials' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Lecture PDF Notes & Study Materials</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
              <Plus className="w-3.5 h-3.5" />
              Upload Material
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { title: 'Full-Stack Architecture Cheat Sheet.pdf', size: '4.2 MB', downloads: 1420, date: 'Nov 18, 2026' },
              { title: 'Data Structures & Algorithms Complete Notes.pdf', size: '12.8 MB', downloads: 3100, date: 'Nov 12, 2026' },
              { title: 'Docker & Kubernetes Production Handbook.pdf', size: '8.1 MB', downloads: 890, date: 'Nov 05, 2026' },
            ].map((mat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{mat.title}</h4>
                    <p className="text-[11px] text-slate-400">{mat.size} • Uploaded {mat.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-indigo-600">{mat.downloads} Downloads</span>
                  <button className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Categories View */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Education Taxonomy & Categories</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {categories.map((cat, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FolderTree className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">{cat}</span>
                </div>
                <button className="text-slate-400 hover:text-rose-500 text-xs font-semibold">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Content Reports View */}
      {activeTab === 'content-reports' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Moderation & Content Reports</h2>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              User Moderation Queue
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rep.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Target: <span className="font-semibold text-slate-800">{rep.reportedItem}</span> ({rep.itemType})
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Reported by {rep.reportedBy} on {rep.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-300 hover:bg-emerald-100">
                    Resolve
                  </button>
                  <button className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 border border-rose-300 hover:bg-rose-100">
                    Remove Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
