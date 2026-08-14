import React, { useState, useEffect } from 'react';
import {
  Star,
  User,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const endpoint =
          user?.role === 'provider'
            ? `/reviews?provider_id=${user?._id}`
            : `/reviews?customer_id=${user?._id}`;

        const res = await api.get(endpoint);
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            {user?.role === 'provider' ? 'Customer Feedback & Ratings' : 'My Service Reviews'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {user?.role === 'provider'
              ? 'Read customer feedback and review job ratings on your completed work orders.'
              : 'Ratings and written feedback you have shared with technicians on FIXIT.'}
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#141720] border border-neutral-800">
            <span className="text-xs text-neutral-400">Average Rating:</span>
            <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{avgRating}</span>
              <span className="text-neutral-500 font-normal text-xs">({reviews.length})</span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving feedback records..." />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No Reviews Found"
          description={
            user?.role === 'provider'
              ? 'You have not received any customer reviews yet. Complete bookings to collect feedback!'
              : "You haven't submitted any reviews for completed services yet."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-[#141720] border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs border border-orange-500/30">
                      {(rev.user?.name || rev.service?.title || 'R').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-100">
                        {user?.role === 'provider'
                          ? rev.user?.name || 'Verified Customer'
                          : rev.service?.title || 'Service Booking'}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {new Date(rev.created_at).toLocaleDateString()} at{' '}
                        {new Date(rev.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 italic leading-relaxed bg-[#0e1117] p-3.5 rounded-xl border border-neutral-800/60">
                  "{rev.review}"
                </p>
              </div>

              {rev.booking_id && (
                <div className="text-[10px] text-neutral-500 font-mono">
                  Ref Booking: #{String(rev.booking_id).slice(-8)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
