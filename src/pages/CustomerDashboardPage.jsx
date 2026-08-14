import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Star,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import BookingCard from '../components/bookings/BookingCard.jsx';
import ReviewModal from '../components/reviews/ReviewModal.jsx';
import ReportModal from '../components/reports/ReportModal.jsx';
import BookingHistoryModal from '../components/bookings/BookingHistoryModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeReviewBooking, setActiveReviewBooking] = useState(null);
  const [activeReportBooking, setActiveReportBooking] = useState(null);
  const [activeHistoryBooking, setActiveHistoryBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(`Booking status updated to ${newStatus}`, 'success');
        fetchBookings();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update booking status', 'error');
    }
  };

  // Metrics
  const activeCount = bookings.filter((b) => ['pending', 'accepted'].includes(b.status)).length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const reviewsGivenCount = bookings.filter((b) => b.review).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500/15 via-[#161a24] to-[#12151d] border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              CUSTOMER OVERVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] mt-1">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Track on-going repair dispatches, inspect status timelines, and review completed service orders.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Service</span>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          <div>
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {activeCount}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">In-Progress Orders</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
              {completedCount}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Completed Jobs</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-amber-400 font-['Space_Grotesk']">
              {reviewsGivenCount}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Reviews Submitted</p>
          </div>
        </div>
      </div>

      {/* Become a Partner Callout Card for Customers */}
      <div className="bg-[#12151e] border border-[#212635] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-orange-400 flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Offer Your Skills on FIXIT</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Are you an electrician, AC specialist, plumber, or contractor? Apply for verified partner status.
            </p>
          </div>
        </div>
        <Link
          to="/become-provider"
          className="px-4 py-2.5 rounded-xl bg-[#191d2a] hover:bg-orange-500 hover:text-white border border-[#262c3e] text-neutral-200 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
        >
          <span>Apply to be a Provider</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Recent Service Bookings
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
          <LoadingSpinner message="Retrieving service requests..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No Bookings Yet"
            description="You haven't requested any home repairs or specialist services yet."
            actionText="Explore Marketplace"
            onAction={() => window.location.assign('/services')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bookings.slice(0, 6).map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                currentRole="customer"
                onUpdateStatus={handleUpdateStatus}
                onOpenReview={(b) => setActiveReviewBooking(b)}
                onOpenReport={(b) => setActiveReportBooking(b)}
                onViewHistory={(b) => setActiveHistoryBooking(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeReviewBooking && (
        <ReviewModal
          booking={activeReviewBooking}
          onClose={() => setActiveReviewBooking(null)}
          onSuccess={() => {
            setActiveReviewBooking(null);
            fetchBookings();
          }}
        />
      )}

      {activeReportBooking && (
        <ReportModal
          booking={activeReportBooking}
          onClose={() => setActiveReportBooking(null)}
          onSuccess={() => {
            setActiveReportBooking(null);
          }}
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
