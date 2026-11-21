import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Share2,
  Crown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Video,
  Play,
  Star,
  Sparkles,
  TrendingUp,
  Award,
  Lock,
  Layers,
  Search,
  Rocket,
} from 'lucide-react';
import { marketplaceApi, educationApi, jobsApi } from '../../services/api';
import { IProduct, ICourse, ILiveClass, IJob } from '../../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [freeCourses, setFreeCourses] = useState<ICourse[]>([]);
  const [jobs, setJobs] = useState<IJob[]>([]);

  useEffect(() => {
    marketplaceApi.getProducts({ featured: 'true' })
      .then((res) => setFeaturedProducts(res.data.data.slice(0, 4)))
      .catch((err) => console.log('Products fetch notice:', err.message));

    educationApi.getCourses()
      .then((res) => setFreeCourses(res.data.data.slice(0, 3)))
      .catch((err) => console.log('Courses fetch notice:', err.message));

    jobsApi.getJobs()
      .then((res) => setJobs(res.data.data.slice(0, 3)))
      .catch((err) => console.log('Jobs fetch notice:', err.message));
  }, []);

  return (
    <div className="bg-white text-[#0A1128] overflow-hidden font-sans">
      {/* =========================================================================
          1. HERO SECTION (Exact Colors, Backdrop, Model & Badges)
      ========================================================================== */}
      <section className="relative pt-6 sm:pt-10 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto overflow-visible">
        {/* Sky-Blue Soft Atmospheric Gradient Backdrop */}
        <div className="absolute top-0 right-0 w-3/5 h-full bg-gradient-to-bl from-[#EDF4FE] via-[#F4F9FF]/70 to-transparent pointer-events-none -z-20 rounded-bl-[140px]" />
        <div className="absolute -top-10 left-0 w-96 h-96 bg-gradient-to-br from-amber-300/15 via-amber-100/10 to-transparent rounded-full blur-3xl pointer-events-none -z-20" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column: Heading, Subheading, CTAs & Social Proof */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6 z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF8E7] border border-[#FDE68A] text-[#92400E] text-xs font-bold tracking-wide shadow-sm">
              <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
              <span>All-in-One Platform</span>
            </div>

            {/* Main Headline with Exact Yellow Accent and Brush Underline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[66px] font-black text-[#0A1128] tracking-tight leading-[1.08]">
              Your Complete <br />
              <span className="relative inline-block text-[#E69A00]">
                Business
                {/* Thick Painterly Golden Yellow Brush Stroke Underline */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-4.5 text-[#FFB800] pointer-events-none"
                  viewBox="0 0 260 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 11C50 4 135 2 254 9C220 14 145 16 6 15C42 12 120 7.5 240 11.5"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>{' '}
              <span className="text-[#0A1128]">Hub</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl leading-relaxed pt-1">
              Shop, Learn, Find Jobs and Grow Your Career <br className="hidden sm:inline" />
              — All in One Platform
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0A1128] hover:bg-slate-800 text-white font-bold text-sm shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </Link>
              <button
                onClick={() => {
                  const elem = document.getElementById('explore-services');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0A1128] font-bold text-sm border border-slate-300 shadow-sm hover:border-slate-400 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#0A1128] text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Social Proof Row */}
            <div className="flex items-center gap-3.5 pt-3">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="User 1"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="User 2"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="User 3"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="User 4"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                  alt="User 5"
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Join <span className="font-extrabold text-[#0A1128]">50K+</span> Happy Users
              </p>
            </div>
          </div>

          {/* Right Column: Hero Model with 4 Floating Badges & 3D Golden Ribbon */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end select-none">
            <div className="relative w-full max-w-[460px]">
              {/* 3D Flowing Golden Ribbon Behind Model */}
              <svg
                className="absolute -bottom-8 -right-8 w-[420px] h-[340px] pointer-events-none -z-10 drop-shadow-xl"
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 240C90 280 220 270 320 200C390 150 370 70 395 10"
                  stroke="url(#exactGoldGradient)"
                  strokeWidth="38"
                  strokeLinecap="round"
                />
                <path
                  d="M40 255C110 290 220 285 305 220"
                  stroke="#D97706"
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <defs>
                  <linearGradient id="exactGoldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D97706" />
                    <stop offset="45%" stopColor="#FFB800" />
                    <stop offset="100%" stopColor="#FFAE00" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Model Image with Soft Rounded Corners */}
              <div className="relative mx-auto rounded-[36px] overflow-hidden shadow-2xl shadow-slate-900/10 border-4 border-white aspect-[4/5] max-h-[500px]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt="Business Hub Creator"
                  className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge 1: Marketplace (Top Left) */}
              <Link
                to="/marketplace"
                className="absolute -top-3 left-4 sm:-left-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col items-center hover:scale-105 transition-all group z-20 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-[#0A1128] mt-1 tracking-tight">Marketplace</span>
              </Link>

              {/* Floating Badge 2: Education (Mid Left) */}
              <Link
                to="/education"
                className="absolute top-[42%] -left-4 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col items-center hover:scale-105 transition-all group z-20 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0A1128] text-white flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-slate-950 transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-[#0A1128] mt-1 tracking-tight">Education</span>
              </Link>

              {/* Floating Badge 3: Jobs (Top Right) */}
              <Link
                to="/jobs"
                className="absolute top-8 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col items-center hover:scale-105 transition-all group z-20 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#B45309] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-[#0A1128] mt-1 tracking-tight">Jobs</span>
              </Link>

              {/* Floating Badge 4: Referrals (Center Right) */}
              <a
                href="#referrals"
                className="absolute bottom-20 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col items-center hover:scale-105 transition-all group z-20 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-[#0A1128] mt-1 tracking-tight">Referrals</span>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. QUICK CATEGORY NAVIGATION RIBBON BAR (Clean White Pill Container)
        ========================================================================== */}
        <div className="mt-12 sm:mt-16 bg-white rounded-full p-2.5 sm:p-3 shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* 1. Marketplace */}
            <Link
              to="/marketplace"
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 pl-1">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1128] leading-tight">Marketplace</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Shop & Buy</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A1128] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 2. Education */}
            <Link
              to="/education"
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A1128] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1128] leading-tight">Education</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Learn & Grow</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A1128] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 3. Jobs */}
            <Link
              to="/jobs"
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A1128] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1128] leading-tight">Jobs</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Find Opportunities</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A1128] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 4. Referrals */}
            <a
              href="#referrals"
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A1128] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1128] leading-tight">Referrals</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Share & Connect</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A1128] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* 5. For Business */}
            <Link
              to="/dashboard/business"
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group col-span-2 md:col-span-1"
            >
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1128] leading-tight">For Business</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Grow Your Business</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A1128] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. EXPLORE OUR SERVICES SECTION (4 Pastel Cards with 3D Icons)
      ========================================================================== */}
      <section id="explore-services" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Title & Checklist */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <div className="w-12 h-1.5 bg-[#FFB800] rounded-full mb-3" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight leading-tight">
                Explore Our <br className="hidden lg:inline" />Services
              </h2>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Discover endless opportunities in one powerful platform.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A1128]">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white" />
                </div>
                <span>Trusted & Secure Platform</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A1128]">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white" />
                </div>
                <span>Easy to Use Interface</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A1128]">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white" />
                </div>
                <span>For Everyone</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#0A1128] font-bold text-xs border border-slate-300 shadow-sm hover:border-slate-400 transition-all"
              >
                <span>Explore More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right 4 Colorful Pastel Cards matching target design */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Marketplace Card (Soft Coral Pink #FFE8EC) */}
            <div className="bg-[#FFE8EC] rounded-3xl p-6 border border-[#FFD2D9] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-4 flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform">
                🛍️
              </div>
              <h3 className="text-lg font-extrabold text-[#0A1128] mb-1">Marketplace</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Discover products and services
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1128] hover:text-rose-600 transition-colors mt-auto"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Education Card (Soft Pastel Sky Blue #EBF3FE) */}
            <div className="bg-[#EBF3FE] rounded-3xl p-6 border border-[#D2E5FD] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-4 flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform">
                🎓
              </div>
              <h3 className="text-lg font-extrabold text-[#0A1128] mb-1">Education</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Access free courses and live classes
              </p>
              <Link
                to="/education"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1128] hover:text-blue-600 transition-colors mt-auto"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Jobs Card (Soft Pastel Lavender #F3EFFF) */}
            <div className="bg-[#F3EFFF] rounded-3xl p-6 border border-[#E3DAFF] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-4 flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform">
                💼
              </div>
              <h3 className="text-lg font-extrabold text-[#0A1128] mb-1">Jobs</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Find the right job for your career
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1128] hover:text-indigo-600 transition-colors mt-auto"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Referrals Card (Soft Pastel Mint #E8FAF0) */}
            <div className="bg-[#E8FAF0] rounded-3xl p-6 border border-[#D0F5E0] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-4 flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform">
                📢
              </div>
              <h3 className="text-lg font-extrabold text-[#0A1128] mb-1">Referrals</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Share links and grow your network
              </p>
              <a
                href="#referrals"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1128] hover:text-emerald-600 transition-colors mt-auto"
              >
                <span>Share Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. WHY CHOOSE BUSINESS HUB? (Royal Navy Card + Features + Warm Cream Stats)
      ========================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Royal Navy Banner Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Glowing Neon Cyan Ambient Light */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#00C4FF]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Why Choose <br />
                <span className="text-[#FFB800]">Business Hub?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
                A smarter platform for a brighter future. Discover verified sellers, free certified education, and real job opportunities.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A1128] font-black text-xs shadow-md hover:shadow-lg transition-all"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 font-bold" />
              </Link>
            </div>
          </div>

          {/* Middle 4 Feature Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Safe & Secure */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A1128] leading-snug">
                Safe & Secure <br />Platform
              </h4>
            </div>

            {/* Learn & Grow */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <Rocket className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A1128] leading-snug">
                Learn & Grow <br />Skills
              </h4>
            </div>

            {/* Find Better Jobs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A1128] leading-snug">
                Find Better <br />Jobs
              </h4>
            </div>

            {/* Grow Your Business */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A1128] leading-snug">
                Grow Your <br />Business
              </h4>
            </div>
          </div>

          {/* Right Statistics Card (Warm Cream / Peach #FFF6EA) */}
          <div className="lg:col-span-3 bg-[#FFF6EA] rounded-3xl p-6 border border-[#FDEBD2] flex flex-col justify-between shadow-sm">
            <div className="grid grid-cols-2 gap-5 my-auto">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0A1128]" />
                </div>
                <p className="text-2xl font-black text-[#0A1128]">50K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Active Users</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#0A1128]" />
                </div>
                <p className="text-2xl font-black text-[#0A1128]">10K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Products & Services</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#0A1128]" />
                </div>
                <p className="text-2xl font-black text-[#0A1128]">5K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Courses & Classes</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#0A1128]" />
                </div>
                <p className="text-2xl font-black text-[#0A1128]">20K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Job Opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. WHAT OUR USERS SAY (3 Clean White Cards with Golden Accent Lines)
      ========================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-14 sm:w-20 h-1 bg-[#FFB800] rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight text-center">
            What Our Users Say
          </h2>
          <div className="w-14 sm:w-20 h-1 bg-[#FFB800] rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Priya S."
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"
            />
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "Business Hub is amazing! I found courses, jobs and great products in one place."
              </p>
              <div className="flex items-center gap-1 text-[#FFB800]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                ))}
              </div>
              <p className="text-[11px] font-bold text-[#0A1128]">— Priya S., Student</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
              alt="Rahul K."
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"
            />
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "A perfect platform for learning and career growth. Highly recommended!"
              </p>
              <div className="flex items-center gap-1 text-[#FFB800]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                ))}
              </div>
              <p className="text-[11px] font-bold text-[#0A1128]">— Rahul K., Job Seeker</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
              alt="Anitha M."
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"
            />
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "Very useful platform for business and education. Easy to use!"
              </p>
              <div className="flex items-center gap-1 text-[#FFB800]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                ))}
              </div>
              <p className="text-[11px] font-bold text-[#0A1128]">— Anitha M., Entrepreneur</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. START YOUR JOURNEY TODAY! (City Skyline Silhouette Banner)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#071128] via-[#0F2052] to-[#20175E] text-white p-8 sm:p-10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-3xl flex items-center justify-center flex-shrink-0 shadow-inner">
              🚀
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Start Your Journey Today!
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mt-1">
                Join Business Hub and unlock endless opportunities.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A1128] font-black text-sm shadow-xl hover:scale-105 transition-all"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 font-black" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CLEAN LINK SHARING MODULE ANCHOR
      ========================================================================== */}
      <section id="referrals" className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
              <Share2 className="w-6 h-6 text-[#FFB800]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0A1128]">Clean Link Sharing & Click Analytics</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Share any product, course, or job link with one click across WhatsApp, LinkedIn, and Twitter. Zero pyramid commissions or MLM wallets.
              </p>
            </div>
          </div>
          <Link
            to="/marketplace"
            className="px-6 py-2.5 rounded-full bg-[#0A1128] text-white font-bold text-xs hover:bg-slate-800 transition-colors flex-shrink-0 shadow-sm"
          >
            Explore Catalog to Share
          </Link>
        </div>
      </section>
    </div>
  );
};
