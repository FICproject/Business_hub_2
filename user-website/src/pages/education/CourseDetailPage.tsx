import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  FileText,
  Clock,
  Award,
  BookOpen,
} from 'lucide-react';
import { educationApi } from '../../services/api';
import { RootState } from '../../store';
import { ICourse } from '../../types';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [course, setCourse] = useState<ICourse | null>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      educationApi.getCourseById(id)
        .then((res) => {
          if (res.data.success) {
            setCourse(res.data.course);
            if (res.data.course.modules?.[0]?.lessons?.[0]) {
              setActiveLesson(res.data.course.modules[0].lessons[0]);
            }
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

      if (isAuthenticated) {
        educationApi.getMyEnrollments()
          .then((res) => {
            const current = res.data.data.find((e: any) => e.courseId === id);
            if (current) {
              setIsEnrolled(true);
              setCompletedLessons(current.completedLessons || []);
            }
          })
          .catch((err) => console.error(err));
      }
    }
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!id) return;
    try {
      const res = await educationApi.enrollCourse(id);
      if (res.data.success) {
        setIsEnrolled(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkComplete = async (lessonTitle: string) => {
    if (!id || !isEnrolled) return;
    const updated = [...completedLessons, lessonTitle];
    setCompletedLessons(updated);

    const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
    const progressPercentage = Math.round((updated.length / totalLessons) * 100);

    try {
      await educationApi.updateProgress(id, { lessonId: lessonTitle, progressPercentage });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Course Not Found</h2>
        <Link to="/education" className="inline-block px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs">
          Return to Courses
        </Link>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = Math.round((completedLessons.length / (totalLessons || 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/education" className="hover:text-teal-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>
        <span>/</span>
        <span className="text-slate-800">{course.category}</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{course.title}</span>
      </div>

      {/* Main Course Player & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Video / Lesson Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl aspect-video relative flex items-center justify-center">
            {activeLesson?.videoUrl ? (
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-center text-white space-y-2 p-6">
                <PlayCircle className="w-16 h-16 text-teal-400 mx-auto opacity-80" />
                <h4 className="font-bold text-lg">{activeLesson?.title || 'Interactive Lesson Player'}</h4>
                <p className="text-xs text-slate-400">Select a lesson from the curriculum to begin</p>
              </div>
            )}
          </div>

          {/* Lesson Header & Mark Complete */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase bg-teal-50 px-2.5 py-1 rounded-md">
                  Active Lesson
                </span>
                <h2 className="text-2xl font-extrabold text-navy-900 mt-2">
                  {activeLesson?.title || course.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Duration: {activeLesson?.duration || '30 min'} • Instructor: {course.instructorName || 'Prof. David Vance'}
                </p>
              </div>

              {isEnrolled ? (
                <div>
                  {completedLessons.includes(activeLesson?.title) ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Lesson Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkComplete(activeLesson?.title)}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Enroll Free to Track Progress
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-sm text-slate-600 leading-relaxed space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Lesson Overview</h4>
              <p>
                In this masterclass lesson, students learn architectural best practices, clean design principles, and enterprise debugging workflows. Code along and submit questions to the community board.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Curriculum & Progress */}
        <div className="space-y-6">
          {/* Progress Card if enrolled */}
          {isEnrolled && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 uppercase">Your Learning Progress</span>
                <span className="text-teal-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500">
                {completedLessons.length} of {totalLessons} lessons completed
              </p>
            </div>
          )}

          {/* Curriculum Accordion */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-navy-900 text-base">Course Curriculum</h3>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-md">
                {totalLessons} Lessons
              </span>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod, mIndex) => (
                <div key={mIndex} className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {mod.title}
                  </h4>
                  <div className="space-y-1.5">
                    {mod.lessons.map((lesson, lIndex) => {
                      const isCurrent = activeLesson?.title === lesson.title;
                      const isDone = completedLessons.includes(lesson.title);
                      return (
                        <button
                          key={lIndex}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 text-xs ${
                            isCurrent
                              ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/80'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 line-clamp-1">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                            {lesson.duration}
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
  );
};
