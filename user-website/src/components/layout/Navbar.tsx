import React, { useState, useRef, useEffect } from 'react';
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
  Video,
  Layers,
  ChevronRight,
  Info,
  BookOpen,
} from 'lucide-react';
import { RootState, logout, setActiveRole } from '../../store';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [allMenuOpen, setAllMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState<string>('home');

  const allMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { user, isAuthenticated, activeRole } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#about') {
      setActiveNav('about');
    } else if (location.hash === '#referrals' || location.hash === '#explore-services') {
      setActiveNav('all');
    } else if (location.pathname.startsWith('/marketplace')) {
      setActiveNav('marketplace');
    } else if (location.pathname.includes('/business')) {
      setActiveNav('business');
    } else if (location.pathname.includes('/student') || location.pathname.startsWith('/education')) {
      setActiveNav('student');
    } else if (location.pathname.includes('/teacher')) {
      setActiveNav('teacher');
    } else if (location.pathname === '/' && !location.hash) {
      setActiveNav('home');
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (allMenuRef.current && !allMenuRef.current.contains(event.target as Node)) {
        setAllMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setAllMenuOpen(false);
    setMobileMenuOpen(false);
    if (hash === 'about') setActiveNav('about');
    if (hash === 'explore-services' || hash === 'referrals') setActiveNav('all');
    if (location.pathname === '/') {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${hash}`);
    }
  };

  const getNavClass = (key: string) => {
    const isActive = activeNav === key;
    return `px-4 xl:px-5 py-2 rounded-full text-xs transition-all cursor-pointer ${
      isActive
        ? 'bg-[#0A255C] text-white shadow-md font-bold'
        : 'text-slate-700 hover:text-[#0A255C] hover:bg-slate-100 font-semibold'
    }`;
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

        {/* Center Navigation Links: Home, Marketplace, Business, Student, Teacher, All, About */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold">
          {/* 1. Home */}
          <Link
            to="/"
            onClick={() => {
              setActiveNav('home');
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState(null, '', '/');
              }
            }}
            className={getNavClass('home')}
          >
            Home
          </Link>

          {/* 2. Marketplace */}
          <Link
            to="/marketplace"
            onClick={() => setActiveNav('marketplace')}
            className={getNavClass('marketplace')}
          >
            Marketplace
          </Link>

          {/* 3. Business */}
          <Link
            to="/business"
            onClick={() => setActiveNav('business')}
            className={getNavClass('business')}
          >
            Business
          </Link>

          {/* 4. Student */}
          <Link
            to={isAuthenticated ? '/dashboard/student' : '/education'}
            onClick={() => setActiveNav('student')}
            className={getNavClass('student')}
          >
            Student
          </Link>

          {/* 5. Teacher */}
          <Link
            to="/teacher"
            onClick={() => setActiveNav('teacher')}
            className={getNavClass('teacher')}
          >
            Teacher
          </Link>

          {/* 6. All Dropdown */}
          <div className="relative" ref={allMenuRef}>
            <button
              onClick={() => {
                setActiveNav('all');
                setAllMenuOpen(!allMenuOpen);
              }}
              className={`flex items-center gap-1 ${getNavClass('all')}`}
            >
              <span>All</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeNav === 'all' ? 'text-white' : 'text-slate-500'
                } ${allMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* "All" Dropdown Menu */}
            {allMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    All Categories & Portals
                  </p>
                </div>
                <div className="space-y-1">
                  <Link
                    to="/marketplace"
                    onClick={() => {
                      setActiveNav('marketplace');
                      setAllMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50/70 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Marketplace</p>
                      <p className="text-[11px] text-slate-500">Shop, deals & order items</p>
                    </div>
                  </Link>

                  <Link
                    to="/education"
                    onClick={() => {
                      setActiveNav('student');
                      setAllMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-teal-50/70 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-teal-800">100% Free Education</p>
                      <p className="text-[11px] text-slate-500">Free courses, materials & tuition</p>
                    </div>
                  </Link>

                  <Link
                    to="/education/live-classes"
                    onClick={() => {
                      setActiveNav('teacher');
                      setAllMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cyan-50/70 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-800">Live Classes</p>
                      <p className="text-[11px] text-slate-500">Interactive live streaming rooms</p>
                    </div>
                  </Link>

                  <Link
                    to="/jobs"
                    onClick={() => {
                      setActiveNav('all');
                      setAllMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50/70 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-800">Jobs & Careers</p>
                      <p className="text-[11px] text-slate-500">Apply to verified vacancies</p>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => {
                      setActiveNav('all');
                      handleAnchorClick(e, 'referrals');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50/70 transition-colors group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-amber-800">Referrals & Clean Sharing</p>
                      <p className="text-[11px] text-slate-500">Share catalog & view analytics</p>
                    </div>
                  </button>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      setActiveNav('all');
                      handleAnchorClick(e, 'explore-services');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#0A255C] hover:text-white text-xs font-bold text-[#0A255C] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View All Services on Homepage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 7. About */}
          <button
            onClick={(e) => {
              setActiveNav('about');
              handleAnchorClick(e, 'about');
            }}
            className={getNavClass('about')}
          >
            About
          </button>
        </nav>

        {/* Right Actions: Search Icon Button, Notifications, Cart, Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Search Symbol Button (Clean Icon matching Bell & Cart) */}
          <div className="relative" ref={searchContainerRef}>
            {!searchOpen ? (
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="relative p-2 rounded-full text-slate-600 hover:text-[#0A255C] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Search"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            ) : (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 flex items-center animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                    className="pl-9 pr-9 py-2 w-56 sm:w-64 md:w-72 rounded-full bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-300 focus:border-amber-400 focus:outline-none transition-all shadow-xl ring-2 ring-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Notification Bell with Badge */}
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
                      <p className="text-[11px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
                        Switch Active Role
                      </p>
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
              onClick={() => {
                setActiveNav('home');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeNav === 'home' ? 'bg-[#0A255C] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              onClick={() => {
                setActiveNav('marketplace');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                activeNav === 'marketplace' ? 'bg-[#0A255C] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Marketplace</span>
              <ShoppingBag className="w-4 h-4" />
            </Link>
            <Link
              to="/business"
              onClick={() => {
                setActiveNav('business');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                activeNav === 'business' ? 'bg-[#0A255C] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Business</span>
              <Store className="w-4 h-4" />
            </Link>
            <Link
              to={isAuthenticated ? '/dashboard/student' : '/education'}
              onClick={() => {
                setActiveNav('student');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                activeNav === 'student' ? 'bg-[#0A255C] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Student</span>
              <GraduationCap className="w-4 h-4" />
            </Link>
            <Link
              to="/teacher"
              onClick={() => {
                setActiveNav('teacher');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                activeNav === 'teacher' ? 'bg-[#0A255C] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Teacher</span>
              <BookOpen className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => {
                setActiveNav('all');
                handleAnchorClick(e, 'explore-services');
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-all ${
                activeNav === 'all' ? 'bg-[#0A255C] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>All Services</span>
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                setActiveNav('about');
                handleAnchorClick(e, 'about');
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-all ${
                activeNav === 'about' ? 'bg-[#0A255C] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>About</span>
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
