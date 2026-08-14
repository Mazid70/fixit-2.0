import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Star,
  User,
  ShieldCheck,
  Clock,
  MapPin,
  History,
} from 'lucide-react';
import api from '../api/axios.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';
import BookingHistoryModal from '../components/bookings/BookingHistoryModal.jsx';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHistoryBooking, setSelectedHistoryBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/all');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load all bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (b.service?.title || '').toLowerCase().includes(term) ||
      (b.customer?.name || '').toLowerCase().includes(term) ||
      (b.provider?.business_name || '').toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
          All Platform Bookings & Dispatches
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Full global log of all customer booking transactions, service schedules, and status lifecycles.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#141720] border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'pending', 'accepted', 'completed', 'cancelled', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#0e1117] text-neutral-400 hover:text-white'
              }`}
            >
              {st} ({st === 'all' ? bookings.length : bookings.filter((b) => b.status === st).length})
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search booking or client..."
              className="w-full bg-[#0e1117] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-4 py-2 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <LoadingSpinner message="Loading all booking records..." />
      ) : (
        <div className="bg-[#141720] border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0e1117] text-[11px] uppercase tracking-wider text-neutral-400 font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4">Booking ID & Service</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-neutral-800/30 transition">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono text-[10px] text-neutral-500 block">
                          #{String(b._id).slice(-8)}
                        </span>
                        <p className="font-bold text-white text-xs">{b.service?.title || 'Service'}</p>
                        <p className="text-[11px] text-orange-400 font-semibold">
                          ৳{b.service?.price ? Number(b.service.price).toLocaleString('en-US') : '0'}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-200">{b.customer?.name || 'Client'}</p>
                      <p className="text-[11px] text-neutral-500">{b.customer?.phone || b.customer?.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-200">{b.provider?.business_name || 'Specialist'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-neutral-200">{new Date(b.booking_date).toLocaleDateString()}</p>
                        <p className="text-[11px] text-neutral-500">
                          {new Date(b.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={b.status}>{b.status}</Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedHistoryBooking(b)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 transition"
                      >
                        <History className="w-3.5 h-3.5 text-orange-400" />
                        <span>Timeline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedHistoryBooking && (
        <BookingHistoryModal
          booking={selectedHistoryBooking}
          onClose={() => setSelectedHistoryBooking(null)}
        />
      )}
    </div>
  );
}
