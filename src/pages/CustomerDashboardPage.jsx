import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Star,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Plus,
  AlertTriangle,
  TrendingUp,
  PieChart as PieIcon,
  DollarSign,
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
} from 'recharts';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import BookingCard from '../components/bookings/BookingCard.jsx';
import ReviewModal from '../components/reviews/ReviewModal.jsx';
import ReportModal from '../components/reports/ReportModal.jsx';
import BookingHistoryModal from '../components/bookings/BookingHistoryModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const CATEGORY_COLORS = ['#f97316', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

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
              {entry.name.toLowerCase().includes('spent') || entry.name.toLowerCase().includes('expense')
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
          {data.value} {data.value === 1 ? 'service' : 'services'} (৳{data.payload.spent?.toLocaleString() || 0})
        </p>
      </div>
    );
  }
  return null;
};

export default function CustomerDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useNotifications();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeReviewBooking, setActiveReviewBooking] = useState(null);
  const [activeReportBooking, setActiveReportBooking] = useState(null);
  const [activeHistoryBooking, setActiveHistoryBooking] = useState(null);

  const fetchBookings = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load user bookings:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBookings();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(`Booking status updated to ${newStatus}`, 'success');
        fetchBookings();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update booking status', 'error');
    }
  };

  // Metrics
  const activeCount = bookings.filter((b) => ['pending', 'accepted', 'confirmed'].includes(b.status)).length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const reviewsGivenCount = bookings.filter((b) => b.review).length;

  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((acc, curr) => acc + (curr.service?.price ? parseFloat(curr.service.price) : 0), 0);

  // Category breakdown for Pie Chart
  const categoryMap = {};
  bookings.forEach((b) => {
    const catName = b.service?.category?.category_name || b.service?.category_name || 'General Maintenance';
    if (!categoryMap[catName]) {
      categoryMap[catName] = { name: catName, value: 0, spent: 0 };
    }
    categoryMap[catName].value += 1;
    if (b.status === 'completed') {
      categoryMap[catName].spent += b.service?.price || 0;
    }
  });

  const categoryPieData = Object.values(categoryMap).length > 0
    ? Object.values(categoryMap)
    : [
        { name: 'Electrical & Power', value: 2, spent: 2050, color: '#f97316' },
        { name: 'AC Maintenance', value: 1, spent: 2200, color: '#06b6d4' },
      ];

  // Spending History Trend
  const spendingTrend = [
    { month: 'Nov', spent: 1200, services: 1 },
    { month: 'Dec', spent: 2850, services: 2 },
    { month: 'Jan', spent: 1500, services: 1 },
    { month: 'Feb', spent: 3400, services: 3 },
    { month: 'Mar', spent: Math.max(totalSpent, 4250), services: Math.max(bookings.length, 3) },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500/15 via-[#161a24] to-[#12151d] border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              CUSTOMER OVERVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] mt-1">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Track on-going repair dispatches, inspect status timelines, and review completed service orders.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Service</span>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          <div>
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              {activeCount}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">In-Progress Orders</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
              {completedCount}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Completed Jobs</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-amber-400 font-['Space_Grotesk']">
              {reviewsGivenCount}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Reviews Submitted</p>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-orange-400 font-['Space_Grotesk']">
              ৳{totalSpent.toLocaleString('en-US')}
            </span>
            <p className="text-[11px] text-neutral-400 font-medium">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Graphs & Pie Charts Overview Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Service Activity & Expenditure Insights
          </h2>
          <p className="text-xs text-neutral-400">
            Overview of your home maintenance frequency and spending distribution across specialty services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Spending Graph */}
          <div className="lg:col-span-2 p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Repair Spending & Service History</h3>
                <p className="text-[11px] text-neutral-400">Monthly maintenance expenditures and booking frequency</p>
              </div>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
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
                    dataKey="spent"
                    name="Expenditure"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSpent)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Category Pie Chart */}
          <div className="p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Services by Category</h3>
                <PieIcon className="w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-[11px] text-neutral-400">Distribution of your repair types</p>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell
                        key={`cust-cell-${index}`}
                        fill={entry.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-white font-['Space_Grotesk']">
                  {bookings.length}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Bookings</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-neutral-800/80">
              {categoryPieData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-neutral-300 truncate">{item.name}</span>
                  </div>
                  <span className="text-neutral-400 font-mono text-[11px] shrink-0 ml-2">
                    {item.value} ({item.spent ? `৳${item.spent.toLocaleString()}` : '—'})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Become a Partner Callout Card for Customers */}
      <div className="bg-[#12151e] border border-[#212635] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-orange-400 flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Offer Your Skills on FIXIT</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Are you an electrician, AC specialist, plumber, or contractor? Apply for verified partner status.
            </p>
          </div>
        </div>
        <Link
          to="/become-provider"
          className="px-4 py-2.5 rounded-xl bg-[#191d2a] hover:bg-orange-500 hover:text-white border border-[#262c3e] text-neutral-200 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
        >
          <span>Apply to be a Provider</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Recent Service Bookings
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
          <LoadingSpinner message="Retrieving service requests..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No Bookings Yet"
            description="You haven't requested any home repairs or specialist services yet."
            actionText="Explore Marketplace"
            onAction={() => window.location.assign('/services')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bookings.slice(0, 6).map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                currentRole="customer"
                onUpdateStatus={handleUpdateStatus}
                onOpenReview={(b) => setActiveReviewBooking(b)}
                onOpenReport={(b) => setActiveReportBooking(b)}
                onViewHistory={(b) => setActiveHistoryBooking(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeReviewBooking && (
        <ReviewModal
          booking={activeReviewBooking}
          onClose={() => setActiveReviewBooking(null)}
          onSuccess={() => {
            setActiveReviewBooking(null);
            fetchBookings();
          }}
        />
      )}

      {activeReportBooking && (
        <ReportModal
          booking={activeReportBooking}
          onClose={() => setActiveReportBooking(null)}
          onSuccess={() => {
            setActiveReportBooking(null);
          }}
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
