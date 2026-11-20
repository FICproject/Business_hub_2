import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  Store,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { adminApi } from '../services/api';
import { IAdminMetrics, IChartData, IBusiness } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<IAdminMetrics | null>(null);
  const [charts, setCharts] = useState<IChartData | null>(null);
  const [pendingBusinesses, setPendingBusinesses] = useState<IBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    adminApi.getMetrics()
      .then((res) => {
        if (res.data.success) {
          setMetrics(res.data.metrics);
          setCharts(res.data.charts);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    adminApi.getBusinesses({ status: 'pending' })
      .then((res) => {
        if (res.data.success) {
          setPendingBusinesses(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickApprove = async (id: string) => {
    try {
      await adminApi.reviewBusiness(id, 'approved');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating business');
    }
  };

  const handleQuickReject = async (id: string) => {
    const reason = prompt('Please enter a rejection reason:', 'Documents submitted were incomplete or invalid.');
    if (!reason) return;
    try {
      await adminApi.reviewBusiness(id, 'rejected', reason);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error rejecting business');
    }
  };

  const COLORS = ['#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-400 bg-teal-950 px-2.5 py-1 rounded-md border border-teal-800/60">
            Platform Master Console
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Executive Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time aggregated health, financial turnover, and compliance metrics.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
          <p className="text-2xl font-extrabold text-white">{metrics?.totalUsers || 6}</p>
          <span className="text-[11px] text-teal-400 font-semibold">{metrics?.totalStudents || 1} Students</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Businesses</span>
          <p className="text-2xl font-extrabold text-white">{metrics?.totalBusinesses || 2}</p>
          <span className="text-[11px] text-amber-400 font-semibold">
            {metrics?.pendingApprovals || 0} Pending Approvals
          </span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Products</span>
          <p className="text-2xl font-extrabold text-white">{metrics?.activeProducts || 4}</p>
          <span className="text-[11px] text-slate-400 font-semibold">Strict Privacy</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Orders</span>
          <p className="text-2xl font-extrabold text-white">{metrics?.totalOrders || 1}</p>
          <span className="text-[11px] text-emerald-400 font-semibold">Settled</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Gross Sales</span>
          <p className="text-2xl font-extrabold text-emerald-400">${metrics?.totalRevenue?.toFixed(0) || '130'}</p>
          <span className="text-[11px] text-slate-400 font-semibold">Platform GMV</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Teacher Stipends</span>
          <p className="text-2xl font-extrabold text-teal-400">${metrics?.totalTeacherPaidAmount?.toFixed(0) || '350'}</p>
          <span className="text-[11px] text-amber-400 font-semibold">{metrics?.pendingTeacherPayments || 1} Pending</span>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">Monthly Sales & Transaction Volume</h3>
            <span className="text-xs font-bold text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-800/40">
              USD ($)
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.salesChart || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" textAnchor="end" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <h3 className="font-extrabold text-base text-white">RBAC Role Distribution</h3>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.roleDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.roleDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Single account architecture with granular RBAC permissions.
          </p>
        </div>
      </div>

      {/* Pending Business Approvals Queue */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-lg text-white">Pending Business Applications</h3>
          </div>
          <Link to="/businesses" className="text-xs font-bold text-teal-400 hover:underline">
            View All Businesses →
          </Link>
        </div>

        {pendingBusinesses.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-300">All business applications reviewed!</p>
            <p>New enterprise submissions will appear here automatically.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {pendingBusinesses.map((b) => (
              <div key={b._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{b.businessName}</h4>
                    <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/40">
                      {b.businessType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Owner: <span className="text-slate-200 font-semibold">{b.ownerName}</span> ({b.ownerEmail})
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{b.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleQuickApprove(b._id)}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition-colors shadow-sm"
                  >
                    Approve Business
                  </button>
                  <button
                    onClick={() => handleQuickReject(b._id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
