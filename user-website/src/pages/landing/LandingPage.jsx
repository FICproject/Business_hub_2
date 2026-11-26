import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, GraduationCap, Briefcase, Share2, Crown, ArrowRight, ShieldCheck, CheckCircle2, Users, Play, Star, Sparkles, TrendingUp, Layers, Rocket, X, Store, Wrench, Package, } from 'lucide-react';
import { marketplaceApi, educationApi, jobsApi, categoriesApi } from '../../services/api';
import heroModel from '../../assets/hero-model.jpg';

const DEFAULT_SERVICE_CATEGORIES = [
    { _id: 'srv-1', name: 'Engineering', description: 'Civil, structural, and geotechnical engineering professionals', subcategories: ['Civil Engineering', 'Structural Design', 'Soil Testing', 'Surveying'] },
    { _id: 'srv-2', name: 'Architecture', description: 'Building plans, 3D modeling, elevations and permits', subcategories: ['Residential Architecture', 'Commercial Plans', 'Landscape Design', '3D Walkthroughs'] },
    { _id: 'srv-3', name: 'Construction', description: 'General contractors, turn-key builders and labor teams', subcategories: ['Turn-key Construction', 'Masonry', 'Carpentry', 'Demolition'] },
    { _id: 'srv-4', name: 'Electrical', description: 'Master electricians for residential, commercial & solar installation', subcategories: ['Full Building Wiring', 'Solar Panel Installation', 'Transformer Setup', 'Safety Audits'] },
    { _id: 'srv-5', name: 'Plumbing', description: 'Pipe installation, sanitary fittings, drainage & water treatment', subcategories: ['Plumbing & Piping', 'Sanitary Fitting', 'Borewell & Pump Setup', 'Waterproofing Pipes'] },
    { _id: 'srv-6', name: 'Interior Design', description: 'Modular kitchens, false ceiling, furniture and styling', subcategories: ['Modular Kitchens', 'False Ceiling & Gypsum', 'Custom Woodwork', 'Lighting Decor'] },
    { _id: 'srv-7', name: 'Painting', description: 'Interior, exterior, texture painting and wall treatments', subcategories: ['Interior Painting', 'Exterior Weatherproof Paint', 'Texture & Stencils', 'Wood Polish'] },
    { _id: 'srv-8', name: 'Maintenance', description: 'HVAC servicing, elevator upkeep, deep cleaning and repairs', subcategories: ['HVAC Servicing', 'Water Tank Cleaning', 'Pest Control', 'General Upkeep'] },
];

const PLATFORM_PORTAL_CATEGORIES = [
    { id: 'marketplace', name: 'Marketplace', description: 'Shop products, deals & verified sellers', link: '/marketplace', badge: 'Commerce' },
    { id: 'education', name: 'Education', description: '100% free courses, live classes, study materials & tuition', link: '/education', badge: 'Learning' },
    { id: 'jobs', name: 'Jobs & Careers', description: 'Verified openings & hiring portal', link: '/jobs', badge: 'Careers' },
    { id: 'business', name: 'Business & Startups', description: 'Storefronts, merchant tools & enterprise registration', link: '/business', badge: 'Enterprise' },
    { id: 'community', name: 'Community', description: 'Student & teacher forums, peer groups & study circles', link: '/community', badge: 'Network' },
    { id: 'events', name: 'Events', description: 'Live masterclasses, webinars & interactive classes', link: '/events', badge: 'Live' },
    { id: 'referrals', name: 'Referrals & Link Sharing', description: 'Share clean product, course & job links with analytics', link: '/#referrals', badge: 'Sharing' },
];

export const LandingPage = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [freeCourses, setFreeCourses] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
    const [categoriesData, setCategoriesData] = useState(null);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [activeCategoryTab, setActiveCategoryTab] = useState('services');
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
        if (window.location.hash) {
            const id = window.location.hash.replace('#', '');
            const elem = document.getElementById(id);
            if (elem) {
                setTimeout(() => {
                    elem.scrollIntoView({ behavior: 'smooth' });
                }, 200);
            }
        }
    }, []);
    useEffect(() => {
        if (!categoriesModalOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                setCategoriesModalOpen(false);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [categoriesModalOpen]);
    const handleOpenCategoriesModal = async () => {
        setCategoriesModalOpen(true);
        if (categoriesData) return;
        setCategoriesLoading(true);
        try {
            const res = await categoriesApi.getCategories();
            setCategoriesData(res.data || {});
        } catch (err) {
            console.log('Categories fetch notice:', err.message);
            setCategoriesData({});
        } finally {
            setCategoriesLoading(false);
        }
    };
    const serviceCategories = categoriesData?.serviceCategories?.length
        ? categoriesData.serviceCategories
        : DEFAULT_SERVICE_CATEGORIES;
    const materialCategories = categoriesData?.materialCategories || [];
    const businessmanCategories = categoriesData?.businessmanCategories || [];
    const entrepreneurCategories = categoriesData?.entrepreneurCategories || [];
    return (<div className="bg-white text-[#0A255C] overflow-hidden font-sans">
      {/* =========================================================================
            1. HERO SECTION (Balanced Equal 50/50 Layout - Pure White Background)
        ========================================================================== */}
      <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-12 max-w-[1320px] mx-auto overflow-visible bg-white">
        {/* Equal 50 / 50 Grid with Centered Vertical Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subheading, CTAs & Social Proof */}
          <div className="space-y-5 lg:space-y-6 z-10 flex flex-col justify-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF8E7] border border-[#FDE68A] text-[#92400E] text-xs font-bold tracking-wide shadow-sm w-fit">
              <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]"/>
              <span>All-in-One Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-[#0A255C] tracking-tight leading-[1.08]">
              Your Complete <br />
              <span className="text-[#D97706]">Business</span>{' '}
              <span className="text-[#0A255C]">Hub</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-lg leading-relaxed">
              Shop, Learn, Find Jobs and Grow Your Career <br className="hidden sm:inline"/>
              — All in One Platform
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0A255C] hover:bg-[#071B42] text-white font-bold text-sm shadow-xl shadow-slate-900/20 hover:scale-105 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 font-bold"/>
              </Link>
              <button onClick={() => {
            const elem = document.getElementById('explore-services');
            elem?.scrollIntoView({ behavior: 'smooth' });
        }} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0A255C] font-bold text-sm border border-slate-300 shadow-sm hover:border-slate-400 transition-all">
                <div className="w-5 h-5 rounded-full bg-[#0A255C] text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5"/>
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Social Proof Row */}
            <div className="flex items-center gap-3.5 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="User 1"/>
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="User 2"/>
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="User 3"/>
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="User 4"/>
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" alt="User 5"/>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Join <span className="font-extrabold text-[#0A255C]">50K+</span> Happy Users
              </p>
            </div>
          </div>

          {/* Right Column: Hero Image Covering Full Area with Soft Border Blur */}
          <div className="flex justify-center items-center select-none w-full h-full">
            <div className="relative w-full h-[440px] sm:h-[500px] lg:h-[540px] flex justify-center items-center mx-auto overflow-hidden rounded-3xl">
              {/* Main Photo covering the right hero space */}
              <img src={heroModel} alt="Business Hub Platform - Shop, Learn, Find Jobs and Grow" className="w-full h-full object-cover object-top sm:object-center pointer-events-none hover:scale-[1.02] transition-transform duration-700" style={{
            WebkitMaskImage: 'radial-gradient(ellipse 92% 90% at 50% 50%, black 65%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 92% 90% at 50% 50%, black 65%, transparent 100%)',
        }}/>

              {/* Edge Blur & Vignette Blend Layers */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{
            boxShadow: 'inset 0 0 50px 30px #ffffff',
        }}/>
              <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{
            background: 'radial-gradient(ellipse at center, transparent 65%, #ffffff 98%)',
        }}/>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. QUICK CATEGORY NAVIGATION RIBBON BAR (Clean White Pill Container)
        ========================================================================== */}
        <div className="mt-12 sm:mt-16 bg-white rounded-full p-2.5 sm:p-3 shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* 1. Marketplace */}
            <Link to="/marketplace" className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3 pl-1">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <ShoppingBag className="w-5 h-5"/>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">Marketplace</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Shop & Buy</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </Link>

            {/* 2. Business */}
            <Link to="/dashboard/business" className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Crown className="w-5 h-5"/>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">Business</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Grow & Sell</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </Link>

            {/* 3. Student */}
            <Link to="/education" className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A255C] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <GraduationCap className="w-5 h-5"/>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">Student</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Free Learning</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </Link>

            {/* 4. Teacher */}
            <Link to="/dashboard/teacher" className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Users className="w-5 h-5"/>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">Teacher</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Teach & Live Classes</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </Link>

            {/* 5. All Services */}
            <button onClick={() => {
            const elem = document.getElementById('explore-services');
            elem?.scrollIntoView({ behavior: 'smooth' });
        }} className="flex items-center justify-between p-2.5 sm:p-3 rounded-full hover:bg-slate-50 transition-colors group col-span-2 md:col-span-1 text-left">
              <div className="flex items-center gap-3 pl-2 sm:pl-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                  <Layers className="w-5 h-5"/>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0A255C] leading-tight">All Services</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Explore Everything</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#0A255C] group-hover:text-white transition-colors mr-1">
                <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
            3. EXPLORE OUR SERVICES SECTION (4 Pastel Cards with 3D Icons)
        ========================================================================== */}
      <section id="explore-services" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Title & Checklist */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              <div>
                <div className="w-12 h-1.5 bg-[#FFB800] rounded-full mb-3"/>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A255C] tracking-tight leading-tight">
                  Explore Our <br className="hidden lg:inline"/>Services
                </h2>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Discover endless opportunities in one powerful platform.
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A255C]">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white"/>
                  </div>
                  <span>Trusted & Secure Platform</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A255C]">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white"/>
                  </div>
                  <span>Easy to Use Interface</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0A255C]">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 fill-[#FFB800] text-white"/>
                  </div>
                  <span>For Everyone</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button type="button" onClick={handleOpenCategoriesModal} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#0A255C] font-bold text-xs border border-slate-300 shadow-sm hover:border-slate-400 transition-all cursor-pointer">
                <span>Explore More</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>

          {/* Right 4 Colorful Pastel Cards matching target design */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 h-full">
            {/* 1. Marketplace Card (Soft Coral Pink #FFE8EC) */}
            <div className="bg-[#FFE8EC] rounded-3xl p-6 border border-[#FFD2D9] flex flex-col items-center text-center h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {/* 3D Dual Shopping Bags Vector */}
                  <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Yellow/Gold Bag (Behind) */}
                    <rect x="36" y="28" width="46" height="58" rx="6" fill="#F59E0B"/>
                    <path d="M48 28V20C48 14 68 14 68 20V28" stroke="#D97706" strokeWidth="4" strokeLinecap="round"/>
                    <rect x="70" y="28" width="12" height="58" rx="4" fill="#D97706" opacity="0.6"/>
                    {/* Blue Bag (Front) */}
                    <rect x="18" y="38" width="44" height="52" rx="6" fill="#2563EB"/>
                    <path d="M28 38V30C28 24 48 24 48 30V38" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round"/>
                    <rect x="52" y="38" width="10" height="52" rx="4" fill="#1D4ED8" opacity="0.6"/>
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-[#0A255C] mb-1">Marketplace</h3>
                <p className="text-xs text-slate-600 font-medium min-h-[32px]">
                  Discover products and services
                </p>
              </div>
              <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-rose-600 transition-colors pt-4">
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>

            {/* 2. Education Card (Soft Pastel Sky Blue #EBF3FE) */}
            <div className="bg-[#EBF3FE] rounded-3xl p-6 border border-[#D2E5FD] flex flex-col items-center text-center h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {/* 3D Books Stack with Graduation Cap Vector */}
                  <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Bottom Red Book */}
                    <rect x="20" y="68" width="60" height="15" rx="3" fill="#DC2626"/>
                    <rect x="23" y="71" width="54" height="9" rx="2" fill="#F87171" opacity="0.4"/>
                    {/* Middle Yellow Book */}
                    <rect x="24" y="52" width="56" height="14" rx="3" fill="#F59E0B"/>
                    {/* Graduation Cap */}
                    <path d="M50 18L18 34L50 50L82 34L50 18Z" fill="#0A255C"/>
                    <path d="M30 40V56C30 62 70 62 70 56V40" fill="#0F172A"/>
                    {/* Tassel */}
                    <path d="M50 34L68 44V58" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="68" cy="60" r="3" fill="#F59E0B"/>
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-[#0A255C] mb-1">Education</h3>
                <p className="text-xs text-slate-600 font-medium min-h-[32px]">
                  Access free courses and live classes
                </p>
              </div>
              <Link to="/education" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-blue-600 transition-colors pt-4">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>

            {/* 3. Jobs Card (Soft Pastel Lavender #F3EFFF) */}
            <div className="bg-[#F3EFFF] rounded-3xl p-6 border border-[#E3DAFF] flex flex-col items-center text-center h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {/* 3D Brown Leather Briefcase Vector */}
                  <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Handle */}
                    <path d="M38 32V24C38 20 62 20 62 24V32" stroke="#78350F" strokeWidth="6" strokeLinecap="round"/>
                    {/* Case Body */}
                    <rect x="18" y="32" width="64" height="48" rx="8" fill="#92400E"/>
                    <path d="M18 52H82" stroke="#78350F" strokeWidth="2"/>
                    {/* Gold Buckle */}
                    <rect x="44" y="48" width="12" height="12" rx="2" fill="#F59E0B"/>
                    <circle cx="50" cy="54" r="2" fill="#78350F"/>
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-[#0A255C] mb-1">Jobs</h3>
                <p className="text-xs text-slate-600 font-medium min-h-[32px]">
                  Find the right job for your career
                </p>
              </div>
              <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-indigo-600 transition-colors pt-4">
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>

            {/* 4. Referrals Card (Soft Pastel Mint #E8FAF0) */}
            <div className="bg-[#E8FAF0] rounded-3xl p-6 border border-[#D0F5E0] flex flex-col items-center text-center h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {/* 3D Megaphone Vector */}
                  <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Megaphone Cone */}
                    <path d="M25 44L60 28V68L25 54V44Z" fill="#2563EB"/>
                    <path d="M60 28C65 28 68 36 68 48C68 60 65 68 60 68" fill="#F59E0B"/>
                    <rect x="18" y="44" width="8" height="10" rx="2" fill="#D97706"/>
                    {/* Handle */}
                    <rect x="30" y="54" width="10" height="24" rx="3" transform="rotate(20 30 54)" fill="#92400E"/>
                    {/* Sound Waves */}
                    <path d="M74 40C78 44 78 52 74 56" stroke="#2563EB" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M80 34C86 42 86 54 80 62" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-[#0A255C] mb-1">Referrals</h3>
                <p className="text-xs text-slate-600 font-medium min-h-[32px]">
                  Share links and grow your network
                </p>
              </div>
              <a href="#referrals" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A255C] hover:text-emerald-600 transition-colors pt-4">
                <span>Share Now</span>
                <ArrowRight className="w-3.5 h-3.5"/>
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
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#00C4FF]/20 rounded-full blur-2xl pointer-events-none"/>

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
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-md hover:shadow-lg transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 font-bold"/>
              </Link>
            </div>
          </div>

          {/* Middle 4 Feature Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Safe & Secure */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500"/>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A255C] leading-snug">
                Safe & Secure <br />Platform
              </h4>
            </div>

            {/* Learn & Grow */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                <Rocket className="w-6 h-6 text-rose-500"/>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A255C] leading-snug">
                Learn & Grow <br />Skills
              </h4>
            </div>

            {/* Find Better Jobs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-500"/>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A255C] leading-snug">
                Find Better <br />Jobs
              </h4>
            </div>

            {/* Grow Your Business */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-emerald-500"/>
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
                  <Users className="w-6 h-6 text-[#0A255C]"/>
                </div>
                <p className="text-2xl font-black text-[#0A255C]">50K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Active Users</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#0A255C]"/>
                </div>
                <p className="text-2xl font-black text-[#0A255C]">10K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Products & Services</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#0A255C]"/>
                </div>
                <p className="text-2xl font-black text-[#0A255C]">5K+</p>
                <p className="text-[11px] font-semibold text-slate-600">Courses & Classes</p>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#0A255C]"/>
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
          <div className="w-14 sm:w-20 h-1 bg-[#FFB800] rounded-full"/>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A255C] tracking-tight text-center">
            What Our Users Say
          </h2>
          <div className="w-14 sm:w-20 h-1 bg-[#FFB800] rounded-full"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Priya S." className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"/>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "Business Hub is amazing! I found courses, jobs and great products in one place."
              </p>
              <div className="flex items-center gap-1 text-[#FFB800]">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]"/>))}
              </div>
              <p className="text-[11px] font-bold text-[#0A255C]">— Priya S., Student</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Rahul K." className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"/>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "A perfect platform for learning and career growth. Highly recommended!"
              </p>
              <div className="flex items-center gap-1 text-[#FFB800]">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]"/>))}
              </div>
              <p className="text-[11px] font-bold text-[#0A255C]">— Rahul K., Job Seeker</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80" alt="Anitha M." className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"/>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                "Very useful platform for business and education. Easy to use!"
              </p>
              <div className="flex items-center gap-1 text-[#FFB800]">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]"/>))}
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
            <div className="w-12 h-28 bg-blue-300 rounded-t-sm"/>
            <div className="w-16 h-40 bg-indigo-300 rounded-t-sm"/>
            <div className="w-10 h-24 bg-blue-400 rounded-t-sm"/>
            <div className="w-20 h-48 bg-purple-300 rounded-t-sm"/>
            <div className="w-14 h-32 bg-blue-300 rounded-t-sm"/>
            <div className="w-18 h-44 bg-indigo-400 rounded-t-sm"/>
            <div className="w-12 h-28 bg-purple-400 rounded-t-sm"/>
          </div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/25 via-amber-500/20 to-transparent flex items-center justify-center flex-shrink-0 shadow-lg border border-amber-400/30">
              <Rocket className="w-8 h-8 text-[#FFB800]"/>
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
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all">
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 font-black"/>
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
              <Share2 className="w-6 h-6 text-[#FFB800]"/>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0A255C]">Clean Link Sharing & Click Analytics</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Share any product, course, or job link with one click across WhatsApp, LinkedIn, and Twitter. Zero pyramid commissions or MLM wallets.
              </p>
            </div>
          </div>
          <Link to="/marketplace" className="px-6 py-2.5 rounded-full bg-[#0A255C] text-white font-bold text-xs hover:bg-[#071B42] transition-colors flex-shrink-0 shadow-sm">
            Explore Catalog to Share
          </Link>
        </div>
      </section>

      {/* =========================================================================
            8. ABOUT BUSINESS HUB SECTION
        ========================================================================== */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto scroll-mt-24">
        <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/40 rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8E7] border border-[#FDE68A] text-[#92400E] text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]"/>
              <span>About Business Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A255C] tracking-tight leading-tight">
              One Unified Platform For <br className="hidden sm:inline"/>
              <span className="text-[#D97706]">Commerce</span>,{' '}
              <span className="text-[#0A255C]">Education</span> & Careers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Business Hub was created to unite key digital needs into one reliable, ethical ecosystem. We empower businesses with zero-fee storefronts, offer students 100% free certified learning, provide teachers with interactive virtual classrooms, and connect job seekers with verified employers — backed by clean, transparent link sharing.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Pillar 1: Marketplace */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-blue-600"/>
                </div>
                <h3 className="text-base font-extrabold text-[#0A255C] mb-2">Verified Marketplace</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct trade between verified sellers and customers. Zero counterfeit risks, transparent pricing, and instant checkout.
                </p>
              </div>
              <Link to="/marketplace" className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>

            {/* Pillar 2: For Business */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-amber-600"/>
                </div>
                <h3 className="text-base font-extrabold text-[#0A255C] mb-2">Empowering Businesses</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Comprehensive dashboard for inventory management, customer order tracking, sales analytics, and hiring top talent.
                </p>
              </div>
              <Link to="/dashboard/business" className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700">
                <span>Start Selling</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>

            {/* Pillar 3: Students & Free Learning */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-emerald-600"/>
                </div>
                <h3 className="text-base font-extrabold text-[#0A255C] mb-2">100% Free For Students</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No hidden subscription traps or paid paywalls. Every lecture, study material, and tuition class is completely free.
                </p>
              </div>
              <Link to="/education" className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                <span>Start Learning</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>

            {/* Pillar 4: Teachers & Mentors */}
            <div id="community" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600"/>
                </div>
                <h3 className="text-base font-extrabold text-[#0A255C] mb-2">Teacher &amp; Student Community</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Host live interactive video classrooms, join collaborative study groups, and connect with peers and mentors across the platform.
                </p>
              </div>
              <Link to="/community" className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700">
                <span>Join Community</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </Link>
            </div>
          </div>

          {/* Bottom Statement & Trust Indicators */}
          <div className="bg-[#0A255C] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-lg sm:text-xl font-bold text-white">Join 50,000+ businesses, students and teachers</h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Create a free account in under 60 seconds and access all features instantly.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/register" className="px-6 py-3 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-md transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
            9. HELP & SUPPORT / CONTACT ANCHOR SECTION
        ========================================================================== */}
      <section id="contact" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto scroll-mt-24">
        <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-navy-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold">
              <span>24/7 Help &amp; Support</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Need assistance with your account or orders?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our dedicated support team is available around the clock to assist businesses with verification, help students navigate free courses, and resolve marketplace order inquiries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <a href="mailto:support@businesshub.com" className="px-6 py-3.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs text-center transition-all shadow-md">
              Email support@businesshub.com
            </a>
            <Link to="/terms" className="px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition-all">
              Read Terms &amp; Policies
            </Link>
          </div>
        </div>
      </section>

      {/* Explore All Categories Popup Modal */}
      {categoriesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A255C]/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setCategoriesModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="categories-modal-title"
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A255C] text-[#FFB800] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Layers className="w-5 h-5"/>
                </div>
                <div>
                  <h3 id="categories-modal-title" className="text-lg sm:text-xl font-black text-[#0A255C]">
                    All Services &amp; Categories
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Browse all service types, materials, business sectors, and platform portals
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCategoriesModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-[#0A255C] hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Close categories popup"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Category Tabs */}
            <div className="px-6 pt-4 pb-3 border-b border-slate-100 flex flex-wrap gap-2 bg-white">
              {[
                { key: 'services', label: `Service Types (${serviceCategories.length})`, icon: Wrench },
                { key: 'portals', label: `Platform Portals (${PLATFORM_PORTAL_CATEGORIES.length})`, icon: Layers },
                ...(materialCategories.length > 0 ? [{ key: 'materials', label: `Materials (${materialCategories.length})`, icon: Package }] : []),
                ...(businessmanCategories.length > 0 ? [{ key: 'business', label: `Business Sectors (${businessmanCategories.length})`, icon: Store }] : []),
                ...(entrepreneurCategories.length > 0 ? [{ key: 'startups', label: `Startup Sectors (${entrepreneurCategories.length})`, icon: Rocket }] : []),
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeCategoryTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategoryTab(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0A255C] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-[#0A255C]'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5"/>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {categoriesLoading ? (
                <div className="py-12 text-center text-sm font-semibold text-slate-500">
                  Loading categories...
                </div>
              ) : activeCategoryTab === 'portals' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PLATFORM_PORTAL_CATEGORIES.map((portal) => (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => {
                        setCategoriesModalOpen(false);
                        if (portal.link.startsWith('/#')) {
                          const elem = document.getElementById(portal.link.replace('/#', ''));
                          elem?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          navigate(portal.link);
                        }
                      }}
                      className="text-left p-4 rounded-2xl border border-slate-200 hover:border-[#0A255C]/40 hover:bg-slate-50/80 transition-all group cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-sm font-extrabold text-[#0A255C] group-hover:text-[#D97706] transition-colors">
                            {portal.name}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                            {portal.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {portal.description}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A255C] mt-3">
                        <span>Open Portal</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"/>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(activeCategoryTab === 'services'
                    ? serviceCategories
                    : activeCategoryTab === 'materials'
                    ? materialCategories
                    : activeCategoryTab === 'business'
                    ? businessmanCategories
                    : entrepreneurCategories
                  ).map((cat) => (
                    <div
                      key={cat._id || cat.id || cat.name}
                      onClick={() => {
                        setCategoriesModalOpen(false);
                        if (activeCategoryTab === 'services') {
                          navigate(`/marketplace?tab=services&search=${encodeURIComponent(cat.name)}`);
                        } else if (activeCategoryTab === 'materials') {
                          navigate(`/marketplace?search=${encodeURIComponent(cat.name)}`);
                        } else {
                          navigate('/business');
                        }
                      }}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-[#0A255C]/40 hover:bg-slate-50/80 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h4 className="text-sm font-extrabold text-[#0A255C] group-hover:text-[#D97706] transition-colors">
                            {cat.name}
                          </h4>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0A255C] group-hover:translate-x-0.5 transition-all flex-shrink-0"/>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      {cat.subcategories?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cat.subcategories.slice(0, 4).map((sub) => (
                            <span
                              key={sub}
                              className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {sub}
                            </span>
                          ))}
                          {cat.subcategories.length > 4 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                              +{cat.subcategories.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setCategoriesModalOpen(false);
                  navigate('/marketplace');
                }}
                className="text-xs font-bold text-[#0A255C] hover:text-[#D97706] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Browse Full Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </button>
              <button
                type="button"
                onClick={() => setCategoriesModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#0A255C] hover:bg-[#071B42] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>);
};
