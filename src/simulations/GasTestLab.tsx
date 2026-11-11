import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { RotateCcw, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

interface GasOption {
  id: string;
  name: string;
  formula: string;
  colorName: string;
  testReagent: string;
  testMethod: string;
  expectedResult: string;
  spmTip: string;
}

const GASES: GasOption[] = [
  {
    id: 'o2',
    name: 'Gas Oksigen',
    formula: 'O₂',
    colorName: 'Gas tidak berwarna',
    testReagent: 'Kayu uji berbara (Glowing splinter)',
    testMethod: 'Masukkan kayu uji berbara ke dalam mulut tabung uji.',
    expectedResult: 'Kayu uji berbara dinyalakan semula dengan nyalaan terang.',
    spmTip: 'Oksigen menyokong pembakaran. Wajib guna perkataan "dinyalakan semula" (relights).'
  },
  {
    id: 'h2',
    name: 'Gas Hidrogen',
    formula: 'H₂',
    colorName: 'Gas tidak berwarna',
    testReagent: 'Kayu uji bernyala (Lighted splinter)',
    testMethod: 'Dekatkan kayu uji bernyala ke mulut tabung uji.',
    expectedResult: 'Bunyi "pop" kedengaran dan nyalaan kayu uji terpadam.',
    spmTip: 'Tindak balas letupan kecil antara H₂ dan O₂ menghasilkan bunyi "pop".'
  },
  {
    id: 'co2',
    name: 'Gas Karbon Dioksida',
    formula: 'CO₂',
    colorName: 'Gas tidak berwarna',
    testReagent: 'Air kapur (Lime water - Ca(OH)₂)',
    testMethod: 'Alirkan gas menggunakan tiub penghantar ke dalam air kapur.',
    expectedResult: 'Air kapur bertukar menjadi keruh (mendakan kalsium karbonat, CaCO₃ terbentuk).',
    spmTip: 'Persamaan: CO₂ + Ca(OH)₂ → CaCO₃ (p) + H₂O'
  },
  {
    id: 'cl2',
    name: 'Gas Klorin',
    formula: 'Cl₂',
    colorName: 'Gas kuning kehijauan',
    testReagent: 'Kertas litmus merah lembap',
    testMethod: 'Letakkan kertas litmus merah lembap pada mulut tabung uji.',
    expectedResult: 'Warna merah kertas litmus bertukar menjadi putih (dilunturkan).',
    spmTip: 'Klorin berasid dan merupakan agen peluntur yang sangat kuat.'
  },
  {
    id: 'nh3',
    name: 'Gas Ammonia',
    formula: 'NH₃',
    colorName: 'Gas tidak berwarna (bau sengit)',
    testReagent: 'Kertas litmus merah lembap',
    testMethod: 'Letakkan kertas litmus merah lembap pada mulut tabung uji.',
    expectedResult: 'Kertas litmus merah lembap bertukar kepada warna biru.',
    spmTip: 'Ammonia adalah satu-satunya gas beralkali yang diuji dalam silibus SPM!'
  }
];

export const GasTestLab: React.FC = () => {
  const SIM_ID = 'ujian-gas';
  const [selectedGas, setSelectedGas] = useState<GasOption>(GASES[0]);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  const handleRunTest = () => {
    setIsTesting(true);
    setTestCompleted(false);
    analytics.recordSimulationClick(SIM_ID, 1);

    setTimeout(() => {
      setIsTesting(false);
      setTestCompleted(true);
      analytics.recordSimulationCompleted(SIM_ID);
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const handleSelectGas = (gas: GasOption) => {
    setSelectedGas(gas);
    setIsTesting(false);
    setTestCompleted(false);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  return (
    <div className="space-y-6">
      {/* Gas Selection Tabs */}
      <div className="flex flex-wrap gap-2">
        {GASES.map(gas => (
          <button
            key={gas.id}
            onClick={() => handleSelectGas(gas)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedGas.id === gas.id
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>{gas.name}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/30 opacity-80">{gas.formula}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60 border border-slate-800 p-6 rounded-2xl">
        
        {/* Visual Tube & Reagent Area */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[360px] bg-gradient-to-b from-slate-900/60 to-slate-950 rounded-xl p-6 relative border border-slate-800/80">
          
          {/* Test Tube Stand */}
          <div className="relative flex flex-col items-center">
            
            {/* The Reagent entering test tube */}
            <div className={`transition-all duration-700 ${isTesting || testCompleted ? 'translate-y-6 opacity-100' : '-translate-y-8 opacity-0'} mb-2`}>
              {selectedGas.id === 'o2' && (
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-14 bg-amber-800 rounded-sm ${testCompleted ? 'bg-orange-500 shadow-[0_0_20px_#f97316]' : 'animate-pulse'}`}>
                    {testCompleted && (
                      <div className="w-5 h-8 -mt-6 -ml-1.5 bg-yellow-400 rounded-full blur-[1px] animate-bounce"></div>
                    )}
                  </div>
                  <span className="text-[10px] text-yellow-300 mt-1 font-medium">Kayu Uji Berbara</span>
                </div>
              )}

              {selectedGas.id === 'h2' && (
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-14 bg-amber-800 rounded-sm relative">
                    <div className="w-4 h-6 -mt-5 -ml-0.5 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  {testCompleted && (
                    <div className="text-xs font-bold text-rose-400 bg-rose-950/80 border border-rose-500 px-2.5 py-1 rounded-full animate-ping mt-1">
                      💥 POP!
                    </div>
                  )}
                  <span className="text-[10px] text-amber-300 mt-1 font-medium">Kayu Uji Bernyala</span>
                </div>
              )}

              {selectedGas.id === 'co2' && (
                <div className="flex items-center gap-2">
                  {/* Delivery tube */}
                  <div className="w-16 h-8 border-t-2 border-r-2 border-sky-300/60 rounded-tr-lg"></div>
                  <div className="text-[10px] text-sky-300">Tiub Penghantar Gas CO₂</div>
                </div>
              )}

              {(selectedGas.id === 'cl2' || selectedGas.id === 'nh3') && (
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-4 h-14 rounded transition-colors duration-700 shadow-md ${
                      testCompleted 
                        ? (selectedGas.id === 'cl2' ? 'bg-white border border-slate-300' : 'bg-blue-600')
                        : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-[10px] text-slate-300 mt-1">
                    {testCompleted 
                      ? (selectedGas.id === 'cl2' ? 'Kertas Litmus Luntur (Putih)' : 'Kertas Litmus Biru')
                      : 'Kertas Litmus Merah Lembap'}
                  </span>
                </div>
              )}
            </div>

            {/* Test Tube Container */}
            <div className="w-16 h-48 border-2 border-slate-600 rounded-b-full bg-slate-900/40 relative overflow-hidden flex flex-col justify-end backdrop-blur-sm shadow-xl">
              
              {/* Gas vapor inside tube */}
              <div 
                className={`absolute inset-0 transition-opacity duration-700 ${
                  selectedGas.id === 'cl2' ? 'bg-yellow-400/20' : 'bg-cyan-500/10'
                }`}
              >
                {/* Floating bubbles/gas particles */}
                <div className="absolute bottom-2 left-3 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-8 right-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping delay-200"></div>
              </div>

              {/* Liquid inside (Air kapur for CO2) */}
              {selectedGas.id === 'co2' ? (
                <div className={`w-full h-24 transition-colors duration-700 ${testCompleted ? 'bg-white/80 border-t-2 border-white' : 'bg-sky-200/20'} flex items-center justify-center`}>
                  <span className="text-[8px] text-slate-800 font-bold px-1 text-center">
                    {testCompleted ? 'Air Kapur Keruh (CaCO₃)' : 'Air Kapur Jernih'}
                  </span>
                </div>
              ) : (
                <div className="w-full h-8 bg-sky-500/10 border-t border-sky-400/20"></div>
              )}
            </div>

            <span className="text-xs text-slate-400 font-medium mt-2">Sampel {selectedGas.name}</span>
          </div>

        </div>

        {/* Observation & Guide Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Kaedah Ujian Makmal</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedGas.testMethod}
              </p>
              <div className="pt-1 text-[11px] text-slate-400">
                <strong>Radas / Reagen:</strong> {selectedGas.testReagent}
              </div>
            </div>

            {/* Test Results Output */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Keputusan Pemerhatian</span>
              
              {testCompleted ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Pemerhatian Direkodkan:
                  </div>
                  <p className="text-slate-200 pl-6 leading-relaxed">
                    {selectedGas.expectedResult}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Tekan butang di bawah untuk menjalankan ujian pengesahan gas ke atas sampel.
                </p>
              )}
            </div>

            {/* SPM Exam Tip */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 space-y-1">
              <span className="font-bold flex items-center gap-1 text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Tip Skor SPM (Kertas 2 & 3):
              </span>
              <p className="text-slate-300 pl-4">{selectedGas.spmTip}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleRunTest}
              disabled={isTesting}
              className="py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              {isTesting ? 'Sedang Diuji...' : 'Uji Gas Sekarang'}
            </button>

            <button
              onClick={() => {
                setIsTesting(false);
                setTestCompleted(false);
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              Reset Ujian
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
