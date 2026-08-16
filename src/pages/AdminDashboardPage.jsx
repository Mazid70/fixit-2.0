import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Calendar,
  FolderTree,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Activity,
  CheckCircle2,
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
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';

const STATUS_COLORS = {
  Completed: '#10b981',
  Active: '#06b6d4',
  Pending: '#f59e0b',
  Cancelled: '#ef4444',
};

const ROLE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

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
              {entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('volume')
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
          {data.value} {data.value === 1 ? 'record' : 'records'}
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendMetric, setTrendMetric] = useState('revenue'); // 'revenue' or 'bookings'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Failed to load admin stats:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating platform metrics..." />;
  }

  // Prepared data for graphs
  const monthlyTrends = stats?.monthlyTrends || [
    { month: 'Oct', revenue: 14500, bookings: 14, completed: 12 },
    { month: 'Nov', revenue: 22800, bookings: 22, completed: 19 },
    { month: 'Dec', revenue: 31200, bookings: 28, completed: 25 },
    { month: 'Jan', revenue: 42000, bookings: 36, completed: 32 },
    { month: 'Feb', revenue: 58500, bookings: 48, completed: 44 },
    { month: 'Mar', revenue: 72000, bookings: 56, completed: 50 },
  ];

  const statusDistribution = stats?.statusDistribution && stats.statusDistribution.length > 0
    ? stats.statusDistribution
    : [
        { name: 'Completed', value: stats?.completedBookings || 4, color: '#10b981' },
        { name: 'Active', value: 2, color: '#06b6d4' },
        { name: 'Pending', value: stats?.pendingBookings || 1, color: '#f59e0b' },
      ];

  const categoryBreakdown = stats?.categoryBreakdown && stats.categoryBreakdown.length > 0
    ? stats.categoryBreakdown
    : [
        { name: 'Electrical', fullName: 'Electrical & Power', bookings: 18, services: 4 },
        { name: 'Plumbing', fullName: 'Plumbing & Water', bookings: 14, services: 3 },
        { name: 'AC/HVAC', fullName: 'AC & HVAC Maintenance', bookings: 16, services: 2 },
        { name: 'Appliances', fullName: 'Home Appliance Repair', bookings: 9, services: 2 },
        { name: 'Cleaning', fullName: 'Deep Cleaning', bookings: 7, services: 2 },
      ];

  const userDistribution = stats?.userRoleDistribution && stats.userRoleDistribution.length > 0
    ? stats.userRoleDistribution
    : [
        { name: 'Customers', value: stats?.totalCustomers || 12, color: '#3b82f6' },
        { name: 'Verified Providers', value: stats?.verifiedProviders || 6, color: '#10b981' },
        { name: 'Pending Providers', value: stats?.pendingVerifications || 2, color: '#f59e0b' },
        { name: 'Admins', value: 1, color: '#ec4899' },
      ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1">
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          <span>ROOT ADMIN CONSOLE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
          Platform Governance & Metrics
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          System-wide performance, technician approval queue, incident moderation, and booking transactions.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#141720] border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            {stats?.totalUsers || 0}
          </div>
          <div className="text-[11px] text-neutral-500">
            {stats?.totalCustomers || 0} Clients • {stats?.totalProviders || 0} Providers
          </div>
        </div>

        <div className="p-5 bg-[#141720] border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-['Space_Grotesk']">
            {stats?.pendingVerifications || 0}
          </div>
          <div className="text-[11px] text-neutral-500">
            {stats?.verifiedProviders || 0} Active Verified Providers
          </div>
        </div>

        <div className="p-5 bg-[#141720] border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            {stats?.totalBookings || 0}
          </div>
          <div className="text-[11px] text-neutral-500">
            {stats?.completedBookings || 0} Completed • {stats?.pendingBookings || 0} Pending
          </div>
        </div>

        <div className="p-5 bg-[#141720] border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
            ৳{stats?.totalVolume ? Number(stats.totalVolume).toLocaleString('en-US') : '0'}
          </div>
          <div className="text-[11px] text-neutral-500">
            Across {stats?.completedBookings || 0} completed orders
          </div>
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Platform Performance Overview
            </h2>
            <p className="text-xs text-neutral-400">
              Live volume analysis, order fulfillment rates, and service category market distribution.
            </p>
          </div>
        </div>

        {/* Top Charts Row: Main Area Chart & Booking Status Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Growth Trend Area Chart */}
          <div className="lg:col-span-2 p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">Gross Volume & Transaction Trajectory</h3>
                <p className="text-[11px] text-neutral-400">Monthly gross transaction volume and booking velocity</p>
              </div>
              <div className="flex items-center bg-[#1b202c] p-1 rounded-xl border border-neutral-700/60 self-start">
                <button
                  onClick={() => setTrendMetric('revenue')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    trendMetric === 'revenue'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Revenue (৳)
                </button>
                <button
                  onClick={() => setTrendMetric('bookings')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    trendMetric === 'bookings'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232838" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => (trendMetric === 'revenue' ? `৳${val >= 1000 ? `${val / 1000}k` : val}` : val)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {trendMetric === 'revenue' ? (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Platform Revenue"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  ) : (
                    <>
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        name="Total Requests"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOrders)"
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        name="Completed Jobs"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={0.2}
                        fill="#10b981"
                      />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking Status Distribution Pie Chart */}
          <div className="p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Order Status Ratio</h3>
                <PieIcon className="w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-[11px] text-neutral-400">Distribution across active service requests</p>
            </div>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || STATUS_COLORS[entry.name] || '#f97316'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-white font-['Space_Grotesk']">
                  {stats?.totalBookings || 0}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Orders</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80">
              {statusDistribution.map((item) => (
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

        {/* Bottom Charts Row: Category Demand Bar Chart & Ecosystem Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Service Demand Bar Chart */}
          <div className="p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Demand by Service Category</h3>
                <p className="text-[11px] text-neutral-400">Total client bookings fulfilled per specialty sector</p>
              </div>
              <BarChart3 className="w-4 h-4 text-neutral-400" />
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232838" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookings" name="Booking Volume" fill="#f97316" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="services" name="Listed Services" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Ecosystem & Provider Roles Pie/Donut Chart */}
          <div className="p-6 bg-[#141720] border border-neutral-800 rounded-3xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">User & Technician Demographics</h3>
                <Users className="w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-[11px] text-neutral-400">Platform participant breakdown and verification status</p>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`user-cell-${index}`} fill={entry.color || ROLE_COLORS[index % ROLE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-white font-['Space_Grotesk']">
                  {stats?.totalUsers || 0}
                </span>
                <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">Members</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80">
              {userDistribution.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || ROLE_COLORS[idx % ROLE_COLORS.length] }}
                  />
                  <div className="truncate flex items-center justify-between w-full">
                    <span className="text-neutral-300 truncate">{item.name}</span>
                    <span className="text-neutral-400 font-mono text-[11px] ml-1">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/providers"
          className="p-6 bg-[#141720] border border-neutral-800 hover:border-amber-500/50 rounded-2xl transition group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
            Provider Verifications
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Review submitted credentials, business names, and verify or decline specialist accounts.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="p-6 bg-[#141720] border border-neutral-800 hover:border-orange-500/50 rounded-2xl transition group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition">
            User Accounts & Roles
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Audit customer and provider accounts, toggle active/inactive access, and inspect profile details.
          </p>
        </Link>

        <Link
          to="/admin/reports"
          className="p-6 bg-[#141720] border border-neutral-800 hover:border-rose-500/50 rounded-2xl transition group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition">
            Incident Moderation
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Investigate customer or technician grievance reports, assign resolutions, and protect quality.
          </p>
        </Link>
      </div>
    </div>
  );
}
