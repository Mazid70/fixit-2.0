import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShieldCheck,
  Calendar,
  Search,
} from 'lucide-react';
import api from '../api/axios.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function AdminReportsPage() {
  const { addToast } = useNotifications();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load reports:', err);
      }
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

  const handleStatusFilterChange = (st) => {
    setStatusFilter(st);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filtered = reports.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (r.reason || '').toLowerCase().includes(term) ||
      (r.details || '').toLowerCase().includes(term) ||
      (r.reporter?.name || '').toLowerCase().includes(term) ||
      String(r.booking_id || '').toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const displayedReports = filtered.slice(
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
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
          Incident Reports & Safety Disputes
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Review customer and technician safety concerns, service quality complaints, and dispatch disputes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141720] border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['all', 'pending', 'resolved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusFilterChange(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-[#0e1117] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {st} ({st === 'all' ? reports.length : reports.filter((r) => r.status === st).length})
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <div className="relative">
            <Search className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search incident reason or name..."
              className="w-full bg-[#0e1117] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-4 py-2 border border-neutral-800 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading reported incidents..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Incident Reports Found"
          description={
            searchTerm
              ? `No incidents matching "${searchTerm}".`
              : statusFilter !== 'all'
              ? `There are no ${statusFilter} incident reports.`
              : 'Zero dispute reports registered. All service dispatches are operating smoothly.'
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedReports.map((rep) => (
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

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filtered.length}
            pageSize={pageSize}
            pageSizeOptions={[4, 6, 12, 20]}
            onPageSizeChange={handlePageSizeChange}
            itemName="incidents"
          />
        </div>
      )}
    </div>
  );
}
