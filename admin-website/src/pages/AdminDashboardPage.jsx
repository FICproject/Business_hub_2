import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, ShoppingCart, TrendingUp, ArrowRight, UserPlus, Building2, GraduationCap, Store, Clock, Bell, Zap, } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, } from 'recharts';
export const AdminDashboardPage = () => {
    const [timeRange, setTimeRange] = useState('30D');
    // Dynamic time-based greeting & icon
    const getGreetingData = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return { text: 'Good Morning, Admin!', emoji: '🌅' };
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
    // Exact 5-point wave curves matching the screenshot
    const analyticsData = [
        { name: 'Oct 1', users: 24, orders: 15, revenue: 9 },
        { name: 'Oct 7', users: 38, orders: 26, revenue: 17 },
        { name: 'Oct 14', users: 35, orders: 22, revenue: 15 },
        { name: 'Oct 21', users: 50, orders: 36, revenue: 26 },
        { name: 'Oct 30', users: 80, orders: 58, revenue: 42 },
    ];
    // Donut chart user distribution
    const userDistributionData = [
        { name: 'Students', value: 42, color: '#3B82F6', percent: '42%' },
        { name: 'Professionals', value: 35, color: '#8B5CF6', percent: '35%' },
        { name: 'Businesses', value: 23, color: '#F59E0B', percent: '23%' },
    ];
    // Pending Approvals exactly from reference design
    const [pendingApprovals, setPendingApprovals] = useState([
        {
            id: '1',
            type: 'Business',
            icon: Store,
            iconBg: 'bg-rose-50 text-rose-500',
            name: 'ABC Traders',
            details: 'Retail Business',
        },
        {
            id: '2',
            type: 'Course',
            icon: GraduationCap,
            iconBg: 'bg-indigo-50 text-indigo-500',
            name: 'Web Development',
            details: 'By John Doe',
        },
        {
            id: '3',
            type: 'Job',
            icon: Briefcase,
            iconBg: 'bg-sky-50 text-sky-500',
            name: 'Frontend Developer',
            details: 'Full-time • Bengaluru',
        },
    ]);
    // Recent Activities exactly from screenshot
    const recentActivities = [
        { id: 1, text: 'New business registered:', highlight: 'Tech Mart', time: '2 mins ago' },
        { id: 2, text: 'Order placed by', highlight: 'Priya Sharma – ₹1,250', time: '5 mins ago' },
        { id: 3, text: 'New course added:', highlight: 'React JS Basics', time: '10 mins ago' },
        { id: 4, text: 'Job posted:', highlight: 'Full Stack Developer', time: '15 mins ago' },
        { id: 5, text: 'Payment received:', highlight: '₹9,999', time: '20 mins ago' },
    ];
    const handleAction = (id) => {
        setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
    };
    return (<div className="space-y-5 max-w-[1600px] mx-auto pb-6">
      {/* 1. Hero Banner: Ultra High-Definition 3D Render with seamless integration */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#10052F] text-white min-h-[175px] lg:min-h-[195px] px-8 sm:px-10 py-6 flex items-center justify-between shadow-sm">
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

        {/* Right side: Ultra-Crisp High-Resolution 3D Render (1376x768) */}
        <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-[62%] max-w-[700px] pointer-events-none select-none items-center justify-end overflow-hidden">
          <img src="/assets/saas-hero-rocket-laptop.png" alt="Dashboard Rocket & Laptop 3D Render" className="h-full w-full object-cover object-right"/>
        </div>
      </div>

      {/* 2. Four Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Users className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">Total Users</p>
              <h3 className="text-[25px] font-black text-slate-900 leading-tight mt-0.5">
                125,430
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
        </div>

        {/* Active Businesses */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#10B981] flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Briefcase className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">Active Businesses</p>
              <h3 className="text-[25px] font-black text-slate-900 leading-tight mt-0.5">
                24,870
              </h3>
              <p className="text-[12px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                <span>↑ 8.3%</span>
              </p>
            </div>
          </div>
          {/* Emerald Sparkline SVG */}
          <div className="w-20 h-10 text-[#10B981]">
            <svg viewBox="0 0 80 40" className="w-full h-full fill-none stroke-current stroke-2">
              <path d="M0,30 Q25,12 45,26 T80,8"/>
            </svg>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
              <ShoppingCart className="w-6 h-6"/>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">Total Orders</p>
              <h3 className="text-[25px] font-black text-slate-900 leading-tight mt-0.5">
                89,340
              </h3>
              <p className="text-[12px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                <span>↑ 14.2%</span>
              </p>
            </div>
          </div>
          {/* Purple Sparkline SVG */}
          <div className="w-20 h-10 text-[#7C3AED]">
            <svg viewBox="0 0 80 40" className="w-full h-full fill-none stroke-current stroke-2">
              <path d="M0,32 Q22,35 40,16 T80,12"/>
            </svg>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
              <span className="font-extrabold text-[22px]">₹</span>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 font-semibold tracking-wide">Total Revenue</p>
              <h3 className="text-[25px] font-black text-slate-900 leading-tight mt-0.5">
                ₹48,75,230
              </h3>
              <p className="text-[12px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                <span>↑ 18.6%</span>
              </p>
            </div>
          </div>
          {/* Amber Sparkline SVG */}
          <div className="w-20 h-10 text-[#F59E0B]">
            <svg viewBox="0 0 80 40" className="w-full h-full fill-none stroke-current stroke-2">
              <path d="M0,30 Q28,34 50,14 T80,10"/>
            </svg>
          </div>
        </div>
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
              <span className="text-[20px] font-black text-slate-900 leading-none">125K</span>
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
                {pendingApprovals.map((item) => {
            const Icon = item.icon;
            return (<tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
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
                          <button onClick={() => handleAction(item.id)} className="px-3 py-1 rounded-full text-[11px] font-bold text-emerald-600 border border-emerald-400 hover:bg-emerald-50 transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleAction(item.id)} className="px-3 py-1 rounded-full text-[11px] font-bold text-rose-500 border border-rose-400 hover:bg-rose-50 transition-colors">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>);
        })}
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
            {recentActivities.map((act) => (<div key={act.id} className="flex items-start justify-between gap-3 text-[12.5px]">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"/>
                  <div>
                    <span className="text-slate-600 font-medium">{act.text} </span>
                    <span className="font-bold text-slate-900">{act.highlight}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium">{act.time}</span>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
};
