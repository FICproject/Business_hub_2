import React, { useState, useEffect } from 'react';
import { FileBarChart, Users, Building2, Store, ShoppingBag, DollarSign, GraduationCap, UserCheck, Briefcase, Share2, Download, } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import { adminApi } from '../services/api';

export const AdminReportsPage = ({ initialTab = 'overview' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [timeRange, setTimeRange] = useState('30D');
    const [metrics, setMetrics] = useState(null);
    const [salesTrendData, setSalesTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                const res = await adminApi.getMetrics();
                if (res.data?.success) {
                    setMetrics(res.data.metrics);
                    if (res.data.charts?.salesChart) {
                        setSalesTrendData(res.data.charts.salesChart.map((s) => ({
                            name: s.month,
                            orders: s.orders,
                            revenue: s.revenue,
                        })));
                    }
                }
            } catch (err) {
                console.error('Failed to load reports:', err);
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    }, []);

    const reportTabs = [
        { key: 'overview', label: 'Platform Overview', icon: FileBarChart },
        { key: 'users', label: 'User Reports', icon: Users },
        { key: 'businesses', label: 'Business Reports', icon: Building2 },
        { key: 'marketplace', label: 'Marketplace Reports', icon: Store },
        { key: 'orders-sales', label: 'Orders & Sales', icon: ShoppingBag },
        { key: 'revenue', label: 'Revenue Reports', icon: DollarSign },
        { key: 'education', label: 'Education Reports', icon: GraduationCap },
        { key: 'teachers', label: 'Teacher Reports', icon: UserCheck },
        { key: 'jobs', label: 'Jobs Reports', icon: Briefcase },
        { key: 'referrals', label: 'Referral Reports', icon: Share2 },
    ];

    const currentTabObj = reportTabs.find((t) => t.key === activeTab) || reportTabs[0];
    return (<div className="space-y-6 max-w-[1550px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileBarChart className="w-7 h-7 text-indigo-600"/>
            Platform Reports & Executive Intelligence
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Comprehensive audit, financial metrics, and operational performance across all modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
            <Download className="w-3.5 h-3.5 text-indigo-600"/>
            <span>Export CSV</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm">
            <Download className="w-3.5 h-3.5"/>
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Report Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {reportTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100'}`}>
              <Icon className="w-3.5 h-3.5"/>
              <span>{tab.label}</span>
            </button>);
        })}
      </div>

      {/* Active Tab Content Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Detailed Analytics
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-2">{currentTabObj.label}</h2>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
            {['7D', '30D', '90D', '1Y'].map((tab) => (<button key={tab} onClick={() => setTimeRange(tab)} className={`px-3 py-1 rounded-lg transition-all ${timeRange === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                {tab}
              </button>))}
          </div>
        </div>

        {/* 1. Overview */}
        {activeTab === 'overview' && (<div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total GMV</span>
                <p className="text-2xl font-black text-slate-900">₹{metrics?.totalRevenue?.toLocaleString() || '0'}</p>
                <p className="text-xs text-emerald-600 font-bold">Settled Order Volume</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Platform Users</span>
                <p className="text-2xl font-black text-slate-900">{metrics?.totalUsers?.toLocaleString() || '0'}</p>
                <p className="text-xs text-emerald-600 font-bold">Registered Members</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Verified Businesses</span>
                <p className="text-2xl font-black text-slate-900">{metrics?.approvedBusinesses?.toLocaleString() || metrics?.totalBusinesses?.toLocaleString() || '0'}</p>
                <p className="text-xs text-emerald-600 font-bold">{metrics?.pendingApprovals || 0} Pending Verification</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Orders</span>
                <p className="text-2xl font-black text-slate-900">{metrics?.totalOrders?.toLocaleString() || '0'}</p>
                <p className="text-xs text-emerald-600 font-bold">Marketplace Orders</p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9"/>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11}/>
                  <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `₹${val}`}/>
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>)}

        {/* 2. User Reports */}
        {activeTab === 'users' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Breakdown of platform users by role, verification, and engagement.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Students</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalStudents || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Free courses enrolled & active</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Teachers & Faculty</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalTeachers || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Active educators hosting classes</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Registered Businesses</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalBusinesses || 0}</p>
                <p className="text-xs text-slate-500 mt-1">{metrics?.approvedBusinesses || 0} approved & active</p>
              </div>
            </div>
          </div>)}

        {/* 3. Business Reports */}
        {activeTab === 'businesses' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Merchant verification pipeline, document compliance, and active vendor statistics.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100">
                    <th className="pb-3">Metric</th>
                    <th className="pb-3">Count</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Approved Active Enterprises</td>
                    <td className="py-3 font-bold text-slate-900">{metrics?.approvedBusinesses || 0}</td>
                    <td className="py-3 text-emerald-600 font-bold">Compliant</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Pending Verification Review</td>
                    <td className="py-3 font-bold text-slate-900">{metrics?.pendingApprovals || 0}</td>
                    <td className="py-3 text-amber-600 font-bold">Awaiting Admin Action</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Total Registered Enterprises</td>
                    <td className="py-3 font-bold text-slate-900">{metrics?.totalBusinesses || 0}</td>
                    <td className="py-3 text-indigo-600 font-bold">Directory Total</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>)}

        {/* 4. Marketplace Reports */}
        {activeTab === 'marketplace' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Strict Seller Privacy metrics: Total public listings, service items, and catalog hygiene.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Live Products</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.activeProducts || 0}</p>
                <p className="text-xs text-emerald-600 font-medium">Privacy Guaranteed (No PII)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Professional Services</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.activeServices || 0}</p>
                <p className="text-xs text-slate-500">Verified provider offerings</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Total Completed Orders</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalOrders || 0}</p>
                <p className="text-xs text-emerald-600">Direct platform fulfillments</p>
              </div>
            </div>
          </div>)}

        {/* 5. Orders & Sales */}
        {activeTab === 'orders-sales' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Fulfillment statistics, shipping statuses, and order volume distribution.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-700 uppercase">Total Orders Processed</h4>
                <p className="text-xl font-black text-emerald-900 mt-1">{metrics?.totalOrders || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-700 uppercase">Settled Order Volume</h4>
                <p className="text-xl font-black text-blue-900 mt-1">₹{metrics?.totalRevenue || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                <h4 className="text-xs font-bold text-purple-700 uppercase">Active Products in Catalog</h4>
                <p className="text-xl font-black text-purple-900 mt-1">{metrics?.activeProducts || 0}</p>
              </div>
            </div>
          </div>)}

        {/* 6. Revenue Reports */}
        {activeTab === 'revenue' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Platform GMV, payment gateway transaction fees, and net settlement numbers.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Gross Platform GMV</h4>
                <p className="text-2xl font-black text-slate-900 mt-1">₹{metrics?.totalRevenue?.toLocaleString() || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Teacher Disbursed Compensation</h4>
                <p className="text-2xl font-black text-emerald-600 mt-1">₹{metrics?.totalTeacherPaidAmount?.toLocaleString() || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Pending Teacher Stipends</h4>
                <p className="text-2xl font-black text-amber-600 mt-1">{metrics?.pendingTeacherPayments || 0}</p>
              </div>
            </div>
          </div>)}

        {/* 7. Education Reports */}
        {activeTab === 'education' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Course completion metrics, student enrollments, and live class attendance rates.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Total Published Courses</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalCourses || 0}</p>
                <p className="text-xs text-emerald-600">100% Free Access</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Live WebRTC Classes Hosted</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.liveClasses || 0} Sessions</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Total Enrolled Students</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalStudents || 0}</p>
              </div>
            </div>
          </div>)}

        {/* 8. Teacher Reports */}
        {activeTab === 'teachers' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Teacher stipends, live class hours taught, and anti-duplicate payout audit log.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Active Instructors</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalTeachers || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Disbursed Stipends</h4>
                <p className="text-xl font-bold text-emerald-600 mt-1">₹{metrics?.totalTeacherPaidAmount || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Pending Compensation Approvals</h4>
                <p className="text-xl font-bold text-amber-600 mt-1">{metrics?.pendingTeacherPayments || 0} Sessions</p>
              </div>
            </div>
          </div>)}

        {/* 9. Jobs Reports */}
        {activeTab === 'jobs' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Verified employer vacancies, candidate applicant tracking, and placement rates.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Active Vacancies</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalJobs || 0} Positions</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Registered Businesses Hiring</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.approvedBusinesses || 0} Companies</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Job Seekers & Students</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalStudents || 0}</p>
              </div>
            </div>
          </div>)}

        {/* 10. Referral Reports */}
        {activeTab === 'referrals' && (<div className="space-y-4">
            <p className="text-sm text-slate-600">Clean link clicks & shares (Zero MLM / Zero pyramid wallet schemes).</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Service Requests Generated</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalRequests || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Business Connections Created</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalConnections || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Referral Integrity</h4>
                <p className="text-xl font-bold text-emerald-600 mt-1">100% Non-MLM</p>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
};
