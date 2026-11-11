import React from 'react';
import { Users, BarChart3, Sparkles } from 'lucide-react';

interface Props {
  totalVisitors: number;
  onOpenAnalytics: () => void;
}

export const Header: React.FC<Props> = ({ totalVisitors, onOpenAnalytics }) => {
  return (
    <header className="relative pt-10 pb-8 px-4 border-b border-purple-100 bg-gradient-to-b from-purple-50/80 via-white to-[#f8fafc]">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Branding */}
        <div className="text-center md:text-left space-y-2">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            amierul hafreez | mrsm bagan datuk
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900 uppercase">
            SIMULASI KIMIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">CIKGU HAFREEZ</span>
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="font-display font-bold text-xs tracking-wide text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              KAMI NAK KIMIA A+
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Makmal Maya SPM KSSM (Tingkatan 4 & 5)
            </span>
          </div>

        </div>

        {/* Right Visitor Counter & Analytics Pill */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Live Visitor Counter Badge */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-purple-200 shadow-sm">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"></span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Jumlah Pelawat</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-extrabold text-lg text-slate-900">
                  {totalVisitors.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Aktif</span>
              </div>
            </div>
            <Users className="w-5 h-5 text-purple-600 ml-1 opacity-80" />
          </div>

          {/* Analytics Dashboard Trigger Button */}
          <button
            onClick={onOpenAnalytics}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition transform hover:-translate-y-0.5"
          >
            <BarChart3 className="w-4 h-4" />
            Statistik Makmal
          </button>

        </div>

      </div>

    </header>
  );
};
