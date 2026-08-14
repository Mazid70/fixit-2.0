import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Wrench,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import api from '../api/axios.js';
import BookingModal from '../components/bookings/BookingModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        if (res.data.success) {
          setService(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Service link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner message="Loading specialist profile and service specifications..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Service Listing Not Found</h2>
        <p className="text-xs text-neutral-400 mb-6">
          The requested service may have been updated or retired.
        </p>
        <Link
          to="/services"
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition"
        >
          Return to All Services
        </Link>
      </div>
    );
  }

  const provider = service.provider || {};
  const category = service.category || {};
  const reviews = service.reviews || [];
  const rating = provider.average_rating || 4.9;
  const bookingsCount = provider.total_bookings || 312;
  const avatarUrl =
    provider.avatar ||
    provider.profile_image ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  const formattedPrice =
    typeof service.price === 'number' ? service.price.toLocaleString('en-US') : service.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Services</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-[#12151e] border border-[#212635] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-xl border border-orange-500/20">
                {category.category_name || 'Lifestyle & Technical Repair'}
              </span>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-[#1a1f2c] border border-neutral-700 text-neutral-400 hover:text-white transition"
                title="Share Service Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] leading-tight">
              {service.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 pt-3 border-t border-[#1c2230]">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                <Star className="w-4 h-4 fill-orange-400" />
                <span>{rating > 0 ? rating.toFixed(1) : '5.0'}</span>
                <span className="text-neutral-400 font-normal">({bookingsCount} bookings)</span>
              </div>

              <div className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{service.location || 'Dhaka, Bangladesh'}</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>NID Verified Specialist</span>
              </div>
            </div>
          </div>

          {/* Description & Deliverables */}
          <div className="bg-[#12151e] border border-[#212635] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
              Service Scope & Workmanship
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {service.description ||
                'Includes full on-site inspection, precision diagnostics with certified instrumentation, guaranteed component repairs, and a 7-day post-service warranty.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#1c2230] text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Certified diagnostics & thermal check</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Genuine manufacturer parts provided</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Pay via bKash / Nagad / Cash on delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>FIXIT 7-day money back warranty</span>
              </div>
            </div>
          </div>

          {/* Provider Card */}
          <div className="bg-[#12151e] border border-[#212635] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                About the Assigned Specialist
              </h2>
              <Link
                to={`/providers/${provider._id}`}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 to-amber-400 shadow-md">
                  <img
                    src={avatarUrl}
                    alt={provider.business_name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full bg-neutral-900"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center border-2 border-[#12151e]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  {provider.business_name || provider.user?.name}
                </h3>
                <p className="text-xs text-orange-400 font-medium">
                  {provider.title_role || 'Certified Technical Contractor'}
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                  {provider.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Sticky Booking Callout */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-[#141722] border border-[#232838] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div>
              <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
                Standard Service Fee
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-orange-500 font-['Space_Grotesk']">
                  ৳{formattedPrice}
                </span>
                <span className="text-xs text-neutral-400">starting rate</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-orange-400">
                <Sparkles className="w-3.5 h-3.5" /> Instant Specialist Assignment
              </p>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Confirm your slot now. Specialist confirms appointment within 15 minutes.
              </p>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/30 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <div className="pt-3 border-t border-[#1f2533] space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-center justify-between">
                <span>Arrival Window:</span>
                <span className="font-bold text-white">Within 30-45 mins</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-white">bKash, Nagad, Cash</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hotline:</span>
                <span className="font-bold text-orange-400">09612-FIXIT-BD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        service={service}
      />
    </div>
  );
}
