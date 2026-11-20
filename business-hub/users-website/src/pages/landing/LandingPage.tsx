import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Store,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Video,
  FileText,
  Star,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Award,
  Globe2,
  Lock,
} from 'lucide-react';
import { marketplaceApi, educationApi, jobsApi } from '../../services/api';
import { IProduct, ICourse, ILiveClass, IJob } from '../../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [freeCourses, setFreeCourses] = useState<ICourse[]>([]);
  const [liveClasses, setLiveClasses] = useState<ILiveClass[]>([]);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    // Fetch live data from backend
    marketplaceApi.getProducts({ featured: 'true' })
      .then((res) => setFeaturedProducts(res.data.data.slice(0, 4)))
      .catch((err) => console.log('Products fetch notice:', err.message));

    educationApi.getCourses()
      .then((res) => setFreeCourses(res.data.data.slice(0, 3)))
      .catch((err) => console.log('Courses fetch notice:', err.message));

    educationApi.getLiveClasses()
      .then((res) => setLiveClasses(res.data.data.slice(0, 2)))
      .catch((err) => console.log('Live classes fetch notice:', err.message));

    jobsApi.getJobs()
      .then((res) => setJobs(res.data.data.slice(0, 3)))
      .catch((err) => console.log('Jobs fetch notice:', err.message));
  }, []);

  const faqs = [
    {
      q: 'What is Business Hub and how does it connect multiple ecosystems?',
      a: 'Business Hub is a unified digital SaaS ecosystem that brings together a high-privacy multi-vendor marketplace, free online education and live classes, verified career job openings, and seamless business management under a single account.',
    },
    {
      q: 'Why are all courses and live classes completely free for students?',
      a: 'Business Hub believes in democratizing education and career advancement. All courses and live interactive classrooms are 100% free for verified students. Teachers receive fair stipends funded directly by Business Hub administrative compensation.',
    },
    {
      q: 'How is seller and business privacy safeguarded on the marketplace?',
      a: 'Public buyers only view product specifications, verified customer ratings, and commercial listing details. Business owner legal names, personal cell numbers, identity filings, and private contact channels are strictly hidden from public scrapers and API consumers.',
    },
    {
      q: 'What is the minimum age requirement to register on Business Hub?',
      a: 'All users must be at least 18 years of age. During registration, your Date of Birth is verified to ensure full legal compliance across commercial transactions and career applications.',
    },
    {
      q: 'How does link sharing work? Are there referral commissions?',
      a: 'Our sharing system enables clean, privacy-preserving sharing of product, service, and job links across WhatsApp, LinkedIn, and social networks with click analytics. We intentionally do NOT run commission wallets, affiliate cuts, or MLM pyramid schemes.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-16 bg-gradient-to-b from-slate-100/80 via-white to-slate-50 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#0D9488_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>The Next Generation Unified SaaS Platform</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
              Everything Your Business and Career Needs in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">One Place.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
              Discover products, explore services, learn new skills, connect with opportunities and grow your business with Business Hub.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <Link
                to="/marketplace"
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Explore Marketplace
              </Link>
              <Link
                to="/education"
                className="px-6 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-sm sm:text-base shadow-lg shadow-navy-800/20 hover:shadow-navy-800/35 transition-all flex items-center gap-2"
              >
                <GraduationCap className="w-5 h-5 text-teal-400" />
                Start Learning Free
              </Link>
              <Link
                to="/jobs"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5 text-slate-500" />
                Explore Jobs
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center gap-2"
              >
                Join Business Hub
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>100% Free Live Classes & Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Strict Seller Privacy Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>Strict 18+ Age Validation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT BUSINESS HUB */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">About The Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight leading-tight">
              A Unified Ecosystem Connecting Commerce, Education, and Careers
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Business Hub was designed from the ground up to eliminate fragmented platforms. Instead of juggling separate software for e-commerce, virtual courseware, live tutoring, job boards, and partner verifications, we provide a unified high-performance cloud hub powered by role-based access control.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <p className="text-2xl font-extrabold text-teal-600">100% Free</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Student Courseware & Live Class Access</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <p className="text-2xl font-extrabold text-navy-800">Verified</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Admin-Approved Business Partners</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"
                alt="Business Hub Collaborative Community"
                className="w-full h-96 object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Fast Growing Community</p>
                  <p className="text-xs text-slate-500">Over 1,200 active students and businesses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MARKETPLACE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">Curated Categories</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Explore Marketplace Categories</h2>
          <p className="text-slate-600 text-sm mt-1">High-end hardware, productivity gadgets, software tooling, and enterprise services.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Electronics', icon: '💻', count: '45+ Items', slug: 'electronics' },
            { title: 'Audio & Gear', icon: '🎧', count: '28+ Items', slug: 'audio' },
            { title: 'Office & Desk', icon: '🪑', count: '32+ Items', slug: 'office' },
            { title: 'Cloud Services', icon: '☁️', count: '18+ Services', slug: 'services' },
            { title: 'Cybersecurity', icon: '🛡️', count: '14+ Services', slug: 'services' },
            { title: 'Development', icon: '⚡', count: '25+ Items', slug: 'electronics' },
          ].map((cat) => (
            <Link
              key={cat.title}
              to={`/marketplace?category=${cat.slug}`}
              className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-300 transition-all text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-teal-600">{cat.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">Verified Marketplace</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Featured Products</h2>
            <p className="text-slate-600 text-sm mt-1">Top-rated equipment and software solutions from approved business partners.</p>
          </div>
          <Link to="/marketplace" className="text-teal-600 hover:text-teal-700 font-bold text-sm flex items-center gap-1.5 mt-3 sm:mt-0">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/marketplace/products/${p._id}`)}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
                  {p.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{p.rating || 4.9}</span>
                  <span className="text-slate-400">({p.reviewsCount || 18})</span>
                </div>
                <h3 className="font-bold text-slate-800 text-base line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
                  {p.title}
                </h3>
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">${p.discountPrice || p.price}</span>
                    {p.discountPrice && (
                      <span className="text-xs text-slate-400 line-through ml-1.5">${p.price}</span>
                    )}
                  </div>
                  <button className="p-2 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. POPULAR SERVICES */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">Professional Solutions</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Popular Enterprise Services</h2>
            <p className="text-slate-600 text-sm mt-1">Book certified cloud architects, cybersecurity auditors, and marketing leaders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Cloud Architecture & Kubernetes Infrastructure Migration',
                desc: 'Zero-downtime cloud migration, Infrastructure-as-Code (Terraform), and AWS/GCP cost optimization audits.',
                rate: 'Quote-Based / Fixed Tier',
                area: 'Worldwide Delivery',
                img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
              },
              {
                title: 'Corporate Cybersecurity & Penetration Testing Audit',
                desc: 'End-to-end vulnerability assessment, SOC 2 compliance readiness audit, and employee phishing simulation training.',
                rate: '$1,800 Fixed Service',
                area: 'Remote / On-site Available',
                img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
              },
            ].map((srv, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-6 items-center">
                <img src={srv.img} alt={srv.title} className="w-full sm:w-44 h-44 rounded-2xl object-cover" />
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-teal-600 uppercase bg-teal-50 px-2.5 py-1 rounded-md">{srv.area}</span>
                  <h3 className="font-bold text-lg text-slate-800 leading-snug">{srv.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{srv.desc}</p>
                  <p className="text-sm font-extrabold text-navy-800">{srv.rate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDUCATION & FREE COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">Zero-Cost Skill Development</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Free Courses & Tutorials</h2>
            <p className="text-slate-600 text-sm mt-1">High-impact engineering, business strategy, and data science courses taught by verified teachers.</p>
          </div>
          <Link to="/education" className="text-teal-600 hover:text-teal-700 font-bold text-sm flex items-center gap-1.5 mt-3 sm:mt-0">
            Browse All Free Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {freeCourses.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/education/courses/${c._id}`)}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={c.thumbnailUrl}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">
                  100% Free
                </span>
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded font-medium">
                  {c.level}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{c.category}</p>
                <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{c.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    {c.enrolledStudentsCount || 140}+ Students
                  </span>
                  <span className="font-bold text-teal-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Enroll Free <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. UPCOMING LIVE CLASSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-900/60 border border-teal-700/60 px-3 py-1 rounded-md">
              Interactive WebRTC Classrooms
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Upcoming Free Live Interactive Masterclasses
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join live video lectures, ask questions in real-time chat, and download curated lecture notes—all with zero tuition barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {liveClasses.map((cls) => (
              <div key={cls._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-teal-300 font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-4 h-4" /> Live Interactive
                    </span>
                    <span>{cls.scheduledDate} at {cls.startTime}</span>
                  </div>
                  <h3 className="font-bold text-lg text-white leading-snug">{cls.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">{cls.description}</p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-teal-300">{cls.enrolledCount}</span> / {cls.studentCapacity} Seats Reserved
                  </div>
                  <Link
                    to="/education/live-classes"
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    Join Class Free <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CAREER OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">Verified Careers</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Featured Career Opportunities</h2>
            <p className="text-slate-600 text-sm mt-1">Direct employment openings published exclusively by admin-approved businesses.</p>
          </div>
          <Link to="/jobs" className="text-teal-600 hover:text-teal-700 font-bold text-sm flex items-center gap-1.5 mt-3 sm:mt-0">
            View All Job Postings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {jobs.map((j) => (
            <div
              key={j._id}
              onClick={() => navigate(`/jobs/${j._id}`)}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                    {j.workMode.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {j.employmentType}
                  </span>
                  <span className="text-xs text-slate-400">• {j.location}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors">
                  {j.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {j.businessName}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {j.skills.slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:text-right flex flex-col md:items-end justify-between pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <span className="text-lg font-extrabold text-navy-900">
                  ${(j.salaryMin / 1000).toFixed(0)}k - ${(j.salaryMax / 1000).toFixed(0)}k / yr
                </span>
                <button className="mt-3 px-5 py-2 rounded-xl bg-teal-600 group-hover:bg-teal-700 text-white text-xs font-bold transition-colors">
                  View & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9 & 10. BECOME PARTNER & BECOME TEACHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Become a Business Partner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-navy-800 text-teal-400 flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-navy-900">Become a Business Partner</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Scale your products, professional services, and high-impact hiring pipelines. Upload verification credentials to receive Admin approval and start selling on Business Hub.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Dedicated Business Dashboard & Analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Complete Seller Privacy & Shielded Identities</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Unlimited Job Vacancy Publications</li>
              </ul>
            </div>
            <Link
              to="/register?role=businessman"
              className="w-full py-3 text-center rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-sm shadow-md transition-all"
            >
              Apply as Business Partner
            </Link>
          </div>

          {/* Become a Teacher */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-navy-900">Become an Instructor</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Share your knowledge with ambitious global learners. Host free live classrooms and upload study materials while receiving admin-approved compensation stipends.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Interactive Virtual WebRTC Video Classroom</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Transparent Class Stipend & Compensation Reviews</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 1-on-1 Tuition and Study Materials Publishing</li>
              </ul>
            </div>
            <Link
              to="/register?role=teacher"
              className="w-full py-3 text-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all"
            >
              Apply to Teach
            </Link>
          </div>
        </div>
      </section>

      {/* 11. WHY CHOOSE BUSINESS HUB */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3 py-1 rounded-md border border-teal-800/60">
              Platform Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Why Choose Business Hub?</h2>
            <p className="text-slate-400 text-sm mt-1">Engineered with high standards of security, privacy, and user convenience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Strict Seller Privacy',
                desc: 'Owner names, private phone numbers, and identity documents are never exposed in public product views.',
                icon: ShieldCheck,
              },
              {
                title: '100% Free Learning',
                desc: 'All courses and live classes are accessible to students completely free of cost with zero paywalls.',
                icon: Award,
              },
              {
                title: 'Admin Verification',
                desc: 'Every business and course author undergoes administrative vetting to ensure platform integrity.',
                icon: Lock,
              },
              {
                title: 'No Referral Exploitation',
                desc: 'Simple clean link sharing without pyramid wallet schemes or multi-level commissions.',
                icon: Globe2,
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">Community Feedback</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Trusted by Students & Businesses</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: 'Business Hub allowed us to showcase our developer hardware while protecting our executive privacy. The integrated order workflow is smooth and reliable.',
              name: 'Marcus Vance',
              role: 'Founder, Apex Global Technologies',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            },
            {
              quote: 'Attending high-quality live classes without paying a penny was a game-changer for my web development career. I also landed my first engineering role through the jobs module!',
              name: 'Alex Chen',
              role: 'Student & Junior Developer',
              avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
            },
            {
              quote: 'The teaching dashboard is intuitive, and knowing that the platform covers teacher compensation directly allows me to focus completely on student success.',
              name: 'Prof. David Vance',
              role: 'Senior Instructor',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            },
          ].map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-[11px] font-medium text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">Frequently Asked Questions</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Answers to Common Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div key={index} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-800 hover:text-teal-600 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 14. CONTACT SECTION */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">Contact Business Hub</span>
            <h2 className="text-3xl font-extrabold text-navy-900">Have Questions? Reach Out to Our Team</h2>
            <p className="text-xs sm:text-sm text-slate-500">We are available 24/7 to assist with business onboarding, technical inquiries, and student admissions.</p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
              <h4 className="font-bold text-slate-900">Message Delivered!</h4>
              <p className="text-xs text-slate-600">Thank you for reaching out. A Business Hub support representative will respond shortly.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Business Partnership Inquiry"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist your business or education journey today?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
