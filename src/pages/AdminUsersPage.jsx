import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  UserX,
  UserCheck,
  Mail,
  Phone,
} from 'lucide-react';
import api from '../api/axios.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Badge from '../components/common/Badge.jsx';

export default function AdminUsersPage() {
  const { addToast } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, { status: nextStatus });
      if (res.data.success) {
        addToast(`User status updated to ${nextStatus}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.toLowerCase().includes(term));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
            User Account Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Directory of all registered customers, verified service specialists, and platform admins.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#141720] border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'customer', 'provider', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                roleFilter === r
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#0e1117] text-neutral-400 hover:text-white'
              }`}
            >
              {r} ({r === 'all' ? users.length : users.filter((u) => u.role === r).length})
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
              placeholder="Search user name or email..."
              className="w-full bg-[#0e1117] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-4 py-2 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner message="Fetching user directory..." />
      ) : (
        <div className="bg-[#141720] border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#0e1117] text-[11px] uppercase tracking-wider text-neutral-400 font-bold border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-neutral-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[11px] text-neutral-500 font-mono">
                            ID: #{String(u._id).slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={u.role}>{u.role}</Badge>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-neutral-200">{u.email}</p>
                        <p className="text-[11px] text-neutral-500">{u.phone || 'No phone'}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={u.status}>{u.status}</Badge>
                    </td>

                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(u.created_at || Date.now()).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            u.status === 'active'
                              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                          }`}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
