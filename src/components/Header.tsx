import React from 'react';
import { Users, BarChart3, Sparkles } from 'lucide-react';

interface Props {
  totalVisitors: number;
  onOpenAnalytics: () => void;
}

export const Header: React.FC<Props> = ({ totalVisitors, onOpenAnalytics }) => {
  return (
    <header className="relative pt-10 pb-8 px-4 border-b border-purple-900/30 bg-gradient-to-b from-[#18112c] via-[#0e0c1e] to-[#0b0c16]">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-purple-600/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Branding */}
        <div className="text-center md:text-left space-y-2">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            amierul hafreez | mrsm bagan datuk
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase drop-shadow-sm">
            SIMULASI KIMIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">CIKGU HAFREEZ</span>
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="font-display font-bold text-sm tracking-wide text-amber-400 bg-amber-400/10 px-3 py-0.5 rounded border border-amber-400/30">
              KAMI NAK KIMIA A+
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Makmal Maya SPM KSSM (Tingkatan 4 & 5)
            </span>
          </div>

        </div>

        {/* Right Visitor Counter & Analytics Pill */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Live Visitor Counter Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-lg shadow-purple-950/40">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative"></span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Jumlah Pelawat</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-bold text-lg text-white">
                  {totalVisitors.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Aktif</span>
              </div>
            </div>
            <Users className="w-5 h-5 text-purple-400 ml-1 opacity-80" />
          </div>

          {/* Analytics Dashboard Trigger Button */}
          <button
            onClick={onOpenAnalytics}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/25 transition transform hover:-translate-y-0.5"
          >
            <BarChart3 className="w-4 h-4" />
            Statistik Makmal
          </button>

        </div>

      </div>

    </header>
  );
};
