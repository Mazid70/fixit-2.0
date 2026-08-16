import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { addToast } = useNotifications();

  // Tab: 'login' or 'register'
  const isRegisterInitial = location.pathname === '/register';
  const [activeTab, setActiveTab] = useState(
    isRegisterInitial ? 'register' : 'login',
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const redirectPath = location.state?.from?.pathname;

  const handleTabChange = tab => {
    setActiveTab(tab);
    setError('');
    if (tab === 'register') {
      window.history.replaceState(null, '', '/register');
    } else {
      window.history.replaceState(null, '', '/login');
    }
  };

  const handleForgotPassword = e => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address above to reset password.');
      return;
    }
    setForgotSent(true);
    addToast('Password reset link sent to your email address.', 'info');
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');

      if (redirectPath) {
        navigate(redirectPath);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    setLoading(true);
    try {
      // Normal user (customer) registration
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'customer',
      });

      addToast(
        `Welcome to FIXIT, ${user.name}! Your account is ready.`,
        'success',
      );
      navigate('/dashboard/customer');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#090b0e] text-white flex flex-col justify-center overflow-hidden">
      {/* Background Watermark USER / Grid Texture */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center">
        <span className="text-[20vw] font-black text-[#12151e]/40 tracking-widest font-['Space_Grotesk'] transform translate-x-12 translate-y-8">
          USER
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Giant Brand Typography & Dispatch Metrics */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-12">
            {/* Top Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Shield className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-black text-white font-['Space_Grotesk'] tracking-tight">
                FIXIT
              </span>
            </div>

            {/* Giant Title: FIX (White) IT. (Orange) */}
            <div className="space-y-1">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] font-['Space_Grotesk'] select-none">
                <span className="block text-white">FIX</span>
                <span className="block text-orange-500">IT.</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed pt-4 font-normal">
                Connect with elite service providers. Reliable, verified hands
                for every urgent residential or commercial repair.
              </p>
            </div>

            {/* Bottom Proof Section: Avatars + Dispatched + Categories */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2a3040] text-[10px] font-bold text-neutral-200 border-2 border-[#090b0e]">
                    AM
                  </span>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#363e54] text-[10px] font-bold text-neutral-200 border-2 border-[#090b0e]">
                    SC
                  </span>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1e2330] text-[10px] font-bold text-neutral-200 border-2 border-[#090b0e]">
                    JD
                  </span>
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-white">12,400+</span>{' '}
                  <span className="text-neutral-400">
                    Pros dispatched today
                  </span>
                </div>
              </div>

              {/* Tag Categories */}
              <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-neutral-400 uppercase flex flex-wrap gap-2 items-center">
                <span>PLUMBING</span>
                <span>•</span>
                <span>ELECTRICAL</span>
                <span>•</span>
                <span>HVAC</span>
                <span>•</span>
                <span>APPLIANCE REPAIR</span>
                <span>•</span>
                <span>AUTOMOTIVE</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Auth Form Box */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:ml-auto">
            <div className="bg-[#10131b]/90 backdrop-blur-xl border border-[#1f2433] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Tab Navigation: LOGIN | REGISTER */}
              <div className="flex items-center gap-6 border-b border-[#1c2230] pb-2">
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className={`relative pb-2 text-base sm:text-lg font-black tracking-wider font-['Space_Grotesk'] uppercase transition-colors ${
                    activeTab === 'login'
                      ? 'text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  LOGIN
                  {/* no underline */}
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className={`relative pb-2 text-base sm:text-lg font-black tracking-wider font-['Space_Grotesk'] uppercase transition-colors ${
                    activeTab === 'register'
                      ? 'text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  REGISTER
                  {/* no underline */}
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full bg-[#151924] text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-3 border border-[#232838] focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80 transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        PASSWORD
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#151924] text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-10 py-3 border border-[#232838] focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition focus:outline-none"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="staySignedIn"
                      checked={staySignedIn}
                      onChange={e => setStaySignedIn(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#151924] border-[#232838] text-orange-500 focus:ring-orange-500/50 accent-orange-500"
                    />
                    <label
                      htmlFor="staySignedIn"
                      className="text-xs text-neutral-400 select-none cursor-pointer"
                    >
                      Stay signed in on this device
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-200 active:scale-[0.99] text-black font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* REGISTER FORM (Normal user - No role selector) */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      FULL NAME
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        required
                        className="w-full bg-[#151924] text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#232838] focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80 transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full bg-[#151924] text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#232838] focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80 transition"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      PHONE NUMBER (OPTIONAL)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+880 1712-345678"
                        className="w-full bg-[#151924] text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#232838] focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80 transition"
                      />
                    </div>
                  </div>

                  {/* Password with Eye Toggle */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      CREATE PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                        className="w-full bg-[#151924] text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-10 py-2.5 border border-[#232838] focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition focus:outline-none"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Provider Info Notice */}
                  <p className="text-[11px] text-neutral-400 leading-relaxed bg-[#151924] p-3 rounded-xl border border-[#232838]">
                    💡 All new members register as normal users. Want to offer
                    services? You can apply to become a certified service
                    partner anytime from your profile or navbar.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-200 active:scale-[0.99] text-black font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
