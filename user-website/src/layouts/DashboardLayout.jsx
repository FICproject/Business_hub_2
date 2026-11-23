import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Store, LayoutDashboard, GraduationCap, Video, FileText, Briefcase, ShoppingBag, Share2, Bell, User, Settings, LogOut, PlusCircle, Clock, DollarSign, ShieldCheck, CheckCircle, Menu, X, Search, Bookmark, Calendar, Users as UsersIcon, Award, Layers, } from 'lucide-react';
import { logout, setActiveRole, setNotifications } from '../store';
import { notificationsApi } from '../services/api';
import { ConfirmationModal } from '../components/dashboard/ConfirmationModal';
import { GlobalSearchModal } from '../components/dashboard/GlobalSearchModal';
export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const { user, isAuthenticated, activeRole } = useSelector((state) => state.auth);
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname, location.search]);
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        notificationsApi
            .getMyNotifications()
            .then((res) => {
            dispatch(setNotifications({
                notifications: res.data.data,
                unreadCount: res.data.unreadCount,
            }));
        })
            .catch((err) => console.log('Notifications load notice:', err.message));
    }, [isAuthenticated]);
    const handleLogoutConfirm = () => {
        dispatch(logout());
        setLogoutModalOpen(false);
        navigate('/');
    };
    const handleMarkAllRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            const res = await notificationsApi.getMyNotifications();
            dispatch(setNotifications({
                notifications: res.data.data,
                unreadCount: res.data.unreadCount,
            }));
        }
        catch (err) {
            console.error(err);
        }
    };
    // 1. STUDENT NAVIGATION
    const studentNav = [
        { label: 'Overview', tab: 'overview', icon: LayoutDashboard },
        { label: 'My Courses', tab: 'courses', icon: GraduationCap },
        { label: 'Browse Courses', tab: 'browse', icon: Layers },
        { label: 'Live Classes', tab: 'live-classes', icon: Video },
        { label: 'Study Materials', tab: 'materials', icon: FileText },
        { label: 'My Certificates', tab: 'certificates', icon: Award },
        { label: 'Job Opportunities', tab: 'jobs', icon: Briefcase },
        { label: 'My Applications', tab: 'applications', icon: CheckCircle },
        { label: 'Community', tab: 'community', icon: UsersIcon },
        { label: 'Events', tab: 'events', icon: Calendar },
        { label: 'Saved Items', tab: 'saved', icon: Bookmark },
        { label: 'My Profile', path: '/dashboard/profile', icon: User },
        { label: 'Settings', path: '/dashboard/profile?tab=settings', icon: Settings },
    ];
    // 2. TEACHER NAVIGATION
    const teacherNav = [
        { label: 'Overview', tab: 'overview', icon: LayoutDashboard },
        { label: 'My Courses', tab: 'courses', icon: GraduationCap },
        { label: 'Create Course', tab: 'create-course', icon: PlusCircle },
        { label: 'Live Class Management', tab: 'live-classes', icon: Video },
        { label: 'Schedule Classes', tab: 'schedule-class', icon: Clock },
        { label: 'Study Materials', tab: 'materials', icon: FileText },
        { label: 'Attendance', tab: 'attendance', icon: CheckCircle },
        { label: 'Stipend Management', tab: 'stipends', icon: DollarSign },
        { label: 'Community', tab: 'community', icon: UsersIcon },
        { label: 'Events', tab: 'events', icon: Calendar },
        { label: 'My Profile', path: '/dashboard/profile', icon: User },
        { label: 'Settings', path: '/dashboard/profile?tab=settings', icon: Settings },
    ];
    // 3. BUSINESSMAN / ENTREPRENEUR NAVIGATION
    const businessNav = [
        { label: 'Overview', tab: 'overview', icon: LayoutDashboard },
        { label: 'Business Profile', tab: 'profile', icon: User },
        { label: 'Verification Status', tab: 'verification', icon: ShieldCheck },
        { label: 'My Store', tab: 'store', icon: Store },
        { label: 'Products', tab: 'products', icon: Store },
        { label: 'Add Product', tab: 'add-product', icon: PlusCircle },
        { label: 'Services', tab: 'services', icon: Layers },
        { label: 'Orders & Tracking', tab: 'orders', icon: ShoppingBag },
        { label: 'Job Postings', tab: 'jobs', icon: Briefcase },
        { label: 'Share Links', tab: 'sharing', icon: Share2 },
        { label: 'My Profile', path: '/dashboard/profile', icon: User },
        { label: 'Settings', path: '/dashboard/profile?tab=settings', icon: Settings },
    ];
    // 4. NORMAL USER NAVIGATION
    const normalUserNav = [
        { label: 'Overview', tab: 'overview', icon: LayoutDashboard },
        { label: 'My Profile', path: '/dashboard/profile', icon: User },
        { label: 'Marketplace', tab: 'marketplace', icon: Store },
        { label: 'My Cart', tab: 'cart', icon: ShoppingBag },
        { label: 'My Orders', tab: 'orders', icon: Clock },
        { label: 'Wishlist & Saved', tab: 'saved', icon: Bookmark },
        { label: 'My Applications', tab: 'applications', icon: CheckCircle },
        { label: 'My Learning', tab: 'learning', icon: GraduationCap },
        { label: 'Shared Links', tab: 'sharing', icon: Share2 },
        { label: 'Community', tab: 'community', icon: UsersIcon },
        { label: 'Events', tab: 'events', icon: Calendar },
        { label: 'Settings', path: '/dashboard/profile?tab=settings', icon: Settings },
    ];
    let currentNav = studentNav;
    let roleTitle = 'Student Portal';
    let roleBadge = 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    let baseRolePath = '/dashboard/student';
    if (activeRole === 'teacher') {
        currentNav = teacherNav;
        roleTitle = 'Teacher Workspace';
        roleBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        baseRolePath = '/dashboard/teacher';
    }
    else if (activeRole === 'businessman' || activeRole === 'entrepreneur') {
        currentNav = businessNav;
        roleTitle = 'Business Enterprise';
        roleBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        baseRolePath = '/dashboard/business';
    }
    else if (activeRole === 'normal' || activeRole === 'user') {
        currentNav = normalUserNav;
        roleTitle = 'Member Dashboard';
        roleBadge = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        baseRolePath = '/dashboard/user';
    }
    // Active Tab handling from URL search params
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get('tab') || 'overview';
    return (<div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy-950 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300">
            <Menu className="w-5 h-5"/>
          </button>
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">
              Business<span className="text-amber-400">Hub</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchModalOpen(true)} className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800">
            <Search className="w-4 h-4"/>
          </button>
          <button onClick={() => setNotifDropdownOpen(!notifDropdownOpen)} className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800">
            <Bell className="w-4 h-4"/>
            {unreadCount > 0 && (<span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-[9px] font-extrabold flex items-center justify-center text-navy-950">
                {unreadCount}
              </span>)}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation - Fixed & Static on Desktop */}
      <aside
        className={`fixed top-0 inset-y-0 left-0 z-40 w-64 lg:w-72 h-screen h-[100dvh] bg-navy-950 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/80 shadow-lg`}
      >
        {/* Top Header: Logo & Profile Card (Fixed, non-scrolling) */}
        <div className="p-4 lg:p-5 pb-2 flex-shrink-0 space-y-3">
          {/* Logo & Close button */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-navy-950 shadow-md shadow-amber-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">Business</span>
                <span className="font-extrabold text-lg text-amber-400">Hub</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Card */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.fullName || 'User')}`
                }
                alt="Avatar"
                className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-white/10"
              />
              <div className="overflow-hidden min-w-0">
                <p className="font-bold text-sm text-white truncate">{user?.fullName}</p>
                <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase border ${roleBadge} mt-0.5`}>
                  {roleTitle}
                </span>
              </div>
            </div>

            {/* Multi-role switcher */}
            {user?.roles && user.roles.length > 1 && (
              <div className="pt-2 border-t border-white/10">
                <label className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                  Switch Active Portal:
                </label>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        dispatch(setActiveRole(r));
                        if (r === 'teacher') navigate('/dashboard/teacher');
                        else if (r === 'businessman' || r === 'entrepreneur') navigate('/dashboard/business');
                        else if (r === 'normal' || r === 'user') navigate('/dashboard/user');
                        else navigate('/dashboard/student');
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-all ${
                        activeRole === r
                          ? 'bg-amber-500 text-navy-950 font-extrabold shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links (Larger font, comfortable spacing) */}
        <nav className="px-3 lg:px-4 flex-grow overflow-y-auto no-scrollbar space-y-1 py-1.5">
          {currentNav.map((item, idx) => {
            const targetUrl = item.tab
              ? item.tab === 'overview'
                ? baseRolePath
                : `${baseRolePath}?tab=${item.tab}`
              : item.path;
            let isTabActive = false;
            if (item.tab) {
              isTabActive = location.pathname === baseRolePath && currentTab === item.tab;
            } else if (item.path) {
              const [itemPathname, itemQuery] = item.path.split('?');
              if (itemQuery) {
                const itemParams = new URLSearchParams(itemQuery);
                const itemTab = itemParams.get('tab');
                isTabActive = location.pathname === itemPathname && searchParams.get('tab') === itemTab;
              } else {
                isTabActive = location.pathname === itemPathname && !searchParams.get('tab');
              }
            }
            const Icon = item.icon;
            return (
              <Link
                key={`${item.label}-${idx}`}
                to={targetUrl}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isTabActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 shadow-md shadow-amber-500/20 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout (Fixed at bottom) */}
        <div className="p-3 lg:p-4 border-t border-slate-800/80 flex-shrink-0">
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Offset by sidebar width on desktop */}
      <div className="flex-grow flex flex-col min-w-0 md:ml-64 lg:ml-72 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden md:flex h-20 bg-white border-b border-slate-200/80 px-8 items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Left: Active Portal Badge */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-navy-900 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
              {roleTitle}
            </span>
          </div>

          {/* Right: Search Icon, Notifications, Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Only Search Icon Button */}
            <button onClick={() => setSearchModalOpen(true)} className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-navy-900 transition-colors" title="Search items, courses, jobs (⌘K)">
              <Search className="w-5 h-5"/>
            </button>

            {/* Smart Notification Trigger */}
            <div className="relative">
              <button onClick={() => setNotifDropdownOpen(!notifDropdownOpen)} className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors" title="Notifications">
                <Bell className="w-5 h-5"/>
                {unreadCount > 0 && (<span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-500 text-navy-950 text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>)}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (<div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 z-50 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-navy-950 flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-amber-500"/>
                      Smart Notifications
                    </h4>
                    {unreadCount > 0 && (<button onClick={handleMarkAllRead} className="text-[11px] font-bold text-teal-600 hover:underline">
                        Mark all read
                      </button>)}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-1">
                    {notifications.length === 0 ? (<p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>) : (notifications.slice(0, 5).map((n) => (<div key={n._id} className="py-2.5 text-left space-y-0.5">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 leading-snug">{n.message}</p>
                          <span className="text-[9px] text-slate-400">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>)))}
                  </div>
                </div>)}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 transition-colors">
                <img src={user?.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.fullName || 'User')}`} alt={user?.fullName} className="w-9 h-9 rounded-xl object-cover bg-slate-200 border border-slate-200"/>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-extrabold text-navy-950 leading-tight">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{activeRole || user?.roles[0]}</p>
                </div>
              </button>

              {profileDropdownOpen && (<div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                  <Link to="/dashboard/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">
                    <User className="w-4 h-4 text-slate-400"/>
                    My Profile
                  </Link>
                  <Link to="/dashboard/saved" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">
                    <Bookmark className="w-4 h-4 text-slate-400"/>
                    Saved Items
                  </Link>
                  <Link to="/marketplace" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">
                    <Store className="w-4 h-4 text-slate-400"/>
                    Marketplace
                  </Link>
                  <div className="pt-1 border-t border-slate-100">
                    <button type="button" onClick={() => {
                setProfileDropdownOpen(false);
                setLogoutModalOpen(true);
            }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 text-left">
                      <LogOut className="w-4 h-4"/>
                      Sign Out
                    </button>
                  </div>
                </div>)}
            </div>
          </div>
        </header>

        {/* Dashboard Page Body */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Child Page Content */}
          <Outlet />
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)}/>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal isOpen={logoutModalOpen} title="Sign Out of Business Hub" message="Are you sure you want to end your current session? You can sign back in anytime to continue your progress." confirmLabel="Sign Out" cancelLabel="Stay Logged In" isDestructive={true} onConfirm={handleLogoutConfirm} onCancel={() => setLogoutModalOpen(false)}/>
    </div>);
};
