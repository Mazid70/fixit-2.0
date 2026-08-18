import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  X,
  Star,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import ConfirmationModal from '../components/common/ConfirmationModal.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function ProviderServicesPage() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useNotifications();

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  const providerProfile = user?.providerProfile || user?.profile;
  const verificationStatus =
    providerProfile?.verification_status ||
    user?.verification_status ||
    (user?.role === 'provider' ? 'verified' : 'pending');

  const isVerified =
    user?.role === 'admin' ||
    verificationStatus === 'verified' ||
    user?.is_verified === true ||
    (user?.role === 'provider' && providerProfile?.verification_status !== 'pending' && providerProfile?.verification_status !== 'rejected');

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/services/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    duration: '',
    location: '',
  });

  const fetchData = async (p = 1, currentLimit = pageSize) => {
    try {
      const [srvRes, catRes] = await Promise.all([
        api.get('/services/my-services', { params: { page: p, limit: currentLimit } }),
        api.get('/services/categories'),
      ]);

      if (srvRes.data && srvRes.data.success) {
        const list = srvRes.data.data || [];
        setServices(list);
        setPage(srvRes.data.page || 1);
        setTotalPages(srvRes.data.totalPages || Math.ceil(list.length / currentLimit) || 1);
        setTotalCount(srvRes.data.total || srvRes.data.totalServices || list.length);
      }

      // Normalize categories to ensure we have _id and category_name fields regardless of API shape
      const catPayload = catRes.data?.data ?? catRes.data ?? [];
      const normalizedCats = Array.isArray(catPayload)
        ? catPayload.map(c => ({
            _id:
              c._id ??
              c.id ??
              c.category_id ??
              c.categoryId ??
              String(Math.random()),
            category_name: c.category_name ?? c.name ?? c.title ?? c.label ?? 'General Service',
            name: c.category_name ?? c.name ?? c.title ?? c.label ?? 'General Service',
            description: c.description || '',
          }))
        : [];

      if (normalizedCats.length > 0) setCategories(normalizedCats);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load services:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pageSize);
  }, [pageSize]);

  const fetchPage = p => {
    fetchData(p, pageSize);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  // When categories are loaded and modal is open for adding a new service,
  // ensure the select has a sensible default value so the user sees categories
  useEffect(() => {
    if (isModalOpen && categories.length > 0 && !formData.category_id) {
      setFormData(prev => ({ ...prev, category_id: categories[0]._id }));
    }
  }, [isModalOpen, categories]);

  const handleOpenAddModal = () => {
    if (!isVerified) {
      addToast(
        `Your provider profile status is "${verificationStatus}". You can post services once an administrator approves your verification request.`,
        'error'
      );
      return;
    }
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      category_id: categories[0]?._id || '',
      price: '',
      duration: '1-2 Hours',
      location: providerProfile?.location || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = service => {
    setEditingService(service);
    // service may store category as an object or an id string; handle both
    const categoryId =
      (service.category && (service.category._id || service.category.id)) ||
      service.category_id ||
      '';

    setFormData({
      title: service.title || '',
      description: service.description || '',
      category_id: categoryId,
      price: service.price || '',
      duration: service.duration || '',
      location: service.location || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.title || !formData.category_id || !formData.price) {
      addToast('Please fill out title, category, and price.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingService) {
        const res = await api.put(`/services/${editingService._id}`, formData);
        if (res.data && res.data.success) {
          addToast('Service listing updated successfully!', 'success');
        }
      } else {
        const res = await api.post('/services', formData);
        if (res.data && res.data.success) {
          addToast('New service published to FIXIT marketplace!', 'success');
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Failed to save service',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      const res = await api.delete(`/services/${serviceToDelete._id}`);
      if (res.data && res.data.success) {
        addToast('Service removed from marketplace.', 'success');
        setServiceToDelete(null);
        fetchData();
      }
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Failed to delete service',
        'error',
      );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            My Marketplace Service Listings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Create, publish, price, and maintain your active repair and
            maintenance offerings.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          disabled={!isVerified}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition ${
            isVerified
              ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-orange-500/20'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
          }`}
          title={!isVerified ? 'Verification required to post services' : ''}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Verification Status Warning if not verified */}
      {!isVerified && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">
                Partner Account Verification Pending
              </p>
              <p className="text-neutral-400 text-[11px] mt-0.5">
                Your service provider credentials are under review by FIXIT admins (Current status: <strong className="text-amber-400 uppercase">{verificationStatus}</strong>). Service publishing will be enabled once your application is approved.
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-[11px] font-bold whitespace-nowrap">
            Under Review
          </div>
        </div>
      )}

      {/* Services List */}
      {loading ? (
        <LoadingSpinner message="Loading your service listings..." />
      ) : services.length === 0 ? (
        <EmptyState
          title="No Services Listed Yet"
          description="Create your first service offering so customers can discover and book you on FIXIT."
          actionText="Add New Service"
          onAction={handleOpenAddModal}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div
                key={service._id}
                className="bg-[#141720] border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between hover:border-neutral-700 transition shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded-md">
                      {service.category?.name || 'General'}
                    </span>
                    <span className="text-lg font-extrabold text-white font-['Space_Grotesk']">
                      ৳{Number(service.price).toLocaleString('en-US')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-100 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-3 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-neutral-400 py-3 border-t border-neutral-800/80">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>
                        Est. Duration: {service.duration || 'Flexible'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{service.location || 'Metro Service Area'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setServiceToDelete(service)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={fetchPage}
            totalItems={totalCount || services.length}
            pageSize={pageSize}
            pageSizeOptions={[6, 9, 18]}
            onPageSizeChange={handlePageSizeChange}
            itemName="services"
          />
        </>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            editingService ? 'Edit Service Offering' : 'Publish New Service'
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Service Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Tankless Water Heater Installation"
                required
                className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={e =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                  className="w-full bg-[#0e1117] text-xs text-white rounded-xl px-3 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition cursor-pointer"
                >
                  <option value="" className="bg-[#141720] text-neutral-400">Select Category</option>
                  {categories.map(c => (
                    <option className="bg-[#141720] text-white py-1.5" key={c._id} value={c._id}>
                      {c.category_name || c.name || 'General Service'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Base Price (৳ BDT) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={formData.price}
                  onChange={e =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="1500"
                  required
                  className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={e =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g. 1-2 Hours"
                  className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Service Coverage Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Austin Metro Area"
                  className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Detailed Scope of Work & Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Explain what is included in this repair service..."
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
                {submitting
                  ? 'Saving...'
                  : editingService
                    ? 'Save Changes'
                    : 'Publish Service'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <ConfirmationModal
          isOpen={!!serviceToDelete}
          onClose={() => setServiceToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Service Listing"
          message={`Are you sure you want to remove "${serviceToDelete.title}"? Active existing bookings will not be cancelled, but customers will no longer be able to discover this service.`}
          confirmText="Yes, Delete Service"
          variant="danger"
        />
      )}
    </div>
  );
}
