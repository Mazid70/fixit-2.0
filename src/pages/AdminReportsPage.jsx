import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import api from '../api/axios.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function AdminReportsPage() {
  const { addToast } = useNotifications();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const res = await api.patch(`/admin/reports/${reportId}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(`Report marked as ${newStatus}`, 'success');
        fetchReports();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update report status', 'error');
    }
  };

  const filtered = reports.filter((r) => {
    return statusFilter === 'all' || r.status === statusFilter;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
          Incident Reports & Safety Disputes
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Review customer and technician safety concerns, service quality complaints, and dispatch disputes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'pending', 'resolved', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              statusFilter === st
                ? 'bg-orange-500 text-white'
                : 'bg-[#141720] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {st} {st !== 'all' && `(${reports.filter((r) => r.status === st).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading reported incidents..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Incident Reports"
          description={
            statusFilter !== 'all'
              ? `There are no ${statusFilter} incident reports.`
              : 'Zero dispute reports registered. All service dispatches are operating smoothly.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rep) => (
            <div
              key={rep._id}
              className="bg-[#141720] border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 block">
                        #{String(rep._id).slice(-8)}
                      </span>
                      <p className="text-xs font-bold text-neutral-200">
                        Reporter: {rep.reporter?.name || 'User'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={rep.status}>{rep.status}</Badge>
                </div>

                <div className="p-3.5 bg-[#0e1117] border border-neutral-800/80 rounded-2xl space-y-2 mb-4">
                  <p className="text-xs font-semibold text-rose-300">
                    Reason: {rep.reason}
                  </p>
                  {rep.details && (
                    <p className="text-xs text-neutral-300 leading-relaxed italic">
                      "{rep.details}"
                    </p>
                  )}
                </div>

                <div className="space-y-1 text-[11px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Booking Ref: #{String(rep.booking_id).slice(-8)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>
                      Reported on {new Date(rep.created_at).toLocaleDateString()} at{' '}
                      {new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-neutral-800">
                {rep.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(rep._id, 'resolved')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve & Close</span>
                  </button>
                )}
                {rep.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(rep._id, 'rejected')}
                    className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
                  >
                    Dismiss / Reject
                  </button>
                )}
                {rep.status !== 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus(rep._id, 'pending')}
                    className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs transition"
                  >
                    Reopen
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
