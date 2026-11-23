import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Video,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Award,
  Play,
  CheckCircle2,
  Filter,
  Check,
  ShieldCheck,
  Star,
  Tv,
} from 'lucide-react';
import { educationApi } from '../../services/api';
import { ILiveClass } from '../../types';
import { Breadcrumb } from '../../components/common/Breadcrumb';

interface IEventItem {
  id: string;
  title: string;
  category: 'workshop' | 'webinar' | 'live-session' | 'summit';
  categoryLabel: string;
  date: string;
  time: string;
  instructor: string;
  instructorRole: string;
  description: string;
  badge: string;
  link: string;
  isExternal?: boolean;
}

export const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'workshop' | 'webinar' | 'live-session' | 'summit'>('all');
  const [liveClasses, setLiveClasses] = useState<ILiveClass[]>([]);
  const [registeredToast, setRegisteredToast] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    educationApi
      .getLiveClasses()
      .then((res) => {
        if (res.data?.data) {
          setLiveClasses(res.data.data);
        }
      })
      .catch((err) => console.error('Live classes error:', err.message));
  }, []);

  const staticEvents: IEventItem[] = [
    {
      id: 'evt-1',
      title: 'Full-Stack Distributed System Architecture Masterclass',
      category: 'workshop',
      categoryLabel: 'Interactive Workshop',
      date: 'Saturday, Dec 5',
      time: '4:00 PM - 6:00 PM IST',
      instructor: 'Dr. Sarah Mitchell',
      instructorRole: 'Principal Cloud Architect',
      description: 'Hands-on architectural deep dive: building microservices, Redis caching layers, and resilient CI/CD pipelines.',
      badge: '100% Free Access',
      link: '/education/live-classes',
    },
    {
      id: 'evt-2',
      title: 'Small Business & Merchant Growth Summit 2026',
      category: 'summit',
      categoryLabel: 'Annual Summit',
      date: 'Wednesday, Dec 9',
      time: '6:30 PM - 8:30 PM IST',
      instructor: 'Vikram Mehta & Panel',
      instructorRole: 'Commercial Strategy Directors',
      description: 'Practical playbooks for digital merchants: catalog turnover, identity privacy compliance, and clean referral link attribution.',
      badge: 'Verified Merchants',
      link: '/business',
    },
    {
      id: 'evt-3',
      title: 'Tech & Commerce Virtual Career Hiring Fair',
      category: 'webinar',
      categoryLabel: 'Career Webinar',
      date: 'Friday, Dec 11',
      time: '2:00 PM - 5:00 PM IST',
      instructor: 'Business Hub Talent Council',
      instructorRole: 'Hiring Leads at 15+ Companies',
      description: 'Meet corporate hiring managers, submit fast-track resumes, and discover high-demand software and business vacancies.',
      badge: 'Job Seekers & Freshers',
      link: '/jobs',
    },
    {
      id: 'evt-4',
      title: 'Modern Digital Classroom Engagement for Educators',
      category: 'workshop',
      categoryLabel: 'Educator Workshop',
      date: 'Thursday, Dec 17',
      time: '5:00 PM - 7:00 PM IST',
      instructor: 'Prof. Anita Roy',
      instructorRole: 'Educational Technologist',
      description: 'Techniques for hosting interactive virtual streaming rooms, evaluating live code exercises, and engaging remote learners.',
      badge: 'Teachers & Mentors',
      link: '/education/live-classes',
    },
    {
      id: 'evt-5',
      title: 'Data Science & Machine Learning Real-World Case Studies',
      category: 'webinar',
      categoryLabel: 'Tech Webinar',
      date: 'Tuesday, Dec 22',
      time: '7:00 PM - 8:30 PM IST',
      instructor: 'Karan Joshi',
      instructorRole: 'Senior Data Scientist',
      description: 'Explore production predictive analytics, transformer model fine-tuning, and scalable feature store designs.',
      badge: 'Open to All',
      link: '/education',
    },
  ];

  // Dynamic live classes converted to event format
  const dynamicLiveEvents: IEventItem[] = liveClasses.map((lc) => ({
    id: lc._id,
    title: lc.title,
    category: 'live-session',
    categoryLabel: 'Live Virtual Classroom',
    date: lc.scheduledDate,
    time: `${lc.startTime} (${lc.durationMinutes} mins)`,
    instructor: lc.instructorName || 'Certified Instructor',
    instructorRole: `${lc.subject} Instructor`,
    description: `Real-time interactive session on ${lc.subject}. Join the video streaming room to learn and ask questions live.`,
    badge: 'Live Streaming Room',
    link: '/education/live-classes',
  }));

  const allEvents = [...dynamicLiveEvents, ...staticEvents];

  const filteredEvents =
    activeTab === 'all' ? allEvents : allEvents.filter((e) => e.category === activeTab);

  const handleRegister = (title: string, link: string) => {
    setRegisteredToast(`You are registered for "${title}"!`);
    setTimeout(() => {
      setRegisteredToast(null);
      navigate(link);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen text-[#0A255C] font-sans pb-16">
      {/* Toast Alert */}
      {registeredToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A255C] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs sm:text-sm border border-amber-400/40 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{registeredToast}</span>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb currentPage="Events" />

        {/* =====================================================================
            1. EVENTS HERO SECTION
        ====================================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white shadow-2xl overflow-hidden mb-12">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              <span>Interactive Live Sessions &amp; Masterclasses</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Upcoming Events, <br />
              <span className="text-[#FFB800]">Webinars &amp; Workshops</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              Participate in live interactive classrooms, annual business summits, and tech hiring expos hosted by verified mentors and corporate leaders.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/education/live-classes"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all"
              >
                <Video className="w-4 h-4 font-bold" />
                <span>Join Live Classroom</span>
              </Link>
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all"
              >
                <span>View Full Schedule</span>
              </a>
            </div>

            {/* Trust points */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free Virtual Admission</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Live Q&amp;A with Experts</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-sky-400" />
                <span>On-Demand Session Recordings</span>
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. FEATURED SPOTLIGHT EVENT
        ====================================================================== */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-amber-500/10 via-white to-teal-500/10 rounded-3xl p-7 sm:p-9 border border-amber-300/70 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-100 text-amber-800">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                    Featured Masterclass of the Week
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#0A255C]">
                  Full-Stack Distributed System Architecture Masterclass
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Join lead architect Dr. Sarah Mitchell for a live hands-on coding walkthrough of scalable microservice topologies, database sharding, and real-time event streaming.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Clock className="w-4 h-4 text-amber-600" /> Saturday, Dec 5 • 4:00 PM IST
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Users className="w-4 h-4 text-blue-600" /> 1,240+ Enrolled Learners
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleRegister(
                      'Full-Stack Distributed System Architecture Masterclass',
                      '/education/live-classes'
                    )
                  }
                  className="px-8 py-3.5 rounded-2xl bg-[#0A255C] hover:bg-[#071B42] text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Reserve Free Seat</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. EVENT CATEGORY TABS & SCHEDULE
        ====================================================================== */}
        <section id="schedule" className="mb-14 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Upcoming Schedule</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Browse all live sessions, webinars, workshops, and business summits
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'all' ? 'bg-[#0A255C] text-white shadow-sm' : 'text-slate-600 hover:text-[#0A255C]'
                }`}
              >
                All Events ({allEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('workshop')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'workshop'
                    ? 'bg-[#0A255C] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0A255C]'
                }`}
              >
                Workshops
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('webinar')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'webinar'
                    ? 'bg-[#0A255C] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0A255C]'
                }`}
              >
                Webinars
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('live-session')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'live-session'
                    ? 'bg-[#0A255C] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0A255C]'
                }`}
              >
                Live Sessions ({dynamicLiveEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('summit')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'summit'
                    ? 'bg-[#0A255C] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0A255C]'
                }`}
              >
                Summits
              </button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                      {evt.categoryLabel}
                    </span>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#0A255C] text-white">
                      {evt.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0A255C] mb-2">{evt.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{evt.description}</p>

                  <div className="space-y-2 py-3 border-t border-b border-slate-100 text-xs text-slate-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-slate-800">
                        {evt.date} • {evt.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>
                        Hosted by: <strong className="text-slate-800">{evt.instructor}</strong>{' '}
                        <span className="text-slate-400">({evt.instructorRole})</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleRegister(evt.title, evt.link)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A255C] hover:bg-[#071B42] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Register / Join Free</span>
                  </button>

                  <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free Virtual Access
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            4. HOST AN EVENT / EDUCATOR CTA BANNER
        ====================================================================== */}
        <section className="bg-gradient-to-r from-[#0A255C] to-[#153A8A] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Are you an educator or industry leader?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Host your own interactive masterclasses, live virtual classrooms, or business workshops on Business Hub.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/teacher"
              className="px-6 py-3 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-md transition-all"
            >
              Host a Masterclass
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
