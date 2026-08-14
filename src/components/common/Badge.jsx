import React from 'react';

export default function Badge({ variant = 'default', children, className = '' }) {
  const variants = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    accepted: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    cancelled: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30',
    verified: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30',
    customer: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    provider: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    admin: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    default: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  };

  const selectedClass = variants[variant.toLowerCase()] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedClass} ${className} whitespace-nowrap capitalize`}
    >
      {children || variant}
    </span>
  );
}
