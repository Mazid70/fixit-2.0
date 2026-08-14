import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ShieldCheck,
  Key,
  CheckCircle2,
  Save,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Camera,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import api from '../api/axios.js';
import Badge from '../components/common/Badge.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotifications();

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || user?.profile?.profile_image || user?.profile?.avatar || '',
    address: user?.profile?.address || '',
    business_name: user?.profile?.business_name || '',
    description: user?.profile?.description || '',
    location: user?.profile?.location || '',
  });

  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(formData);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (passData.newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setChangingPass(true);
    try {
      const res = await api.put('/auth/update-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      if (res.data.success) {
        addToast('Password updated successfully!', 'success');
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Password update failed.', 'error');
    } finally {
      setChangingPass(false);
    }
  };

  if (!user) return null;

  const currentAvatar = formData.avatar || user.avatar || user.profile?.profile_image || user.profile?.avatar;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header with Avatar Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500/50 shadow-lg shadow-orange-500/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-orange-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0b0d11]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
                {user.name}
              </h1>
              <Badge variant={user.role}>{user.role}</Badge>
            </div>
            <p className="text-xs text-neutral-400">{user.email}</p>
          </div>
        </div>

        <div className="text-xs text-neutral-400">
          <span>Member since: {new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#141720] border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Account Details
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Update your contact details, profile photo, and presence.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Avatar Section */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#0e1117] border border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-orange-400" />
                    <span>Profile Picture (Avatar)</span>
                  </label>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      Clear image
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-700 bg-neutral-900 flex items-center justify-center">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="Paste image URL (e.g. https://...)"
                      className="w-full bg-[#141720] text-xs text-neutral-200 rounded-xl px-3.5 py-2 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                    />
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="pt-2 border-t border-neutral-800/80">
                  <span className="text-[10px] font-semibold text-neutral-400 block mb-2">
                    Or select a preset avatar:
                  </span>
                  <div className="flex items-center gap-2">
                    {defaultAvatars.map((url, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormData({ ...formData, avatar: url })}
                        className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition ${
                          formData.avatar === url
                            ? 'border-orange-500 scale-105 shadow-sm shadow-orange-500/40'
                            : 'border-transparent hover:border-neutral-600 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Preset ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1712-345678"
                    className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-[#0e1117]/60 text-xs text-neutral-500 rounded-xl px-4 py-2.5 border border-neutral-800 cursor-not-allowed"
                />
              </div>

              {/* Role specific profile fields */}
              {user.role === 'provider' ? (
                <div className="space-y-4 pt-4 border-t border-neutral-800/80">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Business / Trade Name
                      </label>
                      <input
                        type="text"
                        value={formData.business_name}
                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                        className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Operating City / Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Business Description & Certifications
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl p-3 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Saved Home Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address for on-site services"
                    className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-4 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="py-2.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center gap-2 disabled:opacity-50"
              >
                {savingProfile ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </div>

        {/* Security / Password */}
        <div className="space-y-6">
          <div className="bg-[#141720] border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base font-['Space_Grotesk']">
                <Key className="w-4 h-4 text-orange-400" />
                <span>Security Credentials</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Change your login password.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-3.5 pr-10 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={passData.newPassword}
                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-3.5 pr-10 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#0e1117] text-xs text-neutral-200 rounded-xl px-3.5 pr-10 py-2.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {changingPass ? <LoadingSpinner size="sm" /> : <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
