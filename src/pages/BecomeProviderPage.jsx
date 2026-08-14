import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  MapPin,
  FileText,
  User,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function BecomeProviderPage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business_name: '',
    category: 'HVAC & AC Master Technician',
    location: 'Gulshan & Banani, Dhaka',
    experience_years: '5+',
    nid_number: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('fixit_auth_token');
      const res = await fetch('/api/users/become-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Application submission failed.');
      }

      // Refresh user context so user gets updated role
      if (refreshUser) {
        await refreshUser();
      }

      setSubmitted(true);
      addToast('Application submitted to FIXIT verification admins!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-bold shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
          <span>FIXIT Verified Technician & Contractor Network</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
          Join Bangladesh's Premier <span className="text-orange-500">Service Partner</span> Network
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Connect directly with high-intent homeowners and commercial enterprises across Dhaka, Chittagong, and Sylhet. Get guaranteed payouts via bKash or direct bank transfer.
        </p>
      </div>

      {/* 3 Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#12151e] border border-[#212635] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Verified Badge & Trust</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Gain customer trust immediately with NID-vetted master specialist badges and priority ranking on search pages.
          </p>
        </div>

        <div className="bg-[#12151e] border border-[#212635] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Flexible Working Hours</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Accept booking requests according to your personal availability, track incoming leads, and manage appointments with 1 click.
          </p>
        </div>

        <div className="bg-[#12151e] border border-[#212635] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Transparent Payouts</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Receive fast payments in BDT via bKash, Nagad, Rocket, or direct bank settlement right after service completion.
          </p>
        </div>
      </div>

      {/* Main Application Box */}
      <div className="max-w-2xl mx-auto bg-[#10131b] border border-[#212635] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
              Application Submitted to Admin!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Your service partner verification request has been queued. An admin will review your credentials shortly. You can now access your provider dashboard and start setting up your listings.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard/provider')}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition flex items-center gap-2"
              >
                <span>Go to Provider Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
                Submit Partner Application
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Fill in your trade details. Admin will verify your information and activate your certified badge.
              </p>
            </div>

            {!isAuthenticated && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/25 rounded-2xl flex items-center justify-between gap-4">
                <div className="text-xs">
                  <p className="font-bold text-orange-400">Account required</p>
                  <p className="text-neutral-300 text-[11px]">
                    Please sign in or create a standard user account before submitting your partner application.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold whitespace-nowrap shadow-md"
                >
                  Sign In First
                </Link>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Business / Trade Name *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="e.g. Master Inverter AC & Electrical Care"
                    required
                    className="w-full bg-[#151924] text-xs text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-3 border border-[#232838] focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Primary Service Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#151924] text-xs text-neutral-100 rounded-xl px-3.5 py-3 border border-[#232838] focus:outline-none focus:border-orange-500 transition"
                  >
                    <option>HVAC & Inverter AC Specialist</option>
                    <option>Electrical & IPS Solutions</option>
                    <option>Concealed Plumbing & Sanitary</option>
                    <option>Smart CCTV & Security Systems</option>
                    <option>Deep Cleaning & Pest Sanitization</option>
                    <option>Automotive & Bike Diagnostics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Operating Metro / Dhaka Area *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Gulshan, Banani, Uttara"
                      required
                      className="w-full bg-[#151924] text-xs text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-3 border border-[#232838] focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    National ID / Trade License No. (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.nid_number}
                      onChange={(e) => setFormData({ ...formData, nid_number: e.target.value })}
                      placeholder="NID or Trade Reg Number"
                      className="w-full bg-[#151924] text-xs text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-3 border border-[#232838] focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Years of Field Experience
                  </label>
                  <select
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    className="w-full bg-[#151924] text-xs text-neutral-100 rounded-xl px-3.5 py-3 border border-[#232838] focus:outline-none focus:border-orange-500 transition"
                  >
                    <option>1 - 2 Years</option>
                    <option>3 - 5 Years</option>
                    <option>5 - 10 Years</option>
                    <option>10+ Years (Master Pro)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  About Your Qualifications & Services
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your technical certifications, past work, and emergency response capabilities..."
                  className="w-full bg-[#151924] text-xs text-neutral-100 placeholder-neutral-500 rounded-xl p-3 border border-[#232838] focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isAuthenticated}
                className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <span>Submit Partner Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
