import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Star,
  MapPin,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get('/users/providers');
        if (res.data.success) {
          setProviders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load providers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProviders = providers.filter((p) => {
    const term = searchTerm.toLowerCase();
    const bName = (p.business_name || '').toLowerCase();
    const uName = (p.user?.name || '').toLowerCase();
    const loc = (p.location || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const role = (p.title_role || '').toLowerCase();
    return bName.includes(term) || uName.includes(term) || loc.includes(term) || desc.includes(term) || role.includes(term);
  });

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage) || 1;
  const displayedProviders = filteredProviders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1c2230]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>VERIFIED PROFESSIONAL SPECIALISTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Top Service Providers & Contractors in Bangladesh
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Browse licensed, vetted, and background-checked technicians across Dhaka, Chattogram & Sylhet.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by specialist name, trade, or area..."
              className="w-full bg-[#12151e] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-4 py-2.5 border border-[#212635] focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Locating certified specialists..." />
      ) : filteredProviders.length === 0 ? (
        <EmptyState
          title="No service providers found"
          description="Try adjusting your search query or clear keywords to view all technicians."
        />
      ) : (
        <div className="flex flex-col justify-between min-h-[640px] space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
            {displayedProviders.map((provider) => {
              const avatarUrl =
                provider.avatar ||
                provider.profile_image ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
              const rating = provider.average_rating || 4.9;
              const bookingsCount = provider.total_bookings || 312;
              const rateHourly = provider.rate_hourly || 1200;

              return (
                <motion.div
                  key={provider._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#12151e] hover:bg-[#151924] border border-[#212635] hover:border-orange-500/50 rounded-[22px] p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group"
                >
                  <div>
                    {/* Top: Avatar with badge & Rating */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 to-amber-400 shadow-md">
                          <img
                            src={avatarUrl}
                            alt={provider.business_name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full bg-neutral-900"
                          />
                        </div>
                        <div
                          className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center border-2 border-[#12151e]"
                          title="Verified Specialist"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-orange-400 font-bold text-sm font-['Space_Grotesk']">
                          <Star className="w-4 h-4 fill-orange-400" />
                          <span>{rating > 0 ? rating.toFixed(1) : '5.0'}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">
                          {bookingsCount.toLocaleString()} Bookings
                        </span>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition font-['Space_Grotesk'] mb-0.5">
                      {provider.business_name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-medium line-clamp-1 mb-2">
                      {provider.title_role || 'Certified Technical Specialist'}
                    </p>

                    <p className="text-xs text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                      {provider.description || 'Dedicated tradesperson providing certified repair craftsmanship across Bangladesh.'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-[#1c2230]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-400" />
                        <span className="truncate max-w-[130px]">{provider.location || 'Dhaka, BD'}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-500 font-['Space_Grotesk']">
                        ৳{rateHourly.toLocaleString()} / hr
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4">
                    <Link
                      to={`/providers/${provider.user_id || provider._id}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#1c2230] hover:bg-[#252c3d] text-neutral-200 hover:text-white border border-neutral-700/60 text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/services?location=${encodeURIComponent(provider.location || '')}`}
                      className="py-2.5 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition"
                    >
                      Services
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Unified Pagination */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredProviders.length}
            pageSize={itemsPerPage}
            pageSizeOptions={[6, 12, 24]}
            onPageSizeChange={handlePageSizeChange}
            itemName="specialists"
          />
        </div>
      )}
    </div>
  );
}
