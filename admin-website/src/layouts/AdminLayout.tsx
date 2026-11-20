import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  Building,
  Store,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { RootState, adminLogout } from '../store';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.adminAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'User Management', path: '/users', icon: Users },
    { label: 'Business Approvals', path: '/businesses', icon: Building },
    { label: 'Marketplace', path: '/marketplace', icon: Store },
    { label: 'Orders & Fulfillment', path: '/orders', icon: ShoppingBag },
    { label: 'Teacher Payments', path: '/teacher-payments', icon: DollarSign },
    { label: 'Security & Audit Logs', path: '/audit-logs', icon: ShieldCheck },
    { label: 'Platform Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-lg text-slate-300">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-extrabold text-base tracking-tight text-white">
          Business Hub <span className="text-teal-400">Admin</span>
        </span>
        <button onClick={handleLogout} className="text-xs font-bold text-red-400">
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Logo & Close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-black">
                BH
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">Business</span>
                <span className="font-extrabold text-lg text-teal-400">Hub</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Control</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Profile Chip */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600/30 text-teal-400 flex items-center justify-center font-bold text-xs">
              👑
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-white truncate">{user?.fullName || 'Sarah Sterling'}</p>
              <p className="text-[10px] text-teal-400 font-semibold uppercase">Super Administrator</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="hidden md:flex h-20 bg-slate-950 border-b border-slate-800 px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Centralized Enterprise Operations
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-700 transition-colors"
            >
              Open Public Users Site ↗
            </a>
          </div>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
