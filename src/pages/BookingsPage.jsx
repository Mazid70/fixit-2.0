import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
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
import Pagination from '../components/common/Pagination.jsx';

export default function BookingsPage() {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);

  const [activeReviewBooking, setActiveReviewBooking] = useState(null);
  const [activeReportBooking, setActiveReportBooking] = useState(null);
  const [activeHistoryBooking, setActiveHistoryBooking] = useState(null);

  const fetchBookings = async (p = 1, currentLimit = limit) => {
    setLoading(true);
    try {
      const endpoint =
        user?.role === 'provider'
          ? '/bookings/provider-bookings'
          : '/bookings/my-bookings';

      const res = await api.get(endpoint, {
        params: {
          page: p,
          limit: currentLimit,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      });
      if (res.data.success) {
        setBookings(res.data.data);
        setPage(res.data.page || p);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.total || res.data.totalBookings || res.data.data?.length || 0);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load bookings:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setPage(1);
      fetchBookings(1, limit);
    }
  }, [user, statusFilter, limit]);

  const handlePageSizeChange = (newSize) => {
    setLimit(newSize);
    setPage(1);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        addToast(`Booking status updated to ${newStatus}`, 'success');
        fetchBookings(page, limit);
      }
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Failed to update status',
        'error',
      );
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus =
      statusFilter === 'all' ||
      b.status === statusFilter ||
      (statusFilter === 'accepted' && b.status === 'confirmed');
    const term = searchTerm.toLowerCase();
    const serviceTitle = (b.service?.title || '').toLowerCase();
    const customerName = (b.customer?.name || '').toLowerCase();
    const providerName = (b.provider?.business_name || '').toLowerCase();
    const notes = (b.notes || '').toLowerCase();

    const matchesSearch =
      !term ||
      serviceTitle.includes(term) ||
      customerName.includes(term) ||
      providerName.includes(term) ||
      notes.includes(term);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            {user?.role === 'provider'
              ? 'Work Orders & Job Requests'
              : 'My Service Bookings'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage scheduled repairs, real-time dispatch progress, and booking
            records.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141720] border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            'all',
            'pending',
            'accepted',
            'completed',
            'cancelled',
            'rejected',
          ].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-[#0e1117] text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {st}{' '}
              {st !== 'all' &&
                `(${bookings.filter(b => b.status === st).length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-64">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by job or name..."
              className="w-full bg-[#0e1117] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-4 py-2 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
            />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching order records..." />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings match your filter"
          description={
            statusFilter !== 'all'
              ? `There are no ${statusFilter} service bookings right now.`
              : 'You have no bookings on record.'
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredBookings.map(booking => (
              <BookingCard
                key={booking._id}
                booking={booking}
                currentRole={user?.role}
                onUpdateStatus={handleUpdateStatus}
                onOpenReview={b => setActiveReviewBooking(b)}
                onOpenReport={b => setActiveReportBooking(b)}
                onViewHistory={b => setActiveHistoryBooking(b)}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={p => fetchBookings(p)}
            totalItems={totalItems || filteredBookings.length}
            pageSize={limit}
            pageSizeOptions={[5, 10, 20]}
            onPageSizeChange={handlePageSizeChange}
            itemName="bookings"
          />
        </>
      )}

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
