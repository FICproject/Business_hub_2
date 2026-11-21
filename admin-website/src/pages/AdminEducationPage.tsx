import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Video,
  FileText,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Users,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminEducationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'classes' | 'materials'>('courses');
  const [courses, setCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([
      adminApi.getCourses(),
      adminApi.getLiveClasses(),
      adminApi.getMaterials(),
    ]).then(([crsRes, clsRes, matRes]) => {
      if (crsRes.status === 'fulfilled') setCourses(crsRes.value.data.data || []);
      if (clsRes.status === 'fulfilled') setLiveClasses(clsRes.value.data.data || []);
      if (matRes.status === 'fulfilled') setMaterials(matRes.value.data.data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove the course "${title}"?`)) return;
    try {
      await adminApi.deleteCourse(id);
      setFeedback(`Course "${title}" has been removed.`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteClass = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to cancel the live class "${title}"?`)) return;
    try {
      await adminApi.deleteLiveClass(id);
      setFeedback(`Live class "${title}" has been removed.`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteMaterial = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the study note "${title}"?`)) return;
    try {
      await adminApi.deleteMaterial(id);
      setFeedback(`Study note "${title}" has been removed.`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClasses = liveClasses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Education Moderation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee 100% free courses, scheduled live classrooms, and downloadable study notes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'courses' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses ({courses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'classes' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live Classes ({liveClasses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'materials' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes ({materials.length})</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Content Panels */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading educational records...</div>
      ) : activeTab === 'courses' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Course</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Students Enrolled</th>
                  <th className="p-4">Policy</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No courses match search.</td>
                  </tr>
                ) : (
                  filteredCourses.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'}
                          alt={c.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white leading-tight">{c.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{c.instructorName || 'Verified Teacher'}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{c.category}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[10px]">
                          {c.level}
                        </span>
                      </td>
                      <td className="p-4 text-teal-400 font-bold">{c.enrolledStudentsCount || 0}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                          100% Free
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteCourse(c._id, c.title)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'classes' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Live Class</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Capacity / Attendance</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">No live classes found.</td>
                  </tr>
                ) : (
                  filteredClasses.map((cl) => (
                    <tr key={cl._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-white">{cl.title}</td>
                      <td className="p-4 text-slate-300">{cl.subject}</td>
                      <td className="p-4 text-slate-300">{cl.teacherName || 'Teacher'}</td>
                      <td className="p-4 text-slate-400">
                        {cl.scheduledAt ? new Date(cl.scheduledAt).toLocaleString() : 'TBD'}
                      </td>
                      <td className="p-4 text-slate-300">
                        {cl.enrolledCount || 0} / {cl.maxCapacity || 50}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          cl.status === 'completed'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {cl.status?.toUpperCase() || 'SCHEDULED'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteClass(cl._id, cl.title)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Cancel Class"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Material / Note</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Topic</th>
                  <th className="p-4">Uploaded By</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No study notes found.</td>
                  </tr>
                ) : (
                  filteredMaterials.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span>{m.title}</span>
                      </td>
                      <td className="p-4 text-slate-300">{m.subject}</td>
                      <td className="p-4 text-slate-400">{m.topic || 'General'}</td>
                      <td className="p-4 text-slate-300">{m.uploadedByName || 'Teacher'}</td>
                      <td className="p-4 text-teal-400 font-bold">{m.downloadCount || 0}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteMaterial(m._id, m.title)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove Study Note"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
};
