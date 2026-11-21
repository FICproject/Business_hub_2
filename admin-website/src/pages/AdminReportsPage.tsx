import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  Users,
  Building2,
  Store,
  ShoppingBag,
  DollarSign,
  GraduationCap,
  UserCheck,
  Briefcase,
  Share2,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export type ReportCategory =
  | 'overview'
  | 'users'
  | 'businesses'
  | 'marketplace'
  | 'orders-sales'
  | 'revenue'
  | 'education'
  | 'teachers'
  | 'jobs'
  | 'referrals';

interface AdminReportsPageProps {
  initialTab?: ReportCategory;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<ReportCategory>(initialTab);
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const reportTabs = [
    { key: 'overview' as ReportCategory, label: 'Platform Overview', icon: FileBarChart },
    { key: 'users' as ReportCategory, label: 'User Reports', icon: Users },
    { key: 'businesses' as ReportCategory, label: 'Business Reports', icon: Building2 },
    { key: 'marketplace' as ReportCategory, label: 'Marketplace Reports', icon: Store },
    { key: 'orders-sales' as ReportCategory, label: 'Orders & Sales', icon: ShoppingBag },
    { key: 'revenue' as ReportCategory, label: 'Revenue Reports', icon: DollarSign },
    { key: 'education' as ReportCategory, label: 'Education Reports', icon: GraduationCap },
    { key: 'teachers' as ReportCategory, label: 'Teacher Reports', icon: UserCheck },
    { key: 'jobs' as ReportCategory, label: 'Jobs Reports', icon: Briefcase },
    { key: 'referrals' as ReportCategory, label: 'Referral Reports', icon: Share2 },
  ];

  const salesTrendData = [
    { name: 'Week 1', orders: 1240, revenue: 450000 },
    { name: 'Week 2', orders: 1980, revenue: 780000 },
    { name: 'Week 3', orders: 2450, revenue: 1120000 },
    { name: 'Week 4', orders: 3100, revenue: 1650000 },
  ];

  const currentTabObj = reportTabs.find((t) => t.key === activeTab) || reportTabs[0];

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileBarChart className="w-7 h-7 text-indigo-600" />
            Platform Reports & Executive Intelligence
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Comprehensive audit, financial metrics, and operational performance across all modules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm">
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Report Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
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
            {(['7D', '30D', '90D', '1Y'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeRange(tab)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total GMV</span>
                <p className="text-2xl font-black text-slate-900">₹48,75,230</p>
                <p className="text-xs text-emerald-600 font-bold">↑ 18.6% vs previous cycle</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Platform Users</span>
                <p className="text-2xl font-black text-slate-900">125,430</p>
                <p className="text-xs text-emerald-600 font-bold">↑ 12.5% new registrations</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Verified Businesses</span>
                <p className="text-2xl font-black text-slate-900">24,870</p>
                <p className="text-xs text-emerald-600 font-bold">↑ 8.3% merchant growth</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Fulfilled Orders</span>
                <p className="text-2xl font-black text-slate-900">89,340</p>
                <p className="text-xs text-emerald-600 font-bold">↑ 14.2% completion rate</p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2. User Reports */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Breakdown of platform users by role, verification, and engagement.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Students</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">52,680 (42%)</p>
                <p className="text-xs text-slate-500 mt-1">Free courses enrolled & active</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Professionals & Job Seekers</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">43,900 (35%)</p>
                <p className="text-xs text-slate-500 mt-1">Active job applications submitted</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Registered Businesses</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">28,850 (23%)</p>
                <p className="text-xs text-slate-500 mt-1">Verified vendor catalogs</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Business Reports */}
        {activeTab === 'businesses' && (
          <div className="space-y-4">
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
                    <td className="py-3 font-bold text-slate-900">24,870</td>
                    <td className="py-3 text-emerald-600 font-bold">Compliant</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Pending Verification Review</td>
                    <td className="py-3 font-bold text-slate-900">142</td>
                    <td className="py-3 text-amber-600 font-bold">Awaiting Admin Action</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-800">Rejected / Incomplete Documentation</td>
                    <td className="py-3 font-bold text-slate-900">38</td>
                    <td className="py-3 text-rose-600 font-bold">Requires Resubmission</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Marketplace Reports */}
        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Strict Seller Privacy metrics: Total public listings, service items, and catalog hygiene.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Live Products</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">18,450</p>
                <p className="text-xs text-emerald-600 font-medium">Privacy Guaranteed (No PII)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Professional Services</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">6,420</p>
                <p className="text-xs text-slate-500">Verified provider offerings</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Cart Abandonment Rate</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">18.4%</p>
                <p className="text-xs text-emerald-600">Industry leading checkout conversion</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. Orders & Sales */}
        {activeTab === 'orders-sales' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Fulfillment statistics, shipping statuses, and order volume distribution.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-700 uppercase">Delivered Orders</h4>
                <p className="text-xl font-black text-emerald-900 mt-1">78,210</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-700 uppercase">In Transit</h4>
                <p className="text-xl font-black text-blue-900 mt-1">6,480</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                <h4 className="text-xs font-bold text-amber-700 uppercase">Processing / Packaging</h4>
                <p className="text-xl font-black text-amber-900 mt-1">3,890</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
                <h4 className="text-xs font-bold text-rose-700 uppercase">Returns & Refunds</h4>
                <p className="text-xl font-black text-rose-900 mt-1">760</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. Revenue Reports */}
        {activeTab === 'revenue' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Platform GMV, payment gateway transaction fees, and net settlement numbers.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Gross Platform GMV</h4>
                <p className="text-2xl font-black text-slate-900 mt-1">₹48,75,230</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Settled to Vendors</h4>
                <p className="text-2xl font-black text-emerald-600 mt-1">₹42,90,200</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Platform Take Rate & Reserves</h4>
                <p className="text-2xl font-black text-indigo-600 mt-1">₹5,85,030</p>
              </div>
            </div>
          </div>
        )}

        {/* 7. Education Reports */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Course completion metrics, student enrollments, and live class attendance rates.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Course Enrollments</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">34,500+</p>
                <p className="text-xs text-emerald-600">100% Free Access</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">WebRTC Class Hours Hosted</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">1,240 Hours</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Study Notes Downloads</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">45,800 Files</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. Teacher Reports */}
        {activeTab === 'teachers' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Teacher stipends, live class hours taught, and anti-duplicate payout audit log.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Active Instructors</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">185</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Disbursed Stipends</h4>
                <p className="text-xl font-bold text-emerald-600 mt-1">₹8,45,000</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Pending Compensation Approvals</h4>
                <p className="text-xl font-bold text-amber-600 mt-1">12 Sessions</p>
              </div>
            </div>
          </div>
        )}

        {/* 9. Jobs Reports */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Verified employer vacancies, candidate applicant tracking, and placement rates.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Active Vacancies</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">1,890 Positions</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Applications Processed</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">28,400</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Verified Hiring Employers</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">420 Companies</p>
              </div>
            </div>
          </div>
        )}

        {/* 10. Referral Reports */}
        {activeTab === 'referrals' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Clean link clicks & shares (Zero MLM / Zero pyramid wallet schemes).</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Clean Links Generated</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">94,300 Links</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Total Click Traffic</h4>
                <p className="text-xl font-bold text-slate-900 mt-1">380,200 Clicks</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Referral Integrity</h4>
                <p className="text-xl font-bold text-emerald-600 mt-1">100% Non-MLM</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
