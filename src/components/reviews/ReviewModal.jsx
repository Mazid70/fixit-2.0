import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import api from '../../api/axios.js';
import { useNotifications } from '../../context/NotificationContext.jsx';

export default function ReviewModal({ isOpen, onClose, booking, onReviewSuccess }) {
  const { addToast } = useNotifications();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError('Please select a star rating.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/reviews', {
        booking_id: booking._id,
        rating,
        review: review.trim(),
      });

      if (res.data.success) {
        addToast('Review submitted successfully! Thank you.', 'success');
        if (onReviewSuccess) onReviewSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Service Review" maxWidth="max-w-md">
      <div className="mb-4">
        <p className="text-xs text-neutral-400">
          How was your experience with{' '}
          <strong className="text-neutral-200">
            {booking.provider?.business_name || 'the service specialist'}
          </strong>{' '}
          for "{booking.service?.title}"?
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Interactive Star Rating */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-2 text-center">
            Your Rating
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-2xl transition hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-bold text-amber-400 mt-1">
            {rating === 5 && '5.0 — Outstanding / Highly Recommended'}
            {rating === 4 && '4.0 — Great Craftsmanship'}
            {rating === 3 && '3.0 — Satisfactory / Average'}
            {rating === 2 && '2.0 — Needs Improvement'}
            {rating === 1 && '1.0 — Poor Experience'}
          </p>
        </div>

        {/* Review feedback text */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
            <span>Written Feedback (Optional)</span>
          </label>
          <textarea
            rows={3}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share details regarding punctuality, cleanliness, repair accuracy, and professionalism..."
            className="w-full bg-[#0d0f14] text-xs text-neutral-200 rounded-xl p-3 border border-neutral-800 focus:border-orange-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white shadow-lg shadow-orange-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Post Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
