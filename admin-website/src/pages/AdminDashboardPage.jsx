import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, ShoppingCart, TrendingUp, ArrowRight, UserPlus, Building2, GraduationCap, Store, Clock, Bell, Zap, FileText, Handshake, CheckCircle2, AlertCircle, Sparkles, } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, } from 'recharts';
import { adminApi } from '../services/api';

export const AdminDashboardPage = () => {
    const [timeRange, setTimeRange] = useState('30D');
    const [liveMetrics, setLiveMetrics] = useState(null);
    const [recentRequests, setRecentRequests] = useState([]);
    const [recentConnections, setRecentConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [userDistributionData, setUserDistributionData] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const [metricsRes, pendingRes, businessesRes, logsRes] = await Promise.all([
                    adminApi.getMetrics(),
                    adminApi.getPendingDocumentApplicants().catch(() => ({ data: { data: [] } })),
                    adminApi.getBusinesses({ status: 'pending' }).catch(() => ({ data: { data: [] } })),
                    adminApi.getAuditLogs().catch(() => ({ data: { data: [] } })),
                ]);

                if (metricsRes.data?.success) {
                    const m = metricsRes.data.metrics;
                    setLiveMetrics(m);
                    setRecentRequests(metricsRes.data.recentRequests || []);
                    setRecentConnections(metricsRes.data.recentConnections || []);

                    // Dynamic charts from backend
                    if (metricsRes.data.charts?.salesChart) {
                        setAnalyticsData(metricsRes.data.charts.salesChart.map((s) => ({
                            name: s.month,
                            users: Math.round(s.orders * 1.5),
                            orders: s.orders,
                            revenue: Math.round(s.revenue / 100),
                        })));
                    }

                    if (metricsRes.data.charts?.roleDistribution) {
                        const total = m.totalUsers || 1;
                        const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];
                        setUserDistributionData(metricsRes.data.charts.roleDistribution.map((r, i) => ({
                            name: r.name,
                            value: r.value,
                            color: colors[i % colors.length],
                            percent: `${Math.round((r.value / total) * 100)}%`,
                        })));
                    }
                }

                // Construct real pending approvals list from pending businesses and applicants
                const realPending = [];
                const pendingBiz = businessesRes.data?.data || [];
                pendingBiz.slice(0, 5).forEach((b) => {
                    realPending.push({
                        id: b._id,
                        type: 'Business',
                        icon: Store,
                        iconBg: 'bg-rose-50 text-rose-500',
                        name: b.businessName,
                        details: `${b.businessType || 'Enterprise'} • ${b.email || 'Pending review'}`,
                    });
                });

                const pendingDocs = pendingRes.data?.data || [];
                pendingDocs.slice(0, 5).forEach((item) => {
                    if (!realPending.some((p) => p.id === item.user?._id)) {
                        realPending.push({
                            id: item.user?._id,
                            type: item.user?.roles?.[0] ? item.user.roles[0].charAt(0).toUpperCase() + item.user.roles[0].slice(1) : 'Applicant',
                            icon: GraduationCap,
                            iconBg: 'bg-indigo-50 text-indigo-500',
                            name: item.user?.fullName,
                            details: `Docs: ${item.verification?.summary?.verifiedMandatory || 0}/${item.verification?.summary?.totalMandatory || 0} verified`,
                        });
                    }
                });
                setPendingApprovals(realPending);

                // Construct real activities from audit logs
                const logs = logsRes.data?.data || [];
                if (logs.length > 0) {
                    setRecentActivities(logs.slice(0, 5).map((l) => ({
                        id: l._id,
                        text: `${l.action.replace(/_/g, ' ').toLowerCase()}:`,
                        highlight: l.details || l.targetType,
                        time: new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    })));
                }
            } catch (err) {
                console.error('Failed to fetch dashboard metrics:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // Dynamic time-based greeting & icon
    const getGreetingData = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return { text: 'Good Morning, Admin!', emoji: '👋' };
        }
        else if (hour >= 12 && hour < 17) {
            return { text: 'Good Afternoon, Admin!', emoji: '☀️' };
        }
        else if (hour >= 17 && hour < 21) {
            return { text: 'Good Evening, Admin!', emoji: '🌆' };
        }
        else {
            return { text: 'Good Night, Admin!', emoji: '🌙' };
        }
    };
    const greeting = getGreetingData();

    const handleAction = async (item) => {
        if (item.type === 'Business') {
            await adminApi.reviewBusiness(item.id, 'approved', '');
        }
        setPendingApprovals((prev) => prev.filter((p) => p.id !== item.id));
    };
    return (<div className="space-y-5 max-w-[1600px] mx-auto pb-6">
      {/* 1. Hero Banner: Ultra High-Definition 3D Render with seamless integration */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#0E0628] text-white min-h-[175px] lg:min-h-[195px] px-8 sm:px-10 py-6 flex items-center justify-between shadow-sm">
        {/* Full-width High-Definition 3D Illustration Background & Right Alignment */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img 
            src="/assets/saas-hero-rocket-laptop.png" 
            alt="Business Hub Dashboard 3D Render" 
            className="w-full h-full object-cover object-right"
          />
          {/* Subtle gradient overlay on the left to guarantee optimal text contrast */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-[58%] md:w-[45%] bg-gradient-to-r from-[#0E0628] via-[#0E0628]/80 to-transparent" />
        </div>

        {/* Left text contents */}
        <div className="relative z-10 max-w-lg space-y-2.5">
          <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight flex items-center gap-2">
            {greeting.text} <span className="inline-block text-2xl">{greeting.emoji}</span>
          </h1>
          <p className="text-[14px] sm:text-[15px] text-purple-100/90 font-normal">
            Here's what's happening with your Business Hub today.
          </p>
          <div className="pt-2">
            <Link to="/reports" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-[13px] hover:bg-slate-50 transition-all shadow-md active:scale-95">
              <span>View Reports</span>
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Four Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <Link to="/users" className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Users className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">Total Users</p>
              <h3 className="text-[25px] font-black text-slate-900 leading-tight mt-0.5">
                {liveMetrics?.totalUsers?.toLocaleString() || '125,430'}
              </h3>
              <p className="text-[12px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                <span>↑ 12.5%</span>
              </p>
            </div>
          </div>
          {/* Blue Sparkline SVG */}
          <div className="w-20 h-10 text-[#3B82F6]">
            <svg viewBox="0 0 80 40" className="w-full h-full fill-none stroke-current stroke-2">
              <path d="M0,28 Q20,34 38,18 T80,10"/>
            </svg>
          </div>
        </Link>

        {/* Active Businesses */}
        <Link to="/businesses" className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#10B981] flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Building2 className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">Approved Businesses</p>
              <h3 className="text-[25px] font-black text-slate-900 leading-tight mt-0.5">
                {liveMetrics?.approvedBusinesses?.toLocaleString() || liveMetrics?.totalBusinesses?.toLocaleString() || '24,870'}
              </h3>
              <p className="text-[12px] font-bold text-amber-500 flex items-center gap-1 mt-1">
                <span>{liveMetrics?.pendingApprovals || 0} pending review</span>
              </p>
            </div>
          </div>
          {/* Emerald Sparkline SVG */}
          <div className="w-20 h-10 text-[#10B981]">
            <svg viewBox="0 0 80 40" className="w-full h-full fill-none stroke-current stroke-2">
              <path d="M0,30 Q25,12 45,26 T80,8"/>
            </svg>
          </div>
        </Link>

        {/* Total Service Requests */}
        <Link to="/requests" className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
              <FileText className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">Service Requests</p>
              <h3 className="text-[25px] font-black text-slate-900 leading-tight mt-0.5">
                {liveMetrics?.totalRequests?.toLocaleString() || '5'}
              </h3>
              <p className="text-[12px] font-bold text-indigo-600 flex items-center gap-1 mt-1">
                <span>{liveMetrics?.newRequests || 1} new requests</span>
              </p>
            </div>
          </div>
          {/* Purple Sparkline SVG */}
          <div className="w-20 h-10 text-[#7C3AED]">
            <svg viewBox="0 0 80 40" className="w-full h-full fill-none stroke-current stroke-2">
              <path d="M0,32 Q22,35 40,16 T80,12"/>
            </svg>
          </div>
        </Link>

        {/* Total Business Connections */}
        <Link to="/requests/connections" className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
              <Handshake className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">Business Connections</p>
              <h3 className="text-[25px] font-black text-slate-900 leading-tight mt-0.5">
                {liveMetrics?.totalConnections?.toLocaleString() || '3'}
              </h3>
              <p className="text-[12px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                <span>Active Matchmaking</span>
              </p>
            </div>
          </div>
          {/* Amber Sparkline SVG */}
          <div className="w-20 h-10 text-[#F59E0B]">
            <svg viewBox="0 0 80 40" className="w-full h-full fill-none stroke-current stroke-2">
              <path d="M0,30 Q28,34 50,14 T80,10"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* 2b. Core Service Request Breakdown Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Service Request Pipeline:</span>
        </div>
        <div className="flex items-center flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <Link to="/requests" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>New: <strong>{liveMetrics?.newRequests || 1}</strong></span>
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/requests" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Under Review: <strong>{liveMetrics?.underReviewRequests || 1}</strong></span>
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/requests" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Assigned: <strong>{liveMetrics?.assignedRequests || 1}</strong></span>
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/requests" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>In Progress: <strong>{liveMetrics?.inProgressRequests || 1}</strong></span>
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/requests" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Completed: <strong>{liveMetrics?.completedRequests || 1}</strong></span>
          </Link>
        </div>
        <Link to="/requests" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800">
          <span>Manage Requests</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3. Middle Section: Platform Analytics + User Distribution + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Platform Analytics Multi-line Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-800"/>
              <h2 className="text-[16px] font-extrabold text-slate-900">Platform Analytics</h2>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
              {['7D', '30D', '90D', '1Y'].map((tab) => (<button key={tab} onClick={() => setTimeRange(tab)} className={`px-3 py-1 rounded-lg transition-all ${timeRange === tab
                ? 'bg-[#4338CA] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'}`}>
                  {tab}
                </button>))}
            </div>
          </div>

          {/* Chart Legends */}
          <div className="flex items-center justify-end gap-6 text-[12px] font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"/>
              <span>Users</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"/>
              <span>Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"/>
              <span>Revenue</span>
            </div>
          </div>

          {/* Responsive Line Chart */}
          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9"/>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#F1F5F9' }}/>
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}K`}/>
                <Tooltip contentStyle={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            border: '1px solid #F1F5F9',
            fontSize: '12px',
            fontWeight: 600,
        }}/>
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3, fill: '#3B82F6' }} activeDot={{ r: 5 }}/>
                <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3, fill: '#8B5CF6' }} activeDot={{ r: 5 }}/>
                <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3, fill: '#F59E0B' }} activeDot={{ r: 5 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Donut Chart (3 cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-blue-500"/>
            <h2 className="text-[16px] font-extrabold text-slate-900">User Distribution</h2>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userDistributionData} cx="50%" cy="50%" innerRadius={56} outerRadius={78} paddingAngle={3} dataKey="value">
                    {userDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Donut Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[20px] font-black text-slate-900 leading-none">
                {liveMetrics?.totalUsers || 0}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total Users</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-50">
            {userDistributionData.map((item) => (<div key={item.name} className="flex items-center justify-between text-[12px] font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}/>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{item.percent}</span>
              </div>))}
          </div>
        </div>

        {/* Quick Actions (3 cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4.5 h-4.5 text-indigo-600"/>
            <h2 className="text-[16px] font-extrabold text-slate-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 gap-3.5 my-auto">
            {/* Add User */}
            <Link to="/users" className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-blue-50/70 border border-slate-100 transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5"/>
              </div>
              <span className="text-[12px] font-bold text-slate-700 group-hover:text-blue-600">Add User</span>
            </Link>

            {/* Add Business */}
            <Link to="/businesses" className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-emerald-50/70 border border-slate-100 transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5"/>
              </div>
              <span className="text-[12px] font-bold text-slate-700 group-hover:text-emerald-600">Add Business</span>
            </Link>

            {/* Create Course */}
            <Link to="/education" className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-purple-50/70 border border-slate-100 transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5"/>
              </div>
              <span className="text-[12px] font-bold text-slate-700 group-hover:text-purple-600">Create Course</span>
            </Link>

            {/* Post Job */}
            <Link to="/jobs" className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-amber-50/70 border border-slate-100 transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5"/>
              </div>
              <span className="text-[12px] font-bold text-slate-700 group-hover:text-amber-600">Post Job</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Pending Approvals + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pending Approvals Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-rose-500"/>
              <h2 className="text-[16px] font-extrabold text-slate-900">Pending Approvals</h2>
            </div>
            <Link to="/businesses" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 text-[12px]">
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Details</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingApprovals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                      No pending approvals requiring review. All clear!
                    </td>
                  </tr>
                ) : (
                  pendingApprovals.map((item) => {
                    const Icon = item.icon;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Type */}
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                              <Icon className="w-4 h-4"/>
                            </div>
                            <span className="font-semibold text-slate-800">{item.type}</span>
                          </div>
                        </td>

                        {/* Name */}
                        <td className="py-3 font-semibold text-slate-900">
                          {item.name}
                        </td>

                        {/* Details */}
                        <td className="py-3 text-slate-500">
                          {item.details}
                        </td>

                        {/* Action Buttons: Green Approve & Red Reject */}
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleAction(item)} className="px-3 py-1 rounded-full text-[11px] font-bold text-emerald-600 border border-emerald-400 hover:bg-emerald-50 transition-colors">
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities List (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-indigo-600"/>
              <h2 className="text-[16px] font-extrabold text-slate-900">Recent Activities</h2>
            </div>
            <Link to="/audit-logs" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </Link>
          </div>

          <div className="space-y-3.5 pt-1">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent platform activities recorded.</p>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-3 text-[12.5px]">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"/>
                    <div>
                      <span className="text-slate-600 font-medium capitalize">{act.text} </span>
                      <span className="font-bold text-slate-900">{act.highlight}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium">{act.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>);
};
