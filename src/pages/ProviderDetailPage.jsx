import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Wrench,
  CheckCircle2,
  ChevronLeft,
  Share2,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';
import ServiceCard from '../components/services/ServiceCard.jsx';
import BookingModal from '../components/bookings/BookingModal.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function ProviderDetailPage() {
  const { id } = useParams();
  const { addToast } = useNotifications();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const [provRes, srvRes, revRes] = await Promise.all([
          api.get(`/users/providers/${id}`),
          api.get(`/services?provider_id=${id}`),
          api.get(`/reviews?provider_id=${id}`),
        ]);

        if (provRes.data.success) {
          setProvider(provRes.data.data);
        }
        if (srvRes.data.success) {
          setServices(srvRes.data.data);
        }
        if (revRes.data.success) {
          setReviews(revRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load provider profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Provider profile URL copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner message="Loading technician profile..." />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-neutral-200 mb-2">Provider Not Found</h2>
        <p className="text-xs text-neutral-400 mb-6">The requested service provider could not be located or may be inactive.</p>
        <Link
          to="/providers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-xl text-neutral-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Verified Providers
        </Link>
      </div>
    );
  }

  const avatarUrl =
    provider.avatar ||
    provider.profile_image ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
  const rating = provider.average_rating || 4.9;
  const bookingsCount = provider.total_bookings || 312;
  const rateHourly = provider.rate_hourly || 1200;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/providers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Providers</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c2230] border border-neutral-700/60 hover:bg-[#242c3d] text-xs font-medium text-neutral-300 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Profile</span>
        </button>
      </div>

      {/* Profile Header Hero */}
      <div className="bg-[#12151e] border border-[#212635] rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 to-amber-400 shadow-md">
                <img
                  src={avatarUrl}
                  alt={provider.business_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full bg-neutral-900"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center border-2 border-[#12151e]"
                title="Verified Specialist"
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs text-orange-400 font-bold bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                  <Star className="w-3.5 h-3.5 fill-orange-400" />
                  <span>{rating > 0 ? rating.toFixed(1) : '5.0'}</span>
                  <span className="text-neutral-400 font-normal">({bookingsCount} bookings)</span>
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified in Dhaka, BD
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                {provider.business_name}
              </h1>
              <p className="text-xs text-orange-400 font-medium mt-0.5">
                {provider.title_role || 'Lead Technical Specialist'}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-neutral-400 border-t sm:border-t-0 pt-4 sm:pt-0 sm:text-right">
            <div className="flex items-center sm:justify-end gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-neutral-200 font-medium">{provider.location || 'Dhaka, Bangladesh'}</span>
            </div>
            <div className="text-sm font-bold text-orange-500 font-['Space_Grotesk']">
              Standard Rate: ৳{rateHourly.toLocaleString()} / hr
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#1c2230]">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Specialist Overview & Experience
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed max-w-4xl">
            {provider.description || 'Verified FIXIT service partner providing top quality maintenance, diagnostics, and repairs across Dhaka and surrounding areas.'}
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Offered Services by {provider.business_name}
          </h2>
          <span className="text-xs text-neutral-400">({services.length} active)</span>
        </div>

        {services.length === 0 ? (
          <div className="p-8 text-center bg-[#12151e] border border-[#212635] rounded-2xl">
            <p className="text-xs text-neutral-400">No public service offerings listed at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBookNow={(srv) => setSelectedServiceForBooking(srv)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
          Customer Reviews & Experience Feedback ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-[#12151e] border border-[#212635] rounded-2xl">
            <p className="text-xs text-neutral-400">No verified reviews submitted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 bg-[#12151e] border border-[#212635] rounded-2xl space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1c2230] flex items-center justify-center text-xs font-bold text-orange-400">
                      {(rev.user?.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-200">{rev.user?.name || 'Verified Customer'}</p>
                      <p className="text-[10px] text-neutral-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-orange-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          isOpen={!!selectedServiceForBooking}
          service={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onBookingSuccess={() => {
            setSelectedServiceForBooking(null);
            addToast('Booking request submitted to specialist!', 'success');
          }}
        />
      )}
    </div>
  );
}
