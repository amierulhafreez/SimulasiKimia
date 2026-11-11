import React, { useState, useEffect } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { RotateCcw, Droplets, Play, Pause, Award, CheckCircle2, Info } from 'lucide-react';

export const AcidBaseTitration: React.FC = () => {
  const SIM_ID = 'pentitratan-asid-alkali';

  // State
  const [buretteVolume, setBuretteVolume] = useState<number>(0.0); // Volume of HCl added (0 to 50 cm3)
  const [isDripping, setIsDripping] = useState<boolean>(false);
  const [dripSpeed, setDripSpeed] = useState<'slow' | 'fast'>('slow');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  // Exact stoichiometric end point is at 25.00 cm3
  const targetEndPoint = 25.0;

  // Drip loop
  useEffect(() => {
    let interval: any;
    if (isDripping && buretteVolume < 50.0) {
      interval = setInterval(() => {
        setBuretteVolume(prev => {
          const step = dripSpeed === 'slow' ? 0.1 : 0.5;
          const next = Math.min(50.0, +(prev + step).toFixed(2));
          analytics.recordSimulationClick(SIM_ID, 1);
          return next;
        });
      }, dripSpeed === 'slow' ? 200 : 100);
    }
    return () => clearInterval(interval);
  }, [isDripping, dripSpeed, buretteVolume]);

  // Check end point & color
  // In flask: 25 cm3 NaOH (0.1 M) + fenolftalein (merah jambu / pink)
  // HCl 0.1 M dititis dari buret.
  // Bila volume < 24.5 cm3: Merah Jambu terang (Dark Pink)
  // Bila 24.5 <= volume < 25.0: Merah Jambu pudar (Pale Pink)
  // Bila volume >= 25.0: Tidak berwarna (Colourless) - TAKAT AKHIR SPM!
  const getFlaskColor = () => {
    if (buretteVolume < 24.5) {
      return 'bg-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.6)]';
    } else if (buretteVolume < 25.0) {
      return 'bg-pink-300/70 shadow-[0_0_15px_rgba(244,114,182,0.4)]';
    } else {
      return 'bg-sky-100/30 backdrop-blur-sm border border-white/20'; // Tidak berwarna
    }
  };

  const getStatusText = () => {
    if (buretteVolume === 0) return 'Larutan NaOH beralkali (Merah Jambu pekat)';
    if (buretteVolume < 24.5) return 'Peneutralan sedang berlaku... Larutan masih beralkali.';
    if (buretteVolume < 25.0) return 'Hampir mencapai takat akhir! Titis secara perlahan.';
    if (buretteVolume === 25.0) return '🎯 TEPAT! Takat akhir tercapai (Larutan bertukar tidak berwarna).';
    return 'Melebihi takat akhir (Lebihan asid hidroklorik).';
  };

  // Trigger celebration on exact end point
  useEffect(() => {
    if (buretteVolume >= 24.9 && buretteVolume <= 25.1 && !hasCompleted) {
      setHasCompleted(true);
      analytics.recordSimulationCompleted(SIM_ID);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [buretteVolume, hasCompleted]);

  const handleAddSingleDrop = () => {
    setBuretteVolume(prev => {
      const next = Math.min(50.0, +(prev + 0.05).toFixed(2));
      analytics.recordSimulationClick(SIM_ID, 1);
      return next;
    });
  };

  const handleReset = () => {
    setIsDripping(false);
    setBuretteVolume(0.0);
    setHasCompleted(false);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  const handleShake = () => {
    setIsShaking(true);
    analytics.recordSimulationClick(SIM_ID, 1);
    setTimeout(() => setIsShaking(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Info Banner */}
      <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-sm">
        <div>
          <span className="font-bold text-purple-300">Eksperimen:</span> Pentitratan 25.0 cm³ NaOH 0.1 mol dm⁻³ dengan HCl 0.1 mol dm⁻³ (Penunjuk Fenolftalein)
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFormula(!showFormula)}
            className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-purple-200 flex items-center gap-1.5 text-xs font-medium transition"
          >
            <Info className="w-3.5 h-3.5" /> {showFormula ? 'Tutup Formula' : 'Formula SPM'}
          </button>
        </div>
      </div>

      {showFormula && (
        <div className="bg-slate-900/90 border border-purple-500/40 p-4 rounded-xl text-xs space-y-2 text-slate-300 animate-in fade-in duration-200">
          <p className="font-semibold text-purple-300 text-sm">Persamaan Kimia & Pengiraan Stoikiometri:</p>
          <div className="font-mono bg-black/40 p-2.5 rounded border border-white/5 text-purple-200 text-center">
            HCl + NaOH → NaCl + H₂O
          </div>
          <p>Rumus Pentitratan: <span className="font-mono text-emerald-400 font-bold">(Ma × Va) / (Mb × Vb) = a / b</span></p>
          <p>Di mana: Ma = 0.1, Mb = 0.1, Vb = 25.0 cm³, a = 1, b = 1 ➜ <strong className="text-white">Isipadu Asid Diperlukan (Va) = 25.00 cm³</strong></p>
        </div>
      )}

      {/* Main Interactive Lab Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        
        {/* Left: Apparatus Graphic */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[420px] bg-gradient-to-b from-slate-900/50 to-slate-950/80 rounded-xl p-6 relative border border-slate-800/80">
          
          {/* Retort Stand */}
          <div className="absolute left-1/4 bottom-8 top-8 w-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-sm shadow-md">
            {/* Stand Clamp */}
            <div className="absolute top-28 left-0 w-24 h-2.5 bg-slate-500 rounded-r shadow"></div>
            <div className="absolute top-52 left-0 w-24 h-2.5 bg-slate-500 rounded-r shadow"></div>
            {/* Stand Base */}
            <div className="absolute -bottom-2 -left-12 w-28 h-4 bg-slate-700 rounded shadow"></div>
          </div>

          {/* White Tile under Flask */}
          <div className="absolute bottom-6 w-36 h-3 bg-white rounded shadow-lg border border-slate-300 z-0">
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 whitespace-nowrap">Jubin Putih (White Tile)</span>
          </div>

          {/* Burette Container */}
          <div className="relative z-10 flex flex-col items-center mb-1">
            {/* Burette Glass Tube */}
            <div className="w-8 h-48 border-2 border-sky-300/60 rounded-t bg-sky-950/20 backdrop-blur-sm relative overflow-hidden flex flex-col justify-end">
              {/* Liquid inside burette */}
              <div 
                className="w-full bg-sky-300/30 border-t border-sky-200 transition-all duration-200 relative"
                style={{ height: `${Math.max(0, 100 - (buretteVolume / 50) * 100)}%` }}
              >
                <div className="absolute top-0 w-full h-1 bg-sky-200/60 rounded-full animate-pulse"></div>
              </div>
              
              {/* Burette Markings */}
              <div className="absolute inset-0 flex flex-col justify-between py-1 px-0.5 pointer-events-none opacity-60">
                {[0, 10, 20, 30, 40, 50].map((mark) => (
                  <div key={mark} className="flex items-center justify-between text-[7px] font-mono text-sky-200">
                    <span className="w-1.5 h-0.5 bg-sky-300"></span>
                    <span>{mark}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stopcock (Pili Buret) */}
            <div className="w-4 h-6 bg-slate-600 border border-slate-400 flex items-center justify-center relative">
              <div 
                className={`w-7 h-2 bg-amber-500 rounded-sm cursor-pointer transition-transform duration-300 ${isDripping ? 'rotate-90' : 'rotate-0'}`}
                title="Pili Buret (Klik untuk buka/tutup)"
                onClick={() => setIsDripping(!isDripping)}
              ></div>
            </div>

            {/* Burette Tip */}
            <div className="w-1.5 h-4 bg-sky-200/50 border-x border-sky-300/40"></div>

            {/* Animated Droplet */}
            <div className={`h-6 flex items-start justify-center overflow-hidden ${isDripping ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-2 h-2.5 bg-sky-300 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Conical Flask (Kelalang Kon) */}
          <div 
            className={`relative z-10 w-28 h-28 flex flex-col items-center justify-end transition-transform duration-200 ${isShaking ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : ''}`}
            onClick={handleShake}
            title="Klik untuk goncang kelalang kon"
          >
            {/* Flask Neck */}
            <div className="w-8 h-8 border-x-2 border-t-2 border-sky-300/50 rounded-t-sm bg-transparent"></div>
            
            {/* Flask Body (Trapezoid shape using clip path) */}
            <div 
              className="w-28 h-20 border-2 border-sky-300/60 bg-slate-900/40 relative overflow-hidden flex items-end justify-center rounded-b-xl backdrop-blur-sm"
              style={{
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
              }}
            >
              {/* Liquid inside flask */}
              <div 
                className={`w-full transition-colors duration-500 rounded-b-lg ${getFlaskColor()}`}
                style={{ height: `${Math.min(90, 40 + (buretteVolume / 50) * 35)}%` }}
              >
                {/* Surface Meniscus line */}
                <div className="w-full h-1 bg-white/40"></div>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-400 mt-1">Kelalang Kon + Penunjuk</div>
          </div>

        </div>

        {/* Right: Controls & Measurement Dashboard */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          
          {/* Readings */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-purple-400 font-bold flex items-center justify-between">
              <span>Bacaan Semasa Buret</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Ketepatan ±0.05 cm³</span>
            </h4>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-mono font-bold text-white tracking-tight">
                {buretteVolume.toFixed(2)}
              </span>
              <span className="text-slate-400 font-medium">cm³</span>
            </div>

            {/* Status indicator */}
            <div className="p-2.5 rounded-lg bg-black/30 border border-slate-800 text-xs">
              <span className="text-slate-400">Pemerhatian: </span>
              <span className={`font-semibold ${buretteVolume >= 24.9 && buretteVolume <= 25.1 ? 'text-emerald-400' : buretteVolume > 25.1 ? 'text-rose-400' : 'text-pink-400'}`}>
                {getStatusText()}
              </span>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Kawalan Pentitratan:</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsDripping(!isDripping)}
                className={`py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition ${
                  isDripping 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                }`}
              >
                {isDripping ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isDripping ? 'Henti Titisan' : 'Buka Pili Buret'}
              </button>

              <button
                onClick={handleAddSingleDrop}
                disabled={isDripping}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Droplets className="w-4 h-4 text-sky-400" />
                Titis 1 Titis (+0.05)
              </button>
            </div>

            {/* Drip Speed Toggle */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span>Kelajuan Aliran:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setDripSpeed('slow')}
                  className={`px-2.5 py-1 rounded text-xs transition ${dripSpeed === 'slow' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Perlahan
                </button>
                <button
                  onClick={() => setDripSpeed('fast')}
                  className={`px-2.5 py-1 rounded text-xs transition ${dripSpeed === 'fast' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Laju
                </button>
              </div>
            </div>

            {/* Goncang Kelalang */}
            <button
              onClick={handleShake}
              className="w-full py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              🔄 Goncang Kelalang Kon (Sebatikan Larutan)
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-full py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Semula Pentitratan
            </button>
          </div>

          {/* Success Card */}
          {hasCompleted && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-emerald-300">Tahniah! Takat Akhir Tercapai dengan Tepat</p>
                <p className="text-slate-300">Isipadu asid hidroklorik yang digunakan ialah <strong>{buretteVolume.toFixed(2)} cm³</strong>. Nilai ini menepati pengiraan stoikiometri SPM.</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
