import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Store,
  ChevronDown,
  ShoppingBag,
  Share2,
} from 'lucide-react';
import { RootState, logout, setActiveRole } from '../../store';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated, activeRole } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getDashboardPath = (role: UserRole | null) => {
    switch (role) {
      case 'admin':
        return '/dashboard/admin';
      case 'teacher':
        return '/dashboard/teacher';
      case 'businessman':
      case 'entrepreneur':
        return '/dashboard/business';
      case 'student':
      default:
        return '/dashboard/student';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - Stylized 3D Gold B + Bold Dark Text */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <span className="font-black text-2xl tracking-tighter text-[#0A255C] font-sans">B</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#0A255C] leading-none">Business</span>
            <span className="font-extrabold text-xl tracking-tight text-[#0A255C] leading-tight">Hub</span>
          </div>
        </Link>

        {/* Center Navigation Links matching reference image */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 text-sm font-semibold">
          {/* Home Active Pill (Solid Midnight Navy with White Text) */}
          <Link
            to="/"
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
              location.pathname === '/'
                ? 'bg-[#0A255C] text-white'
                : 'text-slate-700 hover:text-[#0A255C] hover:bg-slate-100'
            }`}
          >
            Home
          </Link>

          {/* Marketplace with Dropdown Chevron */}
          <Link
            to="/marketplace"
            className="flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-[#0A255C] hover:bg-slate-100 transition-colors"
          >
            <span>Marketplace</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Education with Dropdown Chevron */}
          <Link
            to="/education"
            className="flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-[#0A255C] hover:bg-slate-100 transition-colors"
          >
            <span>Education</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Jobs with Dropdown Chevron */}
          <Link
            to="/jobs"
            className="flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-[#0A255C] hover:bg-slate-100 transition-colors"
          >
            <span>Jobs</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Referrals */}
          <a
            href="#referrals"
            className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-[#0A255C] hover:bg-slate-100 transition-colors"
          >
            Referrals
          </a>

          {/* About */}
          <a
            href="#about"
            className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-[#0A255C] hover:bg-slate-100 transition-colors"
          >
            About
          </a>
        </nav>

        {/* Right Actions: Pill Search Bar, Notifications, Auth Buttons */}
        <div className="flex items-center gap-3 sm:gap-3.5 flex-shrink-0">
          {/* Pill Search Bar matching reference image */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-44 lg:w-56 rounded-full bg-slate-50 hover:bg-slate-100/90 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200/90 focus:border-amber-400 focus:outline-none transition-all shadow-inner"
            />
          </form>

          {/* Notification Bell matching image with Red '2' Counter Badge */}
          <div className="relative p-2 rounded-full text-slate-600 hover:text-[#0A255C] hover:bg-slate-100 transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm">
              {unreadCount > 0 ? unreadCount : 2}
            </span>
          </div>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full text-slate-600 hover:text-[#0A255C] hover:bg-slate-100 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-left"
              >
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-full object-cover bg-amber-100"
                />
                <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                  {user.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-xl">
                    <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  {user.roles && user.roles.length > 1 && (
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Switch Active Role</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map((r) => (
                          <button
                            key={r}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setActiveRole(r as UserRole));
                              navigate(getDashboardPath(r as UserRole));
                            }}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                              activeRole === r
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="py-1">
                    <Link
                      to={getDashboardPath(activeRole || user.roles[0])}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>My Profile</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Login Button with Pill Outline */}
              <Link
                to="/login"
                className="px-5 py-2 rounded-full text-xs font-bold text-[#0A255C] border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm"
              >
                Login
              </Link>
              {/* Sign Up Button with Solid Midnight Navy */}
              <Link
                to="/register"
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#0A255C] hover:bg-[#071B42] transition-all shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </form>

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#0A255C] text-white"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Marketplace
            </Link>
            <Link
              to="/education"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Education
            </Link>
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Jobs
            </Link>
            <a
              href="#referrals"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Referrals
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              About
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
