import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Bell, Menu, X, User, LogOut, LayoutDashboard, GraduationCap, Briefcase, Store, ChevronDown, ShoppingBag, Users, Calendar, ChevronRight, Info, PhoneCall, } from 'lucide-react';
import { logout, setActiveRole } from '../../store';
export const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExploreOpen, setMobileExploreOpen] = useState(true);
    const [exploreOpen, setExploreOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeNav, setActiveNav] = useState('home');
    const exploreRef = useRef(null);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const searchContainerRef = useRef(null);
    const searchInputRef = useRef(null);
    const { user, isAuthenticated, activeRole } = useSelector((state) => state.auth);
    const { itemCount } = useSelector((state) => state.cart);
    const { unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // Active navigation tracking based on pathname and hash
    useEffect(() => {
        if (location.pathname === '/about' || location.hash === '#about') {
            setActiveNav('about');
        }
        else if (location.pathname === '/contact' || location.hash === '#contact') {
            setActiveNav('contact');
        }
        else if (location.pathname.startsWith('/marketplace') ||
            location.pathname.startsWith('/education') ||
            location.pathname.startsWith('/jobs') ||
            location.pathname.startsWith('/business') ||
            location.pathname.startsWith('/community') ||
            location.pathname.startsWith('/events') ||
            location.pathname.startsWith('/teacher') ||
            location.pathname.startsWith('/student') ||
            location.hash === '#explore-services' ||
            location.hash === '#referrals') {
            setActiveNav('explore');
        }
        else if (location.pathname === '/' && !location.hash) {
            setActiveNav('home');
        }
        else {
            setActiveNav('');
        }
    }, [location.pathname, location.hash]);
    // Click outside listener for all dropdown menus
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            if (exploreRef.current && !exploreRef.current.contains(target)) {
                setExploreOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(target)) {
                setNotificationOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(target)) {
                setProfileDropdownOpen(false);
            }
            if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
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
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setMobileMenuOpen(false);
        }
    };
    const handleAnchorClick = (e, hash) => {
        e.preventDefault();
        setExploreOpen(false);
        setMobileMenuOpen(false);
        if (hash === 'about')
            setActiveNav('about');
        if (hash === 'contact')
            setActiveNav('contact');
        if (location.pathname === '/') {
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        else {
            navigate(`/#${hash}`);
        }
    };
    const getNavClass = (key) => {
        const isActive = exploreOpen ? key === 'explore' : activeNav === key;
        return `px-4 xl:px-5 py-2 rounded-full text-xs transition-all duration-150 cursor-pointer ${isActive
            ? 'bg-[#0A255C] text-white shadow-md font-bold'
            : 'text-slate-700 hover:text-[#0A255C] hover:bg-slate-100 font-semibold'}`;
    };
    const getDashboardPath = (role) => {
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
    // 6 Explore dropdown items specified in requirements
    const exploreItems = [
        {
            title: 'Marketplace',
            description: 'Shop products, deals & verified sellers',
            link: '/marketplace',
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Education',
            description: '100% free courses, tutorials & tuition',
            link: '/education',
            icon: GraduationCap,
            color: 'bg-teal-50 text-teal-700',
        },
        {
            title: 'Jobs & Careers',
            description: 'Verified openings & hiring portal',
            link: '/jobs',
            icon: Briefcase,
            color: 'bg-indigo-50 text-indigo-700',
        },
        {
            title: 'Business',
            description: 'Storefronts, merchant tools & commerce',
            link: '/business',
            icon: Store,
            color: 'bg-amber-50 text-amber-700',
        },
        {
            title: 'Community',
            description: 'Student & teacher forums, peer groups',
            link: '/community',
            icon: Users,
            color: 'bg-sky-50 text-sky-700',
        },
        {
            title: 'Events',
            description: 'Live masterclasses, webinars & classes',
            link: '/events',
            icon: Calendar,
            color: 'bg-rose-50 text-rose-600',
        },
    ];
    return (<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* =====================================================================
            1. BRAND LOGO (Left side)
        ====================================================================== */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0 select-none">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform duration-200">
            <span className="font-black text-2xl tracking-tighter text-[#0A255C] font-sans">B</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#0A255C] leading-none">Business</span>
            <span className="font-extrabold text-xl tracking-tight text-[#0A255C] leading-tight">Hub</span>
          </div>
        </Link>

        {/* =====================================================================
            2. CENTER NAVIGATION: Home | About | Explore ▼ | Contact
            Clean, minimal, uncrowded layout
        ====================================================================== */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 text-sm font-semibold">
          {/* 1. Home */}
          <Link to="/" onClick={() => {
            setActiveNav('home');
            setExploreOpen(false);
            if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState(null, '', '/');
            }
        }} className={getNavClass('home')}>
            Home
          </Link>

          {/* 2. About */}
          <Link to="/about" onClick={() => {
            setActiveNav('about');
            setExploreOpen(false);
        }} className={getNavClass('about')}>
            About
          </Link>

          {/* 3. Explore Dropdown */}
          <div ref={exploreRef}>
            <button type="button" onClick={() => {
            setExploreOpen((prev) => !prev);
            setNotificationOpen(false);
            setProfileDropdownOpen(false);
        }} className={`flex items-center gap-1.5 ${getNavClass('explore')}`} aria-expanded={exploreOpen} aria-haspopup="true">
              <span>Explore</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exploreOpen || activeNav === 'explore' ? 'text-white' : 'text-slate-500'} ${exploreOpen ? 'rotate-180' : ''}`}/>
            </button>

            {/* Explore Horizontal Mega-Menu Card */}
            {exploreOpen && (<div className="absolute left-0 right-0 top-full mt-2 px-4 sm:px-6 lg:px-8 z-50 pointer-events-none">
                <div className="max-w-[1220px] mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
                  {/* Dropdown Header */}
                  <div className="px-2 pb-2.5 border-b border-slate-100 mb-3 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Explore Platform Services
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                      6 Portals
                    </span>
                  </div>

                  {/* Single Horizontal Row with 6 items: Marketplace, Education, Jobs & Careers, Business, Community, Events */}
                  <div className="grid grid-cols-6 gap-2.5">
                    {exploreItems.map((item, idx) => {
                const Icon = item.icon;
                return (<Link key={idx} to={item.link} onClick={() => {
                        setActiveNav('explore');
                        setExploreOpen(false);
                    }} className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl hover:bg-slate-50 transition-all duration-150 group cursor-pointer border border-transparent hover:border-slate-200/70">
                          <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:shadow-sm transition-all duration-150`}>
                            <Icon className="w-5 h-5"/>
                          </div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-[#0A255C] transition-colors mt-2.5 truncate w-full">
                            {item.title}
                          </p>
                        </Link>);
            })}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="pt-2.5 mt-3 border-t border-slate-100 flex items-center justify-between px-2 text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">All in one ecosystem</span>
                    <button type="button" onClick={(e) => handleAnchorClick(e, 'explore-services')} className="font-bold text-[#0A255C] hover:text-[#D97706] flex items-center gap-1 transition-colors text-[11px]">
                      <span>View All Services on Homepage</span>
                      <ChevronRight className="w-3 h-3"/>
                    </button>
                  </div>
                </div>
              </div>)}
          </div>

          {/* 4. Contact */}
          <Link to="/contact" onClick={() => {
            setActiveNav('contact');
            setExploreOpen(false);
        }} className={getNavClass('contact')}>
            Contact
          </Link>
        </nav>

        {/* =====================================================================
            3. RIGHT ACTIONS: Search | Notifications | Login | Sign Up (or Profile)
        ====================================================================== */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Search Icon / Expandable Search Bar */}
          <div className="relative" ref={searchContainerRef}>
            {!searchOpen ? (<button type="button" onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 60);
            }} className="p-2 rounded-full text-slate-600 hover:text-[#0A255C] hover:bg-slate-100 transition-colors cursor-pointer" title="Search marketplace" aria-label="Search">
                <Search className="w-5 h-5"/>
              </button>) : (<form onSubmit={handleSearchSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 z-50 flex items-center animate-in fade-in zoom-in-95 duration-150">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none"/>
                  <input ref={searchInputRef} type="text" placeholder="Search products, courses, jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Escape')
                    setSearchOpen(false);
            }} className="pl-9 pr-9 py-2 w-56 sm:w-64 md:w-72 rounded-full bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-300 focus:border-[#0A255C] focus:outline-none transition-all shadow-xl ring-2 ring-slate-100"/>
                  <button type="button" onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
            }} className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100" aria-label="Close search">
                    <X className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </form>)}
          </div>

          {/* Notifications Icon with Badge */}
          <div className="relative" ref={notificationRef}>
            <button type="button" onClick={() => {
            setNotificationOpen((prev) => !prev);
            setExploreOpen(false);
            setProfileDropdownOpen(false);
        }} className="relative p-2 rounded-full text-slate-600 hover:text-[#0A255C] hover:bg-slate-100 transition-colors cursor-pointer" title="Notifications" aria-label="Notifications">
              <Bell className="w-5 h-5"/>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                {unreadCount > 0 ? unreadCount : 2}
              </span>
            </button>

            {/* Notification Popover Dropdown */}
            {notificationOpen && (<div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 px-1">
                  <h4 className="text-xs font-bold text-[#0A255C]">Notifications</h4>
                  <span className="text-[10px] font-semibold text-slate-400">Recent</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors text-left cursor-pointer">
                    <p className="text-xs font-bold text-slate-800">Welcome to Business Hub!</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Explore free certified courses, store listings, and verified jobs.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors text-left cursor-pointer">
                    <p className="text-xs font-bold text-slate-800">New Free Live Classes Added</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Check out upcoming engineering and marketing live workshops.</p>
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                  <button type="button" onClick={() => setNotificationOpen(false)} className="text-[11px] font-bold text-[#0A255C] hover:text-[#D97706] transition-colors">
                    Close
                  </button>
                </div>
              </div>)}
          </div>

          {/* Cart Icon (Keeps functionality when items are in cart without cluttering empty state) */}
          {itemCount > 0 && (<Link to="/cart" className="relative p-2 rounded-full text-slate-600 hover:text-[#0A255C] hover:bg-slate-100 transition-colors" title="Shopping Cart">
              <ShoppingBag className="w-5 h-5"/>
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            </Link>)}

          {/* Auth State: Profile dropdown if logged in, else Login */}
          {isAuthenticated && user ? (<div className="relative" ref={profileRef}>
              <button type="button" onClick={() => {
                setProfileDropdownOpen((prev) => !prev);
                setExploreOpen(false);
                setNotificationOpen(false);
            }} className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-left">
                <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt={user.fullName} className="w-7 h-7 rounded-full object-cover bg-amber-100"/>
                <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                  {user.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400"/>
              </button>

              {profileDropdownOpen && (<div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2" onClick={() => setProfileDropdownOpen(false)}>
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-xl">
                    <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  {user.roles && user.roles.length > 1 && (<div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
                        Switch Active Role
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map((r) => (<button key={r} type="button" onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setActiveRole(r));
                            navigate(getDashboardPath(r));
                        }} className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${activeRole === r
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {r}
                          </button>))}
                      </div>
                    </div>)}

                  <div className="py-1">
                    <Link to={getDashboardPath(activeRole || user.roles[0])} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">
                      <LayoutDashboard className="w-4 h-4 text-slate-500"/>
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">
                      <User className="w-4 h-4 text-slate-500"/>
                      <span>My Profile</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left">
                      <LogOut className="w-4 h-4"/>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>)}
            </div>) : (<div className="flex items-center">
              {/* Single Login Button with Solid Midnight Navy */}
              <Link to="/login" className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#0A255C] hover:bg-[#071B42] transition-all shadow-md hover:shadow-lg">
                Login
              </Link>
            </div>)}

          {/* Mobile Menu Toggle Button */}
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#0A255C] hover:bg-slate-100 transition-colors" aria-label="Toggle Navigation Menu">
            {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>
      </div>

      {/* =====================================================================
            4. MOBILE & TABLET MENU DRAWER
            Fully responsive hamburger menu with expandable Explore section
        ====================================================================== */}
      {mobileMenuOpen && (<div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none"/>
            <input type="text" placeholder="Search products, courses, jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-full bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0A255C]"/>
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1">
            {/* 1. Home */}
            <Link to="/" onClick={() => {
                setActiveNav('home');
                setMobileMenuOpen(false);
            }} className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeNav === 'home'
                ? 'bg-[#0A255C] text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-50'}`}>
              Home
            </Link>

            {/* 2. About */}
            <Link to="/about" onClick={() => {
                setActiveNav('about');
                setMobileMenuOpen(false);
            }} className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left flex items-center justify-between transition-all ${activeNav === 'about'
                ? 'bg-[#0A255C] text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-50'}`}>
              <span>About</span>
              <Info className="w-4 h-4 opacity-70"/>
            </Link>

            {/* 3. Expandable Explore Section */}
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50">
              <button type="button" onClick={() => setMobileExploreOpen((prev) => !prev)} className={`w-full px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors ${activeNav === 'explore' ? 'text-[#0A255C] font-bold' : 'text-slate-700'}`}>
                <span className="flex items-center gap-2">
                  <span>Explore</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    6 Portals
                  </span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${mobileExploreOpen ? 'rotate-180' : ''}`}/>
              </button>

              {mobileExploreOpen && (<div className="px-2 pb-2.5 space-y-1 bg-white border-t border-slate-100 pt-1.5">
                  {exploreItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (<Link key={idx} to={item.link} onClick={() => {
                            setActiveNav('explore');
                            setMobileMenuOpen(false);
                        }} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800">{item.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300"/>
                      </Link>);
                })}
                </div>)}
            </div>

            {/* 4. Contact */}
            <Link to="/contact" onClick={() => {
                setActiveNav('contact');
                setMobileMenuOpen(false);
            }} className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left flex items-center justify-between transition-all ${activeNav === 'contact'
                ? 'bg-[#0A255C] text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-50'}`}>
              <span>Contact</span>
              <PhoneCall className="w-4 h-4 opacity-70"/>
            </Link>
          </div>

          {/* Mobile Auth Actions */}
          {!isAuthenticated ? (<div className="pt-3 border-t border-slate-100">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 rounded-full text-xs font-bold text-white bg-[#0A255C] hover:bg-[#071B42] text-center transition-all shadow-md">
                Login
              </Link>
            </div>) : (<div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-3 px-2">
                <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`} alt={user?.fullName} className="w-8 h-8 rounded-full object-cover bg-amber-100"/>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to={getDashboardPath(activeRole || user?.roles[0] || null)} onClick={() => setMobileMenuOpen(false)} className="py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 text-center hover:bg-slate-200">
                  Dashboard
                </Link>
                <button type="button" onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                }} className="py-2 rounded-xl bg-red-50 text-xs font-bold text-red-600 text-center hover:bg-red-100">
                  Sign Out
                </button>
              </div>
            </div>)}
        </div>)}
    </header>);
};
