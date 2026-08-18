import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Star,
  Bell,
  User,
  Users,
  ShieldCheck,
  AlertTriangle,
  FolderTree,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import Badge from './Badge.jsx';

export default function Sidebar() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  if (!user) return null;

  const role =
    user.role === 'admin'
      ? 'admin'
      : user.role === 'provider' ||
        user.providerProfile?.verification_status === 'verified' ||
        user.verification_status === 'verified'
      ? 'provider'
      : 'customer';

  const customerLinks = [
    { name: 'Dashboard', to: '/dashboard/customer', icon: LayoutDashboard },
    { name: 'My Bookings', to: '/dashboard/bookings', icon: Calendar },
    { name: 'My Reviews', to: '/dashboard/reviews', icon: Star },
    { name: 'Become a Partner', to: '/become-provider', icon: ShieldCheck },
    { name: 'Notifications', to: '/dashboard/notifications', icon: Bell, count: unreadCount },
    { name: 'Account Profile', to: '/profile', icon: User },
  ];

  const providerLinks = [
    { name: 'Provider Hub', to: '/dashboard/provider', icon: LayoutDashboard },
    { name: 'My Services', to: '/dashboard/services', icon: Layers },
    { name: 'Bookings & Orders', to: '/dashboard/bookings', icon: Calendar },
    { name: 'Customer Reviews', to: '/dashboard/reviews', icon: Star },
    { name: 'Notifications', to: '/dashboard/notifications', icon: Bell, count: unreadCount },
    { name: 'Business Profile', to: '/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Admin Overview', to: '/admin', icon: LayoutDashboard },
    { name: 'User Management', to: '/admin/users', icon: Users },
    { name: 'Provider Approvals', to: '/admin/providers', icon: ShieldCheck },
    { name: 'Categories', to: '/admin/categories', icon: FolderTree },
    { name: 'All Bookings', to: '/admin/bookings', icon: Calendar },
    { name: 'Incident Reports', to: '/admin/reports', icon: AlertTriangle },
    { name: 'Notifications', to: '/dashboard/notifications', icon: Bell, count: unreadCount },
    { name: 'Admin Profile', to: '/profile', icon: User },
  ];

  const activeLinks =
    role === 'admin' ? adminLinks : role === 'provider' ? providerLinks : customerLinks;

  return (
    <>
      {/* Mobile/Tablet Horizontal Scrollable Segmented Tabs (< lg) */}
      <div className="lg:hidden w-full bg-[#10131a] border-b border-neutral-800/80 px-3 py-2.5 sticky top-[57px] z-30 backdrop-blur-md bg-[#10131a]/95">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {activeLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={`mob-${item.to}`}
                to={item.to}
                end={item.to === '/admin' || item.to === '/dashboard/customer' || item.to === '/dashboard/provider'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                      : 'bg-[#161a25] text-neutral-300 hover:text-white border border-[#222838]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
                {item.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-white text-orange-600">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Desktop Persistent Vertical Sidebar (>= lg) */}
      <aside className="hidden lg:flex w-64 bg-[#10131a] border-r border-neutral-800 shrink-0 p-4 min-h-[calc(100vh-4.5rem)] flex-col justify-between">
        <div>
          {/* User Card */}
          <div className="p-3.5 mb-6 rounded-2xl bg-[#161a24] border border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-100 truncate">{user.name}</p>
                <Badge variant={user.role} className="mt-1 text-[10px]">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {role.toUpperCase()} PORTAL
            </p>
            {activeLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin' || item.to === '/dashboard/customer' || item.to === '/dashboard/provider'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.count > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white text-orange-600">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Quick Help box */}
        <div className="mt-8 p-3.5 rounded-xl bg-[#141720] border border-neutral-800 text-xs text-neutral-400">
          <p className="font-semibold text-neutral-200 mb-1">FIXIT Dispatch</p>
          <p className="text-[11px] leading-relaxed">
            Need assistance with a job? Contact dispatch directly from your active booking records.
          </p>
        </div>
      </aside>
    </>
  );
}
