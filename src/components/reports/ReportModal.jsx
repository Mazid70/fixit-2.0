import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import api from '../../api/axios.js';
import { useNotifications } from '../../context/NotificationContext.jsx';

export default function ReportModal({ isOpen, onClose, targetUser, booking }) {
  const { addToast } = useNotifications();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reportedUserId =
    targetUser?._id ||
    (booking?.provider?.user_id || booking?.provider?.user?._id) ||
    booking?.customer_id;

  const reportedName =
    targetUser?.name ||
    booking?.provider?.business_name ||
    booking?.customer?.name ||
    'User';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide specific incident details.');
      return;
    }

    if (!reportedUserId) {
      setError('Could not identify target user ID.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/reports', {
        reported_user_id: reportedUserId,
        reason: reason.trim(),
      });

      if (res.data.success) {
        addToast('Report submitted for admin review.', 'success');
        onClose();
        setReason('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File Safety or Quality Report" maxWidth="max-w-md">
      <div className="flex items-start gap-3 p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
        <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
        <p className="leading-relaxed">
          Reporting <strong>{reportedName}</strong>. Our Trust & Safety team reviews all disputes, conduct violations, and service discrepancies.
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Reason & Incident Details</span>
          </label>
          <textarea
            rows={4}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain what occurred (e.g. no-show, improper billing, safety concern, unprofessional conduct)..."
            className="w-full bg-[#0d0f14] text-xs text-neutral-200 rounded-xl p-3 border border-neutral-800 focus:border-rose-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white shadow-lg shadow-rose-600/20 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Incident Report'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
