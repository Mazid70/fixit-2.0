import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, LayoutDashboard, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';

export default function BottomNav() {
  const { user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'provider') return '/dashboard/provider';
    return '/dashboard/customer';
  };

  const navItems = [
    { name: 'Home', to: '/', icon: Home, exact: true },
    { name: 'Explore', to: '/services', icon: Search },
    {
      name: isAuthenticated ? 'Bookings' : 'Technicians',
      to: isAuthenticated ? '/dashboard/bookings' : '/providers',
      icon: Calendar,
    },
    {
      name: isAuthenticated ? (user?.role === 'admin' ? 'Admin' : 'Console') : 'Sign In',
      to: isAuthenticated ? getDashboardPath() : '/login',
      icon: isAuthenticated && user?.role === 'admin' ? ShieldCheck : LayoutDashboard,
    },
    {
      name: 'Account',
      to: isAuthenticated ? '/profile' : '/login',
      icon: User,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090b10]/95 backdrop-blur-xl border-t border-[#1e2433] px-2 py-1.5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 min-h-[46px] min-w-[54px] ${
                isActive
                  ? 'text-orange-400 font-bold scale-105'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-orange-500 text-[8px] font-black text-white rounded-full flex items-center justify-center ring-2 ring-[#090b10]">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'text-orange-400' : 'text-neutral-400'}`}>
                {item.name}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-4 h-0.5 bg-orange-500 rounded-full" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
