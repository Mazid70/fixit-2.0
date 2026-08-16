import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Wrench,
  Zap,
  Flame,
  Tv,
  Hammer,
  Paintbrush,
  ArrowRight,
  FolderTree,
  Award,
  Sparkles,
  Search,
} from 'lucide-react';
import api from '../api/axios.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/services/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getCategoryIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('plumb') || lower.includes('water')) return Wrench;
    if (lower.includes('electr') || lower.includes('ips')) return Zap;
    if (lower.includes('ac') || lower.includes('climate') || lower.includes('inverter')) return Flame;
    if (lower.includes('smart') || lower.includes('cctv') || lower.includes('security')) return Tv;
    if (lower.includes('clean') || lower.includes('pest')) return Sparkles;
    if (lower.includes('concierge') || lower.includes('lifestyle')) return Award;
    return Paintbrush;
  };

  const filteredCategories = categories.filter((cat) => {
    const term = searchTerm.toLowerCase();
    const name = (cat.category_name || '').toLowerCase();
    const desc = (cat.description || '').toLowerCase();
    return name.includes(term) || desc.includes(term);
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const displayedCategories = filteredCategories.slice(
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1c2230]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            <FolderTree className="w-4 h-4 text-orange-400" />
            <span>TAXONOMY & SPECIALIZED DOMAINS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Explore Service Categories in Bangladesh
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Select a verified trade domain to find certified technicians with upfront rates in BDT (৳)
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
              placeholder="Search category or trade..."
              className="w-full bg-[#12151e] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-4 py-2.5 border border-[#212635] focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading all service categories..." />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Try adjusting your search query or clear keywords to view all categories."
        />
      ) : (
        <div className="flex flex-col justify-between min-h-[560px] space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
            {displayedCategories.map((cat, idx) => {
              const Icon = getCategoryIcon(cat.category_name);
              return (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  whileHover={{ y: -5 }}
                >
                  <Link
                    to={`/services?category=${cat._id}`}
                    className="group bg-[#12151e] hover:bg-[#161a26] border border-[#212635] hover:border-orange-500/50 p-6 rounded-[22px] transition-all duration-300 flex flex-col justify-between h-full shadow-xl shadow-black/20"
                  >
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-md">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition mb-2 font-['Space_Grotesk']">
                        {cat.category_name}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {cat.description || 'Verified technicians providing guaranteed repair craftsmanship.'}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1c2230] flex items-center justify-between text-xs font-bold text-orange-400 group-hover:text-orange-300">
                      <span>Browse Specialists</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredCategories.length}
            pageSize={itemsPerPage}
            pageSizeOptions={[6, 12, 24]}
            onPageSizeChange={handlePageSizeChange}
            itemName="categories"
          />
        </div>
      )}
    </div>
  );
}

