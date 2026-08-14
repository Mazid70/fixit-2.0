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
import Badge from '../components/common/Badge.jsx';

export default function AdminProvidersPage() {
  const { addToast } = useNotifications();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredProviders = providers.filter((p) => {
    return statusFilter === 'all' || p.verification_status === statusFilter;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
          Service Provider Verifications
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Review specialist trade registrations and approve or decline marketplace credentials.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'pending', 'verified', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((p) => (
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
      )}
    </div>
  );
}
