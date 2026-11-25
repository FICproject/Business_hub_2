import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, Users, Building2, ShoppingCart, ShoppingBag, GraduationCap, BookOpen, Video, FileText, FolderTree, AlertTriangle, UserCheck, Briefcase, Share2, DollarSign, FileBarChart, Settings, Headphones, Search, Bell, ChevronDown, ChevronRight, Menu, X, LogOut, Rocket, User, Clock, Ban, ShieldCheck, Handshake, Layers, } from 'lucide-react';
import { adminLogout } from '../store';
export const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [usersExpanded, setUsersExpanded] = useState(false);
    const [educationExpanded, setEducationExpanded] = useState(false);
    const [reportsExpanded, setReportsExpanded] = useState(false);
    const { user } = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        dispatch(adminLogout());
        navigate('/login');
    };
    // User Management Submenu Items matching exact user request:
    // - All Users
    // - Students
    // - Teachers
    // - Businessmen
    // - Entrepreneurs
    // - Normal Users
    // - Pending Verifications
    // - Blocked / Suspended Users
    const userSubItems = [
        { label: 'All Users', path: '/users', icon: Users },
        { label: 'Students', path: '/users/students', icon: GraduationCap },
        { label: 'Teachers', path: '/users/teachers', icon: UserCheck },
        { label: 'Businessmen', path: '/users/businessmen', icon: Briefcase },
        { label: 'Entrepreneurs', path: '/users/entrepreneurs', icon: Rocket },
        { label: 'Normal Users', path: '/users/normal-users', icon: User },
        { label: 'Pending Verifications', path: '/users/pending', icon: Clock },
        { label: 'Blocked / Suspended', path: '/users/blocked-suspended', icon: Ban },
    ];
    // Education Submenu Items
    const educationSubItems = [
        { label: 'Courses', path: '/education/courses', icon: BookOpen },
        { label: 'Live Classes', path: '/education/live-classes', icon: Video },
        { label: 'Study Materials / Notes', path: '/education/study-materials', icon: FileText },
        { label: 'Categories', path: '/education/categories', icon: FolderTree },
        { label: 'Content Reports', path: '/education/content-reports', icon: AlertTriangle },
    ];
    // Reports Submenu Items
    const reportSubItems = [
        { label: 'Platform Overview', path: '/reports/overview', icon: FileBarChart },
        { label: 'User Reports', path: '/reports/users', icon: Users },
        { label: 'Business Reports', path: '/reports/businesses', icon: Building2 },
        { label: 'Marketplace Reports', path: '/reports/marketplace', icon: ShoppingCart },
        { label: 'Orders & Sales', path: '/reports/orders-sales', icon: ShoppingBag },
        { label: 'Revenue Reports', path: '/reports/revenue', icon: DollarSign },
        { label: 'Education Reports', path: '/reports/education', icon: GraduationCap },
        { label: 'Teacher Reports', path: '/reports/teachers', icon: UserCheck },
        { label: 'Jobs Reports', path: '/reports/jobs', icon: Briefcase },
        { label: 'Referral Reports', path: '/reports/referrals', icon: Share2 },
    ];
    const mainNavItems = [
        { label: 'Dashboard', path: '/', icon: Home, isActiveMatch: (p) => p === '/' },
        { label: 'Service Requests', path: '/requests', icon: FileText },
        { label: 'Connections', path: '/requests/connections', icon: Handshake },
        { label: 'Business Management', path: '/businesses', icon: Building2 },
        { label: 'Categories', path: '/categories', icon: FolderTree },
        { label: 'Marketplace', path: '/marketplace', icon: ShoppingCart },
        { label: 'Orders', path: '/orders', icon: ShoppingBag },
    ];
    const secondaryNavItems = [
        { label: 'Teachers & Payments', path: '/teacher-payments', icon: UserCheck },
        { label: 'Jobs', path: '/jobs', icon: Briefcase },
        { label: 'Referrals', path: '/referrals', icon: Share2 },
        { label: 'Security & Audit', path: '/audit-logs', icon: ShieldCheck },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];
    const isUsersActive = location.pathname.startsWith('/users');
    const isEducationActive = location.pathname.startsWith('/education');
    const isReportsActive = location.pathname.startsWith('/reports');
    return (<div className="min-h-screen bg-[#F4F6FC] text-slate-800 flex flex-col md:flex-row antialiased font-sans select-none overflow-x-hidden">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#121226] text-white p-3.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <button onClick={() => setSidebarOpen(true)} className="p-1 rounded text-slate-300 hover:text-white">
          <Menu className="w-5 h-5"/>
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-400"/>
          <span className="font-bold text-sm tracking-tight text-white">Business Hub</span>
        </div>
        <button onClick={handleLogout} className="text-xs font-semibold text-rose-400">
          Logout
        </button>
      </div>

      {/* Expanded Sidebar */}
      <aside className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-[250px] lg:w-[260px] bg-[#121226] text-[#8C90AB] flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 h-screen shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Header */}
          <div className="px-5 pt-5 pb-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
                <GraduationCap className="w-5 h-5 text-white"/>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-[16px] leading-tight text-white tracking-tight">Business</span>
                  <span className="font-bold text-[16px] leading-tight text-white tracking-tight">Hub</span>
                </div>
                <span className="text-[10px] text-[#636787] font-medium tracking-wide">Admin Panel</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3.5 py-1.5 space-y-1 scrollbar-none">
            {/* Dashboard Link */}
            <Link to="/" onClick={() => setSidebarOpen(false)} className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all group ${location.pathname === '/'
            ? 'bg-[#4F46E5] text-white shadow-sm shadow-indigo-600/40 font-bold'
            : 'text-[#9094B1] hover:text-white hover:bg-white/[0.05]'}`}>
              <div className="flex items-center gap-2.5">
                <Home className={`w-4 h-4 shrink-0 transition-colors ${location.pathname === '/' ? 'text-white' : 'text-[#7D81A0] group-hover:text-white'}`}/>
                <span className="tracking-tight whitespace-nowrap">Dashboard</span>
              </div>
            </Link>

            {/* 1. User Management Section (Collapsible) */}
            <div className="pt-1">
              <button onClick={() => setUsersExpanded(!usersExpanded)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${isUsersActive
            ? 'text-white bg-indigo-950/60 border border-indigo-800/40'
            : 'text-[#9094B1] hover:text-white hover:bg-white/[0.05]'}`}>
                <div className="flex items-center gap-2.5">
                  <Users className={`w-4 h-4 shrink-0 ${isUsersActive ? 'text-indigo-400' : 'text-[#7D81A0]'}`}/>
                  <span className="tracking-tight font-bold">User Management</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${usersExpanded ? 'rotate-180 text-white' : 'text-[#5F6382]'}`}/>
              </button>

              {usersExpanded && (<div className="pl-4 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-indigo-500/30 ml-4">
                  {userSubItems.map((sub) => {
                const isSubActive = location.pathname === sub.path;
                const SubIcon = sub.icon;
                return (<Link key={sub.label} to={sub.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium transition-all ${isSubActive
                        ? 'bg-[#4F46E5] text-white font-bold shadow-sm'
                        : 'text-[#8A8EA8] hover:text-white hover:bg-white/[0.05]'}`}>
                        <SubIcon className="w-3 h-3 shrink-0 opacity-80"/>
                        <span className="truncate">{sub.label}</span>
                      </Link>);
            })}
                </div>)}
            </div>

            {/* Other Direct Nav Items */}
            {mainNavItems.slice(1).map((item) => {
            const active = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (<Link key={item.label} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all group ${active
                    ? 'bg-[#4F46E5] text-white shadow-sm shadow-indigo-600/40 font-bold'
                    : 'text-[#9094B1] hover:text-white hover:bg-white/[0.05]'}`}>
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-white' : 'text-[#7D81A0] group-hover:text-white'}`}/>
                    <span className="tracking-tight whitespace-nowrap">{item.label}</span>
                  </div>
                </Link>);
        })}

            {/* 2. Education Section (Collapsible) */}
            <div className="pt-1">
              <button onClick={() => setEducationExpanded(!educationExpanded)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${isEducationActive
            ? 'text-white bg-indigo-950/60 border border-indigo-800/40'
            : 'text-[#9094B1] hover:text-white hover:bg-white/[0.05]'}`}>
                <div className="flex items-center gap-2.5">
                  <GraduationCap className={`w-4 h-4 shrink-0 ${isEducationActive ? 'text-indigo-400' : 'text-[#7D81A0]'}`}/>
                  <span className="tracking-tight font-bold">Education</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${educationExpanded ? 'rotate-180 text-white' : 'text-[#5F6382]'}`}/>
              </button>

              {educationExpanded && (<div className="pl-4 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-indigo-500/30 ml-4">
                  {educationSubItems.map((sub) => {
                const isSubActive = location.pathname === sub.path;
                const SubIcon = sub.icon;
                return (<Link key={sub.label} to={sub.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium transition-all ${isSubActive
                        ? 'bg-[#4F46E5] text-white font-bold shadow-sm'
                        : 'text-[#8A8EA8] hover:text-white hover:bg-white/[0.05]'}`}>
                        <SubIcon className="w-3 h-3 shrink-0 opacity-80"/>
                        <span className="truncate">{sub.label}</span>
                      </Link>);
            })}
                </div>)}
            </div>

            {/* 3. Reports Section (Collapsible) */}
            <div className="pt-1">
              <button onClick={() => setReportsExpanded(!reportsExpanded)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${isReportsActive
            ? 'text-white bg-indigo-950/60 border border-indigo-800/40'
            : 'text-[#9094B1] hover:text-white hover:bg-white/[0.05]'}`}>
                <div className="flex items-center gap-2.5">
                  <FileBarChart className={`w-4 h-4 shrink-0 ${isReportsActive ? 'text-indigo-400' : 'text-[#7D81A0]'}`}/>
                  <span className="tracking-tight font-bold">Reports</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${reportsExpanded ? 'rotate-180 text-white' : 'text-[#5F6382]'}`}/>
              </button>

              {reportsExpanded && (<div className="pl-4 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-indigo-500/30 ml-4">
                  {reportSubItems.map((sub) => {
                const isSubActive = location.pathname === sub.path;
                const SubIcon = sub.icon;
                return (<Link key={sub.label} to={sub.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium transition-all ${isSubActive
                        ? 'bg-[#4F46E5] text-white font-bold shadow-sm'
                        : 'text-[#8A8EA8] hover:text-white hover:bg-white/[0.05]'}`}>
                        <SubIcon className="w-3 h-3 shrink-0 opacity-80"/>
                        <span className="truncate">{sub.label}</span>
                      </Link>);
            })}
                </div>)}
            </div>

            {/* Bottom Nav Items */}
            <div className="pt-1 space-y-1">
              {secondaryNavItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (<Link key={item.label} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all group ${active
                    ? 'bg-[#4F46E5] text-white shadow-sm shadow-indigo-600/40 font-bold'
                    : 'text-[#9094B1] hover:text-white hover:bg-white/[0.05]'}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-white' : 'text-[#7D81A0] group-hover:text-white'}`}/>
                      <span className="tracking-tight whitespace-nowrap">{item.label}</span>
                    </div>
                  </Link>);
        })}
            </div>
          </div>

          {/* Need Help Card Footer */}
          <div className="p-3.5">
            <div className="px-4 py-3 rounded-2xl bg-[#1B1B34] flex items-center justify-between cursor-pointer hover:bg-[#222240] transition-colors border border-white/[0.04]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4"/>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-white leading-tight">Need Help?</p>
                  <p className="text-[10px] text-[#7C80A2]">Contact Support</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7C80A2]"/>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[58px] bg-[#F4F6FC] px-6 sm:px-8 flex items-center justify-between shrink-0">
          {/* Rounded Search Bar */}
          <div className="relative w-full max-w-[340px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Search anything... (Ctrl + K)" className="w-full pl-9 pr-4 py-2 bg-white text-[12px] font-medium rounded-full border border-slate-200/70 shadow-sm focus:outline-none focus:border-indigo-400 placeholder:text-slate-400 text-slate-700"/>
          </div>

          {/* Top Right: Notification Bell & Admin Profile */}
          <div className="flex items-center gap-5">
            {/* Bell Icon with red badge */}
            <div className="relative cursor-pointer hover:opacity-80">
              <Bell className="w-4.5 h-4.5 text-slate-700"/>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-[#F4F6FC]">
                3
              </span>
            </div>

            {/* Admin Avatar */}
            <div className="relative">
              <div onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 cursor-pointer hover:opacity-90">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-200 shrink-0">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Admin" className="w-full h-full object-cover"/>
                </div>
                <span className="text-[12px] font-bold text-slate-800">Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500"/>
              </div>

              {dropdownOpen && (<div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px]">
                    <p className="font-bold text-slate-800">Admin Account</p>
                    <p className="text-slate-400 truncate">{user?.email || ''}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5"/>
                    Sign Out
                  </button>
                </div>)}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8 pt-1">
          <Outlet />
        </main>
      </div>
    </div>);
};
