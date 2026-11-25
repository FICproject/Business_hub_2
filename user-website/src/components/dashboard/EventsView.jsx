import React, { useState, useEffect } from 'react';
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
import { educationApi } from '../../services/api';

export const EventsView = ({ role = 'teacher', onSchedule }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    educationApi
      .getLiveClasses()
      .then((res) => {
        if (!active) return;
        const rows = res.data?.data || [];
        setAllEvents(
          rows.map((lc) => {
            const capacity = Number(lc.studentCapacity || 100);
            const enrolled = Number(lc.enrolledCount || 0);
            return {
              id: lc._id,
              title: lc.title,
              category: lc.subject || 'Live Session',
              date: lc.scheduledDate || 'Upcoming',
              time: lc.startTime || 'TBD',
              speaker: lc.instructorName || 'Verified Faculty',
              speakerRole: lc.subject || 'Instructor',
              description: lc.description || 'Interactive live workshop hosted on Business Hub.',
              seatsLeft: Math.max(0, capacity - enrolled),
              isLive: lc.status === 'live',
            };
          })
        );
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = ['All', ...Array.from(new Set(allEvents.map((ev) => ev.category).filter(Boolean)))];

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
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto animate-pulse" />
          <p className="text-sm font-bold text-navy-950">Loading upcoming events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
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
