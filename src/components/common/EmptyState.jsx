import React from 'react';
import { Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = Wrench,
  title = 'No records found',
  description = 'There are no items matching your criteria or currently available in this section.',
  actionText = '',
  actionLink = '',
  onAction = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#13161c] border border-neutral-800 rounded-2xl max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-neutral-100 mb-1">{title}</h3>
      <p className="text-sm text-neutral-400 mb-6 leading-relaxed max-w-sm">
        {description}
      </p>

      {actionText && (
        <>
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition shadow-lg shadow-orange-500/20"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition shadow-lg shadow-orange-500/20"
            >
              {actionText}
            </button>
          )}
        </>
      )}
    </div>
  );
}
