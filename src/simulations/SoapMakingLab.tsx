import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, CheckCircle2, Flame, Droplets } from 'lucide-react';

export const SoapMakingLab: React.FC = () => {
  const SIM_ID = 'penghasilan-sabun';
  const [step, setStep] = useState<number>(1);
  const [isBoiling, setIsBoiling] = useState<boolean>(false);

  // Step 1: Campur minyak sawit + NaOH pekat
  // Step 2: Didihkan selama 10 minit
  // Step 3: Tambah larutan tepu NaCl (Garam biasa) untuk memendakkan sabun
  // Step 4: Turas dan uji buih sabun dengan air

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
      setIsBoiling(true);
      analytics.recordSimulationClick(SIM_ID, 1);
    } else if (step === 2) {
      setStep(3);
      setIsBoiling(false);
      analytics.recordSimulationClick(SIM_ID, 1);
    } else if (step === 3) {
      setStep(4);
      analytics.recordSimulationClick(SIM_ID, 1);
      analytics.recordSimulationCompleted(SIM_ID);
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const handleReset = () => {
    setStep(1);
    setIsBoiling(false);
  };

  return (
    <div className="space-y-6">
      {/* Steps progress bar */}
      <div className="grid grid-cols-4 gap-2">
        {[
          '1. Minyak Sawit + NaOH',
          '2. Pemanasan & Didih',
          '3. Tambah NaCl Tepu',
          '4. Sabun Terhasil & Buih'
        ].map((title, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
              step === i + 1
                ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-600/25'
                : step > i + 1
                ? 'bg-pink-50 text-pink-700 border-pink-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {title}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Beaker with Soap Saponification */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[350px] bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
          
          {/* Beaker */}
          <div className="w-56 h-48 border-4 border-slate-300 rounded-b-3xl bg-white relative overflow-hidden flex flex-col justify-end p-2 shadow-md">
            
            {/* Mixture inside beaker */}
            <div 
              className={`w-full transition-all duration-700 rounded-b-2xl border-t flex flex-col items-center justify-center p-2 ${
                step === 1 ? 'h-24 bg-amber-200/60 border-amber-300' :
                step === 2 ? 'h-32 bg-amber-300/80 border-amber-400 animate-pulse' :
                step === 3 ? 'h-36 bg-amber-100 border-slate-300' :
                'h-36 bg-white border-pink-300 shadow-lg'
              }`}
            >
              {step === 2 && (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-amber-900 animate-ping">🫧 Buih Sabun Mendidih</span>
                  <span className="text-[10px] text-amber-800">Tindak balas saponifikasi berlaku...</span>
                </div>
              )}

              {step === 3 && (
                <div className="w-full h-8 bg-white/95 rounded border border-slate-200 shadow flex items-center justify-center text-xs font-bold text-slate-800">
                  🧀 Enapan Pepejal Sabun Terbentuk
                </div>
              )}

              {step === 4 && (
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full border border-pink-300">
                    ✨ Sabun Bersih & Banyak Buih!
                  </span>
                  <p className="text-[10px] text-slate-500">Telah dituras dan dibilas.</p>
                </div>
              )}
            </div>

          </div>

          {step === 2 && (
            <div className="mt-3 flex flex-col items-center">
              <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full animate-bounce"></div>
              <div className="w-6 h-4 bg-slate-600 rounded-t"></div>
              <span className="text-[9px] text-slate-500 mt-0.5">Penunu Bunsen</span>
            </div>
          )}

          <span className="text-xs text-slate-600 font-medium mt-3">
            Bikar 250 cm³ (Tindak Balas Saponifikasi)
          </span>
        </div>

        {/* Right: Chemical Process Guide */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Persamaan Kimia Saponifikasi:
            </h4>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-center text-purple-900 font-bold">
              Minyak Sawit (Ester) + 3NaOH → Gliserol + 3 Garam Sabun
            </div>

            {/* Why NaCl is added */}
            <div className="p-3.5 bg-pink-50 border border-pink-200 rounded-xl text-xs space-y-1.5 text-slate-700">
              <span className="font-bold text-pink-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" /> Mengapa Natrium Klorida (NaCl) Ditambah? (Soalan Popular SPM):
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Penambahan larutan tepu NaCl bertujuan untuk <strong>mengurangkan keterlarutan sabun dalam air</strong> supaya pepejal sabun termendak keluar (*salting out*).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleNextStep}
              className="py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-pink-600/25 transition"
            >
              <Sparkles className="w-4 h-4" />
              {step === 1 ? 'Mula Mendidih' : step === 2 ? 'Tambah NaCl Tepu' : step === 3 ? 'Turas & Uji Sabun' : 'Selesai'}
            </button>

            <button
              onClick={handleReset}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4" /> Mula Semula
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
