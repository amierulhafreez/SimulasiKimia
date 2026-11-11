import React, { useState, useEffect } from 'react';
import { SIMULATIONS_DATA } from './data/simulations';
import { SimulationItem, FormLevel, SimulationAnalytics } from './types/simulation';
import { analytics } from './services/analytics';
import { Header } from './components/Header';
import { SimulationCard } from './components/SimulationCard';
import { SimulationModal } from './components/SimulationModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { Footer } from './components/Footer';
import { Search, Sparkles, Filter, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<SimulationAnalytics>(analytics.getAnalytics());
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationItem | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [activeFormTab, setActiveFormTab] = useState<'all' | FormLevel>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Record home page visit
    const updated = analytics.recordHomeVisit();
    setAnalyticsData(updated);

    // Subscribe to real-time changes
    const unsubscribe = analytics.subscribe(data => {
      setAnalyticsData({ ...data });
    });

    return () => unsubscribe();
  }, []);

  // Filter simulations based on tab & search
  const filteredSimulations = SIMULATIONS_DATA.filter(sim => {
    const matchesForm = activeFormTab === 'all' || sim.form === activeFormTab;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (
      sim.title.toLowerCase().includes(query) ||
      sim.chapter.toLowerCase().includes(query) ||
      sim.category.toLowerCase().includes(query) ||
      sim.tags.some(t => t.toLowerCase().includes(query))
    );
    return matchesForm && matchesSearch;
  });

  const t4Count = SIMULATIONS_DATA.filter(s => s.form === 'Tingkatan 4').length;
  const t5Count = SIMULATIONS_DATA.filter(s => s.form === 'Tingkatan 5').length;

  return (
    <div className="min-h-screen bg-[#0b0c16] text-slate-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      
      <div>
        {/* Top Header */}
        <Header 
          totalVisitors={analyticsData.totalHomeVisits}
          onOpenAnalytics={() => setShowAnalyticsModal(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-[#121327]/80 border border-slate-800">
            
            {/* Form Level Tabs (Semua / T4 / T5) */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 rounded-xl bg-black/40">
              <button
                onClick={() => setActiveFormTab('all')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeFormTab === 'all'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({SIMULATIONS_DATA.length})
              </button>

              <button
                onClick={() => setActiveFormTab('Tingkatan 4')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  activeFormTab === 'Tingkatan 4'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Tingkatan 4</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">{t4Count}</span>
              </button>

              <button
                onClick={() => setActiveFormTab('Tingkatan 5')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  activeFormTab === 'Tingkatan 5'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Tingkatan 5</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">{t5Count}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari eksperimen, topik, gas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

          </div>

          {/* Simulations Section */}
          {activeFormTab === 'all' && !searchQuery ? (
            // Grouped by Tingkatan 4 and Tingkatan 5 when viewing all (like Canva site layout)
            <div className="space-y-12">
              
              {/* Tingkatan 4 Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-purple-900/30">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h2 className="font-display font-extrabold text-xl text-white tracking-wide uppercase">
                    TINGKATAN 4
                  </h2>
                  <span className="text-xs text-purple-300/70 font-mono">({t4Count} Simulasi KSSM)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SIMULATIONS_DATA.filter(s => s.form === 'Tingkatan 4').map(sim => (
                    <SimulationCard
                      key={sim.id}
                      simulation={sim}
                      views={analyticsData.simulations[sim.id]?.views || 0}
                      completed={analyticsData.simulations[sim.id]?.completed || 0}
                      onSelect={setSelectedSimulation}
                    />
                  ))}
                </div>
              </div>

              {/* Tingkatan 5 Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/30">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h2 className="font-display font-extrabold text-xl text-white tracking-wide uppercase">
                    TINGKATAN 5
                  </h2>
                  <span className="text-xs text-emerald-300/70 font-mono">({t5Count} Simulasi KSSM)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SIMULATIONS_DATA.filter(s => s.form === 'Tingkatan 5').map(sim => (
                    <SimulationCard
                      key={sim.id}
                      simulation={sim}
                      views={analyticsData.simulations[sim.id]?.views || 0}
                      completed={analyticsData.simulations[sim.id]?.completed || 0}
                      onSelect={setSelectedSimulation}
                    />
                  ))}
                </div>
              </div>

            </div>
          ) : (
            // Filtered view
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Memaparkan {filteredSimulations.length} simulasi</span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-purple-400 hover:underline"
                  >
                    Kosongkan carian
                  </button>
                )}
              </div>

              {filteredSimulations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredSimulations.map(sim => (
                    <SimulationCard
                      key={sim.id}
                      simulation={sim}
                      views={analyticsData.simulations[sim.id]?.views || 0}
                      completed={analyticsData.simulations[sim.id]?.completed || 0}
                      onSelect={setSelectedSimulation}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-slate-400 text-sm">Tiada simulasi ditemui untuk carian "{searchQuery}".</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                  >
                    Papar Semua Eksperimen
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Interactive Simulation Modal */}
      <SimulationModal
        simulation={selectedSimulation}
        onClose={() => setSelectedSimulation(null)}
      />

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <AnalyticsModal
          analyticsData={analyticsData}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
};
export default App;
