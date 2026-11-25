import React, { useState, useEffect } from 'react';
import { GraduationCap, Video, FileText, FolderTree, AlertTriangle, Search, Plus, Trash2, BookOpen, } from 'lucide-react';
import api from '../services/api';
export const AdminEducationPage = ({ initialTab = 'courses' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [courses, setCourses] = useState([]);
    const [liveClasses, setLiveClasses] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reports, setReports] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);
    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get('/education/courses').catch(() => ({ data: { data: [] } })),
            api.get('/education/live-classes').catch(() => ({ data: { data: [] } })),
            api.get('/education/materials').catch(() => ({ data: { data: [] } })),
        ])
            .then(([cRes, lRes, mRes]) => {
                const fetchedCourses = cRes.data?.data || cRes.data?.courses || [];
                const fetchedLive = lRes.data?.data || lRes.data?.liveClasses || [];
                const fetchedMaterials = mRes.data?.data || mRes.data?.materials || [];

                setCourses(fetchedCourses);
                setLiveClasses(fetchedLive);
                setMaterials(fetchedMaterials);

                // Derive unique categories from existing real courses
                const cats = Array.from(new Set(fetchedCourses.map((c) => c.category).filter(Boolean)));
                setCategories(cats);
            })
            .finally(() => setLoading(false));
    }, []);
    const tabs = [
        { key: 'courses', label: 'Courses', icon: GraduationCap, count: courses.length },
        { key: 'live-classes', label: 'Live Classes', icon: Video, count: liveClasses.length },
        { key: 'study-materials', label: 'Study Materials / Notes', icon: FileText, count: materials.length },
        { key: 'categories', label: 'Categories', icon: FolderTree, count: categories.length },
        { key: 'content-reports', label: 'Content Reports', icon: AlertTriangle, count: reports.length },
    ];
    return (<div className="space-y-6 max-w-[1550px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-indigo-600"/>
            Education Management
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Oversee 100% free courses, live WebRTC masterclasses, notes, course categories, and moderation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Search education content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-white text-xs rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:border-indigo-500 w-64"/>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100'}`}>
              <Icon className="w-4 h-4"/>
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>);
        })}
      </div>

      {/* 1. Courses View */}
      {activeTab === 'courses' && (<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
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
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No published courses found.
                    </td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          <BookOpen className="w-4 h-4"/>
                        </div>
                        <span>{c.title}</span>
                      </td>
                      <td className="py-3.5 text-slate-600">{c.instructorName || 'Verified Faculty'}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                          {c.category || 'Engineering'}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 font-medium">{c.modules?.length || c.modulesCount || 1} Modules</td>
                      <td className="py-3.5 font-bold text-indigo-600">{c.enrolledCount?.toLocaleString() || 0}</td>
                      <td className="py-3.5 text-right">
                        <button className="px-3 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-indigo-600 border border-slate-200 hover:bg-indigo-50">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* 2. Live Classes View */}
      {activeTab === 'live-classes' && (<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Scheduled & Completed Live Classes</h2>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              WebRTC Powered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {liveClasses.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                No live classes currently scheduled.
              </div>
            ) : (
              liveClasses.map((live) => (
                <div key={live._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${live.status === 'upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {live.status || 'Scheduled'}
                    </span>
                    <span className="text-xs text-slate-400">{live.startTime || live.scheduledDate || 'TBD'}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{live.title}</h3>
                  <p className="text-xs text-slate-500">Instructor: {live.instructorName || 'Assigned Faculty'}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">{live.attendeesCount || live.studentCapacity || 0} Registered</span>
                    <a href={live.classLink || live.meetingLink || '#'} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">
                      View Session
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>)}

      {/* 3. Study Materials View */}
      {activeTab === 'study-materials' && (<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Lecture PDF Notes & Study Materials</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
              <Plus className="w-3.5 h-3.5"/>
              Upload Material
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {materials.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No study materials uploaded yet.
              </div>
            ) : (
              materials.map((mat) => (
                <div key={mat._id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5"/>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{mat.title}</h4>
                      <p className="text-[11px] text-slate-400">{mat.fileSize || 'PDF'} • {mat.subject || 'Reference Notes'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-indigo-600">{mat.downloadsCount || 0} Downloads</span>
                    <button className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>)}

      {/* 4. Categories View */}
      {activeTab === 'categories' && (<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Education Taxonomy & Categories</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
              <Plus className="w-3.5 h-3.5"/>
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {categories.map((cat, i) => (<div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FolderTree className="w-4 h-4 text-indigo-600"/>
                  <span className="text-xs font-bold text-slate-800">{cat}</span>
                </div>
                <button className="text-slate-400 hover:text-rose-500 text-xs font-semibold">Edit</button>
              </div>))}
          </div>
        </div>)}

      {/* 5. Content Reports View */}
      {activeTab === 'content-reports' && (<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Moderation & Content Reports</h2>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              User Moderation Queue
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {reports.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active content reports or moderation alerts. Platform clean!
              </div>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4"/>
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
              ))
            )}
          </div>
        </div>)}
    </div>);
};
