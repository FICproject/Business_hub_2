import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
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
} from 'lucide-react';
import { RootState, logout, setActiveRole } from '../../store';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Education', path: '/education' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'About Us', path: '/#about' },
    { label: 'Contact', path: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-navy-800 via-navy-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform">
            <Store className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-navy-800">Business</span>
              <span className="font-extrabold text-2xl tracking-tight text-teal-600">Hub</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">All-in-One Platform</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-teal-600 bg-teal-50/70 font-semibold'
                    : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Cart, Notifications, Auth */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-navy-800 hover:bg-slate-100 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="relative">
              {/* Profile Avatar Trigger */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-left"
              >
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-lg object-cover bg-white"
                />
                <div className="hidden sm:block pr-1">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[110px]">{user.fullName}</p>
                  <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">{activeRole || user.roles[0]}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-xl">
                    <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  {/* Role Switcher if user has multiple roles */}
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
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-1">
                    <Link
                      to={getDashboardPath(activeRole)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-600" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-navy-800 hover:text-teal-600 hover:bg-slate-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 hover:shadow-lg transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-bold text-slate-700 border border-slate-200 rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-bold text-white bg-teal-600 rounded-xl shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
