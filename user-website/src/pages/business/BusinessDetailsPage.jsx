import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Store, ShieldCheck, Briefcase, TrendingUp, PackageCheck, CheckCircle2, ArrowRight, Crown, Lock, Layers, ShoppingBag, Users, FileText, BadgeCheck, DollarSign, Check, } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
export const BusinessDetailsPage = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const isBusiness = user?.roles?.some((r) => r === 'businessman' || r === 'entrepreneur');
    return (<div className="bg-white min-h-screen text-[#0A255C] font-sans pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb currentPage="Business"/>

        {/* =====================================================================
            1. BUSINESS GROWTH HERO SECTION
        ====================================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white shadow-2xl overflow-hidden mb-12">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"/>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <Crown className="w-3.5 h-3.5"/>
              <span>For Businessmen &amp; Entrepreneurs</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Scale Your Commerce, Sell <br />
              <span className="text-[#FFB800]">Online &amp; Hire Top Talent</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              A high-security, multi-vendor commercial ecosystem designed to empower verified businesses. Create digital storefronts, sell products and services with mandatory identity privacy, post jobs, and manage orders with zero commission traps.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {isAuthenticated && isBusiness ? (<Link to="/dashboard/business" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all">
                  <span>Go to My Business Dashboard</span>
                  <ArrowRight className="w-4 h-4 font-bold"/>
                </Link>) : (<>
                  <Link to="/register?role=business" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all">
                    <span>Register Your Business</span>
                    <ArrowRight className="w-4 h-4 font-bold"/>
                  </Link>
                  <Link to="/login" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all">
                    <span>Sign In to Dashboard</span>
                  </Link>
                </>)}
            </div>

            {/* Trust points */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400"/>
                <span>Strict Identity Privacy</span>
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400"/>
                <span>Zero Commission Scams</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-400"/>
                <span>Verified Direct Recruitment</span>
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. BUSINESS BENEFITS
        ====================================================================== */}
        <section className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="w-12 h-1.5 bg-[#FFB800] rounded-full mx-auto"/>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A255C]">
              Comprehensive Business Benefits
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Everything your enterprise needs to trade securely, manage orders, and hire qualified talent in one integrated dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Store className="w-6 h-6"/>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C]">Product &amp; Service Listings</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Create and manage commercial listings with multiple product variants, images, specifications, stock availability, and customizable pricing models.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-600">
                <BadgeCheck className="w-4 h-4"/>
                <span>Catalog Management</span>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Lock className="w-6 h-6"/>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C]">Mandatory Identity Privacy</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Strict enterprise privacy protection. Your personal identity, owner names, and residential contacts are never exposed on public marketplace pages or APIs.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-teal-600">
                <ShieldCheck className="w-4 h-4"/>
                <span>100% Privacy Protected</span>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Briefcase className="w-6 h-6"/>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C]">Job Board &amp; Talent Hiring</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Only approved businesses can publish job listings. Receive candidate resumes, review qualifications, track applicant status, and hire top talent.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-600">
                <Users className="w-4 h-4"/>
                <span>Direct Recruitment</span>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <PackageCheck className="w-6 h-6"/>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C]">Order &amp; Fulfillment Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Manage incoming customer orders in real time. Update fulfillment states from Pending and Confirmed through to Shipped and Delivered.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <ShoppingBag className="w-4 h-4"/>
                <span>Live Order Tracking</span>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <TrendingUp className="w-6 h-6"/>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C]">Turnover &amp; Revenue Metrics</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Comprehensive analytics on total revenue turnover, top-selling inventory, order volumes, customer feedback, and listing views.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-purple-600">
                <Layers className="w-4 h-4"/>
                <span>Business Intelligence</span>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <FileText className="w-6 h-6"/>
              </div>
              <h3 className="text-lg font-extrabold text-[#0A255C]">Clean Sharing &amp; Promo</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generate privacy-safe shareable links for your products and jobs with built-in click attribution. Zero scam wallets or MLM pyramid structures.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-rose-600">
                <CheckCircle2 className="w-4 h-4"/>
                <span>Ethical Promotion</span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. PRODUCT & SERVICE SELLING INFORMATION
        ====================================================================== */}
        <section className="mb-14 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Selling on Business Hub
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A255C] leading-tight">
                How Merchants Publish Products and Offer Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you sell physical electronics, corporate workstations, or professional consulting services, our merchant suite handles listing, variant pricing, order statuses, and direct customer communication.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5"/>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A255C]">Multi-Variant Product Listings</h4>
                    <p className="text-xs text-slate-500">Add multiple high-resolution photos, color and specification variants, and inventory tracking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5"/>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A255C]">Flexible Service Pricing Models</h4>
                    <p className="text-xs text-slate-500">Offer hourly, fixed-project, or recurring retainer packages with clearly documented turnaround times.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5"/>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A255C]">Direct Order Dispatch &amp; Tracking</h4>
                    <p className="text-xs text-slate-500">Update shipments with carrier tracking numbers and provide customers with live real-time status.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-5">
              <h3 className="text-lg font-extrabold text-[#0A255C]">Merchant Protection Highlights</h3>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Platform Transaction Fee</span>
                  <span className="font-extrabold text-emerald-600">0% Commission</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Identity Privacy Exposure</span>
                  <span className="font-extrabold text-teal-600">100% Redacted</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Candidate Recruitment</span>
                  <span className="font-extrabold text-[#0A255C]">Direct In-App Applications</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Payout Cycles</span>
                  <span className="font-extrabold text-slate-900">Instant Direct Settlement</span>
                </div>
              </div>

              <Link to="/register?role=business" className="w-full py-3.5 rounded-2xl bg-[#0A255C] hover:bg-[#071B42] text-white text-xs font-bold text-center block transition-all shadow-md">
                Apply for Merchant Verification
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================================
            4. BUSINESS ONBOARDING STEPS
        ====================================================================== */}
        <section className="mb-14 bg-slate-50/70 rounded-3xl p-8 sm:p-12 border border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A255C]">
              4-Step Business Onboarding Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Strict compliance ensures only legitimate, approved businesses operate on Business Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
                1
              </div>
              <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Sign Up (18+)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register as Businessman or Entrepreneur. Date of birth is validated to ensure 18+ legal eligibility.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
                2
              </div>
              <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Submit Documents</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide business trade name, commercial registry, tax identifiers, and proof of operational authority.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
                3
              </div>
              <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Compliance Audit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our central compliance administration verifies and audits your documentation within 24-48 business hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#FFB800] text-slate-950 flex items-center justify-center font-bold text-xs mb-4">
                4
              </div>
              <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Start Trading &amp; Hiring</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upon approval, product publishing, service management, and corporate job postings are unlocked!
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. BOTTOM BUSINESS REGISTRATION CTA
        ====================================================================== */}
        <section className="bg-[#0A255C] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to take your business to the next level?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Create your business profile today and begin reaching thousands of customers and job seekers.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/register?role=business" className="px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-lg hover:scale-105 transition-all">
              Register Your Business Now
            </Link>
          </div>
        </section>
      </div>
    </div>);
};
