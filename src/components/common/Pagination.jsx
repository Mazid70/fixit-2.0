import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
  itemName = 'items',
}) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safePage = Math.min(Math.max(1, page || 1), safeTotalPages);

  // If there are literally 0 items and totalPages is 0/1 with no count, hide
  if (totalItems === 0) {
    return null;
  }

  const handlePage = (p) => {
    if (p < 1 || p > safeTotalPages || p === safePage) return;
    if (onPageChange) onPageChange(p);
  };

  // Generate page numbers with smart ellipsis windowing
  const getPageNumbers = () => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (safePage <= 4) {
      // Near beginning: 1, 2, 3, 4, 5, ..., total
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(safeTotalPages);
    } else if (safePage >= safeTotalPages - 3) {
      // Near end: 1, ..., total-4, total-3, total-2, total-1, total
      pages.push(1);
      pages.push('...');
      for (let i = safeTotalPages - 4; i <= safeTotalPages; i++) pages.push(i);
    } else {
      // In middle: 1, ..., page-1, page, page+1, ..., total
      pages.push(1);
      pages.push('...');
      pages.push(safePage - 1);
      pages.push(safePage);
      pages.push(safePage + 1);
      pages.push('...');
      pages.push(safeTotalPages);
    }
    return pages;
  };

  // Item range calculations
  const startItem = totalItems !== undefined && pageSize ? (safePage - 1) * pageSize + 1 : null;
  const endItem =
    totalItems !== undefined && pageSize
      ? Math.min(safePage * pageSize, totalItems)
      : null;

  return (
    <div className="w-full pt-4 pb-2 border-t border-[#1c2230] flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      {/* Item info / count */}
      <div className="text-xs text-neutral-400 font-medium flex flex-wrap items-center gap-3">
        {totalItems !== undefined && startItem !== null && endItem !== null ? (
          <span>
            Showing <strong className="text-white font-bold">{Math.max(1, startItem)}–{endItem}</strong> of{' '}
            <strong className="text-white font-bold">{totalItems}</strong> {itemName}
          </span>
        ) : (
          <span>
            Page <strong className="text-white font-bold">{safePage}</strong> of{' '}
            <strong className="text-white font-bold">{safeTotalPages}</strong>
          </span>
        )}

        {/* Optional Page Size Selector */}
        {pageSizeOptions && onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-neutral-800">
            <span className="text-[11px] text-neutral-500">Per page:</span>
            <select
              value={pageSize || pageSizeOptions[0]}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-[#12151e] border border-[#212635] text-neutral-200 text-xs rounded-lg px-2 py-1 focus:border-orange-500 focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        {safeTotalPages > 5 && (
          <button
            onClick={() => handlePage(1)}
            disabled={safePage === 1}
            title="First page"
            className="w-8 h-8 rounded-xl bg-[#12151e] border border-[#212635] text-neutral-400 hover:text-white hover:border-orange-500/40 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Previous page button */}
        <button
          onClick={() => handlePage(safePage - 1)}
          disabled={safePage === 1}
          className="px-2.5 h-8 rounded-xl bg-[#12151e] border border-[#212635] text-xs font-semibold text-neutral-300 hover:text-white hover:border-orange-500/50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((item, idx) => {
            if (item === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-xs text-neutral-500 font-mono"
                >
                  …
                </span>
              );
            }

            const pNum = Number(item);
            const isActive = safePage === pNum;

            return (
              <button
                key={`page-${pNum}`}
                onClick={() => handlePage(pNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-[#12151e] border border-[#212635] text-neutral-400 hover:text-white hover:border-orange-500/40'
                }`}
              >
                {pNum}
              </button>
            );
          })}
        </div>

        {/* Next page button */}
        <button
          onClick={() => handlePage(safePage + 1)}
          disabled={safePage === safeTotalPages}
          className="px-2.5 h-8 rounded-xl bg-[#12151e] border border-[#212635] text-xs font-semibold text-neutral-300 hover:text-white hover:border-orange-500/50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last page button */}
        {safeTotalPages > 5 && (
          <button
            onClick={() => handlePage(safeTotalPages)}
            disabled={safePage === safeTotalPages}
            title="Last page"
            className="w-8 h-8 rounded-xl bg-[#12151e] border border-[#212635] text-neutral-400 hover:text-white hover:border-orange-500/40 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
