import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Droplets, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface SaltRule {
  type: string;
  soluble: string;
  insoluble: string;
  mnemonic: string;
  sampleSalt: string;
  isSampleSoluble: boolean;
}

const SALT_RULES: SaltRule[] = [
  {
    type: 'Garam Nitrat (NO₃⁻)',
    soluble: 'SEMUA garam nitrat LARUT dalam air tanpa pengecualian.',
    insoluble: 'Tiada (100% larut).',
    mnemonic: 'NO3 = NO Exception (Tiada yang tak larut!)',
    sampleSalt: 'Kalsium Nitrat, Ca(NO₃)₂',
    isSampleSoluble: true
  },
  {
    type: 'Garam Sulfat (SO₄²⁻)',
    soluble: 'Kebanyakan garam sulfat LARUT dalam air.',
    insoluble: 'Plumbum(II) sulfat (PbSO₄), Barium sulfat (BaSO₄), Kalsium sulfat (CaSO₄).',
    mnemonic: 'P-B-C (Pagi-Bila-Cuti / Plumbum, Barium, Kalsium)',
    sampleSalt: 'Barium Sulfat, BaSO₄',
    isSampleSoluble: false
  },
  {
    type: 'Garam Klorida (Cl⁻)',
    soluble: 'Kebanyakan garam klorida LARUT dalam air.',
    insoluble: 'Plumbum(II) klorida (PbCl₂), Argentum klorida (AgCl), Merkuri klorida (Hg₂Cl₂).',
    mnemonic: 'P-A-H (Plumbum, Argentum, Hidrargirum)',
    sampleSalt: 'Argentum Klorida, AgCl',
    isSampleSoluble: false
  },
  {
    type: 'Garam Karbonat (CO₃²⁻)',
    soluble: 'Hanya garam karbonat SPAn (Natrium, Kalium, Ammonium) yang LARUT.',
    insoluble: 'Semua garam karbonat lain TIDAK LARUT.',
    mnemonic: 'Hanya S-P-An (Sodium, Potassium, Ammonium) larut!',
    sampleSalt: 'Zink Karbonat, ZnCO₃',
    isSampleSoluble: false
  }
];

export const SaltSolubilityLab: React.FC = () => {
  const SIM_ID = 'keterlarutan-garam';
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const rule = SALT_RULES[selectedIdx];
  const [hasTested, setHasTested] = useState<boolean>(false);

  const handleTestDissolve = () => {
    setHasTested(true);
    analytics.recordSimulationClick(SIM_ID, 1);
    analytics.recordSimulationCompleted(SIM_ID);
    confetti({ particleCount: 50, spread: 50 });
  };

  return (
    <div className="space-y-6">
      {/* Salt Type Switch */}
      <div className="flex flex-wrap gap-2">
        {SALT_RULES.map((r, idx) => (
          <button
            key={r.type}
            onClick={() => {
              setSelectedIdx(idx);
              setHasTested(false);
              analytics.recordSimulationClick(SIM_ID, 1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedIdx === idx
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {r.type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Beaker with Dissolving / Precipitate Animation */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[340px] bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
          
          <div className="w-52 h-44 border-4 border-slate-300 rounded-b-3xl bg-white relative overflow-hidden flex flex-col justify-end p-2 shadow-md">
            
            {/* Water in beaker */}
            <div className="w-full h-32 bg-sky-100/70 rounded-b-2xl border-t border-sky-300 relative flex flex-col items-center justify-end p-2">
              
              {hasTested && (
                rule.isSampleSoluble ? (
                  // Fully dissolved
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-teal-800 bg-white/80 px-2 py-0.5 rounded shadow-sm">
                      ✨ Larut Sepenuhnya (Larutan Jernih)
                    </span>
                    <p className="text-[10px] text-slate-500">Tiada mendakan terbentuk.</p>
                  </div>
                ) : (
                  // Insoluble precipitate at bottom
                  <div className="w-full h-8 bg-slate-200 border-t-2 border-slate-400 rounded-b-xl shadow-inner flex items-center justify-center">
                    <span className="text-[9px] font-bold text-slate-700">
                      Mendakan Putih Terbentuk (Tak Larut)
                    </span>
                  </div>
                )
              )}

              {!hasTested && (
                <span className="text-[11px] text-slate-400 italic">Air Suling 100 cm³</span>
              )}
            </div>

          </div>

          <span className="text-xs font-semibold text-slate-700 mt-3">
            Ujian Sampel: {rule.sampleSalt}
          </span>
        </div>

        {/* Right: SPM Mnemonic & Guide */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Hukum Keterlarutan Garam SPM:
            </h4>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Garam Larut:</span>
                <p className="text-slate-900 font-medium">{rule.soluble}</p>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="font-semibold text-rose-600">Garam Tak Larut (Mendakan):</span>
                <p className="text-slate-900 font-medium">{rule.insoluble}</p>
              </div>
            </div>

            {/* Mnemonic Box */}
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1 text-slate-700">
              <span className="font-bold text-teal-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Mnemonik Formula SPM:
              </span>
              <p className="font-mono text-xs text-teal-800 font-bold bg-white p-2 rounded border border-teal-100">
                {rule.mnemonic}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTestDissolve}
              className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/25 transition"
            >
              <Droplets className="w-4 h-4" /> Masukkan Garam
            </button>

            <button
              onClick={() => setHasTested(false)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset Ujian
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
