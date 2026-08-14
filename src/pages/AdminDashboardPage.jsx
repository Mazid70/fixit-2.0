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
} from 'lucide-react';
import api from '../api/axios.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating platform metrics..." />;
  }

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
