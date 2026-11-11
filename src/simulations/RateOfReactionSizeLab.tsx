import React, { useState, useEffect } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Timer, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

type MarbleSize = 'large' | 'small';

interface DataPoint {
  time: number; // seconds (0, 30, 60, ..., 240)
  largeGas: number; // cm3 CO2 collected (max 45.0 cm3 for burette limit visualization)
  smallGas: number;
}

// Realistic experimental curves reaching the same plateau (45.0 cm3 collected => burette 50.00 -> 5.00 cm3)
const CURVE_DATA: DataPoint[] = [
  { time: 0, largeGas: 0.0, smallGas: 0.0 },
  { time: 30, largeGas: 12.0, smallGas: 26.0 },
  { time: 60, largeGas: 22.0, smallGas: 38.5 },
  { time: 90, largeGas: 30.0, smallGas: 43.5 },
  { time: 120, largeGas: 36.5, smallGas: 45.0 },
  { time: 150, largeGas: 41.0, smallGas: 45.0 },
  { time: 180, largeGas: 43.8, smallGas: 45.0 },
  { time: 210, largeGas: 45.0, smallGas: 45.0 },
  { time: 240, largeGas: 45.0, smallGas: 45.0 }
];

export const RateOfReactionSizeLab: React.FC = () => {
  const SIM_ID = 'kadar-tindak-balas-saiz';
  const [selectedSize, setSelectedSize] = useState<MarbleSize>('large');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeSec, setTimeSec] = useState<number>(0); // 0 to 240
  const [recordedLarge, setRecordedLarge] = useState<DataPoint[]>([]);
  const [recordedSmall, setRecordedSmall] = useState<DataPoint[]>([]);

  // Interpolate gas volume at current timeSec
  const getGasAtTime = (t: number, size: MarbleSize): number => {
    for (let i = 0; i < CURVE_DATA.length - 1; i++) {
      const p1 = CURVE_DATA[i];
      const p2 = CURVE_DATA[i + 1];
      if (t >= p1.time && t <= p2.time) {
        const ratio = (t - p1.time) / (p2.time - p1.time);
        const v1 = size === 'large' ? p1.largeGas : p1.smallGas;
        const v2 = size === 'large' ? p2.largeGas : p2.smallGas;
        return +(v1 + ratio * (v2 - v1)).toFixed(2);
      }
    }
    return 45.0;
  };

  const currentGas = getGasAtTime(timeSec, selectedSize);
  const currentBuretteReading = +(50.0 - currentGas).toFixed(2);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeSec < 240) {
      timer = setInterval(() => {
        setTimeSec(prev => {
          const next = Math.min(240, prev + 10);
          // Record at 30s intervals
          if (next % 30 === 0) {
            const point = CURVE_DATA.find(d => d.time === next);
            if (point) {
              if (selectedSize === 'large') {
                setRecordedLarge(old => old.some(x => x.time === next) ? old : [...old, point]);
              } else {
                setRecordedSmall(old => old.some(x => x.time === next) ? old : [...old, point]);
              }
            }
          }
          if (next >= 240) {
            setIsRunning(false);
            analytics.recordSimulationCompleted(SIM_ID);
            confetti({ particleCount: 60, spread: 50 });
          }
          return next;
        });
      }, 220);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeSec, selectedSize]);

  const handleStart = () => {
    if (timeSec === 0) {
      const startPt = CURVE_DATA[0];
      if (selectedSize === 'large') {
        setRecordedLarge(old => old.length ? old : [startPt]);
      } else {
        setRecordedSmall(old => old.length ? old : [startPt]);
      }
    }
    analytics.recordSimulationClick(SIM_ID, 1);
    setIsRunning(!isRunning);
  };

  const handleSelectSize = (size: MarbleSize) => {
    setIsRunning(false);
    setSelectedSize(size);
    setTimeSec(0);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  const handleResetAll = () => {
    setIsRunning(false);
    setTimeSec(0);
    setRecordedLarge([]);
    setRecordedSmall([]);
  };

  const isReactionFinished =
    (selectedSize === 'large' && timeSec >= 210) ||
    (selectedSize === 'small' && timeSec >= 120);

  return (
    <div className="space-y-6">
      {/* Experiment Selector & Warning */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSelectSize('large')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedSize === 'large'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Set I: 5.0 g Ketulan Marmar Besar (CaCO₃)
          </button>
          <button
            onClick={() => handleSelectSize('small')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedSize === 'small'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Set II: 5.0 g Ketulan Marmar Kecil / Serbuk
          </button>
        </div>

        <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> 80.0 cm³ HCl 0.1 mol dm⁻³ (Mengakis)
        </span>
      </div>

      {/* Main Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Textbook-Exact Apparatus Diagram (Rajah 7.12) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-2xl p-5 relative">
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              Rajah 7.12: Pengumpulan Gas CO₂ (Sesaran Air)
            </span>
            <div className="flex items-center gap-2 bg-slate-900 text-emerald-400 px-3 py-1 rounded-xl font-mono text-xs font-bold shadow">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeSec} saat</span>
            </div>
          </div>

          <svg viewBox="0 0 420 260" className="w-full h-64">
            {/* Retort Stand on Right */}
            <rect x="330" y="232" width="70" height="8" rx="2" fill="#475569" />
            <rect x="362" y="20" width="7" height="214" fill="#64748b" />
            {/* Burette Clamp */}
            <rect x="305" y="65" width="60" height="6" rx="2" fill="#334155" />

            {/* Water Basin (Besen Berisi Air) */}
            <path d="M 225 182 L 235 232 L 345 232 L 355 182" fill="none" stroke="#475569" strokeWidth="3" />
            <path d="M 229 194 L 236 230 L 344 230 L 351 194 Z" fill="#bae6fd" fillOpacity="0.65" />
            <text x="358" y="206" fontSize="8.5" fill="#334155" fontWeight="bold">Besen</text>
            <text x="358" y="220" fontSize="8.5" fill="#0369a1" fontWeight="bold">Air</text>

            {/* Inverted Burette (Buret Ditelangkupkan) */}
            <rect x="294" y="28" width="18" height="190" fill="#f8fafc" fillOpacity="0.7" stroke="#0284c7" strokeWidth="2" />
            {/* Water inside burette (drops down as gas collects) */}
            {(() => {
              // 50.00 cm3 full => height 160px; empty => height 20px
              const gasFraction = currentGas / 50.0;
              const gasHeight = gasFraction * 165;
              const waterTopY = 30 + gasHeight;
              const waterHeight = 218 - waterTopY;
              return (
                <>
                  {/* Gas CO2 collected at top of inverted burette */}
                  <rect x="296" y="30" width="14" height={gasHeight} fill="#e2e8f0" fillOpacity="0.5" />
                  {/* Water level remaining */}
                  <rect x="296" y={waterTopY} width="14" height={Math.max(0, waterHeight)} fill="#38bdf8" fillOpacity="0.65" />
                  <line x1="294" y1={waterTopY} x2="312" y2={waterTopY} stroke="#dc2626" strokeWidth="1.5" />
                </>
              );
            })()}
            {/* Burette scale marks */}
            {[45, 75, 105, 135, 165, 195].map(y => (
              <line key={y} x1="294" y1={y} x2="300" y2={y} stroke="#475569" strokeWidth="1" />
            ))}
            <text x="288" y="52" fontSize="8.5" fill="#334155" fontWeight="bold" textAnchor="end">Gas CO₂</text>
            <text x="288" y="120" fontSize="8.5" fill="#334155" fontWeight="bold" textAnchor="end">Buret</text>

            {/* Conical Flask on Left */}
            <path d="M 78 105 L 78 135 L 35 220 Q 32 230 44 230 L 136 230 Q 148 230 145 220 L 102 135 L 102 105" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
            {/* Acid HCl inside conical flask */}
            <path d="M 52 186 L 37 220 Q 34 228 44 228 L 136 228 Q 146 228 143 220 L 128 186 Z" fill="#e0f2fe" fillOpacity="0.8" />
            <text x="28" y="135" fontSize="8.5" fill="#334155" fontWeight="bold">Asid hidroklorik,</text>
            <text x="28" y="146" fontSize="8.5" fill="#0369a1" fontWeight="bold">HCl 0.1 M</text>
            <text x="135" y="165" fontSize="8.5" fill="#334155" fontWeight="bold">Kelalang kon</text>

            {/* Marble chips (Ketulan marmar CaCO3) */}
            {selectedSize === 'large' ? (
              <g>
                <polygon points="72,218 82,213 88,223 75,226" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                <polygon points="92,216 105,212 108,224 94,225" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                <polygon points="80,221 90,219 92,227 79,227" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              </g>
            ) : (
              <g>
                {[65, 71, 77, 83, 89, 95, 101, 107, 113, 68, 74, 80, 86, 92, 98, 104, 110].map((cx, idx) => (
                  <circle key={idx} cx={cx} cy={idx > 8 ? 224 : 220} r="2.2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.6" />
                ))}
              </g>
            )}
            <text x="90" y="246" fontSize="8.5" fill="#334155" fontWeight="bold" textAnchor="middle">
              5.0 g {selectedSize === 'large' ? 'Ketulan marmar besar' : 'Ketulan marmar kecil / serbuk'}, CaCO₃
            </text>

            {/* Effervescence bubbles in flask when reacting */}
            {isRunning && !isReactionFinished && (
              <g>
                <circle cx="80" cy="208" r="2.5" fill="#ffffff" stroke="#0284c7" className="animate-ping" />
                <circle cx="95" cy="200" r="2" fill="#ffffff" stroke="#0284c7" className="animate-bounce" />
                <circle cx="88" cy="192" r="2.5" fill="#ffffff" stroke="#0284c7" className="animate-ping" />
              </g>
            )}

            {/* Rubber Stopper & Delivery Tube (Salur Penghantar) */}
            <rect x="76" y="96" width="28" height="14" rx="2" fill="#dc2626" />
            <path d="M 90 96 L 90 72 L 210 72 L 210 218 L 303 218 L 303 206" fill="none" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 90 96 L 90 72 L 210 72 L 210 218 L 303 218 L 303 206" fill="none" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="150" y="64" fontSize="8.5" fill="#334155" fontWeight="bold" textAnchor="middle">Salur penghantar</text>

            {/* Gas bubbles rising into burette */}
            {isRunning && !isReactionFinished && (
              <g>
                <circle cx="303" cy="195" r="2.5" fill="#ffffff" stroke="#0284c7" className="animate-bounce" />
                <circle cx="302" cy="175" r="2" fill="#ffffff" stroke="#0284c7" className="animate-ping" />
              </g>
            )}
          </svg>

          {/* Readings Bar + Controls */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Bacaan Buret</span>
              <strong className="font-mono text-sm text-sky-700">{currentBuretteReading.toFixed(2)} cm³</strong>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Isi Padu Gas CO₂</span>
              <strong className="font-mono text-sm text-purple-700">{currentGas.toFixed(2)} cm³</strong>
            </div>
            <button
              onClick={handleStart}
              disabled={timeSec >= 240}
              className={`py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition ${
                isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-purple-600 hover:bg-purple-500 disabled:opacity-50'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Jeda' : timeSec > 0 ? 'Sambung' : 'Mula'}
            </button>
            <button
              onClick={handleResetAll}
              className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

        </div>

        {/* Right: Dual-Curve Graph & Collision Theory */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Graph Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Graf Isi Padu Gas CO₂ vs Masa
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-sky-700"><span className="w-2.5 h-0.5 bg-sky-600 inline-block"></span> Besar</span>
                <span className="flex items-center gap-1 text-rose-600"><span className="w-2.5 h-0.5 bg-rose-600 inline-block"></span> Kecil</span>
              </div>
            </div>

            <svg viewBox="0 0 280 150" className="w-full h-40 bg-white rounded-xl border border-slate-200">
              {/* Axes */}
              <line x1="35" y1="15" x2="35" y2="125" stroke="#64748b" strokeWidth="1.5" />
              <line x1="35" y1="125" x2="265" y2="125" stroke="#64748b" strokeWidth="1.5" />
              {/* Max gas plateau guide line */}
              <line x1="35" y1="28" x2="260" y2="28" stroke="#e2e8f0" strokeDasharray="3,3" strokeWidth="1" />
              <text x="31" y="31" fontSize="7" fill="#64748b" textAnchor="end">45</text>
              <text x="31" y="127" fontSize="7" fill="#64748b" textAnchor="end">0</text>
              <text x="12" y="75" fontSize="7" fill="#475569" transform="rotate(-90 12 75)" textAnchor="middle">Isi padu CO₂ (cm³)</text>
              <text x="150" y="142" fontSize="7.5" fill="#475569" textAnchor="middle">Masa (saat)</text>

              {/* Plot Set I (Large) polyline */}
              {recordedLarge.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  points={recordedLarge.map(p => `${35 + (p.time / 240) * 220},${125 - (p.largeGas / 50) * 105}`).join(' ')}
                />
              )}
              {recordedLarge.map(p => (
                <circle key={'L' + p.time} cx={35 + (p.time / 240) * 220} cy={125 - (p.largeGas / 50) * 105} r="3" fill="#0284c7" />
              ))}

              {/* Plot Set II (Small) polyline */}
              {recordedSmall.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="2.5"
                  points={recordedSmall.map(p => `${35 + (p.time / 240) * 220},${125 - (p.smallGas / 50) * 105}`).join(' ')}
                />
              )}
              {recordedSmall.map(p => (
                <circle key={'S' + p.time} cx={35 + (p.time / 240) * 220} cy={125 - (p.smallGas / 50) * 105} r="3" fill="#e11d48" />
              ))}
            </svg>
            <p className="text-[10px] text-slate-500">
              Jalankan kedua-dua <strong>Set I</strong> dan <strong>Set II</strong> untuk membandingkan lengkung pada graf yang sama!
            </p>
          </div>

          {/* Chemical Equation & Collision Theory */}
          <div className="space-y-2.5 text-xs">
            <div className="font-mono text-[11px] bg-slate-100 p-2 rounded-xl border border-slate-200 text-center font-bold text-slate-800">
              CaCO₃(p) + 2HCl(ak) → CaCl₂(ak) + H₂O(ce) + CO₂(g)
            </div>

            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-slate-700">
              <span className="font-bold text-purple-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Teori Perlanggaran KSSM (m.s. 246):
              </span>
              <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-slate-600">
                <li>Saiz CaCO₃ lebih kecil ➜ <strong>Jumlah luas permukaan terdedah bertambah</strong>.</li>
                <li><strong>Frekuensi perlanggaran</strong> antara zarah CaCO₃ dan ion H⁺ bertambah.</li>
                <li><strong>Frekuensi perlanggaran berkesan</strong> bertambah ➜ Kadar tindak balas lebih tinggi!</li>
                <li>Isi padu maksimum gas CO₂ adalah <strong>SAMA</strong> kerana bilangan mol asid HCl (bahan pengehad) sama.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
