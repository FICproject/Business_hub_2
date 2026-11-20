import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Video,
  FileText,
  Search,
  Filter,
  Users,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { educationApi } from '../../services/api';
import { ICourse, ILiveClass } from '../../types';

export const EducationPage: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [liveClasses, setLiveClasses] = useState<ILiveClass[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadCourses = () => {
    setLoading(true);
    educationApi.getCourses({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      level: selectedLevel !== 'all' ? selectedLevel : undefined,
      search: searchQuery || undefined,
    })
      .then((res) => setCourses(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
    educationApi.getLiveClasses()
      .then((res) => setLiveClasses(res.data.data.slice(0, 2)))
      .catch((err) => console.error(err));
  }, [selectedCategory, selectedLevel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner: Free Education Guarantee */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-navy-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-md">
            100% Free Learning Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Learn Industry Skills With Zero Tuition Fees
          </h1>
          <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
            Every course, lesson, downloadable PDF material, and live interactive classroom on Business Hub is completely free for all students.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            to="/education/live-classes"
            className="px-6 py-3.5 rounded-xl bg-white text-navy-900 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4 text-teal-600" />
            Join Live Classes
          </Link>
          <Link
            to="/education/materials"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all text-center flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            PDF Study Notes
          </Link>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 text-xs font-bold">
        <Link to="/education" className="px-4 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80">
          Courses Catalog
        </Link>
        <Link to="/education/live-classes" className="px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-slate-100 border border-slate-200">
          Live Classes ({liveClasses.length})
        </Link>
        <Link to="/education/materials" className="px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-slate-100 border border-slate-200">
          Notes & Materials
        </Link>
        <Link to="/education/tuition" className="px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-slate-100 border border-slate-200">
          1-on-1 Tuition
        </Link>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadCourses()}
            placeholder="Search free courses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="software engineering">Software Engineering</option>
            <option value="business & finance">Business & Finance</option>
            <option value="data science">Data Science</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/education/courses/${c._id}`)}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={c.thumbnailUrl}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">
                  100% Free
                </span>
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded font-medium">
                  {c.level}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{c.category}</p>
                <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{c.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    {c.enrolledStudentsCount || 120}+ Enrolled
                  </span>
                  <span className="font-bold text-teal-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Start Learning <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
