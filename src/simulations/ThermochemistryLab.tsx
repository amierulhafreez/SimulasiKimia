import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Thermometer, RotateCcw, Play, CheckCircle2, FlameKindling, Info } from 'lucide-react';

export const ThermochemistryLab: React.FC = () => {
  const SIM_ID = 'haba-penyesaran';
  const [hasAddedZinc, setHasAddedZinc] = useState<boolean>(false);
  const [currentTemp, setCurrentTemp] = useState<number>(28.0);
  const [isReacting, setIsReacting] = useState<boolean>(false);

  // Cu2+ + Zn -> Zn2+ + Cu
  // Initial temp = 28.0°C, Highest temp = 46.0°C (Δθ = 18.0°C)
  // m = 50g (50 cm3 CuSO4 0.2 mol dm-3)
  // c = 4.2 J g-1 °C-1
  // Q = mcΔθ = 50 * 4.2 * 18 = 3780 J = 3.78 kJ
  // mol Cu2+ = 0.2 * 50 / 1000 = 0.01 mol
  // ΔH = -3.78 / 0.01 = -378 kJ mol-1

  const handleAddZinc = () => {
    setIsReacting(true);
    setHasAddedZinc(true);
    analytics.recordSimulationClick(SIM_ID, 1);

    let temp = 28.0;
    const interval = setInterval(() => {
      temp += 1.0;
      setCurrentTemp(temp);
      if (temp >= 46.0) {
        clearInterval(interval);
        setIsReacting(false);
        analytics.recordSimulationCompleted(SIM_ID);
        confetti({ particleCount: 70, spread: 60 });
      }
    }, 150);
  };

  const handleReset = () => {
    setHasAddedZinc(false);
    setCurrentTemp(28.0);
    setIsReacting(false);
  };

  return (
    <div className="space-y-6">
      {/* Experiment Banner */}
      <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-950 font-medium">
        <span>
          <strong>Eksperimen:</strong> Menentukan Haba Penyesaran Kuprum oleh Zink (50 cm³ CuSO₄ 0.2 mol dm⁻³ + Serbuk Zink berlebihan)
        </span>
        <span className="font-bold text-red-700 bg-white px-2.5 py-1 rounded-full border border-red-200">
          Tindak Balas Eksotermik (Haba Dibebaskan)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Polystyrene Cup & Thermometer */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[350px] bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
          
          {/* Floating Temperature Gauge */}
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-500" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Suhu Semasa</span>
              <span className="font-mono font-extrabold text-lg text-red-600">{currentTemp.toFixed(1)}°C</span>
            </div>
          </div>

          {/* Apparatus */}
          <div className="relative flex flex-col items-center mt-6">
            
            {/* Thermometer Stem */}
            <div className="w-2.5 h-36 bg-slate-200 border border-slate-400 rounded-full relative z-20 flex flex-col justify-end overflow-hidden shadow">
              <div 
                className="w-full bg-red-600 transition-all duration-300 rounded-b-full"
                style={{ height: `${((currentTemp - 20) / 40) * 100}%` }}
              ></div>
            </div>

            {/* Polystyrene Cup */}
            <div className="w-44 h-40 border-4 border-slate-300 rounded-b-3xl bg-white -mt-16 z-10 relative overflow-hidden flex flex-col justify-end p-2 shadow-md">
              {/* Liquid CuSO4 inside */}
              <div 
                className={`w-full transition-colors duration-700 rounded-b-2xl h-24 flex flex-col items-center justify-end p-2 ${
                  hasAddedZinc ? 'bg-sky-200/50' : 'bg-blue-600/70'
                }`}
              >
                {/* Brown precipitate of Copper at the bottom */}
                {hasAddedZinc && (
                  <div className="w-full h-4 bg-amber-800 rounded-b-xl animate-in fade-in duration-500 text-[8px] text-white font-bold text-center">
                    Enapan Kuprum Perang
                  </div>
                )}
              </div>
            </div>

            <span className="text-xs text-slate-500 mt-2 font-medium">Cawan Polistirena (Penebat Haba)</span>
          </div>

        </div>

        {/* Right: Calculations & Data */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Data & Pengiraan Termokimia SPM:
            </h4>

            {/* Data Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Suhu awal larutan (θ₁):</span>
                <strong className="font-mono text-slate-900">28.0°C</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Suhu tertinggi larutan (θ₂):</span>
                <strong className="font-mono text-red-600">{hasAddedZinc ? '46.0°C' : '-'}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Perubahan suhu (Δθ):</span>
                <strong className="font-mono text-purple-700">{hasAddedZinc ? '18.0°C' : '-'}</strong>
              </div>
            </div>

            {/* Step by Step Calculation */}
            {hasAddedZinc ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2 text-slate-700 animate-in fade-in duration-300">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pengiraan Lengkap:
                </div>
                <div className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded border border-emerald-100">
                  <p>1. Haba dibebaskan (Q) = mcΔθ = 50g × 4.2 × 18°C = <strong>3,780 J (3.78 kJ)</strong></p>
                  <p>2. Bilangan mol Cu²⁺ = (0.2 × 50) / 1000 = <strong>0.01 mol</strong></p>
                  <p>3. Haba Penyesaran (ΔH) = -3.78 kJ / 0.01 mol = <strong className="text-red-600 text-xs">-378 kJ mol⁻¹</strong></p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                Tekan butang di bawah untuk memasukkan serbuk zink berlebihan ke dalam cawan polistirena.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddZinc}
              disabled={isReacting || hasAddedZinc}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition"
            >
              <FlameKindling className="w-4 h-4" />
              {isReacting ? 'Tindak Balas Berjalan...' : 'Tambah Serbuk Zink'}
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
