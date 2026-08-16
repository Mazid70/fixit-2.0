import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Wrench,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  // Scroll System: Smart hide on scroll down, show on scroll up
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Determine if at top
        if (currentScrollY <= 20) {
          setIsVisible(true);
          setIsScrolled(false);
        } else {
          setIsScrolled(true);

          // Hide on scroll down, show on scroll up (with a threshold buffer)
          if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 70) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current - 10) {
            setIsVisible(true);
          }
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(e.target)
      ) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'provider') return '/dashboard/provider';
    return '/dashboard/customer';
  };

  const userAvatar =
    user?.avatar || user?.profile?.profile_image || user?.profile?.avatar;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full shadow-none'
      } ${
        isScrolled
          ? 'bg-[#080a0f]/95 backdrop-blur-xl border-b border-orange-500/15 shadow-[0_12px_36px_rgba(0,0,0,0.6)] py-2'
          : 'bg-[#0b0d11]/90 backdrop-blur-md border-b border-neutral-800/80 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
                <Shield className="w-4 h-4 fill-white" />
              </div>
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight text-white font-['Space_Grotesk']">
                  FIX<span className="text-orange-500">IT</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main Navigation"
            >
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  location.pathname.startsWith('/services')
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                Explore
              </Link>
              <Link
                to="/providers"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  location.pathname === '/providers'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                Performance
              </Link>
              <Link
                to="/become-provider"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  location.pathname === '/become-provider'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                Become a Partner
              </Link>
            </nav>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden lg:block flex-1 max-w-xs xl:max-w-sm mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search AC repair, electrician, plumber..."
                className="w-full bg-[#131620] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-8 pr-12 py-2 border border-[#212635] focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/70 transition"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-mono bg-[#1a1f2c] px-1.5 py-0.5 rounded border border-neutral-700">
                ↵
              </span>
            </form>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Authenticated Controls */}
            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="relative p-2 text-neutral-300 hover:text-white rounded-xl hover:bg-[#161a25] border border-transparent hover:border-[#232838] transition"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute 0 right-0 w-4 h-4 bg-orange-500 text-[9px] font-extrabold text-white flex items-center justify-center rounded-full ring-2 ring-[#0b0d11]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141722] border border-[#232838] rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#212635]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-200 font-['Space_Grotesk']">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-[#212635]/60">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-neutral-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 5).map(notif => (
                            <div
                              key={notif._id}
                              onClick={() => markAsRead(notif._id)}
                              className={`p-3 text-xs transition cursor-pointer hover:bg-[#1a1f2c] flex gap-2.5 items-start ${
                                !notif.is_read ? 'bg-orange-500/5' : ''
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                                  !notif.is_read
                                    ? 'bg-orange-500'
                                    : 'bg-transparent'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-neutral-200 text-xs truncate">
                                  {notif.title}
                                </p>
                                <p className="text-neutral-400 text-[11px] leading-relaxed line-clamp-2 mt-0.5">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-neutral-500 mt-1">
                                  {new Date(
                                    notif.created_at,
                                  ).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-2 border-t border-[#212635] text-center bg-[#11131a]">
                        <Link
                          to="/dashboard/notifications"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs font-bold text-orange-400 hover:text-orange-300 block py-1"
                        >
                          View All Notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Single-Line User Card Button in Navbar */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1 px-2 sm:px-2.5 rounded-xl bg-[#12151e] hover:bg-[#171b26] border border-[#212635] hover:border-orange-500/40 transition whitespace-nowrap"
                  >
                    <div className="relative shrink-0">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-lg object-cover border border-orange-500/30"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#0b0d11]" />
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-left">
                      <span className="text-xs font-bold text-neutral-200 truncate max-w-[85px] leading-none">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase leading-none">
                        {user.role}
                      </span>
                    </div>

                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#141722] border border-[#232838] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-[#212635] flex items-center gap-3">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-xl object-cover border border-orange-500/40 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#1a1f2c] transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-orange-400 shrink-0" />
                          <span>Console Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#1a1f2c] transition"
                        >
                          <User className="w-4 h-4 text-orange-400 shrink-0" />
                          <span>Account Settings</span>
                        </Link>
                        {user.role === 'customer' && (
                          <>
                            <Link
                              to="/dashboard/customer"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#1a1f2c] transition"
                            >
                              <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                              <span>My Appointments</span>
                            </Link>
                            <Link
                              to="/become-provider"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition"
                            >
                              <Briefcase className="w-4 h-4 shrink-0" />
                              <span>Become a Service Partner</span>
                            </Link>
                          </>
                        )}
                        {user.role === 'provider' && (
                          <Link
                            to="/dashboard/services"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#1a1f2c] transition"
                          >
                            <Layers className="w-4 h-4 text-orange-400 shrink-0" />
                            <span>Manage My Services</span>
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-purple-400 hover:bg-purple-500/10 transition"
                          >
                            <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-[#212635]">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-700/70 hover:border-neutral-500 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-1"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Removed scroll progress bar as requested */}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#212635] bg-[#0c0e14] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services in Dhaka, BD..."
              className="w-full bg-[#141722] text-xs text-neutral-200 rounded-xl pl-9 pr-4 py-2.5 border border-[#212635] focus:outline-none focus:border-orange-500"
            />
          </form>

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-[#161a25] transition"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-[#161a25] transition"
            >
              Explore Services
            </Link>
            <Link
              to="/providers"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-[#161a25] transition"
            >
              Performance & Technicians
            </Link>
            <Link
              to="/become-provider"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-orange-400 hover:bg-orange-500/10 transition"
            >
              Become a Partner
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-[#212635]">
              <Link
                to={getDashboardPath()}
                className="w-full block text-center py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 shadow-md shadow-orange-500/20"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#212635] grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="text-center py-2 rounded-xl text-xs font-semibold text-neutral-200 bg-[#161a25] border border-[#212635]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-center py-2 rounded-xl text-xs font-bold text-white bg-orange-500"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
