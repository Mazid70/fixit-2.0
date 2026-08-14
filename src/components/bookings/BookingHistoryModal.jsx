import React from 'react';
import { History, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Badge from '../common/Badge.jsx';

export default function BookingHistoryModal({ isOpen, onClose, booking }) {
  if (!booking) return null;

  const history = booking.status_history || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Status Timeline" maxWidth="max-w-md">
      <div className="mb-4 text-xs text-neutral-400">
        Lifecycle audit log for booking{' '}
        <span className="font-mono text-neutral-200">#{String(booking._id).slice(-6)}</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
        {history.length === 0 ? (
          <div className="text-xs text-neutral-400">Initial status: {booking.status}</div>
        ) : (
          history.map((h, idx) => {
            const date = new Date(h.changed_at || booking.created_at);
            return (
              <div key={h._id || idx} className="relative flex items-start gap-3">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-neutral-900 border-2 border-orange-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                </div>
                <div className="bg-[#0f1218] border border-neutral-800 rounded-xl p-3 flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant={h.new_status}>{h.new_status}</Badge>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {h.old_status ? (
                    <p className="text-[11px] text-neutral-400">
                      Transitioned from <span className="font-semibold text-neutral-300 capitalize">{h.old_status}</span> to <span className="font-semibold text-orange-400 capitalize">{h.new_status}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-neutral-400">
                      Initial booking request created
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-800 text-right">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold bg-neutral-800 text-neutral-200 hover:text-white rounded-xl transition"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
