import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Headphones,
} from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const contactChannels = [
    {
      title: 'Email Support',
      desc: 'Direct email inquiries for support, accounts, or order queries.',
      detail: 'support@businesshub.com',
      icon: Mail,
      badge: '24/7 Response',
      action: 'mailto:support@businesshub.com',
      actionText: 'Send Email',
    },
    {
      title: 'Community Lounge',
      desc: 'Ask questions and interact with our student and educator network.',
      detail: '50,000+ Active Members',
      icon: MessageSquare,
      badge: 'Interactive',
      action: '/community',
      actionText: 'Visit Community',
      isInternal: true,
    },
    {
      title: 'Business & Merchant Hub',
      desc: 'Direct technical onboarding and storefront verification assistance.',
      detail: 'merchants@businesshub.com',
      icon: Headphones,
      badge: 'Priority Desk',
      action: 'mailto:merchants@businesshub.com',
      actionText: 'Merchant Support',
    },
    {
      title: 'Headquarters',
      desc: 'Registered operational campus and regional technological offices.',
      detail: 'Bangalore, Karnataka, India',
      icon: MapPin,
      badge: 'HQ Office',
      action: null,
      actionText: null,
    },
  ];

  const faqs = [
    {
      q: 'Is learning on Business Hub really 100% free?',
      a: 'Yes! Every course, downloadable lecture material, live classroom session, and certificate on Business Hub is 100% free with zero tuition fees or subscription fees forever.',
    },
    {
      q: 'How do businesses register and sell without commission fees?',
      a: 'Businesses can sign up for a Businessman / Entrepreneur account, verify their commercial details, and list products in the marketplace with zero storefront fees and direct customer payments.',
    },
    {
      q: 'How does link sharing work without MLM wallets?',
      a: 'Business Hub utilizes clean, direct link sharing with transparent click analytics. There are no multi-level marketing pyramid structures, forced referral chains, or locked commission wallets.',
    },
    {
      q: 'How can teachers host live classes and receive stipends?',
      a: 'Teachers can apply with their credentials, access the Teacher Workspace to schedule interactive sessions and share study materials, and manage student attendance transparently.',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-[#0A255C] font-sans pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb currentPage="Contact & Support" category="Help" />

        {/* =====================================================================
            1. HERO
        ====================================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white shadow-2xl overflow-hidden mb-12">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>24/7 Dedicated Support</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
              We're Here to Help <br />
              <span className="text-[#FFB800]">Reach Out to Our Team</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Whether you need assistance with free course enrollments, seller onboarding, marketplace orders, or general platform inquiries, our dedicated support team is ready to help you.
            </p>
          </div>
        </section>

        {/* =====================================================================
            2. CONTACT CHANNELS GRID
        ====================================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactChannels.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-full">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#0A255C] mb-1">{c.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{c.desc}</p>
                  <p className="text-xs font-bold text-slate-800 break-all">{c.detail}</p>
                </div>

                {c.action && (
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    {c.isInternal ? (
                      <Link
                        to={c.action}
                        className="text-xs font-bold text-[#0A255C] hover:text-amber-600 transition-colors inline-flex items-center gap-1"
                      >
                        <span>{c.actionText}</span>
                        <span>→</span>
                      </Link>
                    ) : (
                      <a
                        href={c.action}
                        className="text-xs font-bold text-[#0A255C] hover:text-amber-600 transition-colors inline-flex items-center gap-1"
                      >
                        <span>{c.actionText}</span>
                        <span>→</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* =====================================================================
            3. INTERACTIVE CONTACT FORM & FAQ
        ====================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Send a Message
              </span>
              <h2 className="text-2xl font-black text-[#0A255C] mt-1">Get in Touch Directly</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the details below and our team will get back to you within 2-4 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you for contacting Business Hub. Our team has received your ticket and will respond to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', category: 'general', subject: '', message: '' });
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Chen"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A255C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A255C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A255C] bg-white"
                    >
                      <option value="general">General Inquiries</option>
                      <option value="student">Student &amp; Free Courses</option>
                      <option value="business">Business &amp; Seller Support</option>
                      <option value="teacher">Teacher &amp; Classroom Portal</option>
                      <option value="jobs">Careers &amp; Job Applications</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief topic summary..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A255C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry or question in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A255C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0A255C] hover:bg-[#071B42] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-[#0A255C]">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-4 py-3 text-left text-xs font-bold text-[#0A255C] flex items-center justify-between gap-2"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
