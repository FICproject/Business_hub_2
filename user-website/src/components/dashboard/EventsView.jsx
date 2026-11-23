import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Users,
  Sparkles,
  PlusCircle,
  Search,
  CheckCircle2,
  Tv,
} from 'lucide-react';

export const EventsView = ({ role = 'teacher', onSchedule }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredIds, setRegisteredIds] = useState(new Set(['evt-1']));

  const categories = ['All', 'Workshop', 'Webinar', 'Live Session', 'Summit'];

  const allEvents = [
    {
      id: 'evt-1',
      title: 'Full-Stack Distributed System Architecture Masterclass',
      category: 'Workshop',
      date: 'Saturday, Dec 5, 2026',
      time: '4:00 PM - 6:00 PM EST',
      speaker: 'Dr. Sarah Mitchell',
      speakerRole: 'Principal Cloud Architect',
      description:
        'Hands-on architectural deep dive: building microservices, Redis caching layers, and resilient CI/CD pipelines with zero downtime.',
      seatsLeft: 34,
      isLive: false,
    },
    {
      id: 'evt-2',
      title: 'Small Business & Merchant Growth Summit 2026',
      category: 'Summit',
      date: 'Wednesday, Dec 9, 2026',
      time: '6:30 PM - 8:30 PM EST',
      speaker: 'Vikram Mehta & Strategic Panel',
      speakerRole: 'Commercial Strategy Directors',
      description:
        'Practical playbooks for digital merchants: catalog turnover, identity privacy compliance, and clean referral link attribution.',
      seatsLeft: 78,
      isLive: false,
    },
    {
      id: 'evt-3',
      title: 'Tech & Commerce Virtual Career Hiring Fair',
      category: 'Webinar',
      date: 'Friday, Dec 11, 2026',
      time: '2:00 PM - 5:00 PM EST',
      speaker: 'Business Hub Talent Council',
      speakerRole: 'Hiring Leads at 15+ Companies',
      description:
        'Meet corporate hiring managers, submit fast-track resumes, and discover high-demand software and business vacancies.',
      seatsLeft: 120,
      isLive: false,
    },
    {
      id: 'evt-4',
      title: 'Modern Digital Classroom Engagement for Educators',
      category: 'Workshop',
      date: 'Thursday, Dec 17, 2026',
      time: '5:00 PM - 7:00 PM EST',
      speaker: 'Prof. Anita Roy',
      speakerRole: 'Educational Technologist',
      description:
        'Techniques for hosting interactive virtual streaming rooms, evaluating live code exercises, and engaging remote learners.',
      seatsLeft: 42,
      isLive: false,
    },
    {
      id: 'evt-5',
      title: 'Data Science & Machine Learning Real-World Case Studies',
      category: 'Webinar',
      date: 'Tuesday, Dec 22, 2026',
      time: '7:00 PM - 8:30 PM EST',
      speaker: 'Karan Joshi',
      speakerRole: 'Senior Data Scientist',
      description:
        'Explore production predictive analytics, transformer model fine-tuning, and scalable feature store designs.',
      seatsLeft: 89,
      isLive: false,
    },
    {
      id: 'evt-6',
      title: 'Interactive Live Coding: React 18 Concurrent Rendering',
      category: 'Live Session',
      date: 'Today',
      time: '8:00 PM - 9:30 PM EST',
      speaker: 'Prof. David Vance',
      speakerRole: 'Software Engineering Faculty',
      description:
        'Live stream covering React 18 transitions, useDeferredValue, and custom concurrent state orchestrations with live student Q&A.',
      seatsLeft: 15,
      isLive: true,
    },
  ];

  const toggleRegister = (id, title) => {
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        alert(`You are officially registered for: "${title}"! A confirmation has been added to your dashboard schedule.`);
      }
      return next;
    });
  };

  const filteredEvents = allEvents.filter((ev) => {
    const matchesCategory =
      activeCategory === 'All' || ev.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesQuery =
      searchQuery === '' ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 text-xs font-extrabold border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free Educational Events &amp; Workshops
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
            Events &amp; Live Workshops
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Attend live interactive masterclasses, faculty roundtables, career hiring fairs, and industry keynotes.
          </p>
        </div>

        {role === 'teacher' && onSchedule && (
          <button
            type="button"
            onClick={onSchedule}
            className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            Schedule New Session
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-navy-950 text-white shadow-md font-extrabold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy-950 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events or speakers..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-navy-950">No events found matching your criteria.</p>
          <p className="text-xs text-slate-500">Try adjusting your filters or search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const isRegistered = registeredIds.has(ev.id);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all relative overflow-hidden"
              >
                {/* Top Badge & Live Indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                    {ev.category}
                  </span>
                  {ev.isLive ? (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Live Now
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">
                      {ev.seatsLeft} seats left
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-base text-navy-950 leading-snug">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {ev.description}
                  </p>
                </div>

                {/* Speaker & Timing */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div>
                    <p className="font-bold text-navy-950">{ev.speaker}</p>
                    <p className="text-[11px] text-slate-400">{ev.speakerRole}</p>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 font-semibold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.date} • {ev.time}</span>
                  </div>
                </div>

                {/* Registration CTA Button */}
                <button
                  type="button"
                  onClick={() => toggleRegister(ev.id, ev.title)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                    isRegistered
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-navy-950 hover:bg-navy-900 text-white'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Seat Reserved ✓
                    </>
                  ) : (
                    'Register for Free'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
