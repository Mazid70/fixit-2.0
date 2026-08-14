import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Calendar,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import BookingCard from '../components/bookings/BookingCard.jsx';
import ReportModal from '../components/reports/ReportModal.jsx';
import BookingHistoryModal from '../components/bookings/BookingHistoryModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeReportBooking, setActiveReportBooking] = useState(null);
  const [activeHistoryBooking, setActiveHistoryBooking] = useState(null);

  const fetchProviderHub = async () => {
    try {
      const [bookRes, srvRes] = await Promise.all([
        api.get('/bookings/provider-bookings'),
        api.get('/services/my-services'),
      ]);

      if (bookRes.data.success) setBookings(bookRes.data.data);
      if (srvRes.data.success) setServices(srvRes.data.data);
    } catch (err) {
      console.error('Failed to load provider hub:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderHub();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(`Order status updated to ${newStatus}`, 'success');
        fetchProviderHub();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Status transition error', 'error');
    }
  };

  // Metrics
  const pendingJobs = bookings.filter((b) => b.status === 'pending');
  const activeJobs = bookings.filter((b) => b.status === 'accepted');
  const completedJobs = bookings.filter((b) => b.status === 'completed');

  const totalEarnings = completedJobs.reduce((acc, curr) => {
    return acc + (curr.service?.price ? parseFloat(curr.service.price) : 0);
  }, 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-[#161a24] to-[#12151d] border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                PROVIDER COMMAND CENTER
              </span>
              <Badge variant={user?.profile?.verification_status || 'verified'}>
                {user?.profile?.verification_status || 'verified'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              {user?.profile?.business_name || user?.name}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Accept job requests, manage work orders, update booking status, and list new services.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/services"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Service</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          <div>
            <span className="text-2xl font-extrabold text-amber-400 font-['Space_Grotesk']">
              {pendingJobs.length}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Pending Requests</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-orange-400 font-['Space_Grotesk']">
              {activeJobs.length}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Active Dispatches</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
              {completedJobs.length}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Completed Jobs</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              ৳{totalEarnings.toLocaleString('en-US')}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Gross Revenue</p>
          </div>
        </div>
      </div>

      {/* Pending Incoming Bookings Alert */}
      {pendingJobs.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-300">
                You have {pendingJobs.length} pending client booking requests awaiting confirmation!
              </p>
              <p className="text-[11px] text-amber-200/70">
                Review dates and client locations to accept or decline promptly.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/bookings"
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold shrink-0 transition"
          >
            Review Orders
          </Link>
        </div>
      )}

      {/* Active Work Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Recent Service Orders
          </h2>
          <Link
            to="/dashboard/bookings"
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading incoming work orders..." />
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center bg-[#141720] border border-neutral-800 rounded-2xl">
            <p className="text-xs text-neutral-400">No active work orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bookings.slice(0, 6).map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                currentRole="provider"
                onUpdateStatus={handleUpdateStatus}
                onOpenReport={(b) => setActiveReportBooking(b)}
                onViewHistory={(b) => setActiveHistoryBooking(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeReportBooking && (
        <ReportModal
          booking={activeReportBooking}
          onClose={() => setActiveReportBooking(null)}
          onSuccess={() => setActiveReportBooking(null)}
        />
      )}

      {activeHistoryBooking && (
        <BookingHistoryModal
          booking={activeHistoryBooking}
          onClose={() => setActiveHistoryBooking(null)}
        />
      )}
    </div>
  );
}
