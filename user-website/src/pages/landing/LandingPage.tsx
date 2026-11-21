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
    <div className="bg-[#FAF9F6] text-slate-900 overflow-hidden font-sans">
      {/* =========================================================================
          1. HERO SECTION (Exact Match to Design Reference)
      ========================================================================== */}
      <section className="relative pt-6 sm:pt-10 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible">
        {/* Decorative Golden Ambient Waves */}
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-300/25 via-amber-200/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-sky-300/20 via-blue-200/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subheading, CTAs & Social Proof */}
          <div className="lg:col-span-7 space-y-6 lg:pr-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-200 text-amber-900 text-xs font-bold tracking-wide shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>All-in-One Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-slate-900 tracking-tight leading-[1.08]">
              Your Complete <br />
              <span className="relative inline-block text-amber-500">
                Business
                {/* Hand-drawn Golden Swoop Underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-amber-400"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C60 3 190 3 247 9"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              <span className="text-slate-900">Hub</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl leading-relaxed pt-1">
              Shop, Learn, Find Jobs and Grow Your Career <br className="hidden sm:inline" />
              — All in One Platform
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  const elem = document.getElementById('explore-services');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm hover:border-slate-400 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Social Proof: 5 Customer Avatars + 50K+ */}
            <div className="flex items-center gap-3.5 pt-4">
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
                Join <span className="font-extrabold text-slate-900">50K+</span> Happy Users
              </p>
            </div>
          </div>

          {/* Right Column: Hero Model + Floating Interactive Category Cards */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Visual Container */}
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Golden Background Glow Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-amber-300/40 via-amber-200/20 to-sky-200/30 blur-2xl -z-10" />

              {/* Main Professional Model Photo */}
              <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-amber-900/10 border-4 border-white max-h-[480px]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt="Business Hub Professional"
                  className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge 1: Marketplace (Top Left) */}
              <Link
                to="/marketplace"
                className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-100 flex flex-col items-center hover:scale-105 transition-all group z-20 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1">Marketplace</span>
              </Link>

              {/* Floating Badge 2: Education (Center Left) */}
              <Link
                to="/education"
                className="absolute top-1/3 -left-6 sm:-left-10 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-100 flex flex-col items-center hover:scale-105 transition-all group z-20 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1">Education</span>
              </Link>

              {/* Floating Badge 3: Jobs (Top Right) */}
              <Link
                to="/jobs"
                className="absolute top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-100 flex flex-col items-center hover:scale-105 transition-all group z-20 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1">Jobs</span>
              </Link>

              {/* Floating Badge 4: Referrals (Center Right) */}
              <a
                href="#referrals"
                className="absolute bottom-12 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-100 flex flex-col items-center hover:scale-105 transition-all group z-20 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1">Referrals</span>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. QUICK CATEGORY NAVIGATION RIBBON (Pill Bar matching Image 1)
        ========================================================================== */}
        <div className="mt-12 sm:mt-16 bg-white rounded-3xl p-3 sm:p-4 shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* 1. Marketplace */}
            <Link
              to="/marketplace"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Marketplace</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Shop & Buy</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 2. Education */}
            <Link
              to="/education"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Education</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Learn & Grow</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 3. Jobs */}
            <Link
              to="/jobs"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Jobs</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Find Opportunities</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 4. Referrals */}
            <a
              href="#referrals"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Referrals</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Share & Connect</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* 5. For Business */}
            <Link
              to="/dashboard/business"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group col-span-2 md:col-span-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">For Business</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Grow Your Business</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. EXPLORE OUR SERVICES SECTION (4 Pastel Cards matching Image 1)
      ========================================================================== */}
      <section id="explore-services" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Title & Checklist */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <div className="w-12 h-1 bg-amber-400 rounded-full mb-3" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Explore Our <br className="hidden lg:inline" />Services
              </h2>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Discover endless opportunities in one powerful platform.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-amber-500 text-white" />
                </div>
                <span>Trusted & Secure Platform</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-amber-500 text-white" />
                </div>
                <span>Easy to Use Interface</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-amber-500 text-white" />
                </div>
                <span>For Everyone</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs border border-slate-300 shadow-sm hover:border-slate-400 transition-all"
              >
                <span>Explore More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right 4 Colorful Pastel Cards matching target design */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Marketplace Card (Soft Pink/Red) */}
            <div className="bg-[#FFF1F2] rounded-3xl p-6 border border-[#FFE4E6] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-4 flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform">
                🛍️
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Marketplace</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Discover products and services
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-rose-600 transition-colors mt-auto"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Education Card (Soft Sky Blue) */}
            <div className="bg-[#EFF6FF] rounded-3xl p-6 border border-[#DBEAFE] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-4 flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform">
                🎓
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Education</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Access free courses and live classes
              </p>
              <Link
                to="/education"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors mt-auto"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Jobs Card (Soft Lavender/Purple) */}
            <div className="bg-[#F5F3FF] rounded-3xl p-6 border border-[#EDE9FE] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-4 flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform">
                💼
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Jobs</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Find the right job for your career
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors mt-auto"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Referrals Card (Soft Mint Green) */}
            <div className="bg-[#F0FDF4] rounded-3xl p-6 border border-[#DCFCE7] flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="w-24 h-24 mb-4 flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform">
                📢
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Referrals</h3>
              <p className="text-xs text-slate-600 font-medium mb-5 min-h-[32px]">
                Share links and grow your network
              </p>
              <a
                href="#referrals"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-600 transition-colors mt-auto"
              >
                <span>Share Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. WHY CHOOSE BUSINESS HUB? (Navy Card + Features + Stats)
      ========================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Navy Banner Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#0B132B] via-[#0F1E42] to-[#142A5C] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Glowing Accent Ring */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Why Choose <br />
                <span className="text-amber-400">Business Hub?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                A smarter platform for a brighter future. Discover verified sellers, free certified education, and real job opportunities.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Middle 4 Feature Items */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Safe & Secure */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                Safe & Secure <br />Platform
              </h4>
            </div>

            {/* Learn & Grow */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <Rocket className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                Learn & Grow <br />Skills
              </h4>
            </div>

            {/* Find Better Jobs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                Find Better <br />Jobs
              </h4>
            </div>

            {/* Grow Your Business */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                Grow Your <br />Business
              </h4>
            </div>
          </div>

          {/* Right Statistics Card (Beige Card matching Image 1) */}
          <div className="lg:col-span-3 bg-[#FBF5EC] rounded-3xl p-6 border border-[#F4E8D4] flex flex-col justify-between shadow-sm">
            <div className="grid grid-cols-2 gap-5 my-auto">
              {/* Stat 1: 50K+ */}
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 text-slate-800 flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-900" />
                </div>
                <p className="text-2xl font-black text-slate-900">50K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Active Users</p>
              </div>

              {/* Stat 2: 10K+ */}
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 text-slate-800 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-slate-900" />
                </div>
                <p className="text-2xl font-black text-slate-900">10K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Products & Services</p>
              </div>

              {/* Stat 3: 5K+ */}
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 text-slate-800 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-slate-900" />
                </div>
                <p className="text-2xl font-black text-slate-900">5K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Courses & Classes</p>
              </div>

              {/* Stat 4: 20K+ */}
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 text-slate-800 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-slate-900" />
                </div>
                <p className="text-2xl font-black text-slate-900">20K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Job Opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. WHAT OUR USERS SAY (3 Clean Cards matching Image 1)
      ========================================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header with Golden Accent Lines */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-12 sm:w-20 h-0.5 bg-amber-400 rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center">
            What Our Users Say
          </h2>
          <div className="w-12 sm:w-20 h-0.5 bg-amber-400 rounded-full" />
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1: Priya S. */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Priya S."
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"
            />
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "Business Hub is amazing! I found courses, jobs and great products in one place."
              </p>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-900">— Priya S., Student</p>
            </div>
          </div>

          {/* Review 2: Rahul K. */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
              alt="Rahul K."
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"
            />
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "A perfect platform for learning and career growth. Highly recommended!"
              </p>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-900">— Rahul K., Job Seeker</p>
            </div>
          </div>

          {/* Review 3: Anitha M. */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
              alt="Anitha M."
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"
            />
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "Very useful platform for business and education. Easy to use!"
              </p>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-900">— Anitha M., Entrepreneur</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. START YOUR JOURNEY TODAY! (City Skyline CTA Banner matching Image 1)
      ========================================================================== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#070D1E] via-[#0E1A3C] to-[#162758] text-white p-8 sm:p-10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Cityscape Skyline Graphic Effect at bottom of banner */}
          <div className="absolute inset-x-0 bottom-0 h-16 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />

          {/* Left: 3D Rocket Icon & Text */}
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-3xl flex items-center justify-center flex-shrink-0 shadow-inner">
              🚀
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Start Your Journey Today!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Join Business Hub and unlock endless opportunities.
              </p>
            </div>
          </div>

          {/* Right: Golden CTA Button */}
          <div className="relative z-10 flex-shrink-0">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 font-black" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. REFERRALS / SHARING ANCHOR (PRD Clean Sharing Module)
      ========================================================================== */}
      <section id="referrals" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Clean Link Sharing & Click Analytics</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Share any product, course, or job link with one click across WhatsApp, LinkedIn, and Twitter. Zero pyramid commissions or MLM wallets.
              </p>
            </div>
          </div>
          <Link
            to="/marketplace"
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            Explore Catalog to Share
          </Link>
        </div>
      </section>
    </div>
  );
};
