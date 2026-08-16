import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShieldCheck, MapPin, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

export default function ServiceCard({ service, onBookNow }) {
  if (!service) return null;

  const provider = service.provider || {};
  const categoryName = service.category?.category_name || 'Lifestyle & Repair';
  const providerName = provider.user?.name || provider.business_name || 'Verified Specialist';
  const titleRole = provider.title_role || service.title || 'Master Technician';
  const rating = provider.average_rating || 4.9;
  const totalBookings = provider.total_bookings || 312;
  const isVerified = provider.verification_status === 'verified';
  
  // Custom avatar fallback
  const avatarUrl =
    provider.avatar ||
    provider.profile_image ||
    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`;

  // Format price in BDT ৳
  const formattedPrice = typeof service.price === 'number' ? service.price.toLocaleString('en-US') : service.price;
  const priceRateLabel = service.price_rate_label || `${formattedPrice} / hr`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group relative bg-[#12151e] hover:bg-[#151924] border border-[#212635] hover:border-orange-500/50 rounded-[22px] p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(249,115,22,0.12)]"
    >
      <div>
        {/* Top Header: Avatar with Shield + Rating & Booking Count */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Avatar with Orange Ring & Verified Shield */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 to-amber-400 shadow-md">
              <img
                src={avatarUrl}
                alt={providerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full bg-neutral-900"
              />
            </div>
            {isVerified && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center border-2 border-[#12151e] shadow-sm"
                title="Verified FixIt Professional"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Rating & Total Bookings */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-orange-400 font-bold text-sm">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span className="font-['Space_Grotesk'] tracking-tight">
                {rating > 0 ? rating.toFixed(1) : '5.0'}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">
              {totalBookings.toLocaleString()} Bookings
            </span>
          </div>
        </div>

        {/* Name / Title */}
        <Link to={`/services/${service._id}`} className="block group-hover:text-orange-400 transition">
          <h3 className="text-lg font-extrabold text-white line-clamp-1 font-['Space_Grotesk'] tracking-tight mb-1">
            {providerName}
          </h3>
        </Link>

        {/* Subtitle / Role Description */}
        <p className="text-xs font-medium text-neutral-400 line-clamp-2 leading-relaxed mb-3">
          {titleRole}
        </p>

        {/* Service Details & Location */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-neutral-400">
          <span className="px-2.5 py-1 rounded-lg bg-[#191e2b] text-orange-300 font-medium border border-neutral-800">
            {categoryName}
          </span>
          <div className="flex items-center gap-1 text-neutral-400">
            <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
            <span className="truncate max-w-[130px]">{service.location || 'Dhaka, Bangladesh'}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Action Buttons */}
      <div className="pt-3.5 border-t border-[#1c2230] mt-1 flex items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <span className="text-xs sm:text-sm font-extrabold text-orange-500 font-['Space_Grotesk'] tracking-tight whitespace-nowrap block truncate">
            ৳{priceRateLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to={`/services/${service._id}`}
            className="px-3 py-1.5 rounded-xl bg-[#1c2230] hover:bg-[#252c3d] text-neutral-200 hover:text-white border border-neutral-700/60 text-xs font-semibold transition flex items-center gap-1 whitespace-nowrap"
          >
            <span>Profile</span>
          </Link>
          <button
            onClick={() => onBookNow && onBookNow(service)}
            className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1 whitespace-nowrap"
          >
            <span>Book</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
