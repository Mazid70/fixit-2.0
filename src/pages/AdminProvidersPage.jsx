import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Star,
  Search,
} from 'lucide-react';
import api from '../api/axios.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Badge from '../components/common/Badge.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function AdminProvidersPage() {
  const { addToast } = useNotifications();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const fetchProviders = async () => {
    try {
      const res = await api.get('/users/providers');
      if (res.data.success) {
        setProviders(res.data.data);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load providers:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleUpdateVerification = async (providerId, newStatus) => {
    try {
      const res = await api.patch(`/admin/providers/${providerId}/verification`, {
        status: newStatus,
      });
      if (res.data.success) {
        addToast(`Provider marked as ${newStatus}`, 'success');
        fetchProviders();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Verification update error', 'error');
    }
  };

  const handleStatusFilterChange = (st) => {
    setStatusFilter(st);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProviders = providers.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.verification_status === statusFilter;
    const term = searchTerm.toLowerCase();
    const bName = (p.business_name || '').toLowerCase();
    const uName = (p.user?.name || '').toLowerCase();
    const uEmail = (p.user?.email || '').toLowerCase();
    const loc = (p.location || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    const matchesSearch =
      !term ||
      bName.includes(term) ||
      uName.includes(term) ||
      uEmail.includes(term) ||
      loc.includes(term) ||
      desc.includes(term);

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProviders.length / pageSize) || 1;
  const displayedProviders = filteredProviders.slice(
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            Service Provider Verifications
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review specialist trade registrations and approve or decline marketplace credentials.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search provider, user, area..."
              className="w-full bg-[#12151e] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-4 py-2 border border-neutral-800 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'pending', 'verified', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => handleStatusFilterChange(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              statusFilter === st
                ? 'bg-orange-500 text-white'
                : 'bg-[#141720] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {st} {st !== 'all' && `(${providers.filter((p) => p.verification_status === st).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading provider credentials..." />
      ) : filteredProviders.length === 0 ? (
        <EmptyState
          title="No providers found"
          description="No specialists match the current status filter and search keywords."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProviders.map((p) => (
              <div
                key={p._id}
                className="bg-[#141720] border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{p.business_name}</h3>
                      <p className="text-xs text-neutral-400">
                        User: <span className="text-neutral-200">{p.user?.name}</span>
                      </p>
                    </div>
                    <Badge variant={p.verification_status}>{p.verification_status}</Badge>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-3 mb-4 leading-relaxed bg-[#0e1117] p-3 rounded-xl border border-neutral-800/60">
                    {p.description || 'No description provided.'}
                  </p>

                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Location: {p.location || 'Metro Area'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rating: {p.rating ? parseFloat(p.rating).toFixed(1) : '5.0'} ({p.total_reviews || 0} reviews)</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Contact: {p.user?.email} • {p.user?.phone || 'No phone'}
                    </div>
                  </div>
                </div>

                {/* Approval Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-neutral-800">
                  {p.verification_status !== 'verified' && (
                    <button
                      onClick={() => handleUpdateVerification(p._id, 'verified')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  )}
                  {p.verification_status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateVerification(p._id, 'rejected')}
                      className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 font-semibold text-xs transition"
                    >
                      Reject
                    </button>
                  )}
                  {p.verification_status !== 'pending' && (
                    <button
                      onClick={() => handleUpdateVerification(p._id, 'pending')}
                      className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs transition"
                    >
                      Set Pending
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredProviders.length}
            pageSize={pageSize}
            pageSizeOptions={[6, 12, 24]}
            onPageSizeChange={handlePageSizeChange}
            itemName="providers"
          />
        </div>
      )}
    </div>
  );
}
