import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Power, RotateCcw, BatteryCharging, Info, Sparkles } from 'lucide-react';

interface ElectrolyteOption {
  id: string;
  name: string;
  formula: string;
  ions: { positive: string[]; negative: string[] };
  anodeDischarge: { ion: string; observation: string; halfEq: string };
  cathodeDischarge: { ion: string; observation: string; halfEq: string };
}

const ELECTROLYTES: ElectrolyteOption[] = [
  {
    id: 'cuso4',
    name: 'Larutan Kuprum(II) Sulfat',
    formula: 'CuSO₄ 0.5 mol dm⁻³',
    ions: { positive: ['Cu²⁺', 'H⁺'], negative: ['SO₄²⁻', 'OH⁻'] },
    anodeDischarge: {
      ion: 'Ion OH⁻ dinyahcas (Nilai E⁰ lebih kurang positif)',
      observation: 'Gelembung gas tidak berwarna terbebas (Gas Oksigen, O₂)',
      halfEq: '4OH⁻ → 2H₂O + O₂ + 4e⁻'
    },
    cathodeDischarge: {
      ion: 'Ion Cu²⁺ dinyahcas (Nilai E⁰ lebih positif daripada H⁺)',
      observation: 'Enapan pepejal perang terenap pada katod (Logam Cu)',
      halfEq: 'Cu²⁺ + 2e⁻ → Cu'
    }
  },
  {
    id: 'nacl_conc',
    name: 'Larutan Natrium Klorida Pekat',
    formula: 'NaCl 1.0 mol dm⁻³ (Pekat)',
    ions: { positive: ['Na⁺', 'H⁺'], negative: ['Cl⁻', 'OH⁻'] },
    anodeDischarge: {
      ion: 'Ion Cl⁻ dinyahcas (Faktor Kepekatan)',
      observation: 'Gas kuning kehijauan dengan bau sengit terbebas (Gas Klorin, Cl₂)',
      halfEq: '2Cl⁻ → Cl₂ + 2e⁻'
    },
    cathodeDischarge: {
      ion: 'Ion H⁺ dinyahcas (Nilai E⁰ lebih positif)',
      observation: 'Gelembung gas tidak berwarna terbebas (Gas Hidrogen, H₂)',
      halfEq: '2H⁺ + 2e⁻ → H₂'
    }
  }
];

export const ElectrolysisLab: React.FC = () => {
  const SIM_ID = 'elektrolisis';
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const electrolyte = ELECTROLYTES[selectedIdx];
  const [isPowerOn, setIsPowerOn] = useState<boolean>(false);

  const togglePower = () => {
    const next = !isPowerOn;
    setIsPowerOn(next);
    analytics.recordSimulationClick(SIM_ID, 1);
    if (next) {
      analytics.recordSimulationCompleted(SIM_ID);
      confetti({ particleCount: 50, spread: 50 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Electrolyte Switch */}
      <div className="flex flex-wrap gap-2">
        {ELECTROLYTES.map((el, idx) => (
          <button
            key={el.id}
            onClick={() => {
              setSelectedIdx(idx);
              setIsPowerOn(false);
              analytics.recordSimulationClick(SIM_ID, 1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedIdx === idx
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{el.name}</span>
            <span className="font-mono text-[10px] bg-black/10 px-1 py-0.2 rounded">{el.formula}</span>
          </button>
        ))}
      </div>

      {/* Lab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Graphic Electrolytic Cell */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[350px] bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
          
          {/* Battery & Circuit wire on top */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              <BatteryCharging className={`w-4 h-4 ${isPowerOn ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-700">Bekalan Kuasa (Bateri 6V)</span>
            </div>
            
            <button
              onClick={togglePower}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                isPowerOn 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              {isPowerOn ? 'Matikan Suis' : 'Hidupkan Suis'}
            </button>
          </div>

          {/* Electrolytic Beaker */}
          <div className="w-64 h-48 border-x-4 border-b-4 border-slate-400 rounded-b-2xl bg-sky-50/20 relative flex justify-around items-end p-4 shadow-inner">
            
            {/* Liquid electrolyte */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-sky-200/40 rounded-b-xl border-t border-sky-300 flex items-center justify-center">
              <span className="text-[10px] font-bold text-sky-800 bg-white/70 px-2 py-0.5 rounded shadow-sm">
                {electrolyte.formula}
              </span>
            </div>

            {/* Anode Electrode (Positif +) */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 mb-1">
                Anod (+)
              </span>
              <div className="w-5 h-32 bg-slate-700 rounded-t shadow relative">
                {isPowerOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-around overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>
                  </div>
                )}
              </div>
              <span className="text-[8px] text-slate-500 mt-1">Karbon</span>
            </div>

            {/* Cathode Electrode (Negatif -) */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 mb-1">
                Katod (-)
              </span>
              <div 
                className={`w-5 h-32 transition-all duration-700 rounded-t shadow relative ${
                  isPowerOn && selectedIdx === 0 ? 'bg-amber-800' : 'bg-slate-700'
                }`}
              >
                {isPowerOn && selectedIdx === 0 && (
                  <span className="absolute -left-1 -right-1 bottom-0 h-16 bg-amber-700/90 rounded border border-amber-900 shadow"></span>
                )}
                {isPowerOn && selectedIdx === 1 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-around overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>
                  </div>
                )}
              </div>
              <span className="text-[8px] text-slate-500 mt-1">Karbon</span>
            </div>

          </div>

          <span className="text-xs text-slate-500 mt-3 font-medium">Sel Elektrolisis Larutan Akues</span>
        </div>

        {/* Right: Half-Equations & SPM Observations */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Tindak Balas Elektrod ({isPowerOn ? 'Arus Mengalir' : 'Litar Terbuka'}):
            </h4>

            {/* Anode Box */}
            <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                <span>Di Anod (+) [Pengoksidaan]</span>
                <span className="text-[10px] text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">
                  {electrolyte.anodeDischarge.ion}
                </span>
              </div>
              <p className="text-xs text-slate-700"><strong>Pemerhatian:</strong> {isPowerOn ? electrolyte.anodeDischarge.observation : 'Tiada perubahan.'}</p>
              <div className="font-mono text-xs bg-white p-1.5 rounded border border-rose-100 text-rose-700 text-center font-bold">
                {electrolyte.anodeDischarge.halfEq}
              </div>
            </div>

            {/* Cathode Box */}
            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span>Di Katod (-) [Penurunan]</span>
                <span className="text-[10px] text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {electrolyte.cathodeDischarge.ion}
                </span>
              </div>
              <p className="text-xs text-slate-700"><strong>Pemerhatian:</strong> {isPowerOn ? electrolyte.cathodeDischarge.observation : 'Tiada perubahan.'}</p>
              <div className="font-mono text-xs bg-white p-1.5 rounded border border-blue-100 text-blue-700 text-center font-bold">
                {electrolyte.cathodeDischarge.halfEq}
              </div>
            </div>

            {/* SPM Factor Note */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-1 text-slate-700">
              <span className="font-bold text-purple-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Faktor Pemilihan Nyahcas Ion SPM:
              </span>
              <p className="text-[11px] text-slate-600">
                1. Kedudukan dalam Siri Elektrokimia (E⁰ Piawai)<br/>
                2. Kepekatan ion dalam larutan akues<br/>
                3. Jenis elektrod yang digunakan (inert vs aktif)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPowerOn(false)}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Sel
          </button>

        </div>

      </div>
    </div>
  );
};
