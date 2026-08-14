import React from 'react';
import { RotateCcw, MapPin, Check, Star, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function ServiceFilters({
  categories = [],
  filters,
  onFilterChange,
  onResetFilters,
}) {
  const quickLocations = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Mirpur', 'Chattogram'];
  const ratingOptions = [
    { label: 'All', value: '' },
    { label: '4.0+', value: '4.0' },
    { label: '4.5+', value: '4.5' },
    { label: '4.8+', value: '4.8' },
  ];

  return (
    <div className="bg-[#12151e] border border-[#212635] rounded-[22px] p-6 space-y-6 shadow-xl sticky top-24">
      {/* Top Header with Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1f2533]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-orange-500" />
          <h2 className="text-base font-extrabold text-white tracking-wide font-['Space_Grotesk']">
            Filters
          </h2>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1.5 transition uppercase tracking-wider py-1 px-2.5 rounded-lg hover:bg-orange-500/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* CATEGORY Selection */}
      <div className="space-y-3">
        <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
          Category
        </label>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange('category', '')}
            className="w-full flex items-center gap-3 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer select-none py-1 text-left group"
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                !filters.category
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-[#181d2a] border-neutral-700 group-hover:border-neutral-500'
              }`}
            >
              {!filters.category && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="truncate">All Categories</span>
          </button>

          {categories.map((cat) => {
            const isSelected = filters.category === cat._id || filters.category === cat.category_name;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => onFilterChange('category', isSelected ? '' : cat._id)}
                className="w-full flex items-center gap-3 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer select-none py-1 text-left group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-[#181d2a] border-neutral-700 group-hover:border-neutral-500'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">{cat.category_name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRICE PER HOUR / SERVICE RATE */}
      <div className="space-y-3 pt-2 border-t border-[#1f2533]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
            Price Rate (BDT ৳)
          </label>
          <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">
            {filters.maxPrice ? `৳${Number(filters.maxPrice).toLocaleString()} max` : '৳5,000 max'}
          </span>
        </div>

        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={filters.maxPrice || 5000}
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          className="w-full accent-orange-500 bg-[#1a1f2c] h-2 rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold">
          <span>৳500</span>
          <span>৳2,500</span>
          <span>৳5,000+</span>
        </div>
      </div>

      {/* MIN. RATING */}
      <div className="space-y-3 pt-2 border-t border-[#1f2533]">
        <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
          Min. Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {ratingOptions.map((opt) => {
            const isSelected = (filters.minRating || '') === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onFilterChange('minRating', opt.value)}
                className={`py-1.5 px-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                    : 'bg-[#181d2a] text-neutral-300 border-neutral-700/60 hover:border-orange-500/40 hover:text-white'
                }`}
              >
                {opt.value && <Star className="w-3 h-3 fill-current text-amber-300" />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCATION */}
      <div className="space-y-3 pt-2 border-t border-[#1f2533]">
        <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
          Location
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="e.g. Gulshan, Banani, Uttara"
            className="w-full bg-[#161a25] text-xs text-neutral-200 placeholder-neutral-500 rounded-xl pl-9 pr-3 py-2.5 border border-neutral-700/80 focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Bangladesh Popular Zone Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickLocations.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => onFilterChange('location', filters.location === loc ? '' : loc)}
              className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition ${
                filters.location === loc
                  ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                  : 'bg-[#161a25] border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="pt-2 border-t border-[#1f2533]">
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-3 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-neutral-300 leading-snug">
            <strong className="text-orange-400 font-semibold block mb-0.5">
              100% Bangladesh Verified
            </strong>
            NID & Trade License verified specialists with guaranteed repair warranty.
          </p>
        </div>
      </div>
    </div>
  );
}
