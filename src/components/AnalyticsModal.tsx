import React, { useState } from 'react';
import { SimulationAnalytics } from '../types/simulation';
import { SIMULATIONS_DATA } from '../data/simulations';
import { analytics } from '../services/analytics';
import {
  X,
  Users,
  MousePointerClick,
  Eye,
  Trophy,
  Award,
  BarChart2,
  RefreshCw,
  Radio,
  Fingerprint,
  CheckCircle,
} from 'lucide-react';

interface Props {
  analyticsData: SimulationAnalytics;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<Props> = ({ analyticsData, onClose }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'top' | 'all'>('top');
  const [filterQuery, setFilterQuery] = useState('');

  let totalViews = 0;
  let totalClicks = 0;
  let totalCompleted = 0;

  const simulationsWithStats = SIMULATIONS_DATA.map((sim) => {
    const stat = analyticsData.simulations[sim.id] || { views: 0, clicks: 0, completed: 0 };
    totalViews += stat.views;
    totalClicks += stat.clicks;
    totalCompleted += stat.completed;
    return {
      ...sim,
      views: stat.views,
      clicks: stat.clicks,
      completed: stat.completed,
    };
  });

  const topSimulations = [...simulationsWithStats]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const filteredAll = simulationsWithStats
    .filter(
      (s) =>
        s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        s.chapter.toLowerCase().includes(filterQuery.toLowerCase()) ||
        s.form.toLowerCase().includes(filterQuery.toLowerCase())
    )
    .sort((a, b) => b.views - a.views);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await analytics.syncFromCloud();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const anonUid = analytics.ensureAnonymousUid();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Papan Pemuka Statistik Makmal Maya
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Masa-Nyata (Tanpa Login)
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Perekodan telemetri automatik pelawat & klik radas seluruh Malaysia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Segerakkan data terkini dari awan"
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200 text-xs font-semibold flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
              <span className="hidden sm:inline text-[11px]">Segerak</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition border border-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1">
                <Radio className="w-3 h-3 text-purple-500 animate-pulse" /> Pelawat Laman
              </span>
              <div className="flex items-center justify-center gap-1.5 text-xl font-mono font-extrabold text-purple-700">
                <Users className="w-4 h-4 text-purple-600" />
                {analyticsData.totalHomeVisits.toLocaleString()}
              </div>
              <div className="text-[9.5px] text-purple-600/80 font-medium">diselaraskan di awan</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Jumlah Tontonan</span>
              <div className="flex items-center justify-center gap-1.5 text-xl font-mono font-extrabold text-sky-700">
                <Eye className="w-4 h-4 text-sky-600" />
                {totalViews.toLocaleString()}
              </div>
              <div className="text-[9.5px] text-sky-600/80 font-medium">buka eksperimen</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Interaksi & Klik</span>
              <div className="flex items-center justify-center gap-1.5 text-xl font-mono font-extrabold text-emerald-700">
                <MousePointerClick className="w-4 h-4 text-emerald-600" />
                {totalClicks.toLocaleString()}
              </div>
              <div className="text-[9.5px] text-emerald-600/80 font-medium">tindakan butang/radas</div>
            </div>
          </div>

          {/* Tab Selector: Top 5 vs Semua */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('top')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'top'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Top 5 Popular</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Semua Simulasi ({simulationsWithStats.length})</span>
              </button>
            </div>

            {activeTab === 'all' && (
              <input
                type="text"
                placeholder="Tapis topik..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 w-36"
              />
            )}
          </div>

          {/* List of Simulations */}
          {activeTab === 'top' ? (
            <div className="space-y-2">
              {topSimulations.map((sim, index) => (
                <div
                  key={sim.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-purple-300 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        index === 0
                          ? 'bg-amber-400 text-black'
                          : index === 1
                          ? 'bg-slate-300 text-black'
                          : index === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{sim.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {sim.form} &bull; {sim.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-700">
                    <div>
                      <span className="text-slate-400 mr-1">Tontonan:</span>
                      <strong className="text-purple-700">{sim.views.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 mr-1">Klik:</span>
                      <strong className="text-emerald-700">{sim.clicks.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredAll.map((sim, index) => (
                <div
                  key={sim.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-purple-300 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{sim.title}</p>
                      <p className="text-[9.5px] text-slate-500 font-medium">
                        {sim.form} &bull; {sim.chapter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10.5px] font-mono text-slate-700 shrink-0">
                    <div>
                      <span className="text-slate-400 mr-1">Views:</span>
                      <strong className="text-purple-700">{sim.views}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 mr-1">Klik:</span>
                      <strong className="text-emerald-700">{sim.clicks}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Anonymous Architecture Info Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-xs text-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" /> Pengesahan Arkitektur Masa-Nyata (Tanpa Login):
              </span>
              <span className="text-[10px] font-mono font-semibold text-indigo-700 flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full border border-indigo-200">
                <Fingerprint className="w-3 h-3 text-indigo-600" />
                {anonUid.slice(0, 16)}...
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Setiap kali mana-mana pelajar di seluruh Malaysia membuka laman atau menekan radas eksperimen, data kaunter
              disimpan secara atomik di awan menerusi ID peranti tanpa nama (*anonymous telemetry*). Pengguna tidak perlu
              membuat akaun atau mendaftar masuk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
