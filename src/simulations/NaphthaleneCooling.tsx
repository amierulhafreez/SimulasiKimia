import React, { useState, useEffect } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Flame, Snowflake, Info, CheckCircle2 } from 'lucide-react';

export const NaphthaleneCooling: React.FC = () => {
  const SIM_ID = 'pemanasan-dan-penyejukkan-naftalena';
  const [mode, setMode] = useState<'heating' | 'cooling'>('heating');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0); // in minutes (0 to 10)
  const [temperature, setTemperature] = useState<number>(65);

  // Heating data curve (Starts at 65°C, melts at 80°C plateau between min 3 to 6, then reaches 95°C)
  // Cooling data curve (Starts at 95°C, freezes at 80°C plateau between min 3 to 6, then drops to 65°C)
  const calculateTemp = (t: number, m: 'heating' | 'cooling') => {
    if (m === 'heating') {
      if (t <= 3) return 65 + (t / 3) * 15; // 65 -> 80
      if (t <= 6) return 80; // Plateau at melting point 80°C
      return 80 + ((t - 6) / 4) * 15; // 80 -> 95
    } else {
      if (t <= 3) return 95 - (t / 3) * 15; // 95 -> 80
      if (t <= 6) return 80; // Plateau at freezing point 80°C
      return 80 - ((t - 6) / 4) * 15; // 80 -> 65
    }
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying && time < 10) {
      timer = setInterval(() => {
        setTime(prev => {
          const next = +(prev + 0.2).toFixed(1);
          setTemperature(calculateTemp(next, mode));
          analytics.recordSimulationClick(SIM_ID, 1);
          if (next >= 10) {
            setIsPlaying(false);
            analytics.recordSimulationCompleted(SIM_ID);
            confetti({ particleCount: 60, spread: 50 });
          }
          return Math.min(10, next);
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, time, mode]);

  const handleModeChange = (newMode: 'heating' | 'cooling') => {
    setMode(newMode);
    setIsPlaying(false);
    setTime(0);
    setTemperature(newMode === 'heating' ? 65 : 95);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setTemperature(mode === 'heating' ? 65 : 95);
  };

  // State of matter
  const getStateOfMatter = () => {
    if (temperature < 80) return 'Pepejal (Solid)';
    if (temperature === 80) return 'Pepejal & Cecair (Campuran Fasa)';
    return 'Cecair (Liquid)';
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-purple-50 border border-purple-200 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleModeChange('heating')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              mode === 'heating' 
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Pemanasan Naftalena
          </button>

          <button
            onClick={() => handleModeChange('cooling')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              mode === 'cooling' 
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" /> Penyejukan Naftalena
          </button>
        </div>

        <span className="text-xs font-semibold text-purple-900 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200">
          Takat Lebur / Beku Piawai SPM: <strong>80°C</strong>
        </span>
      </div>

      {/* Main Lab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Graphic Apparatus */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[360px] bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-2xl p-6 relative border border-slate-200">
          
          {/* Thermometer Display Floating */}
          <div className="absolute top-4 left-4 bg-white/95 px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Suhu Semasa:</span>
            <span className="font-mono font-extrabold text-lg text-purple-700">{temperature.toFixed(1)}°C</span>
          </div>

          {/* Apparatus: Water bath / Conical flask */}
          <div className="relative flex flex-col items-center mt-8">
            
            {/* Thermometer stem dipping in boiling tube */}
            <div className="w-2.5 h-36 bg-slate-200 border border-slate-400 rounded-full relative z-20 flex flex-col justify-end overflow-hidden shadow">
              <div 
                className="w-full bg-red-500 transition-all duration-300 rounded-b-full"
                style={{ height: `${((temperature - 50) / 50) * 100}%` }}
              ></div>
            </div>

            {/* Boiling tube */}
            <div className="w-12 h-36 border-2 border-sky-400/80 rounded-b-full bg-sky-100/30 -mt-20 z-10 relative overflow-hidden flex flex-col justify-end shadow-inner">
              {/* Naphthalene inside */}
              <div 
                className={`w-full h-20 transition-all duration-500 rounded-b-full flex items-center justify-center ${
                  temperature < 80 
                    ? 'bg-slate-200 border-t-2 border-slate-300' 
                    : temperature === 80 
                    ? 'bg-amber-100/80 border-t-2 border-amber-300' 
                    : 'bg-amber-200/90 border-t-2 border-amber-400'
                }`}
              >
                <span className="text-[8px] font-bold text-slate-700 text-center px-1">
                  {temperature < 80 ? 'Pepejal' : temperature === 80 ? 'Melebur' : 'Cecair'}
                </span>
              </div>
            </div>

            {/* Beaker (Water bath for heating / conical flask for cooling) */}
            <div className="w-32 h-28 border-2 border-slate-400 rounded-b-xl bg-sky-200/30 -mt-24 z-0 flex flex-col justify-end p-2 border-t-0 shadow">
              <div className="w-full h-16 bg-sky-300/40 rounded-b-lg border-t border-sky-300 text-center text-[9px] text-slate-600 font-medium pt-1">
                {mode === 'heating' ? 'Kukus Air (Water Bath)' : 'Kelalang Kon (Udara)'}
              </div>
            </div>

            {/* Bunsen Burner flame (heating mode) */}
            {mode === 'heating' && (
              <div className="mt-2 flex flex-col items-center">
                <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full animate-bounce"></div>
                <div className="w-6 h-5 bg-slate-600 rounded-t"></div>
                <span className="text-[9px] text-slate-500 mt-0.5">Penunu Bunsen</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            Keadaan Jirim: <span className="text-purple-700 font-bold">{getStateOfMatter()}</span>
          </div>

        </div>

        {/* Right: Interactive Graph & Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          {/* Dynamic Graph Simulation */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Lengkung {mode === 'heating' ? 'Pemanasan' : 'Penyejukan'} (Suhu vs Masa)</span>
              <span className="font-mono text-purple-700">Masa: {time.toFixed(1)} min</span>
            </div>

            {/* SVG Graph */}
            <div className="w-full h-44 bg-white rounded-lg border border-slate-200 p-2 relative flex items-center justify-center">
              <svg viewBox="0 0 300 130" className="w-full h-full">
                {/* Axes */}
                <line x1="30" y1="10" x2="30" y2="110" stroke="#94a3b8" strokeWidth="2" />
                <line x1="30" y1="110" x2="290" y2="110" stroke="#94a3b8" strokeWidth="2" />
                
                {/* Plateau line at 80C */}
                <line x1="30" y1="55" x2="290" y2="55" stroke="#e2e8f0" strokeDasharray="4" strokeWidth="1.5" />
                <text x="5" y="58" fontSize="8" fill="#7c3aed" fontWeight="bold">80°C</text>
                <text x="10" y="20" fontSize="8" fill="#64748b">Suhu (°C)</text>
                <text x="250" y="125" fontSize="8" fill="#64748b">Masa (min)</text>

                {/* Graph Curve */}
                {mode === 'heating' ? (
                  <path
                    d="M 30 100 L 100 55 L 190 55 L 280 20"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M 30 20 L 100 55 L 190 55 L 280 100"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}

                {/* Progress Dot */}
                <circle 
                  cx={30 + (time / 10) * 250} 
                  cy={110 - ((temperature - 60) / 40) * 90} 
                  r="5" 
                  fill="#7c3aed" 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                />
              </svg>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Suhu malar di 80°C kerana haba pendam diserap/dibebaskan.</span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-purple-600 hover:bg-purple-500'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Jeda Simulasi' : 'Jalankan Eksperimen'}
              </button>

              <button
                onClick={handleReset}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" /> Reset Masa
              </button>
            </div>

            {/* SPM Explanation Box */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-1 text-slate-700">
              <p className="font-bold text-purple-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-purple-600" /> Mengapa suhu tidak berubah pada 80°C?
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {mode === 'heating' 
                  ? 'Haba yang diserap digunakan untuk mengatasi daya tarikan antara zarah naftalena sehingga semua pepejal bertukar kepada cecair (Haba Pendam Pelakuran).' 
                  : 'Haba yang hilang ke persekitaran diimbangi oleh haba yang dibebaskan semasa zarah-zarah merapat untuk membentuk pepejal.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
