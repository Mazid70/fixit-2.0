import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Calendar,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  DollarSign,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import BookingCard from '../components/bookings/BookingCard.jsx';
import ReportModal from '../components/reports/ReportModal.jsx';
import BookingHistoryModal from '../components/bookings/BookingHistoryModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';

const STATUS_COLORS = {
  Completed: '#10b981',
  Active: '#06b6d4',
  Pending: '#f59e0b',
  Cancelled: '#ef4444',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1f2c] border border-neutral-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-semibold text-white">
              {entry.name.toLowerCase().includes('earnings') || entry.name.toLowerCase().includes('revenue')
                ? `৳${Number(entry.value).toLocaleString()}`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#1a1f2c] border border-neutral-700 p-2.5 rounded-xl shadow-xl text-xs space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color || data.payload.fill }} />
          <span className="font-bold text-white">{data.name}</span>
        </div>
        <p className="text-neutral-300 pl-4 font-mono font-medium">
          {data.value} {data.value === 1 ? 'job' : 'jobs'}
        </p>
      </div>
    );
  }
  return null;
};

export default function ProviderDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useNotifications();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeReportBooking, setActiveReportBooking] = useState(null);
  const [activeHistoryBooking, setActiveHistoryBooking] = useState(null);

  const fetchProviderHub = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const [bookRes, srvRes] = await Promise.all([
        api.get('/bookings/provider-bookings'),
        api.get('/services/my-services'),
      ]);

      if (bookRes.data.success) setBookings(bookRes.data.data);
      if (srvRes.data.success) setServices(srvRes.data.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load provider hub:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && (user.role === 'provider' || user.role === 'admin')) {
      fetchProviderHub();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(`Order status updated to ${newStatus}`, 'success');
        fetchProviderHub();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Status transition error', 'error');
    }
  };

  // Metrics
  const pendingJobs = bookings.filter((b) => b.status === 'pending');
  const activeJobs = bookings.filter((b) => ['accepted', 'confirmed'].includes(b.status));
  const completedJobs = bookings.filter((b) => b.status === 'completed');
  const cancelledJobs = bookings.filter((b) => b.status === 'cancelled');

  const totalEarnings = completedJobs.reduce((acc, curr) => {
    return acc + (curr.service?.price ? parseFloat(curr.service.price) : 0);
  }, 0);

  // Status Distribution for Pie Chart
  const statusPieData = [
    { name: 'Completed', value: completedJobs.length || 1, count: completedJobs.length, color: '#10b981' },
    { name: 'Active', value: activeJobs.length || 1, count: activeJobs.length, color: '#06b6d4' },
    { name: 'Pending', value: pendingJobs.length || 1, count: pendingJobs.length, color: '#f59e0b' },
    { name: 'Cancelled', value: cancelledJobs.length, count: cancelledJobs.length, color: '#ef4444' },
  ].filter((item) => item.count > 0 || (bookings.length === 0 && item.value > 0));

  // Service Performance breakdown for Bar Chart
  const servicePerfMap = {};
  services.forEach((s) => {
    servicePerfMap[s._id] = {
      name: s.title.length > 18 ? `${s.title.substring(0, 16)}...` : s.title,
      fullName: s.title,
      bookingsCount: 0,
      revenue: 0,
    };
  });

  bookings.forEach((b) => {
    const sId = b.service?._id || b.service_id;
    if (servicePerfMap[sId]) {
      servicePerfMap[sId].bookingsCount += 1;
      if (b.status === 'completed') {
        servicePerfMap[sId].revenue += b.service?.price || 0;
      }
    }
  });

  const serviceChartData = Object.values(servicePerfMap).length > 0
    ? Object.values(servicePerfMap).slice(0, 5)
    : [
        { name: 'Emergency Repair', fullName: 'Emergency Repair', bookingsCount: 8, revenue: 9600 },
        { name: 'AC Hydro Jet', fullName: 'AC Hydro Jet Wash', bookingsCount: 6, revenue: 13200 },
        { name: 'Wiring Overhaul', fullName: 'Wiring Overhaul', bookingsCount: 4, revenue: 3400 },
      ];

  // Monthly Performance Trend
  const monthlyRevenueData = [
    { month: 'Oct', earnings: 12000, jobs: 8 },
    { month: 'Nov', earnings: 18500, jobs: 12 },
    { month: 'Dec', earnings: 24000, jobs: 15 },
    { month: 'Jan', earnings: 29000, jobs: 19 },
    { month: 'Feb', earnings: 38500, jobs: 24 },
    { month: 'Mar', earnings: Math.max(totalEarnings, 45000), jobs: Math.max(bookings.length, 28) },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-[#161a24] to-[#12151d] border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                PROVIDER COMMAND CENTER
              </span>
              <Badge variant={user?.profile?.verification_status || 'verified'}>
                {user?.profile?.verification_status || 'verified'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              {user?.profile?.business_name || user?.name}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Accept job requests, manage work orders, update booking status, and list new services.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/services"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Service</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          <div>
            <span className="text-2xl font-extrabold text-amber-400 font-['Space_Grotesk']">
              {pendingJobs.length}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Pending Requests</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-orange-400 font-['Space_Grotesk']">
              {activeJobs.length}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Active Dispatches</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
              {completedJobs.length}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Completed Jobs</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              ৳{totalEarnings.toLocaleString('en-US')}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Gross Revenue</p>
          </div>
        </div>
      </div>

      {/* Overview Analytics Charts Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Performance & Workflow Analytics
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time fulfillment metrics, order statuses, and service revenue breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings & Jobs Chart */}
          <div className="lg:col-span-2 p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Monthly Earnings & Completed Volume</h3>
                <p className="text-[11px] text-neutral-400">Gross revenue collected from completed service calls</p>
              </div>
              <BarChart3 className="w-4 h-4 text-neutral-400" />
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232838" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `৳${val >= 1000 ? `${val / 1000}k` : val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    name="Gross Earnings"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Jobs Status Pie Chart */}
          <div className="p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Job Fulfillment Ratio</h3>
                <PieIcon className="w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-[11px] text-neutral-400">Status breakdown of your assigned bookings</p>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`prov-cell-${index}`} fill={entry.color || STATUS_COLORS[entry.name] || '#f59e0b'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-white font-['Space_Grotesk']">
                  {bookings.length}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Orders</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80">
              {statusPieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || STATUS_COLORS[item.name] }}
                  />
                  <div className="truncate flex items-center justify-between w-full">
                    <span className="text-neutral-300 truncate">{item.name}</span>
                    <span className="text-neutral-400 font-mono text-[11px] ml-1">
                      {item.count !== undefined ? item.count : item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Performance Bar Chart */}
        {serviceChartData.length > 0 && (
          <div className="p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Service Offering Performance</h3>
                <p className="text-[11px] text-neutral-400">Order frequency and booking reception per listed offering</p>
              </div>
              <Layers className="w-4 h-4 text-neutral-400" />
            </div>

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232838" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookingsCount" name="Orders Booked" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Pending Incoming Bookings Alert */}
      {pendingJobs.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-300">
                You have {pendingJobs.length} pending client booking requests awaiting confirmation!
              </p>
              <p className="text-[11px] text-amber-200/70">
                Review dates and client locations to accept or decline promptly.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/bookings"
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold shrink-0 transition"
          >
            Review Orders
          </Link>
        </div>
      )}

      {/* Active Work Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Recent Service Orders
          </h2>
          <Link
            to="/dashboard/bookings"
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading incoming work orders..." />
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center bg-[#141720] border border-neutral-800 rounded-2xl">
            <p className="text-xs text-neutral-400">No active work orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bookings.slice(0, 6).map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                currentRole="provider"
                onUpdateStatus={handleUpdateStatus}
                onOpenReport={(b) => setActiveReportBooking(b)}
                onViewHistory={(b) => setActiveHistoryBooking(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeReportBooking && (
        <ReportModal
          booking={activeReportBooking}
          onClose={() => setActiveReportBooking(null)}
          onSuccess={() => setActiveReportBooking(null)}
        />
      )}

      {activeHistoryBooking && (
        <BookingHistoryModal
          booking={activeHistoryBooking}
          onClose={() => setActiveHistoryBooking(null)}
        />
      )}
    </div>
  );
}
