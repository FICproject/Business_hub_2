import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GraduationCap, Video, FileText, DollarSign, Users, CheckCircle2, ArrowRight, ShieldCheck, BookOpen, Calendar, Sparkles, Award, } from 'lucide-react';
export const TeacherDetailsPage = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const isTeacher = user?.roles?.some((r) => r === 'teacher');
    return (<div className="bg-white min-h-screen text-[#0A255C] font-sans">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto overflow-hidden">
        <div className="bg-gradient-to-br from-[#071536] via-[#0F284E] to-[#0A4D68] text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"/>

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00E5FF] text-xs font-bold tracking-wide">
              <GraduationCap className="w-3.5 h-3.5"/>
              <span>For Educators, Mentors &amp; Instructors</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Teach, Inspire &amp; Earn with <br />
              <span className="text-[#FFB800]">Business Hub</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              Deliver 100% free live classes and courses to students worldwide while receiving guaranteed, platform-funded compensation approved and managed by central administrators.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {isAuthenticated && isTeacher ? (<Link to="/dashboard/teacher" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all">
                  <span>Go to My Teacher Dashboard</span>
                  <ArrowRight className="w-4 h-4 font-bold"/>
                </Link>) : (<>
                  <Link to="/register?role=teacher" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-sm shadow-xl hover:scale-105 transition-all">
                    <span>Apply as a Teacher</span>
                    <ArrowRight className="w-4 h-4 font-bold"/>
                  </Link>
                  <Link to="/education/live-classes" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all">
                    <span>Explore Live Classes</span>
                  </Link>
                </>)}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Capabilities Breakdown (PRD Section 7 & 8) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="w-12 h-1.5 bg-[#FFB800] rounded-full mx-auto"/>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How Teaching Works on Business Hub
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            A sustainable, platform-backed model combining zero-cost education for students with fair compensation for teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Capability 1: Free Live Classes */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Video className="w-6 h-6"/>
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Host Free Live Classes</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Schedule interactive video classes with real-time video, attendance tracking, and student questions. Classes are 100% free for students to attend.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-teal-600">
              <Sparkles className="w-4 h-4"/>
              <span>Interactive Classrooms</span>
            </div>
          </div>

          {/* Capability 2: Guaranteed Compensation */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6"/>
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Platform-Funded Compensation</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Administrators review your completed live sessions and approve a per-class payment amount directly to your teacher earnings history.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-600">
              <ShieldCheck className="w-4 h-4"/>
              <span>Reliable Admin Payouts</span>
            </div>
          </div>

          {/* Capability 3: Free Courses */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6"/>
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Publish Structured Courses</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Create modular courses with video lessons, reading material, downloadable resources, and track student completion rates.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-600">
              <Award className="w-4 h-4"/>
              <span>Course Authoring</span>
            </div>
          </div>

          {/* Capability 4: Study Notes & PDFs */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FileText className="w-6 h-6"/>
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Upload Study Notes &amp; PDFs</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Distribute high-yield PDF notes, cheat sheets, and practice exams organized by subject, topic, and academic level.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-purple-600">
              <CheckCircle2 className="w-4 h-4"/>
              <span>Curriculum Materials</span>
            </div>
          </div>

          {/* Capability 5: Flexible Tuition */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-6 h-6"/>
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Tuition &amp; Mentorship</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Offer tailored 1-on-1 tutoring sessions or small cohort workshops with customizable scheduling and learner management.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
              <Users className="w-4 h-4"/>
              <span>Mentorship Programs</span>
            </div>
          </div>

          {/* Capability 6: Community Impact */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <GraduationCap className="w-6 h-6"/>
            </div>
            <h3 className="text-lg font-extrabold text-[#0A255C]">Empower 50,000+ Students</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bridge the educational divide by making certified skills accessible to eager students across all backgrounds and demographics.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-rose-600">
              <Sparkles className="w-4 h-4"/>
              <span>Social Impact</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4-Step Teacher Journey */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto bg-slate-50/70 rounded-3xl border border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            The Teacher Onboarding Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            From initial registration to holding live classes and receiving admin payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
              1
            </div>
            <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Sign Up as Teacher (18+)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create your account with date of birth validation and select the Teacher profile category.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
              2
            </div>
            <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Admin Authorization</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Administrators review your credentials and authorize teacher publishing privileges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#0A255C] text-white flex items-center justify-center font-bold text-xs mb-4">
              3
            </div>
            <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Schedule &amp; Teach</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Publish free courses, upload PDF notes, and schedule free live streaming classrooms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-8 h-8 rounded-full bg-[#FFB800] text-slate-950 flex items-center justify-center font-bold text-xs mb-4">
              4
            </div>
            <h4 className="font-extrabold text-sm text-[#0A255C] mb-1.5">Earn Admin Stipends</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Admin reviews completed class attendance and sets fair, platform-funded compensation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-gradient-to-r from-[#071536] via-[#0A4D68] to-[#088395] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to share your knowledge with the world?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Join Business Hub today and empower thousands of students with free certified learning.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/register?role=teacher" className="px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-lg hover:scale-105 transition-all">
              Apply as a Teacher
            </Link>
          </div>
        </div>
      </section>
    </div>);
};
