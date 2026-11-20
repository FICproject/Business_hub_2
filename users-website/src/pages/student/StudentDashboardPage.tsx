import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  GraduationCap,
  Video,
  Briefcase,
  ShoppingBag,
  Share2,
  Clock,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
} from 'lucide-react';
import { educationApi, jobsApi, marketplaceApi, sharingApi } from '../../services/api';
import { RootState } from '../../store';
import { IOrder, IJobApplication, ISharedLink } from '../../types';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [sharedLinks, setSharedLinks] = useState<ISharedLink[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'applications' | 'orders' | 'links'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      educationApi.getMyEnrollments(),
      jobsApi.getMyApplications(),
      marketplaceApi.getMyOrders(),
      sharingApi.getMySharedLinks(),
    ]).then(([enrRes, appRes, ordRes, shrRes]) => {
      if (enrRes.status === 'fulfilled') setEnrollments(enrRes.value.data.data || []);
      if (appRes.status === 'fulfilled') setApplications(appRes.value.data.data || []);
      if (ordRes.status === 'fulfilled') setOrders(ordRes.value.data.data || []);
      if (shrRes.status === 'fulfilled') setSharedLinks(shrRes.value.data.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-900/60 px-2.5 py-0.5 rounded-md">
            Student & Learner Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.fullName}!</h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Track your free courses, live class schedules, career applications, and marketplace orders.
          </p>
        </div>
        <Link
          to="/education"
          className="px-5 py-2.5 rounded-xl bg-white text-navy-900 font-bold text-xs shadow-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <GraduationCap className="w-4 h-4 text-teal-600" />
          Browse Free Courses
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Enrolled Courses</span>
          <p className="text-2xl font-extrabold text-navy-900">{enrollments.length}</p>
          <p className="text-[11px] font-semibold text-teal-600">100% Free Access</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Applications</span>
          <p className="text-2xl font-extrabold text-navy-900">{applications.length}</p>
          <p className="text-[11px] font-semibold text-slate-500">Active Job Inquiries</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Recent Orders</span>
          <p className="text-2xl font-extrabold text-navy-900">{orders.length}</p>
          <p className="text-[11px] font-semibold text-emerald-600">Marketplace Purchases</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Shared Links</span>
          <p className="text-2xl font-extrabold text-navy-900">{sharedLinks.length}</p>
          <p className="text-[11px] font-semibold text-teal-600">Clean Link Clicks</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'courses', label: `My Courses (${enrollments.length})` },
          { id: 'applications', label: `Job Applications (${applications.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'links', label: `Shared Links (${sharedLinks.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW & COURSES */}
      {(activeTab === 'overview' || activeTab === 'courses') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-navy-900">Enrolled Courses</h3>
            <Link to="/education" className="text-xs font-bold text-teal-600 hover:underline">
              Explore More
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No courses enrolled yet.</p>
              <Link to="/education" className="inline-block text-xs font-bold text-teal-600 hover:underline">
                Explore free masterclasses →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enr) => (
                <div
                  key={enr._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={enr.courseThumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80'}
                      alt="Thumbnail"
                      className="w-20 h-20 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 px-2 py-0.5 rounded-md">
                        100% Free
                      </span>
                      <h4 className="font-bold text-sm text-navy-900 line-clamp-1">{enr.courseTitle}</h4>
                      <p className="text-[11px] text-slate-500">
                        {enr.completedLessons?.length || 0} Lessons Completed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">Course Progress</span>
                      <span className="text-teal-600">{enr.progressPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full transition-all"
                        style={{ width: `${enr.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link
                    to={`/education/courses/${enr.courseId}`}
                    className="w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4" /> Continue Lessons
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. JOB APPLICATIONS */}
      {(activeTab === 'overview' || activeTab === 'applications') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-navy-900">Job Applications</h3>
            <Link to="/jobs" className="text-xs font-bold text-teal-600 hover:underline">
              Find Jobs
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No active job applications.</p>
              <Link to="/jobs" className="text-xs text-teal-600 font-bold hover:underline">
                Explore verified vacancies →
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <div key={app._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-navy-900">{app.jobTitle || 'Software Engineer'}</h4>
                      <p className="text-xs text-slate-500">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                        Status: {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ORDER HISTORY */}
      {(activeTab === 'overview' || activeTab === 'orders') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-navy-900">Order History & Tracking</h3>
            <Link to="/marketplace" className="text-xs font-bold text-teal-600 hover:underline">
              Marketplace
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No orders placed yet.</p>
              <Link to="/marketplace" className="text-xs text-teal-600 font-bold hover:underline">
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord._id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-extrabold text-navy-900">Order #{ord.orderNumber}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.paymentMethod}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700">
                        {ord.orderStatus}
                      </span>
                      <span className="text-sm font-extrabold text-navy-900">${ord.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-50">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{item.quantity}x {item.title}</span>
                        <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. SHARED LINKS */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg text-navy-900">Your Shared Links</h3>
          {sharedLinks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <Share2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No shared links created yet.</p>
              <p className="text-[11px] text-slate-500">Click the Share button on any product or job to create a clean link!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
              {sharedLinks.map((link) => (
                <div key={link._id} className="p-5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-navy-900">{link.title}</p>
                    <p className="text-[11px] font-mono text-teal-600">{link.fullUrl}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-navy-900">{link.clickCount}</span>
                    <span className="text-xs text-slate-400 block">Total Clicks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
