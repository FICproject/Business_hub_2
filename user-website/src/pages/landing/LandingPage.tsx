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
import heroModel from '../../assets/hero-model.png';

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
    <div className="bg-white text-[#0A255C] overflow-hidden font-sans">
      {/* =========================================================================
          1. HERO SECTION (Balanced Equal Length Layout)
      ========================================================================== */}
      <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-12 max-w-[1320px] mx-auto overflow-visible">
        {/* Sky-Blue Soft Atmospheric Gradient Backdrop */}
        <div className="absolute top-0 right-0 w-3/5 h-full bg-gradient-to-bl from-[#EDF4FE] via-[#F4F9FF]/70 to-transparent pointer-events-none -z-20 rounded-bl-[140px]" />
        
        {/* Soft Modern Glass Building Texture in Background */}
        <div
          className="absolute top-0 right-0 w-1/2 h-[85%] bg-cover bg-center opacity-10 mix-blend-multiply pointer-events-none -z-10 rounded-bl-[140px]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')` }}
        />
        <div className="absolute -top-10 left-0 w-96 h-96 bg-gradient-to-br from-amber-300/15 via-amber-100/10 to-transparent rounded-full blur-3xl pointer-events-none -z-20" />

        {/* 50 / 50 Equal Split Grid with Centered Vertical Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left Column: Heading, Subheading, CTAs & Social Proof */}
          <div className="space-y-6 z-10 flex flex-col justify-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF8E7] border border-[#FDE68A] text-[#92400E] text-xs font-bold tracking-wide shadow-sm w-fit">
              <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
              <span>All-in-One Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-black text-[#0A255C] tracking-tight leading-[1.08]">
              Your Complete <br />
              <span className="text-[#D97706]">Business</span>{' '}
              <span className="text-[#0A255C]">Hub</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-lg leading-relaxed">
              Shop, Learn, Find Jobs and Grow Your Career <br className="hidden sm:inline" />
              — All in One Platform
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0A255C] hover:bg-[#071B42] text-white font-bold text-sm shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </Link>
              <button
                onClick={() => {
                  const elem = document.getElementById('explore-services');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0A255C] font-bold text-sm border border-slate-300 shadow-sm hover:border-slate-400 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-[#0A255C] text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Social Proof Row */}
            <div className="flex items-center gap-3.5 pt-2">
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
                Join <span className="font-extrabold text-[#0A255C]">50K+</span> Happy Users
              </p>
            </div>
          </div>

          {/* Right Column: Hero Graphic (Centered Exactly in Frame) */}
          <div className="relative flex justify-center items-center select-none w-full">
            <div className="relative w-full max-w-[420px] h-[360px] flex justify-center items-center mx-auto">
              {/* 3D Flowing Golden Ribbon Centered Behind Model */}
              <svg
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[360px] h-[270px] pointer-events-none -z-10 drop-shadow-xl"
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

              {/* Model Cutout Centered Perfectly */}
              <img
                src={heroModel}
                alt="Business Hub Platform - Shop, Learn, Find Jobs and Grow"
                className="max-h-[360px] max-w-full w-auto h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 pointer-events-none mx-auto"
              />
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
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">Marketplace</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Shop & Buy</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 2. Education */}
            <Link
              to="/education"
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A255C] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">Education</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Learn & Grow</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 3. Jobs */}
            <Link
              to="/jobs"
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A255C] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">Jobs</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Find Opportunities</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 4. Referrals */}
            <a
              href="#referrals"
              className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A255C] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">Referrals</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Share & Connect</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
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
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">For Business</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Grow Your Business</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
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
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A255C] tracking-tight leading-tight">
                Explore Our <br className="hidden lg:inline" />Services
              </h2>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Discover endless opportunities in one powerful platform.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A255C]">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white" />
                </div>
                <span>Trusted & Secure Platform</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A255C]">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white" />
                </div>
                <span>Easy to Use Interface</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A255C]">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white" />
                </div>
                <span>For Everyone</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#0A255C] font-bold text-xs border border-slate-300 shadow-sm hover:border-slate-400 transition-all"
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
              <div className="w-24 h-24 mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                {/* 3D Dual Shopping Bags Vector */}
                <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Yellow/Gold Bag (Behind) */}
                  <rect x="36" y="28" width="46" height="58" rx="6" fill="#F59E0B" />
                  <path d="M48 28V20C48 14 68 14 68 20V28" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                  <rect x="70" y="28" width="12" height="58" rx="4" fill="#D97706" opacity="0.6" />
                  {/* Blue Bag (Front) */}
                  <rect x="18" y="38" width="44" height="52" rx="6" fill="#2563EB" />
                  <path d="M28 38V30C28 24 48 24 48 30V38" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
                  <rect x="52" y="38" width="10" height="52" rx="4" fill="#1D4ED8" opacity="0.6" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C] mb-1">Marketplace</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Discover products and services
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-rose-600 transition-colors mt-auto"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Education Card (Soft Pastel Sky Blue #EBF3FE) */}
            <div className="bg-[#EBF3FE] rounded-3xl p-6 border border-[#D2E5FD] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                {/* 3D Books Stack with Graduation Cap Vector */}
                <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Bottom Red Book */}
                  <rect x="20" y="68" width="60" height="15" rx="3" fill="#DC2626" />
                  <rect x="23" y="71" width="54" height="9" rx="2" fill="#F87171" opacity="0.4" />
                  {/* Middle Yellow Book */}
                  <rect x="24" y="52" width="56" height="14" rx="3" fill="#F59E0B" />
                  {/* Graduation Cap */}
                  <path d="M50 18L18 34L50 50L82 34L50 18Z" fill="#0A255C" />
                  <path d="M30 40V56C30 62 70 62 70 56V40" fill="#0F172A" />
                  {/* Tassel */}
                  <path d="M50 34L68 44V58" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="68" cy="60" r="3" fill="#F59E0B" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C] mb-1">Education</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Access free courses and live classes
              </p>
              <Link
                to="/education"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-blue-600 transition-colors mt-auto"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Jobs Card (Soft Pastel Lavender #F3EFFF) */}
            <div className="bg-[#F3EFFF] rounded-3xl p-6 border border-[#E3DAFF] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                {/* 3D Brown Leather Briefcase Vector */}
                <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Handle */}
                  <path d="M38 32V24C38 20 62 20 62 24V32" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
                  {/* Case Body */}
                  <rect x="18" y="32" width="64" height="48" rx="8" fill="#92400E" />
                  <path d="M18 52H82" stroke="#78350F" strokeWidth="2" />
                  {/* Gold Buckle */}
                  <rect x="44" y="48" width="12" height="12" rx="2" fill="#F59E0B" />
                  <circle cx="50" cy="54" r="2" fill="#78350F" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C] mb-1">Jobs</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Find the right job for your career
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-indigo-600 transition-colors mt-auto"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Referrals Card (Soft Pastel Mint #E8FAF0) */}
            <div className="bg-[#E8FAF0] rounded-3xl p-6 border border-[#D0F5E0] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                {/* 3D Megaphone Vector */}
                <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Megaphone Cone */}
                  <path d="M25 44L60 28V68L25 54V44Z" fill="#2563EB" />
                  <path d="M60 28C65 28 68 36 68 48C68 60 65 68 60 68" fill="#F59E0B" />
                  <rect x="18" y="44" width="8" height="10" rx="2" fill="#D97706" />
                  {/* Handle */}
                  <rect x="30" y="54" width="10" height="24" rx="3" transform="rotate(20 30 54)" fill="#92400E" />
                  {/* Sound Waves */}
                  <path d="M74 40C78 44 78 52 74 56" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                  <path d="M80 34C86 42 86 54 80 62" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C] mb-1">Referrals</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Share links and grow your network
              </p>
              <a
                href="#referrals"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-emerald-600 transition-colors mt-auto"
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-md hover:shadow-lg transition-all"
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
              <h4 className="text-xs sm:text-sm font-bold text-[#0A255C] leading-snug">
                Safe & Secure <br />Platform
              </h4>
            </div>

            {/* Learn & Grow */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <Rocket className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A255C] leading-snug">
                Learn & Grow <br />Skills
              </h4>
            </div>

            {/* Find Better Jobs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A255C] leading-snug">
                Find Better <br />Jobs
              </h4>
            </div>

            {/* Grow Your Business */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A255C] leading-snug">
                Grow Your <br />Business
              </h4>
            </div>
          </div>

          {/* Right Statistics Card (Warm Cream / Peach #FFF6EA) */}
          <div className="lg:col-span-3 bg-[#FFF6EA] rounded-3xl p-6 border border-[#FDEBD2] flex flex-col justify-between shadow-sm">
            <div className="grid grid-cols-2 gap-5 my-auto">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0A255C]" />
                </div>
                <p className="text-2xl font-black text-[#0A255C]">50K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Active Users</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#0A255C]" />
                </div>
                <p className="text-2xl font-black text-[#0A255C]">10K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Products & Services</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#0A255C]" />
                </div>
                <p className="text-2xl font-black text-[#0A255C]">5K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Courses & Classes</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#0A255C]" />
                </div>
                <p className="text-2xl font-black text-[#0A255C]">20K+</p>
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
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A255C] tracking-tight text-center">
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
              <p className="text-[11px] font-bold text-[#0A255C]">— Priya S., Student</p>
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
              <p className="text-[11px] font-bold text-[#0A255C]">— Rahul K., Job Seeker</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80"
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
              <p className="text-[11px] font-bold text-[#0A255C]">— Anitha M., Entrepreneur</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. START YOUR JOURNEY TODAY! (City Skyline Silhouette Banner)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#071128] via-[#0F2052] to-[#20175E] text-white p-8 sm:p-10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Stylized Night Skyline Vector Glow Backdrop */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end justify-around">
            <div className="w-12 h-28 bg-blue-300 rounded-t-sm" />
            <div className="w-16 h-40 bg-indigo-300 rounded-t-sm" />
            <div className="w-10 h-24 bg-blue-400 rounded-t-sm" />
            <div className="w-20 h-48 bg-purple-300 rounded-t-sm" />
            <div className="w-14 h-32 bg-blue-300 rounded-t-sm" />
            <div className="w-18 h-44 bg-indigo-400 rounded-t-sm" />
            <div className="w-12 h-28 bg-purple-400 rounded-t-sm" />
          </div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/25 via-amber-500/20 to-transparent flex items-center justify-center flex-shrink-0 shadow-lg border border-amber-400/30">
              <Rocket className="w-8 h-8 text-[#FFB800]" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#FFB800] tracking-tight">
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
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all"
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
              <h4 className="text-lg font-bold text-[#0A255C]">Clean Link Sharing & Click Analytics</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Share any product, course, or job link with one click across WhatsApp, LinkedIn, and Twitter. Zero pyramid commissions or MLM wallets.
              </p>
            </div>
          </div>
          <Link
            to="/marketplace"
            className="px-6 py-2.5 rounded-full bg-[#0A255C] text-white font-bold text-xs hover:bg-[#071B42] transition-colors flex-shrink-0 shadow-sm"
          >
            Explore Catalog to Share
          </Link>
        </div>
      </section>
    </div>
  );
};
