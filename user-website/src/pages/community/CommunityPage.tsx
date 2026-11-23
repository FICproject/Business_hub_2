import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Users,
  GraduationCap,
  Store,
  Briefcase,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Share2,
  Heart,
  Globe,
  Award,
  BookOpen,
  Code,
  LineChart,
  MessageCircle,
  ThumbsUp,
  Clock,
  Check,
} from 'lucide-react';
import { RootState } from '../../store';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export const CommunityPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const channels = [
    {
      title: 'Students & Learners Circle',
      description: 'Collaborate with fellow students, form virtual study pods, share lesson notes, and ask coding and finance questions.',
      icon: GraduationCap,
      color: 'bg-teal-50 text-teal-700',
      badge: '50K+ Students',
      link: '/education',
      linkText: 'Explore Free Courses',
    },
    {
      title: 'Educators & Mentor Lounge',
      description: 'Certified teachers and industry mentors sharing modern classroom techniques, curriculum outlines, and live class materials.',
      icon: Award,
      color: 'bg-purple-50 text-purple-700',
      badge: '1.2K+ Educators',
      link: '/teacher',
      linkText: 'Teacher Portal',
    },
    {
      title: 'Entrepreneurs & Merchant Forum',
      description: 'Verified business owners discussing supply chain strategies, product listings, store optimization, and customer retention.',
      icon: Store,
      color: 'bg-amber-50 text-amber-700',
      badge: '3.8K+ Businesses',
      link: '/business',
      linkText: 'Business Hub Portal',
    },
    {
      title: 'Careers & Talent Exchange',
      description: 'Direct networking between hiring managers and top candidates. Resume feedback, mock interview tips, and vacancy sharing.',
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-700',
      badge: '800+ Hiring Teams',
      link: '/jobs',
      linkText: 'Browse Openings',
    },
  ];

  const communityCategories = [
    { label: 'All Discussions', value: 'all', icon: MessageSquare },
    { label: 'Engineering & Code', value: 'engineering', icon: Code },
    { label: 'Business & Commerce', value: 'business', icon: Store },
    { label: 'Career & Resumes', value: 'career', icon: Briefcase },
    { label: 'Study Groups', value: 'study', icon: GraduationCap },
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best practices for organizing React full-stack microservices with clean API boundaries',
      author: 'Alex Morgan',
      role: 'Lead Architect',
      category: 'engineering',
      replies: 24,
      likes: 58,
      time: '2 hours ago',
      tags: ['React', 'Architecture', 'TypeScript'],
    },
    {
      id: 2,
      title: 'How our verified store scaled product turnover by 40% using clean social link sharing',
      author: 'Kavita Rao',
      role: 'Merchant Founder',
      category: 'business',
      replies: 19,
      likes: 42,
      time: '4 hours ago',
      tags: ['Commerce', 'Growth', 'Retail'],
    },
    {
      id: 3,
      title: 'Advice for clearing junior full-stack interviews at tech startups this quarter',
      author: 'David Chen',
      role: 'Recent Graduate',
      category: 'career',
      replies: 31,
      likes: 76,
      time: '5 hours ago',
      tags: ['Careers', 'Interviews', 'Fresher'],
    },
    {
      id: 4,
      title: 'Collaborative study pod for upcoming Data Science and Machine Learning certification',
      author: 'Priya Sharma',
      role: 'Student Ambassador',
      category: 'study',
      replies: 15,
      likes: 33,
      time: 'Yesterday',
      tags: ['Python', 'DataScience', 'StudyPod'],
    },
  ];

  const filteredDiscussions =
    selectedCategory === 'all'
      ? discussions
      : discussions.filter((d) => d.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen text-[#0A255C] font-sans pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb currentPage="Community" />

        {/* =====================================================================
            1. COMMUNITY HERO SECTION
        ====================================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white shadow-2xl overflow-hidden mb-12">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <Users className="w-3.5 h-3.5" />
              <span>Business Hub Community Ecosystem</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Connect, Collaborate &amp; <br />
              <span className="text-[#FFB800]">Grow Together</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              A vibrant, spam-free knowledge ecosystem bringing together passionate learners, verified merchant founders, certified educators, and talent seekers.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all"
                  >
                    <span>Join the Community</span>
                    <ArrowRight className="w-4 h-4 font-bold" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all"
                  >
                    <span>Sign In</span>
                  </Link>
                </>
              ) : (
                <a
                  href="#discussions"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all"
                >
                  <span>Explore Discussions</span>
                  <ArrowRight className="w-4 h-4 font-bold" />
                </a>
              )}
            </div>

            {/* Community stats */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Moderated &amp; Safe</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Global Peer Exchange</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Zero Ads or MLM Solicitations</span>
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. STUDENT AND PROFESSIONAL COMMUNITIES (CIRCLES)
        ====================================================================== */}
        <section className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A255C]">Specialized Community Circles</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Find your dedicated circle, connect with peers, and share industry insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map((ch, idx) => {
              const Icon = ch.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${ch.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {ch.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0A255C] mb-2">{ch.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{ch.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={ch.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-[#D97706] transition-colors"
                    >
                      <span>{ch.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Channels
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            3. COMMUNITY CATEGORIES
        ====================================================================== */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Explore Knowledge Categories</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Filter ongoing community discussions by topic</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {communityCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all group ${
                    isSelected
                      ? 'bg-[#0A255C] text-white border-[#0A255C] shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${
                      isSelected ? 'bg-white/10 text-[#FFB800]' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            4. ACTIVE DISCUSSION GROUPS & KNOWLEDGE SHARING
        ====================================================================== */}
        <section id="discussions" className="mb-14 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Trending Knowledge Discussions</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Join conversations, share solutions, and upvote high-impact answers
              </p>
            </div>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A255C] text-white font-bold text-xs"
              >
                <span>Start a Discussion</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {filteredDiscussions.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      {d.category}
                    </span>
                    <span className="text-xs text-slate-400">• {d.time}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0A255C] hover:text-amber-600 transition-colors cursor-pointer">
                    {d.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mr-3">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-[#0A255C]">
                        {d.author.charAt(0)}
                      </div>
                      <span>{d.author}</span>
                      <span className="text-slate-400 font-normal">({d.role})</span>
                    </div>

                    {d.tags.map((t) => (
                      <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-blue-600" /> {d.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4 text-emerald-600" /> {d.likes}
                    </span>
                  </div>

                  <Link
                    to={isAuthenticated ? '/dashboard/student' : '/register'}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#0A255C] hover:text-white text-[#0A255C] font-bold text-xs transition-colors"
                  >
                    Join Conversation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            5. COMMUNITY VALUES & GUIDELINES
        ====================================================================== */}
        <section className="mb-14 bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0A255C]">Zero Spam &amp; Safe Spaces</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Strictly moderated channels free of pyramid schemes, unauthorized advertisements, or aggressive solicitations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0A255C]">Inclusive &amp; Global</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Connect across regions, discover cross-border trade tips, and expand your career worldview.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0A255C]">Collaborative Growth</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Provide constructive code reviews, share study cheat-sheets, and celebrate peer career milestones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. JOIN COMMUNITY CTA
        ====================================================================== */}
        <section className="bg-[#0A255C] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to share knowledge and expand your network?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Create a free account in under 60 seconds and access all discussion channels immediately.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-lg hover:scale-105 transition-all"
            >
              Join Business Hub Free
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
