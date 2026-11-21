import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Store,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
  ArrowRight,
  Crown,
  Lock,
  Layers,
  ShoppingBag,
  Users,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { RootState } from '../../store';

export const BusinessDetailsPage: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isBusiness = user?.roles?.some((r) => r === 'businessman' || r === 'entrepreneur');

  return (
    <div className="bg-white min-h-screen text-[#0A255C] font-sans">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto overflow-hidden">
        <div className="bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <Crown className="w-3.5 h-3.5" />
              <span>For Businessmen &amp; Entrepreneurs</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Grow, Sell &amp; Hire on <br />
              <span className="text-[#FFB800]">Business Hub</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              A high-security, multi-vendor commercial ecosystem designed to empower verified businesses. Create digital storefronts, sell products and services with mandatory identity privacy, post jobs, and manage orders with zero commission traps.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {isAuthenticated && isBusiness ? (
                <Link
                  to="/dashboard/business"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all"
                >
                  <span>Go to My Business Dashboard</span>
                  <ArrowRight className="w-4 h-4 font-bold" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register?role=businessman"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all"
                  >
                    <span>Register Business Account</span>
                    <ArrowRight className="w-4 h-4 font-bold" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all"
                  >
                    <span>Sign In to Dashboard</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Capabilities & Features */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="w-12 h-1.5 bg-[#FFB800] rounded-full mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Comprehensive Business Capabilities
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Everything your business needs to scale, trade, and recruit in one seamless dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Product &amp; Service Listings</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Create and manage listings with multiple product variants, images, specifications, stock availability, and customizable pricing models.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-600">
              <BadgeCheck className="w-4 h-4" />
              <span>Catalog Management</span>
            </div>
          </div>

          {/* Feature 2: Seller Privacy */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Mandatory Identity Privacy</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Strict PRD-compliant protection. Your personal identity, owner names, and residential contacts are never exposed on public marketplace pages or APIs.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-teal-600">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Privacy Protected</span>
            </div>
          </div>

          {/* Feature 3: Job Recruitment */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Job Board &amp; Talent Hiring</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Only approved businesses can publish job listings. Receive candidate resumes, review qualifications, track applicant status, and hire top talent.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-600">
              <Users className="w-4 h-4" />
              <span>Direct Recruitment</span>
            </div>
          </div>

          {/* Feature 4: Order Fulfillment */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Order &amp; Fulfillment Tracking</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Manage incoming customer orders in real time. Update fulfillment states from Pending and Confirmed through to Shipped and Delivered.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
              <ShoppingBag className="w-4 h-4" />
              <span>Live Order Tracking</span>
            </div>
          </div>

          {/* Feature 5: Sales Analytics */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Turnover &amp; Revenue Metrics</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Comprehensive analytics on total revenue turnover, top-selling inventory, order volumes, customer feedback, and listing views.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-purple-600">
              <Layers className="w-4 h-4" />
              <span>Business Intelligence</span>
            </div>
          </div>

          {/* Feature 6: Clean Link Sharing */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Clean Sharing &amp; Promo</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Generate privacy-safe shareable links for your products and jobs with built-in click attribution. Zero scam wallets or MLM pyramid structures.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-rose-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ethical Promotion</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4-Step Onboarding Process (PRD Section 5) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto bg-slate-50/70 rounded-3xl border border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How Business Verification Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Strict verification ensures only legitimate, approved businesses operate on Business Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
              1
            </div>
            <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Sign Up (18+)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Register as Businessman or Entrepreneur. Date of birth is validated to ensure 18+ eligibility.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
              2
            </div>
            <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Submit Documents</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provide business name, commercial registry, trade license, and proof of legal identity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
              3
            </div>
            <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Admin Review</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our central compliance administrators verify and audit your submitted business documentation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#FFB800] text-slate-950 flex items-center justify-center font-bold text-xs mb-4">
              4
            </div>
            <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Start Trading &amp; Hiring</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upon approval, product publishing, service management, and job postings are unlocked!
            </p>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-[#0A255C] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to take your business to the next level?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Create your business profile today and begin reaching thousands of customers and job seekers.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/register?role=businessman"
              className="px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-lg hover:scale-105 transition-all"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
