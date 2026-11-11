import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Flame, Layers, Sparkles, CheckCircle2, Info, Play, RotateCcw } from 'lucide-react';

type ZoneId = 'feed' | 'zone3' | 'zone2' | 'zone1' | 'slag';

interface ZoneDetail {
  id: ZoneId;
  badge: string;
  title: string;
  temp: string;
  equations: string[];
  explanation: string;
}

const ZONES: Record<ZoneId, ZoneDetail> = {
  feed: {
    id: 'feed',
    badge: 'Bahan Mentah',
    title: 'Campuran Bijih Besi, Arang Kok & Batu Kapur',
    temp: 'Masukan Puncak Relau',
    equations: [
      'Bijih besi utama: Hematit (Fe₂O₃)',
      'Lain-lain: Magnetit (Fe₃O₄), Pirit besi (FeS₂), Siderit (FeCO₃)'
    ],
    explanation: 'Campuran bijih besi (Fe₂O₃), arang kok (C) dan batu kapur (CaCO₃) dimasukkan melalui puncak relau bagas. Besi berada di bawah karbon dalam Siri Kereaktifan Logam, maka ia diekstrak melalui penurunan oleh karbon.'
  },
  zone3: {
    id: 'zone3',
    badge: 'Zon 3 (Atas)',
    title: 'Penurunan Ferum(III) Oksida kepada Leburan Besi',
    temp: '~500 °C – 900 °C',
    equations: [
      '2Fe₂O₃(p) + 3C(p) → 4Fe(ce) + 3CO₂(g)',
      'Fe₂O₃(p) + 3CO(g) → 2Fe(ce) + 3CO₂(g)'
    ],
    explanation: 'Arang kok (C) dan karbon monoksida (CO) bertindak sebagai agen penurunan yang menurunkan ferum(III) oksida (Fe₂O₃) kepada leburan besi (Fe). Enapan leburan besi mengalir turun ke dasar relau bagas.'
  },
  zone2: {
    id: 'zone2',
    badge: 'Zon 2 (Tengah)',
    title: 'Pembentukan Agen Penurunan Karbon Monoksida',
    temp: '~1000 °C – 1200 °C (Endotermik)',
    equations: ['C(p) + CO₂(g) → 2CO(g)'],
    explanation: 'Gas karbon dioksida (CO₂) yang naik dari Zon 1 bertindak balas dengan arang kok yang masih berbaki. Tindak balas ini bersifat endotermik (menurunkan suhu pada Zon 2) dan menghasilkan gas CO sebagai agen penurunan utama.'
  },
  zone1: {
    id: 'zone1',
    badge: 'Zon 1 (Bawah)',
    title: 'Pembakaran Arang Kok dengan Udara Panas',
    temp: 'Mencecah 1600 °C (Eksotermik)',
    equations: ['C(p) + O₂(g) → CO₂(g)'],
    explanation: 'Udara panas ditiup masuk di bahagian bawah. Arang kok (C) bertindak balas dengan oksigen (O₂) menghasilkan CO₂. Ini ialah tindak balas redoks eksotermik yang menaikkan suhu relau bagas hingga 1600 °C.'
  },
  slag: {
    id: 'slag',
    badge: 'Pengasingan Bendasing',
    title: 'Fungsi Batu Kapur & Pembentukan Sanga (CaSiO₃)',
    temp: 'Dasar Relau (Ketumpatan Berbeza)',
    equations: [
      'CaCO₃(p) → CaO(p) + CO₂(g)',
      'CaO(p) + SiO₂(p) → CaSiO₃(ce)  [Sanga]'
    ],
    explanation: 'Batu kapur (CaCO₃) terurai kepada kalsium oksida, CaO (kapur tohor). CaO yang bersifat bes meneutralkan bendasing pasir/silikon(IV) oksida, SiO₂ yang bersifat asid membentuk sanga (kalsium silikat). Sanga kurang tumpat terapung di atas leburan besi dan dikeluarkan berasingan.'
  }
};

export const IronExtractionLab: React.FC = () => {
  const SIM_ID = 'pengekstrakan-besi';
  const [activeZone, setActiveZone] = useState<ZoneId>('zone1');
  const [isFurnaceActive, setIsFurnaceActive] = useState<boolean>(false);

  const handleSelectZone = (z: ZoneId) => {
    setActiveZone(z);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  const handleRunFurnace = () => {
    setIsFurnaceActive(true);
    analytics.recordSimulationClick(SIM_ID, 1);
    analytics.recordSimulationCompleted(SIM_ID);
    confetti({ particleCount: 60, spread: 55 });
  };

  const detail = ZONES[activeZone];

  return (
    <div className="space-y-6">
      {/* Zone Switch Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-orange-50/70 border border-orange-200 rounded-2xl">
        <div className="flex flex-wrap gap-1.5">
          {(['feed', 'zone3', 'zone2', 'zone1', 'slag'] as ZoneId[]).map(z => (
            <button
              key={z}
              onClick={() => handleSelectZone(z)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeZone === z
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-orange-100/60 border border-slate-200'
              }`}
            >
              {ZONES[z].badge}
            </button>
          ))}
        </div>

        <button
          onClick={handleRunFurnace}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            isFurnaceActive
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${isFurnaceActive ? 'text-amber-300 animate-pulse' : 'text-orange-400'}`} />
          {isFurnaceActive ? 'Relau Bagas Beroperasi (1600°C)' : 'Nyalakan Relau Bagas'}
        </button>
      </div>

      {/* Main Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Textbook-Exact Blast Furnace SVG (Rajah 1.38) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-4 relative">
          <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 mb-2">
            Rajah 1.38: Relau Bagas (Klik Zon untuk Perincian)
          </span>

          <svg viewBox="0 0 360 310" className="w-full max-w-sm h-72">
            {/* Top label: Raw materials feed */}
            <text x="180" y="15" fontSize="8" fill="#0f172a" fontWeight="bold" textAnchor="middle">
              Bijih besi (Fe₂O₃), arang kok (C) & batu kapur (CaCO₃)
            </text>
            {/* Feed Arrow */}
            <line x1="180" y1="22" x2="180" y2="45" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="175,42 185,42 180,50" fill="#0f172a" />

            {/* Exhaust Gas Ducts (Gas buangan) Left & Right */}
            <path d="M 145 75 L 95 75 L 95 62" fill="none" stroke="#475569" strokeWidth="10" />
            <path d="M 215 75 L 265 75 L 265 62" fill="none" stroke="#475569" strokeWidth="10" />
            <text x="68" y="55" fontSize="8" fill="#475569" fontWeight="bold" textAnchor="middle">Gas buangan</text>
            <text x="292" y="55" fontSize="8" fill="#475569" fontWeight="bold" textAnchor="middle">Gas buangan</text>
            {isFurnaceActive && (
              <>
                <circle cx="95" cy="48" r="3" fill="#94a3b8" className="animate-ping" />
                <circle cx="265" cy="48" r="3" fill="#94a3b8" className="animate-ping" />
              </>
            )}

            {/* Outer Furnace Walls */}
            <path
              d="M 145 55 L 145 95 L 120 185 L 125 270 L 235 270 L 240 185 L 215 95 L 215 55 Z"
              fill="#e2e8f0"
              stroke="#334155"
              strokeWidth="3"
            />

            {/* Zone 3 (Top Red-Crimson) */}
            <path
              d="M 146 82 L 214 82 L 222 135 L 138 135 Z"
              fill={activeZone === 'zone3' ? '#dc2626' : '#b91c1c'}
              className="cursor-pointer transition hover:opacity-90"
              onClick={() => handleSelectZone('zone3')}
            />
            <text x="180" y="112" fontSize="10" fill="#ffffff" fontWeight="bold" textAnchor="middle" pointerEvents="none">Zon 3</text>

            {/* Zone 2 (Middle Burnt Orange) */}
            <path
              d="M 138 135 L 222 135 L 236 185 L 124 185 Z"
              fill={activeZone === 'zone2' ? '#ea580c' : '#c2410c'}
              className="cursor-pointer transition hover:opacity-90"
              onClick={() => handleSelectZone('zone2')}
            />
            <text x="180" y="164" fontSize="10" fill="#ffffff" fontWeight="bold" textAnchor="middle" pointerEvents="none">Zon 2</text>

            {/* Zone 1 (Bottom Amber-Yellow 1600 C) */}
            <path
              d="M 124 185 L 236 185 L 234 232 L 126 232 Z"
              fill={activeZone === 'zone1' ? '#f59e0b' : '#d97706'}
              className="cursor-pointer transition hover:opacity-90"
              onClick={() => handleSelectZone('zone1')}
            />
            <text x="180" y="213" fontSize="10" fill="#ffffff" fontWeight="bold" textAnchor="middle" pointerEvents="none">Zon 1 (1600°C)</text>

            {/* Hot Air Tuyeres (Udara panas) */}
            <rect x="88" y="206" width="38" height="10" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
            <rect x="234" y="206" width="38" height="10" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
            <text x="48" y="210" fontSize="8" fill="#0f172a" fontWeight="bold" textAnchor="middle">Udara</text>
            <text x="48" y="220" fontSize="8" fill="#0f172a" fontWeight="bold" textAnchor="middle">panas</text>
            <text x="312" y="210" fontSize="8" fill="#0f172a" fontWeight="bold" textAnchor="middle">Udara</text>
            <text x="312" y="220" fontSize="8" fill="#0f172a" fontWeight="bold" textAnchor="middle">panas</text>

            {/* Slag Layer (Sanga - upper layer at bottom) */}
            <rect
              x="126"
              y="232"
              width="108"
              height="16"
              fill={activeZone === 'slag' ? '#64748b' : '#475569'}
              className="cursor-pointer"
              onClick={() => handleSelectZone('slag')}
            />
            {/* Slag outlet (right) */}
            <rect x="234" y="236" width="35" height="8" fill="#475569" />
            <text x="276" y="243" fontSize="8.5" fill="#334155" fontWeight="bold">Sanga (CaSiO₃)</text>

            {/* Molten Iron Layer (Leburan Besi - bottom densest layer) */}
            <rect
              x="126"
              y="248"
              width="108"
              height="20"
              fill="#7f1d1d"
              className="cursor-pointer"
              onClick={() => handleSelectZone('zone3')}
            />
            {/* Molten Iron outlet (left) */}
            <rect x="92" y="255" width="34" height="9" fill="#991b1b" />
            <text x="86" y="262" fontSize="8.5" fill="#991b1b" fontWeight="bold" textAnchor="end">Leburan besi</text>

            {/* Bell & Hopper at top */}
            <polygon points="165,65 195,65 180,52" fill="#475569" />
          </svg>
        </div>

        {/* Right: Detailed Zone Equations & Facts */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-white px-2.5 py-0.5 rounded-full border border-orange-200">
                  {detail.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-orange-900">{detail.temp}</span>
              </div>

              <h4 className="font-display font-bold text-base text-slate-900">{detail.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{detail.explanation}</p>
            </div>

            {/* Chemical Equations Box */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Persamaan Kimia Terlibat:</span>
              <div className="space-y-1.5">
                {detail.equations.map((eq, i) => (
                  <div key={i} className="font-mono text-xs bg-white p-2 rounded-lg border border-slate-200 text-center font-bold text-slate-900">
                    {eq}
                  </div>
                ))}
              </div>
            </div>

            {/* Cabaran Minda */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-slate-700 space-y-1">
              <p className="font-bold text-purple-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Cabaran Minda KSSM (m.s. 50):
              </p>
              <p className="leading-relaxed">
                <strong>Apakah gas buangan yang terhasil daripada relau bagas?</strong> Gas nitrogen (N₂ dari udara), karbon dioksida (CO₂) dan karbon monoksida (CO) yang tidak bertindak balas.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-center text-[11px] font-semibold text-slate-700">
            Ingat: Sanga kurang tumpat daripada leburan besi ➜ terapung di lapisan atas.
          </div>

        </div>

      </div>
    </div>
  );
};
