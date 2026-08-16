import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6 shadow-xl shadow-orange-500/10">
        <Wrench className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
        404 ERROR
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] mb-3">
        Page Under Construction or Not Found
      </h1>
      <p className="text-xs text-neutral-400 max-w-md mb-8 leading-relaxed">
        The route you requested could not be located. It may have been moved or you might have entered an incorrect dispatch URL.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition"
      >
        <Home className="w-4 h-4" />
        <span>Return to Marketplace Home</span>
      </Link>
    </div>
  );
}
