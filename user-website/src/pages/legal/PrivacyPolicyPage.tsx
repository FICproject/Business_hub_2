import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, EyeOff, UserCheck, Database } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0A255C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-teal-700" />
            <span>Privacy &amp; Data Protection (PRD v1.1)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A255C] tracking-tight">
            Privacy Policy &amp; Seller Protection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Effective Date: November 19, 2026 • Version 1.1
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Data Collection */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">1</span>
              <span>Information Collected &amp; 18+ Verification</span>
            </h2>
            <p>
              We collect user registration data including full name, email address, mobile phone number, date of birth, and password. The date of birth is processed exclusively to verify that the user meets the mandatory 18+ age requirement before granting account access.
            </p>
          </section>

          {/* Section 2: Mandatory Seller Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">2</span>
              <span>Mandatory Marketplace Seller Privacy Rule</span>
            </h2>
            <div className="p-4 bg-teal-50 border border-teal-200/80 rounded-2xl text-teal-900 text-xs leading-relaxed space-y-1">
              <p className="font-bold">Core PRD Mandate:</p>
              <p>
                Public marketplace pages, APIs, and client-side scripts do NOT expose seller personal identities, owner names, personal phone numbers, or private legal details. Public listing responses only convey commercial specifications, product images, stock availability, and price.
              </p>
            </div>
            <p>
              Seller identity and confidential commercial registration files are accessible exclusively to authorized internal administrators and fulfillment systems for dispute resolution and order processing.
            </p>
          </section>

          {/* Section 3: Educational Attendance */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">3</span>
              <span>Educational Attendance &amp; Live Classes</span>
            </h2>
            <p>
              When students join live classes, student attendance counts are logged strictly for educational verification and teacher compensation authorization. Video streams are end-to-end secure, and recording is disabled without prior administrative and participant consent.
            </p>
          </section>

          {/* Section 4: Shared Links & Analytics */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">4</span>
              <span>Clean Link Sharing &amp; Click Attribution</span>
            </h2>
            <p>
              Generated share URLs contain anonymized codes referencing the shared product, course, or job. Link tracking is restricted to aggregate click counters. We do not track invasive cross-site browsing habits or share user contacts with third-party advertising networks.
            </p>
          </section>

          {/* Section 5: Security & Inquiries */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">5</span>
              <span>Data Security &amp; Contact</span>
            </h2>
            <p>
              All traffic is encrypted via TLS/HTTPS, passwords are cryptographically hashed using bcrypt, and database transactions enforce strict access limits. For any privacy requests or inquiries, reach out to our privacy officer via our Help &amp; Support desk.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
