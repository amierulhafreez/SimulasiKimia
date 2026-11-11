import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Zap, RotateCcw, CheckCircle2, Sparkles, Info } from 'lucide-react';

interface MetalOption {
  id: string;
  name: string;
  symbol: string;
  reactivity: string;
  waterReaction: string;
  flameColor: string;
  equation: string;
  spmExplanation: string;
}

const METALS: MetalOption[] = [
  {
    id: 'li',
    name: 'Litium',
    symbol: 'Li',
    reactivity: 'Perlahan & Tenang',
    waterReaction: 'Litium terapung di permukaan air, bergerak perlahan dengan desiran gas hidrogen terbebas.',
    flameColor: 'bg-red-500',
    equation: '2Li + 2H₂O → 2LiOH + H₂',
    spmExplanation: 'Saiz atom Litium paling kecil, daya tarikan nukleus terhadap elektron valens paling kuat, maka sukar melepaskan elektron.'
  },
  {
    id: 'na',
    name: 'Natrium',
    symbol: 'Na',
    reactivity: 'Cergas & Pantas',
    waterReaction: 'Natrium melebur menjadi bebola berkilat, meluncur laju di atas air dan menyala dengan nyalaan kuning keemasan.',
    flameColor: 'bg-yellow-400',
    equation: '2Na + 2H₂O → 2NaOH + H₂',
    spmExplanation: 'Saiz atom lebih besar daripada Li, elektron valens lebih jauh dari nukleus, lebih mudah dilepaskan.'
  },
  {
    id: 'k',
    name: 'Kalium',
    symbol: 'K',
    reactivity: 'Sangat Cergas & Meletup',
    waterReaction: 'Kalium bertindak balas serta-merta dengan nyalaan ungu (lilac flame), mendesir sangat kuat dan berakhir dengan letupan kecil.',
    flameColor: 'bg-purple-500',
    equation: '2K + 2H₂O → 2KOH + H₂',
    spmExplanation: 'Saiz atom Kalium paling besar antara ketiga-tiganya, daya tarikan nukleus paling lemah, elektron valens paling mudah dilepaskan.'
  }
];

export const ReactivityLab: React.FC = () => {
  const SIM_ID = 'kereaktifan-k1-dan-k17';
  const [selectedMetal, setSelectedMetal] = useState<MetalOption>(METALS[0]);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  const handleDropInWater = () => {
    setIsReacting(true);
    setHasFinished(false);
    analytics.recordSimulationClick(SIM_ID, 1);

    setTimeout(() => {
      setIsReacting(false);
      setHasFinished(true);
      analytics.recordSimulationCompleted(SIM_ID);
      confetti({ particleCount: 70, spread: 60 });
    }, 1500);
  };

  const handleReset = () => {
    setIsReacting(false);
    setHasFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Metal Switch */}
      <div className="flex flex-wrap gap-2">
        {METALS.map(metal => (
          <button
            key={metal.id}
            onClick={() => {
              setSelectedMetal(metal);
              handleReset();
              analytics.recordSimulationClick(SIM_ID, 1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedMetal.id === metal.id
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Logam {metal.name}</span>
            <span className="font-mono text-[10px] bg-black/10 px-1 py-0.2 rounded font-bold">{metal.symbol}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Water Trough Visualizer */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[350px] bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
          
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-600 font-semibold">
            Palung Kaca Berisi Air + Penunjuk Fenolftalein
          </div>

          {/* Water Trough */}
          <div className="w-72 h-44 border-4 border-slate-300 rounded-b-3xl bg-white relative overflow-hidden flex flex-col justify-end p-2 shadow-md">
            
            {/* Water with phenolphthalein color turning pink */}
            <div 
              className={`w-full transition-colors duration-1000 h-28 rounded-b-2xl border-t border-sky-300 relative flex items-start justify-center ${
                hasFinished ? 'bg-pink-300/80 shadow-[0_0_20px_rgba(244,114,182,0.5)]' : 'bg-sky-200/50'
              }`}
            >
              {/* Metal reacting at surface */}
              {isReacting && (
                <div className="flex flex-col items-center -mt-3 animate-bounce">
                  <div className={`w-5 h-5 rounded-full ${selectedMetal.flameColor} shadow-lg shadow-current animate-ping`}></div>
                  <span className="text-[8px] font-bold text-slate-900 bg-white/80 px-1 rounded mt-1">
                    💨 Gas H₂ terbebas!
                  </span>
                </div>
              )}

              {hasFinished && (
                <div className="text-[10px] text-pink-900 font-bold bg-white/70 px-2 py-0.5 rounded shadow-sm mt-3">
                  Larutan Beralkali Terbentuk (Merah Jambu)
                </div>
              )}
            </div>

          </div>

          <span className="text-xs text-slate-500 mt-3 font-medium">
            Kereaktifan Menuruni Kumpulan 1: Li &lt; Na &lt; K
          </span>
        </div>

        {/* Right: Data & Explanations */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Tindak Balas {selectedMetal.name} Dengan Air:
            </h4>

            {/* Observations */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tahap Kereaktifan:</span>
                <strong className="text-orange-600 font-bold">{selectedMetal.reactivity}</strong>
              </div>
              <p className="text-slate-700 leading-relaxed pt-1">
                <strong>Pemerhatian:</strong> {hasFinished || isReacting ? selectedMetal.waterReaction : 'Logam sedia dimasukkan ke dalam air.'}
              </p>
              <div className="font-mono text-xs bg-white p-2 rounded border border-slate-200 text-purple-700 text-center font-bold">
                {selectedMetal.equation}
              </div>
            </div>

            {/* SPM Atomic Size Factor */}
            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-1 text-slate-700">
              <span className="font-bold text-purple-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Penerangan SPM (Kereaktifan Kumpulan 1):
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {selectedMetal.spmExplanation}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDropInWater}
              disabled={isReacting || hasFinished}
              className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-600/25 transition"
            >
              <Zap className="w-4 h-4" />
              {isReacting ? 'Sedang Bertindak Balas...' : 'Jatuhkan ke Dalam Air'}
            </button>

            <button
              onClick={handleReset}
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
