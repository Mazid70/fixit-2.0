import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import api from '../api/axios.js';
import ServiceCard from '../components/services/ServiceCard.jsx';
import ServiceFilters from '../components/services/ServiceFilters.jsx';
import BookingModal from '../components/bookings/BookingModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { Wrench, SlidersHorizontal } from 'lucide-react';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state initialized from searchParams
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sortBy: 'newest',
  });

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/services/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Synchronize filters when searchParams (URL query) changes
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      location: searchParams.get('location') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minRating: searchParams.get('minRating') || '',
      sortBy: searchParams.get('sortBy') || 'newest',
    });
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch filtered services
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.location) params.location = filters.location;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;

        const res = await api.get('/services', { params });
        if (res.data.success) {
          let list = res.data.data;

          // Client-side min rating filter if specified
          if (filters.minRating) {
            const minR = parseFloat(filters.minRating);
            list = list.filter((s) => (s.provider?.average_rating || 5.0) >= minR);
          }

          // Sorting
          if (filters.sortBy === 'price_asc') {
            list = [...list].sort((a, b) => a.price - b.price);
          } else if (filters.sortBy === 'price_desc') {
            list = [...list].sort((a, b) => b.price - a.price);
          } else if (filters.sortBy === 'rating') {
            list = [...list].sort(
              (a, b) => (b.provider?.average_rating || 0) - (a.provider?.average_rating || 0)
            );
          }
          setServices(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    setCurrentPage(1);

    const sp = new URLSearchParams();
    if (updated.search) sp.set('search', updated.search);
    if (updated.category) sp.set('category', updated.category);
    if (updated.location) sp.set('location', updated.location);
    if (updated.maxPrice) sp.set('maxPrice', updated.maxPrice);
    if (updated.minRating) sp.set('minRating', updated.minRating);
    if (updated.sortBy && updated.sortBy !== 'newest') sp.set('sortBy', updated.sortBy);
    setSearchParams(sp, { replace: true });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      maxPrice: '',
      minRating: '',
      sortBy: 'newest',
    });
    setSearchParams({}, { replace: true });
    setCurrentPage(1);
  };

  // Pagination parameters
  const totalPages = Math.ceil(services.length / itemsPerPage) || 1;
  const displayedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Top Banner / Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1c2230]">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-white">Explore Verified Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Verified On-Demand Services in Bangladesh
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Book certified master electricians, HVAC technicians, plumbers, and event designers in Dhaka & nationwide.
          </p>
        </div>

        {/* Mobile Filter Toggle & Sort Select */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-[#141720] border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="bg-[#12151e] border border-[#212635] text-neutral-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-orange-500 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Listed</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filter Column (Hidden on mobile unless toggled) */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1`}>
          <ServiceFilters
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Main Services Grid Column */}
        <div className="lg:col-span-3 flex flex-col justify-between min-h-[640px] space-y-6">
          <div className="space-y-6">
            {/* Header Count Info */}
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>
                Showing{' '}
                <strong className="text-white font-bold">{displayedServices.length}</strong> of{' '}
                <strong className="text-white font-bold">{services.length}</strong> verified specialists
              </span>
              {filters.location && (
                <span className="text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
                  Location: {filters.location}
                </span>
              )}
            </div>

            {/* Service Cards Grid or Empty / Loading State */}
            {loading ? (
              <LoadingSpinner message="Searching verified service providers in Bangladesh..." />
            ) : services.length === 0 ? (
              <EmptyState
                icon={Wrench}
                title="No service providers found"
                description="Try adjusting your category filter, location keyword, or expanding your price limit."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[460px] content-start"
              >
                {displayedServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    onBookNow={(srv) => setSelectedService(srv)}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Bottom Pagination Bar */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={services.length}
            pageSize={itemsPerPage}
            pageSizeOptions={[6, 12, 24, 48]}
            onPageSizeChange={handlePageSizeChange}
            itemName="services"
          />
        </div>
      </div>

      {/* Interactive Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
        />
      )}
    </div>
  );
}
