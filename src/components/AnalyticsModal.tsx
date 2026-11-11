import React from 'react';
import { SimulationAnalytics } from '../types/simulation';
import { SIMULATIONS_DATA } from '../data/simulations';
import { X, Users, MousePointerClick, Eye, Trophy, Award, BarChart2 } from 'lucide-react';

interface Props {
  analyticsData: SimulationAnalytics;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<Props> = ({ analyticsData, onClose }) => {
  // Compute totals
  let totalViews = 0;
  let totalClicks = 0;
  let totalCompleted = 0;

  const simulationsWithStats = SIMULATIONS_DATA.map(sim => {
    const stat = analyticsData.simulations[sim.id] || { views: 0, clicks: 0, completed: 0 };
    totalViews += stat.views;
    totalClicks += stat.clicks;
    totalCompleted += stat.completed;
    return {
      ...sim,
      views: stat.views,
      clicks: stat.clicks,
      completed: stat.completed
    };
  });

  // Sort top 5 simulations by views
  const topSimulations = [...simulationsWithStats].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121324] border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Papan Pemuka Statistik Makmal Maya
              </h3>
              <p className="text-xs text-slate-400">Analisis Pelawat & Interaksi Pelajar SPM</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pelawat Laman</span>
              <div className="flex items-center justify-center gap-1.5 text-xl font-mono font-bold text-purple-300">
                <Users className="w-4 h-4 text-purple-400" />
                {analyticsData.totalHomeVisits.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Jumlah Tontonan</span>
              <div className="flex items-center justify-center gap-1.5 text-xl font-mono font-bold text-cyan-300">
                <Eye className="w-4 h-4 text-cyan-400" />
                {totalViews.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Interaksi & Klik</span>
              <div className="flex items-center justify-center gap-1.5 text-xl font-mono font-bold text-emerald-300">
                <MousePointerClick className="w-4 h-4 text-emerald-400" />
                {totalClicks.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Top 5 Most Popular Simulations */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Top 5 Simulasi Paling Kerap Digunakan Pelajar:
            </h4>

            <div className="space-y-2">
              {topSimulations.map((sim, index) => (
                <div 
                  key={sim.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs hover:border-purple-500/30 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      index === 0 ? 'bg-amber-500 text-black' :
                      index === 1 ? 'bg-slate-300 text-black' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{sim.title}</p>
                      <p className="text-[10px] text-slate-400">{sim.form} &bull; {sim.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 mr-1">Views:</span>
                      <strong className="text-purple-300">{sim.views}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 mr-1">Klik:</span>
                      <strong className="text-emerald-300">{sim.clicks}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Info */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" /> Nota Guru (Cikgu Hafreez):
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Statistik ini direkodkan secara langsung setiap kali pelajar mengakses laman web, membuka modul, atau menekan radas kimia interaktif. Data ini disimpan dalam simpanan pelawat secara automatik.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
