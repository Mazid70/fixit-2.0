import React from 'react';
import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal.jsx';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this operation?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  loading = false,
}) {
  const getIcon = () => {
    if (variant === 'danger') {
      return <Trash2 className="w-6 h-6 text-rose-500" />;
    }
    if (variant === 'warning') {
      return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    }
    return <CheckCircle2 className="w-6 h-6 text-orange-500" />;
  };

  const getButtonClass = () => {
    if (variant === 'danger') {
      return 'bg-rose-600 hover:bg-rose-700 text-white';
    }
    if (variant === 'warning') {
      return 'bg-amber-600 hover:bg-amber-700 text-white';
    }
    return 'bg-orange-500 hover:bg-orange-600 text-white';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0">
          {getIcon()}
        </div>
        <div>
          <p className="text-sm text-neutral-300 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-xl transition"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-5 py-2 text-sm font-medium rounded-xl transition flex items-center gap-2 ${getButtonClass()}`}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
