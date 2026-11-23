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
  Sparkles,
  Award,
  Play,
  Clock,
  Code,
  LineChart,
  Brain,
  ShieldCheck,
  Star,
  Check,
} from 'lucide-react';
import { educationApi } from '../../services/api';
import { ICourse, ILiveClass } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';

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
    educationApi
      .getCourses({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        level: selectedLevel !== 'all' ? selectedLevel : undefined,
        search: searchQuery || undefined,
      })
      .then((res) => {
        if (res.data?.data) {
          setCourses(res.data.data);
        }
      })
      .catch((err) => console.error('Courses load error:', err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
    educationApi
      .getLiveClasses()
      .then((res) => {
        if (res.data?.data) {
          setLiveClasses(res.data.data.slice(0, 3));
        }
      })
      .catch((err) => console.error('Live classes error:', err.message));
  }, [selectedCategory, selectedLevel]);

  const categories = [
    { label: 'All Fields', value: 'all', icon: BookOpen },
    { label: 'Software Engineering', value: 'software engineering', icon: Code },
    { label: 'Data Science & AI', value: 'data science', icon: Brain },
    { label: 'Business & Finance', value: 'business & finance', icon: LineChart },
  ];

  // Featured course: first course or high enrolled
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="bg-white min-h-screen text-[#0A255C] font-sans pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb currentPage="Education" />

        {/* =====================================================================
            1. EDUCATION HERO SECTION
        ====================================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white shadow-2xl overflow-hidden mb-12">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>100% Free Learning Policy</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Master In-Demand Skills <br />
              <span className="text-[#FFB800]">With Zero Tuition Fees</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              Every course, downloadable study material, interactive coding exercise, and live virtual classroom is completely free for all learners. No hidden subscriptions or paywalls.
            </p>

            {/* Quick Hero Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/education/live-classes"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all"
              >
                <Video className="w-4 h-4 font-bold" />
                <span>Join Live Classroom</span>
              </Link>
              <Link
                to="/education/materials"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/30 backdrop-blur-md transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>PDF Study Notes</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free Certified Certificates</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>50,000+ Active Students</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Live Instructor Mentorship</span>
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. BROWSE COURSES BY CATEGORY
        ====================================================================== */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Browse by Category</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Choose your field of study and start learning immediately</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all group ${
                    isSelected
                      ? 'bg-[#0A255C] text-white border-[#0A255C] shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                      isSelected ? 'bg-white/10 text-[#FFB800]' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            3. FEATURED COURSES SPOTLIGHT
        ====================================================================== */}
        {selectedCategory === 'all' && !searchQuery && featuredCourses.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Featured Masterclasses</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/education/courses/${c._id}`)}
                  className="bg-white rounded-3xl border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={c.thumbnailUrl}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#0A255C] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                      100% Free
                    </span>
                    <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-md font-semibold capitalize">
                      {c.level}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded w-fit mb-2">
                      {c.category}
                    </span>
                    <h3 className="font-extrabold text-[#0A255C] text-lg group-hover:text-teal-700 transition-colors line-clamp-2 mb-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{c.description}</p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                        {c.enrolledStudentsCount || 150}+ Enrolled
                      </span>
                      <span className="text-[#0A255C] group-hover:text-amber-600 flex items-center gap-1 font-bold">
                        Start Learning <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================================
            4. SEARCH & ALL FREE COURSES CATALOG
        ====================================================================== */}
        <section className="mb-14">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadCourses()}
                placeholder="Search free courses..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A255C]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A255C]"
              >
                <option value="all">All Fields</option>
                <option value="software engineering">Software Engineering</option>
                <option value="data science">Data Science</option>
                <option value="business & finance">Business & Finance</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A255C]"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">
              {selectedCategory === 'all' ? 'All Free Courses' : `${selectedCategory.toUpperCase()} Courses`}
            </h2>
            <span className="text-xs text-slate-500 font-semibold">{courses.length} courses available</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-[#0A255C] text-lg">No Courses Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No courses match your criteria. Try adjusting the search or category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-full bg-[#0A255C] text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/education/courses/${c._id}`)}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all overflow-hidden flex flex-col cursor-pointer"
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
                    <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded font-medium capitalize">
                      {c.level}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{c.category}</p>
                    <h3 className="font-bold text-[#0A255C] text-base group-hover:text-teal-700 transition-colors line-clamp-2 mb-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{c.description}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                        {c.enrolledStudentsCount || 120}+ Enrolled
                      </span>
                      <span className="font-bold text-teal-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Start Learning <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================================
            5. UPCOMING LIVE CLASSES SECTION
        ====================================================================== */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Upcoming Live Classes</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Join interactive real-time video classrooms and ask questions directly
              </p>
            </div>
            <Link
              to="/education/live-classes"
              className="text-xs font-bold text-[#0A255C] hover:text-amber-600 flex items-center gap-1"
            >
              <span>View All Live Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveClasses.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-slate-50 rounded-3xl p-6">
                <Video className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Live classrooms are scheduled throughout the week.</p>
                <Link
                  to="/education/live-classes"
                  className="mt-3 inline-block px-5 py-2 rounded-full bg-[#0A255C] text-white text-xs font-bold"
                >
                  Check Live Schedule
                </Link>
              </div>
            ) : (
              liveClasses.map((lc) => (
                <div
                  key={lc._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                        Live Streaming
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{lc.subject}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0A255C] mb-2">{lc.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{lc.scheduledDate} • {lc.startTime} ({lc.durationMinutes} mins)</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">{lc.instructorName || 'Certified Instructor'}</span>
                    <Link
                      to={`/education/live-classes`}
                      className="px-4 py-2 rounded-xl bg-[#0A255C] hover:bg-[#071B42] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Join Room</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* =====================================================================
            6. LEARNING BENEFITS SECTION
        ====================================================================== */}
        <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 mb-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A255C]">Why Learn on Business Hub?</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              We eliminate traditional barriers so any student can achieve career-ready excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0A255C] mb-1">100% Free Forever</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero fees, no trial expiration, and no card requirements. All materials are completely open.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0A255C] mb-1">Practical Industry Code</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hands-on projects, real enterprise code repos, and architectural system design principles.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0A255C] mb-1">Live Classroom Rooms</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Join interactive video streaming rooms, chat with educators, and receive immediate code feedback.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0A255C] mb-1">Certified Completion</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Earn verified digital completion certificates you can showcase on LinkedIn and resumes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
