import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-[#0A255C] text-xs font-bold">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Platform Policy Baseline (PRD v1.1)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A255C] tracking-tight">
            Terms &amp; Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Effective Date: November 19, 2026 • Version 1.1
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Age Gate */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">1</span>
              <span>Strict 18+ Age Gate &amp; Eligibility</span>
            </h2>
            <p>
              In accordance with Business Hub PRD Section 4, <strong>all registered users must be at least 18 years of age</strong>. The platform validates the date of birth at registration. Any attempt to provide fraudulent age data or bypass this gate will result in immediate account termination.
            </p>
          </section>

          {/* Section 2: Business Onboarding & Approval */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">2</span>
              <span>Business Onboarding, Verification &amp; Publishing</span>
            </h2>
            <p>
              Businessmen and entrepreneurs must complete a formal business verification process. Accounts in <strong>Draft, Pending, Rejected, Suspended, or Blocked</strong> status are strictly prohibited from publishing marketplace items or posting jobs. Publishing privileges are only enabled after administrative review and approval.
            </p>
          </section>

          {/* Section 3: Seller Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">3</span>
              <span>Mandatory Marketplace Seller Identity Privacy</span>
            </h2>
            <p>
              To protect commercial privacy, public product and service pages do not disclose personal seller profiles, owner identities, private phone numbers, or residential addresses. Public marketplace APIs only transmit product specifications, price, availability, and fulfillment terms necessary to make a purchase decision.
            </p>
          </section>

          {/* Section 4: 100% Free Education */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">4</span>
              <span>100% Free Education &amp; Live Classes Guarantee</span>
            </h2>
            <p>
              All courses, video lessons, PDF materials, and scheduled interactive live classrooms are <strong>completely free for all students to attend and access</strong>. Charging students for live class attendance is prohibited.
            </p>
          </section>

          {/* Section 5: Teacher Compensation */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">5</span>
              <span>Platform-Funded Teacher Compensation</span>
            </h2>
            <p>
              Approved teachers receive stipends determined and managed centrally by platform administrators upon verification of completed live classes and attendance evidence. Duplicate payouts for the same live session are blocked by system safeguards.
            </p>
          </section>

          {/* Section 6: Zero-Commission Referral Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">6</span>
              <span>Clean Link Sharing Policy (No MLM or Commissions)</span>
            </h2>
            <p>
              Business Hub provides clean URL generation for sharing products, courses, and jobs. This is strictly a content sharing utility. The platform <strong>does not calculate, accrue, or pay referral commissions, multi-level marketing (MLM) incentives, or wallet rewards</strong>.
            </p>
          </section>

          {/* Section 7: Auditability & Security */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0A255C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-extrabold">7</span>
              <span>Audit Logging &amp; Administration</span>
            </h2>
            <p>
              All sensitive administrative actions, business verification approvals, content deletions, and financial compensation disbursements are permanently recorded in system audit logs to ensure security, compliance, and dispute resolution.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
