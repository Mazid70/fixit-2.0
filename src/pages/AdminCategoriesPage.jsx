import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Wrench,
  Zap,
  Flame,
  Tv,
  Hammer,
  Paintbrush,
  CheckCircle2,
  Search,
} from 'lucide-react';
import api from '../api/axios.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function AdminCategoriesPage() {
  const { addToast } = useNotifications();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category_name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/services/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load categories:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!formData.category_name) {
      addToast('Category name is required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/admin/categories', formData);
      if (res.data.success) {
        addToast('New category created successfully!', 'success');
        setIsModalOpen(false);
        setFormData({ category_name: '', description: '' });
        fetchCategories();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter((c) => {
    const term = searchTerm.toLowerCase();
    const name = (c.category_name || c.name || '').toLowerCase();
    const desc = (c.description || '').toLowerCase();
    return name.includes(term) || desc.includes(term);
  });

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const displayedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            Service Category Taxonomy
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Define classification buckets for marketplace repair and maintenance offerings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-56">
            <Search className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search taxonomy..."
              className="w-full bg-[#12151e] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-3 py-2 border border-neutral-800 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading taxonomy..." />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Try adjusting your search keywords or add a new category above."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCategories.map((c) => (
              <div
                key={c._id}
                className="bg-[#141720] border border-neutral-800 rounded-2xl p-5 space-y-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{c.category_name || c.name}</h3>
                    <span className="text-[10px] text-neutral-500 font-mono">ID: {c._id}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {c.description || 'General trade service category for homeowner repair requests.'}
                </p>
              </div>
            ))}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredCategories.length}
            pageSize={pageSize}
            pageSizeOptions={[6, 12, 24]}
            onPageSizeChange={handlePageSizeChange}
            itemName="categories"
          />
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Service Category"
        >
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                placeholder="e.g. Roofing & Gutters"
                required
                className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Category Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of specialized services included in this bucket..."
                rows={3}
                className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Save Category'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
