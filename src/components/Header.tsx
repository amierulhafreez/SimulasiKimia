import React from 'react';
import { BarChart3, Search, FlaskConical, Send, ArrowUpRight } from 'lucide-react';

interface Props {
  totalVisitors: number;
  onOpenAnalytics: () => void;
  onNavigateSection: (section: 'hero' | 'bento' | 't4' | 't5') => void;
  onFocusSearch: () => void;
}

export const Header: React.FC<Props> = ({
  totalVisitors,
  onOpenAnalytics,
  onNavigateSection,
  onFocusSearch,
}) => {
  return (
    <nav
      aria-label="Navigasi utama"
      className="sticky top-0 z-40 apple-glass border-b border-black/[0.06] transition-shadow"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-13 flex items-center justify-between gap-4">
        {/* Left: Minimal Brand */}
        <button
          type="button"
          onClick={() => onNavigateSection('hero')}
          className="flex items-center gap-2 text-[#1d1d1f] hover:opacity-80 transition cursor-pointer shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-[#1d1d1f] text-white flex items-center justify-center shadow-2xs">
            <FlaskConical className="w-3.5 h-3.5" />
          </div>
          <span className="font-display font-semibold text-xs sm:text-[13px] tracking-tight whitespace-nowrap">
            Simulasi Kimia
          </span>
          <span className="hidden lg:inline-block text-[11px] text-[#6e6e73] font-medium">
            · Cikgu Hafreez
          </span>
        </button>

        {/* Center: Clear Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-[12px] font-medium text-[#1d1d1f]/80">
          <button
            type="button"
            onClick={() => onNavigateSection('hero')}
            className="hover:text-[#0071e3] transition cursor-pointer whitespace-nowrap"
          >
            Utama
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('bento')}
            className="hover:text-[#0071e3] transition cursor-pointer whitespace-nowrap"
          >
            Sorotan Pembelajaran
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('t4')}
            className="hover:text-[#0071e3] transition cursor-pointer whitespace-nowrap"
          >
            Tingkatan 4
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('t5')}
            className="hover:text-[#0071e3] transition cursor-pointer whitespace-nowrap"
          >
            Tingkatan 5
          </button>
          <a
            href="https://www.erphkimia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition cursor-pointer whitespace-nowrap flex items-center gap-1 text-indigo-600/90 font-semibold"
            title="e-RPH Kimia KSSM Pintar untuk Guru"
          >
            <span>e-RPH Guru</span>
            <ArrowUpRight className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Right: Telegram Contact, Quick Search, Visitor Live Pill & Statistics */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://t.me/amierulhafreez"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3 py-1 rounded-full bg-[#0088cc]/10 hover:bg-[#0088cc] text-[#0088cc] hover:text-white text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shadow-2xs"
            title="Hubungi Cikgu Hafreez di Telegram (@AmierulHafreez)"
          >
            <Send className="w-3 h-3" />
            <span className="inline">Hubungi Saya</span>
          </a>

          <button
            type="button"
            onClick={onFocusSearch}
            aria-label="Cari simulasi"
            className="p-1.5 rounded-full text-[#1d1d1f]/70 hover:text-[#1d1d1f] hover:bg-black/[0.05] transition cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <div
            title="Jumlah pelawat aktif"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.04] border border-black/[0.05] text-[11px] font-medium text-[#1d1d1f]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-semibold tabular-nums">
              {totalVisitors.toLocaleString()}
            </span>
            <span className="text-[#6e6e73]">pelawat</span>
          </div>

          <button
            type="button"
            onClick={onOpenAnalytics}
            className="px-3 py-1 rounded-full bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Statistik</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
