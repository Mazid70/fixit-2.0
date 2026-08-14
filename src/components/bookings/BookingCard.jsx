import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Star,
  AlertTriangle,
  History,
} from 'lucide-react';
import Badge from '../common/Badge.jsx';

export default function BookingCard({
  booking,
  currentRole = 'customer',
  onUpdateStatus,
  onOpenReview,
  onOpenReport,
  onViewHistory,
}) {
  if (!booking) return null;

  const service = booking.service || {};
  const customer = booking.customer || {};
  const provider = booking.provider || {};
  const bDate = new Date(booking.booking_date);

  return (
    <div className="bg-[#141720] border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700/80 transition shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-neutral-400">
              #{String(booking._id).slice(-6)}
            </span>
            <Badge variant={booking.status}>{booking.status}</Badge>
            {booking.review && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{booking.review.rating} Stars</span>
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-neutral-100">{service.title || 'Service Booking'}</h3>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-lg font-extrabold text-orange-500 font-['Space_Grotesk']">
            ৳{service.price ? Number(service.price).toLocaleString('en-US') : '0'}
          </span>
          <span className="text-[10px] text-neutral-400 block">Total Est.</span>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs text-neutral-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              <strong>Date:</strong> {bDate.toLocaleDateString()} at{' '}
              {bDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
            <span className="truncate">
              <strong>Location:</strong> {service.location || 'Customer Address'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {currentRole === 'provider' ? (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>Customer:</strong> {customer.name || 'Client'} ({customer.phone || 'No phone'})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                <strong>Provider:</strong> {provider.business_name || 'Specialist'}
              </span>
            </div>
          )}

          {booking.notes && (
            <div className="text-neutral-400 line-clamp-1 italic">
              <strong>Notes:</strong> "{booking.notes}"
            </div>
          )}
        </div>
      </div>

      {/* Review preview if existing */}
      {booking.review && (
        <div className="p-3 mb-4 rounded-xl bg-[#0e1117] border border-neutral-800/80 text-xs text-neutral-300">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Verified Customer Feedback</span>
          </div>
          <p className="italic text-neutral-400">"{booking.review.review}"</p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => (onViewHistory ? onViewHistory(booking) : null)}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 py-1.5 transition"
        >
          <History className="w-3.5 h-3.5 text-orange-400" />
          <span>Status Timeline ({booking.status_history?.length || 1})</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Provider Actions */}
          {currentRole === 'provider' && booking.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(booking._id, 'accepted')}
                className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition"
              >
                Accept Booking
              </button>
              <button
                onClick={() => onUpdateStatus(booking._id, 'rejected')}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-400 font-semibold text-xs transition"
              >
                Decline
              </button>
            </>
          )}

          {currentRole === 'provider' && booking.status === 'accepted' && (
            <button
              onClick={() => onUpdateStatus(booking._id, 'completed')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Job Completed</span>
            </button>
          )}

          {/* Customer Actions */}
          {currentRole === 'customer' &&
            ['pending', 'accepted'].includes(booking.status) && (
              <button
                onClick={() => onUpdateStatus(booking._id, 'cancelled')}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-400 text-xs font-semibold transition"
              >
                Cancel Booking
              </button>
            )}

          {/* Customer Review Button */}
          {currentRole === 'customer' &&
            booking.status === 'completed' &&
            !booking.review && (
              <button
                onClick={() => onOpenReview(booking)}
                className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-orange-500/20"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Rate & Review</span>
              </button>
            )}

          {/* Incident Report Button */}
          <button
            onClick={() => onOpenReport(booking)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Report an issue or safety concern"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
