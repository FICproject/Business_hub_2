import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Store,
  Briefcase,
  Users,
  Award,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Globe,
  Share2,
  Lock,
  Compass,
} from 'lucide-react';

export const AboutPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const pillars = [
    {
      title: 'Verified Marketplace',
      tagline: 'Authentic Goods & Zero Counterfeits',
      description:
        'A high-security, multi-vendor commercial ecosystem connecting verified sellers and customers. Zero commission scams, transparent pricing, and robust privacy protections for merchants and buyers alike.',
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      link: '/marketplace',
      linkText: 'Explore Marketplace',
    },
    {
      title: '100% Free For Students',
      tagline: 'Zero Tuition Fees Forever',
      description:
        'Education is a fundamental right. We offer verified interactive courses, curriculum materials, lecture downloads, and completion certificates completely free with zero subscription paywalls.',
      icon: GraduationCap,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      link: '/education',
      linkText: 'Browse Free Courses',
    },
    {
      title: 'Empowering Businesses',
      tagline: 'Storefronts, Orders & Recruitment',
      description:
        'Comprehensive business dashboard designed for entrepreneurs. Create customized digital storefronts, manage live inventory, track order fulfillment, and recruit verified talent directly.',
      icon: Store,
      color: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      link: '/business',
      linkText: 'Business Hub Portal',
    },
    {
      title: 'Teacher & Mentor Lounge',
      tagline: 'Live Classrooms & Fair Stipends',
      description:
        'A dedicated workspace for educators. Schedule interactive video classes, upload study notes, track student attendance, and receive institutional teaching stipends without administrative friction.',
      icon: Award,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      link: '/teacher',
      linkText: 'Teacher Portal',
    },
  ];

  const coreValues = [
    {
      title: '100% Free Learning Guarantee',
      desc: 'No hidden subscription traps or paid paywalls. Every lecture, study material, and tuition class is completely free forever.',
      icon: GraduationCap,
    },
    {
      title: 'Strict Seller Privacy Protection',
      desc: 'Seller contact numbers and personal emails are never leaked to public scrapers or third-party marketing brokers.',
      icon: Lock,
    },
    {
      title: 'Clean Link Sharing Without MLM',
      desc: 'Direct, honest link recommendations with transparent click analytics. Zero pyramid commissions, points schemes, or MLM wallets.',
      icon: Share2,
    },
    {
      title: 'Verified Career Opportunities',
      desc: 'Authentic job openings from registered businesses with direct hiring pipelines for qualified graduates and skilled talent.',
      icon: Briefcase,
    },
  ];

  const stats = [
    { label: 'Community Members', value: '50,000+', note: 'Across India & Global' },
    { label: 'Free Certified Courses', value: '100%', note: 'Zero Tuition Guaranteed' },
    { label: 'Verified Businesses', value: '3,800+', note: 'Zero Storefront Fees' },
    { label: 'Certified Educators', value: '1,200+', note: 'Interactive Live Classes' },
  ];

  return (
    <div className="bg-white min-h-screen text-[#0A255C] font-sans pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* =====================================================================
            1. HERO SECTION
        ====================================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-14 lg:p-16 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white shadow-2xl overflow-hidden mb-14">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>About Business Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              One Unified Platform For <br />
              <span className="text-[#FFB800]">Commerce, Education</span> & Careers
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              Business Hub was created to unite key digital needs into one reliable, ethical ecosystem. We empower businesses with zero-fee storefronts, offer students 100% free certified learning, provide teachers with interactive virtual classrooms, and connect job seekers with verified employers — backed by clean, transparent link sharing.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all"
              >
                <span>Join Business Hub Free</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Portals</span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Community</span>
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Ethical & Transparent</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Open Digital Access</span>
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. PLATFORM IMPACT STATS
        ====================================================================== */}
        <section className="mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center hover:bg-amber-50/40 hover:border-amber-200/60 transition-all duration-200"
              >
                <p className="text-3xl sm:text-4xl font-black text-[#0A255C] tracking-tight">{s.value}</p>
                <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">{s.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            3. THE 4 CORE PILLARS
        ====================================================================== */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="w-12 h-1.5 bg-[#FFB800] rounded-full mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A255C]">
              Four Pillars of Our Ecosystem
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Each portal is engineered specifically for the distinct needs of our members, working harmoniously under a single account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border ${pillar.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${pillar.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {pillar.tagline}
                    </span>
                    <h3 className="text-lg font-black text-[#0A255C] mt-1 mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>

                  <Link
                    to={pillar.link}
                    className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0A255C] group-hover:text-amber-600 transition-colors"
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            4. OUR COMMITMENTS & CORE VALUES
        ====================================================================== */}
        <section className="mb-16 bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 sm:p-12 border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A255C] tracking-tight">
              Ethical Foundations &amp; Guarantees
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Unlike traditional platforms driven by predatory ad tracking or hidden paywalls, we are built on transparent rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0A255C] mb-1">{val.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            5. COMMUNITY CALL TO ACTION
        ====================================================================== */}
        <section className="bg-[#0A255C] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFB800] text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Join 50,000+ Members</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to learn, sell, or teach?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create your account in under 60 seconds and experience the unified power of Business Hub with zero subscription fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs text-center shadow-lg transition-all hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center border border-white/20 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
