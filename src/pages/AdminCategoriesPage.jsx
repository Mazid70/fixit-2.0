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
} from 'lucide-react';
import api from '../api/axios.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Modal from '../components/common/Modal.jsx';

export default function AdminCategoriesPage() {
  const { addToast } = useNotifications();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.error('Failed to load categories:', err);
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading taxonomy..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div
              key={c._id}
              className="bg-[#141720] border border-neutral-800 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{c.name}</h3>
                  <span className="text-[10px] text-neutral-500 font-mono">ID: {c._id}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                {c.description || 'General trade service category for homeowner repair requests.'}
              </p>
            </div>
          ))}
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
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe which services fall under this category..."
                className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl p-3 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Create Category'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
