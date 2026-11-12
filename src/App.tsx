import React, { useEffect, useMemo, useState } from 'react';
import { SIMULATIONS_DATA } from './data/simulations';
import { FormLevel, SimulationAnalytics, SimulationItem } from './types/simulation';
import { analytics } from './services/analytics';
import { Header } from './components/Header';
import { SimulationCard } from './components/SimulationCard';
import { SimulationModal } from './components/SimulationModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { Footer } from './components/Footer';
import { BookOpen, Layers, Search } from 'lucide-react';

interface TopicGroup {
  key: string;
  babCode: string;
  title: string;
  items: SimulationItem[];
}

const T4_TOPICS: Array<{ key: string; babCode: string; title: string; match: (s: SimulationItem) => boolean }> = [
  {
    key: 't4-bab2',
    babCode: 'Bab 2',
    title: 'Jirim dan Struktur Atom',
    match: (s) => s.chapter.startsWith('Bab 2:'),
  },
  {
    key: 't4-bab3',
    babCode: 'Bab 3',
    title: 'Konsep Mol, Formula dan Persamaan Kimia',
    match: (s) => s.chapter.startsWith('Bab 3:'),
  },
  {
    key: 't4-bab4',
    babCode: 'Bab 4',
    title: 'Jadual Berkala Unsur',
    match: (s) => s.chapter.startsWith('Bab 4:'),
  },
  {
    key: 't4-bab5',
    babCode: 'Bab 5',
    title: 'Ikatan Kimia',
    match: (s) => s.chapter.startsWith('Bab 5:') || s.chapter.startsWith('Bab 4 & Bab 5:'),
  },
  {
    key: 't4-bab6',
    babCode: 'Bab 6',
    title: 'Asid, Bes dan Garam',
    match: (s) => s.chapter.startsWith('Bab 6:'),
  },
  {
    key: 't4-bab7',
    babCode: 'Bab 7',
    title: 'Kadar Tindak Balas',
    match: (s) => s.chapter.startsWith('Bab 7:'),
  },
];

const T5_TOPICS: Array<{ key: string; babCode: string; title: string; match: (s: SimulationItem) => boolean }> = [
  {
    key: 't5-bab1',
    babCode: 'Bab 1',
    title: 'Keseimbangan Redoks',
    match: (s) => s.chapter.startsWith('Bab 1:'),
  },
  {
    key: 't5-bab2',
    babCode: 'Bab 2',
    title: 'Sebatian Karbon',
    match: (s) => s.chapter.startsWith('Bab 2:'),
  },
  {
    key: 't5-bab3',
    babCode: 'Bab 3',
    title: 'Termokimia',
    match: (s) => s.chapter.startsWith('Bab 3:'),
  },
  {
    key: 't5-bab4',
    babCode: 'Bab 4',
    title: 'Kimia Polimer',
    match: (s) => s.chapter.startsWith('Bab 4:'),
  },
  {
    key: 't5-bab5',
    babCode: 'Bab 5',
    title: 'Kimia Konsumer dan Industri',
    match: (s) => s.chapter.startsWith('Bab 5:'),
  },
];

function groupByTopics(
  sims: SimulationItem[],
  defs: typeof T4_TOPICS
): TopicGroup[] {
  return defs
    .map((def) => ({
      key: def.key,
      babCode: def.babCode,
      title: def.title,
      items: sims.filter(def.match),
    }))
    .filter((group) => group.items.length > 0);
}

export const App: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<SimulationAnalytics>(analytics.getAnalytics());
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationItem | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [activeFormTab, setActiveFormTab] = useState<'all' | FormLevel>('all');
  const [selectedT4Topic, setSelectedT4Topic] = useState<string>('all');
  const [selectedT5Topic, setSelectedT5Topic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const updated = analytics.recordHomeVisit();
    setAnalyticsData(updated);

    const unsubscribe = analytics.subscribe((data) => {
      setAnalyticsData({ ...data });
    });

    return () => unsubscribe();
  }, []);

  const t4Sims = useMemo(
    () => SIMULATIONS_DATA.filter((s) => s.form === 'Tingkatan 4'),
    []
  );
  const t5Sims = useMemo(
    () => SIMULATIONS_DATA.filter((s) => s.form === 'Tingkatan 5'),
    []
  );

  const t4Groups = useMemo(() => groupByTopics(t4Sims, T4_TOPICS), [t4Sims]);
  const t5Groups = useMemo(() => groupByTopics(t5Sims, T5_TOPICS), [t5Sims]);

  const visibleT4Groups = useMemo(
    () =>
      selectedT4Topic === 'all'
        ? t4Groups
        : t4Groups.filter((g) => g.key === selectedT4Topic),
    [t4Groups, selectedT4Topic]
  );

  const visibleT5Groups = useMemo(
    () =>
      selectedT5Topic === 'all'
        ? t5Groups
        : t5Groups.filter((g) => g.key === selectedT5Topic),
    [t5Groups, selectedT5Topic]
  );

  const searchFilteredSimulations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];
    return SIMULATIONS_DATA.filter((sim) => {
      const matchesForm = activeFormTab === 'all' || sim.form === activeFormTab;
      const matchesSearch =
        sim.title.toLowerCase().includes(query) ||
        sim.chapter.toLowerCase().includes(query) ||
        sim.category.toLowerCase().includes(query) ||
        sim.tags.some((t) => t.toLowerCase().includes(query));
      return matchesForm && matchesSearch;
    });
  }, [activeFormTab, searchQuery]);

  const t4Count = t4Sims.length;
  const t5Count = t5Sims.length;

  const renderT4Section = () => (
    <section
      data-testid="section-tingkatan-4"
      className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#F7FBFF] via-[#F2F8FF] to-[#F4F1FF]/60 border border-[#BBD9FB] shadow-xs space-y-5"
    >
      {/* Tingkatan 4 Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#C7DFFE]">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-wide uppercase">
                TINGKATAN 4
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-bold font-mono">
                {t4Count} Simulasi KSSM
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Himpunan simulasi makmal maya Tingkatan 4 • Disusun mengikut topik Bab 2 – Bab 7
            </p>
          </div>
        </div>
      </div>

      {/* Topic Quick Filter Bar for Tingkatan 4 */}
      <div
        className="flex flex-wrap items-center gap-1.5"
        role="tablist"
        aria-label="Penapis topik Tingkatan 4"
      >
        <button
          type="button"
          data-testid="t4-topic-all"
          onClick={() => setSelectedT4Topic('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
            selectedT4Topic === 'all'
              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
              : 'bg-white/90 text-slate-700 border-[#BFDBFE] hover:border-purple-300 hover:text-purple-700'
          }`}
        >
          Semua Topik ({t4Count})
        </button>
        {t4Groups.map((group) => {
          const isActive = selectedT4Topic === group.key;
          return (
            <button
              key={group.key}
              type="button"
              data-testid={`t4-topic-${group.key}`}
              onClick={() => setSelectedT4Topic(group.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white/90 text-slate-700 border-[#BFDBFE] hover:border-purple-300 hover:text-purple-700'
              }`}
            >
              <span>{group.babCode}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-purple-800 text-white' : 'bg-[#E5F1FF] text-slate-600'
                }`}
              >
                {group.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Topic Subsections */}
      <div className="space-y-6">
        {visibleT4Groups.map((group) => (
          <div
            key={group.key}
            data-testid={`topic-group-${group.key}`}
            className="space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                  {group.babCode}
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                  {group.title}
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 whitespace-nowrap">
                {group.items.length} simulasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.items.map((sim) => (
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
        ))}
      </div>
    </section>
  );

  const renderT5Section = () => (
    <section
      data-testid="section-tingkatan-5"
      className="rounded-3xl p-5 sm:p-6 bg-white border border-emerald-200/80 shadow-xs space-y-5"
    >
      {/* Tingkatan 5 Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-wide uppercase">
                TINGKATAN 5
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold font-mono">
                {t5Count} Simulasi KSSM
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Simulasi Tingkatan 5 • Disusun mengikut topik Bab 1 – Bab 5
            </p>
          </div>
        </div>
      </div>

      {/* Topic Quick Filter Bar for Tingkatan 5 */}
      <div
        className="flex flex-wrap items-center gap-1.5"
        role="tablist"
        aria-label="Penapis topik Tingkatan 5"
      >
        <button
          type="button"
          data-testid="t5-topic-all"
          onClick={() => setSelectedT5Topic('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
            selectedT5Topic === 'all'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
          }`}
        >
          Semua Topik ({t5Count})
        </button>
        {t5Groups.map((group) => {
          const isActive = selectedT5Topic === group.key;
          return (
            <button
              key={group.key}
              type="button"
              data-testid={`t5-topic-${group.key}`}
              onClick={() => setSelectedT5Topic(group.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              <span>{group.babCode}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {group.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Topic Subsections */}
      <div className="space-y-6">
        {visibleT5Groups.map((group) => (
          <div
            key={group.key}
            data-testid={`topic-group-${group.key}`}
            className="space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                  {group.babCode}
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                  {group.title}
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                {group.items.length} simulasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.items.map((sim) => (
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
        ))}
      </div>
    </section>
  );

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
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeFormTab === 'all'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({SIMULATIONS_DATA.length})
              </button>

              <button
                onClick={() => setActiveFormTab('Tingkatan 4')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeFormTab === 'Tingkatan 4'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Tingkatan 4</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    activeFormTab === 'Tingkatan 4' ? 'bg-purple-800' : 'bg-slate-200'
                  }`}
                >
                  {t4Count}
                </span>
              </button>

              <button
                onClick={() => setActiveFormTab('Tingkatan 5')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeFormTab === 'Tingkatan 5'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Tingkatan 5</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    activeFormTab === 'Tingkatan 5' ? 'bg-emerald-800' : 'bg-slate-200'
                  }`}
                >
                  {t5Count}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari eksperimen, topik, gas, radas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Simulations Section */}
          {!searchQuery.trim() ? (
            <div className="space-y-8">
              {(activeFormTab === 'all' || activeFormTab === 'Tingkatan 4') && renderT4Section()}
              {(activeFormTab === 'all' || activeFormTab === 'Tingkatan 5') && renderT5Section()}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Memaparkan {searchFilteredSimulations.length} simulasi</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-purple-600 font-bold hover:underline cursor-pointer"
                >
                  Kosongkan carian
                </button>
              </div>

              {searchFilteredSimulations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {searchFilteredSimulations.map((sim) => (
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
                  <p className="text-slate-500 text-sm">
                    Tiada simulasi ditemui untuk carian "{searchQuery}".
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
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
