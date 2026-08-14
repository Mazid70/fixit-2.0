import React from 'react';
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Trash2,
  Clock,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'verification':
        return ShieldCheck;
      case 'report':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            Notification Center
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time updates regarding your repair orders, scheduling alerts, and platform dispatches.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You're all caught up! Booking updates and messages will appear here."
        />
      ) : (
        <div className="bg-[#141720] border border-neutral-800 rounded-3xl overflow-hidden divide-y divide-neutral-800/80 shadow-xl">
          {notifications.map((notif) => {
            const Icon = getNotifIcon(notif.type);
            return (
              <div
                key={notif._id}
                onClick={() => markAsRead(notif._id)}
                className={`p-5 transition cursor-pointer hover:bg-neutral-800/40 flex items-start gap-4 ${
                  !notif.is_read ? 'bg-orange-500/5' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    !notif.is_read
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4
                      className={`text-xs sm:text-sm font-bold truncate ${
                        !notif.is_read ? 'text-white' : 'text-neutral-300'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-neutral-500 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.created_at).toLocaleDateString()} at{' '}
                      {new Date(notif.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {notif.message}
                  </p>

                  {!notif.is_read && (
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                      • Unread
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
