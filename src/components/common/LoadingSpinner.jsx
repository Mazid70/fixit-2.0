import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', message = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className={`${sizeMap[size] || sizeMap.md} text-orange-500 animate-spin mb-3`} />
      {message && <p className="text-sm text-neutral-400 font-medium">{message}</p>}
    </div>
  );
}
