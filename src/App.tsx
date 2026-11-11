import React, { useState, useEffect } from 'react';
import { SIMULATIONS_DATA } from './data/simulations';
import { SimulationItem, FormLevel, SimulationAnalytics } from './types/simulation';
import { analytics } from './services/analytics';
import { Header } from './components/Header';
import { SimulationCard } from './components/SimulationCard';
import { SimulationModal } from './components/SimulationModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { Footer } from './components/Footer';
import { Search } from 'lucide-react';

export const App: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<SimulationAnalytics>(analytics.getAnalytics());
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationItem | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [activeFormTab, setActiveFormTab] = useState<'all' | FormLevel>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const updated = analytics.recordHomeVisit();
    setAnalyticsData(updated);

    const unsubscribe = analytics.subscribe(data => {
      setAnalyticsData({ ...data });
    });

    return () => unsubscribe();
  }, []);

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      
      <div>
        {/* Top Header */}
        <Header 
          totalVisitors={analyticsData.totalHomeVisits}
          onOpenAnalytics={() => setShowAnalyticsModal(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            
            {/* Form Level Tabs (Semua / T4 / T5) */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 rounded-xl bg-slate-100">
              <button
                onClick={() => setActiveFormTab('all')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeFormTab === 'all'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({SIMULATIONS_DATA.length})
              </button>

              <button
                onClick={() => setActiveFormTab('Tingkatan 4')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeFormTab === 'Tingkatan 4'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Tingkatan 4</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeFormTab === 'Tingkatan 4' ? 'bg-purple-800' : 'bg-slate-200'}`}>{t4Count}</span>
              </button>

              <button
                onClick={() => setActiveFormTab('Tingkatan 5')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeFormTab === 'Tingkatan 5'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Tingkatan 5</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeFormTab === 'Tingkatan 5' ? 'bg-emerald-800' : 'bg-slate-200'}`}>{t5Count}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari eksperimen, topik, gas, radas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition"
              />
            </div>

          </div>

          {/* Simulations Section */}
          {activeFormTab === 'all' && !searchQuery ? (
            <div className="space-y-12">
              
              {/* Tingkatan 4 Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-purple-200">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-wide uppercase">
                    TINGKATAN 4
                  </h2>
                  <span className="text-xs text-purple-700 font-bold font-mono">({t4Count} Simulasi KSSM)</span>
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
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-wide uppercase">
                    TINGKATAN 5
                  </h2>
                  <span className="text-xs text-emerald-700 font-bold font-mono">({t5Count} Simulasi KSSM)</span>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Memaparkan {filteredSimulations.length} simulasi</span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-purple-600 font-bold hover:underline"
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
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <p className="text-slate-500 text-sm">Tiada simulasi ditemui untuk carian "{searchQuery}".</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
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
