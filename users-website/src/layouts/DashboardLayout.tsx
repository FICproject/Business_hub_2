import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Store,
  LayoutDashboard,
  GraduationCap,
  Video,
  FileText,
  Briefcase,
  ShoppingBag,
  Share2,
  Bell,
  User,
  Settings,
  LogOut,
  PlusCircle,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  Layers,
  Users as UsersIcon,
} from 'lucide-react';
import { RootState, logout, setActiveRole, setNotifications } from '../store';
import { notificationsApi } from '../services/api';
import { UserRole } from '../types';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const { user, isAuthenticated, activeRole } = useSelector((state: RootState) => state.auth);
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user notifications
    notificationsApi.getMyNotifications()
      .then((res) => {
        dispatch(setNotifications({
          notifications: res.data.data,
          unreadCount: res.data.unreadCount,
        }));
      })
      .catch((err) => console.log('Notifications load notice:', err.message));
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
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
    } catch (err) {
      console.error(err);
    }
  };

  // Student Navigation Items
  const studentNav = [
    { label: 'Overview', path: '/dashboard/student', icon: LayoutDashboard },
    { label: 'My Courses', path: '/dashboard/student/courses', icon: GraduationCap },
    { label: 'Live Classes', path: '/education/live-classes', icon: Video },
    { label: 'Study Materials', path: '/education/materials', icon: FileText },
    { label: 'Tuition', path: '/education/tuition', icon: UsersIcon },
    { label: 'Explore Jobs', path: '/jobs', icon: Briefcase },
    { label: 'My Applications', path: '/dashboard/student/applications', icon: CheckCircle },
    { label: 'Marketplace', path: '/marketplace', icon: Store },
    { label: 'My Cart', path: '/cart', icon: ShoppingBag },
    { label: 'My Orders', path: '/dashboard/student/orders', icon: Clock },
    { label: 'Shared Links', path: '/dashboard/student/shared-links', icon: Share2 },
  ];

  // Teacher Navigation Items
  const teacherNav = [
    { label: 'Dashboard', path: '/dashboard/teacher', icon: LayoutDashboard },
    { label: 'My Courses', path: '/dashboard/teacher/courses', icon: GraduationCap },
    { label: 'Create Course', path: '/dashboard/teacher/create-course', icon: PlusCircle },
    { label: 'Live Classes', path: '/dashboard/teacher/live-classes', icon: Video },
    { label: 'Schedule Class', path: '/dashboard/teacher/schedule-class', icon: Clock },
    { label: 'Study Materials', path: '/dashboard/teacher/materials', icon: FileText },
    { label: 'Tuition Management', path: '/dashboard/teacher/tuitions', icon: UsersIcon },
    { label: 'Attendance', path: '/dashboard/teacher/attendance', icon: CheckCircle },
    { label: 'My Earnings', path: '/dashboard/teacher/earnings', icon: DollarSign },
  ];

  // Business Navigation Items
  const businessNav = [
    { label: 'Dashboard', path: '/dashboard/business', icon: LayoutDashboard },
    { label: 'Business Profile', path: '/dashboard/business/profile', icon: User },
    { label: 'Verification Status', path: '/dashboard/business/verification', icon: ShieldCheck },
    { label: 'My Products', path: '/dashboard/business/products', icon: Store },
    { label: 'Add Product', path: '/dashboard/business/add-product', icon: PlusCircle },
    { label: 'My Services', path: '/dashboard/business/services', icon: Layers },
    { label: 'Orders & Sales', path: '/dashboard/business/orders', icon: ShoppingBag },
    { label: 'Job Management', path: '/dashboard/business/jobs', icon: Briefcase },
  ];

  let currentNav = studentNav;
  if (activeRole === 'teacher') {
    currentNav = teacherNav;
  } else if (activeRole === 'businessman' || activeRole === 'entrepreneur') {
    currentNav = businessNav;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-lg hover:bg-slate-800">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-extrabold text-lg text-white">Business<span className="text-teal-400">Hub</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 text-slate-300 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-teal-500 text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-navy-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Logo & Close button */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white">Business</span>
                <span className="font-extrabold text-xl text-teal-400">Hub</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`}
                alt="Avatar"
                className="w-10 h-10 rounded-xl object-cover bg-slate-800"
              />
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-white truncate">{user?.fullName}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-400 mt-0.5">
                  {activeRole || user?.roles[0]}
                </span>
              </div>
            </div>

            {/* Multi-role switcher */}
            {user?.roles && user.roles.length > 1 && (
              <div className="pt-2 border-t border-white/10">
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                  Active View
                </label>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        dispatch(setActiveRole(r as UserRole));
                        if (r === 'teacher') navigate('/dashboard/teacher');
                        else if (r === 'businessman' || r === 'entrepreneur') navigate('/dashboard/business');
                        else navigate('/dashboard/student');
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                        activeRole === r ? 'bg-teal-500 text-navy-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {currentNav.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex h-20 bg-white border-b border-slate-200/80 px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
              {activeRole?.toUpperCase()} PORTAL
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Business Hub 2.0</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-navy-900">Notifications</h4>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-[11px] font-bold text-teal-600 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n._id} className="py-2.5 text-left">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/marketplace"
              className="px-4 py-2 rounded-xl text-xs font-bold text-navy-900 hover:bg-slate-100 transition-colors"
            >
              Public Marketplace
            </Link>
          </div>
        </header>

        {/* Dashboard Page Body */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
