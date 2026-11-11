import React, { useState, useEffect, useRef } from 'react';
import { analytics } from '../services/analytics';
import { Flame, Snowflake, Sparkles, ArrowRight, Info } from 'lucide-react';

type MatterState = 'solid' | 'liquid' | 'gas';

interface ProcessInfo {
  id: string;
  name: string;
  from: MatterState;
  to: MatterState;
  heatType: 'absorbed' | 'released';
  description: string;
  examples: string;
}

const PROCESSES: ProcessInfo[] = [
  {
    id: 'melting',
    name: 'Peleburan',
    from: 'solid',
    to: 'liquid',
    heatType: 'absorbed',
    description: 'Pepejal menyerap haba. Zarah memperoleh tenaga kinetik, bergetar lebih cepat dan mengatasi daya tarikan sehingga susunan teratur pecah menjadi cecair.',
    examples: 'Ais melebur menjadi air; Naftalena melebur pada 80°C.'
  },
  {
    id: 'boiling',
    name: 'Pendidihan / Penyejatan',
    from: 'liquid',
    to: 'gas',
    heatType: 'absorbed',
    description: 'Cecair menyerap haba. Tenaga kinetik zarah menjadi sangat tinggi sehingga memutuskan daya tarikan antara zarah dan terbebas ke udara sebagai gas.',
    examples: 'Air mendidih menjadi stim pada 100°C.'
  },
  {
    id: 'sublimation',
    name: 'Pemejalwapan',
    from: 'solid',
    to: 'gas',
    heatType: 'absorbed',
    description: 'Zarah pepejal menyerap tenaga haba dan bertukar terus kepada keadaan gas tanpa melalui keadaan cecair.',
    examples: 'Hablur iodin (I₂), naftalena, ammonium klorida, ais kering (CO₂).'
  },
  {
    id: 'freezing',
    name: 'Pembekuan',
    from: 'liquid',
    to: 'solid',
    heatType: 'released',
    description: 'Cecair membebaskan tenaga haba. Zarah kehilangan tenaga kinetik, bergerak semakin perlahan dan tertarik rapat membentuk susunan padat serta teratur.',
    examples: 'Air membeku menjadi ais pada 0°C.'
  },
  {
    id: 'condensation',
    name: 'Kondensasi',
    from: 'gas',
    to: 'liquid',
    heatType: 'released',
    description: 'Zarah gas membebaskan haba ke persekitaran, bergerak lebih perlahan dan ditarik rapat antara satu sama lain menjadi cecair.',
    examples: 'Wap air membentuk titisan embun di permukaan gelas sejuk.'
  },
  {
    id: 'deposition',
    name: 'Pengendapan',
    from: 'gas',
    to: 'solid',
    heatType: 'released',
    description: 'Zarah gas membebaskan tenaga haba dan bertukar terus kepada keadaan pepejal tanpa melalui keadaan cecair.',
    examples: 'Wap iodin menyejuk membentuk hablur iodin ungu kehitaman.'
  }
];

const STATE_PROPERTIES: Record<MatterState, {
  label: string;
  arrangement: string;
  kineticEnergy: string;
  attraction: string;
  movement: string;
  color: string;
}> = {
  solid: {
    label: 'Pepejal (Solid)',
    arrangement: 'Zarah disusun secara padat dan teratur.',
    kineticEnergy: 'Tenaga kinetik zarah adalah rendah.',
    attraction: 'Daya tarikan antara zarah adalah kuat.',
    movement: 'Bergetar dan berputar pada kedudukan tetap.',
    color: 'text-emerald-700'
  },
  liquid: {
    label: 'Cecair (Liquid)',
    arrangement: 'Zarah disusun secara padat tetapi tidak teratur.',
    kineticEnergy: 'Tenaga kinetik zarah lebih tinggi daripada keadaan pepejal.',
    attraction: 'Daya tarikan antara zarah adalah kuat, tetapi kurang daripada pepejal.',
    movement: 'Bergetar, berputar dan bergerak bebas menggelongsor antara satu sama lain.',
    color: 'text-sky-700'
  },
  gas: {
    label: 'Gas (Gas)',
    arrangement: 'Zarah berjauhan antara satu sama lain.',
    kineticEnergy: 'Tenaga kinetik zarah adalah sangat tinggi.',
    attraction: 'Daya tarikan antara zarah adalah lemah.',
    movement: 'Bergerak secara rawak, bebas dan pantas ke semua arah.',
    color: 'text-purple-700'
  }
};

export const StatesOfMatterLab: React.FC = () => {
  const SIM_ID = 'keadaan-zarah-jirim';
  const [activeState, setActiveState] = useState<MatterState>('solid');
  const [selectedProcess, setSelectedProcess] = useState<ProcessInfo | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Real-time 2D particle physics animation matching Rajah 2.2 & Aktiviti 2.1
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animId: number;

    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
    }

    const particles: Particle[] = [];

    if (activeState === 'solid') {
      // 5x4 rigid lattice at bottom center
      const cols = 6;
      const rows = 4;
      const spacing = 28;
      const startX = (width - (cols - 1) * spacing) / 2;
      const startY = height - 35 - (rows - 1) * spacing;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = startX + c * spacing;
          const by = startY + r * spacing;
          particles.push({ x: bx, y: by, baseX: bx, baseY: by, vx: 0, vy: 0 });
        }
      }
    } else if (activeState === 'liquid') {
      // 24 particles clustered in lower half, sliding freely
      for (let i = 0; i < 24; i++) {
        particles.push({
          x: 40 + Math.random() * (width - 80),
          y: height * 0.45 + Math.random() * (height * 0.5 - 20),
          baseX: 0,
          baseY: 0,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.2
        });
      }
    } else {
      // 14 particles far apart moving rapidly everywhere
      for (let i = 0; i < 14; i++) {
        particles.push({
          x: 20 + Math.random() * (width - 40),
          y: 20 + Math.random() * (height - 40),
          baseX: 0,
          baseY: 0,
          vx: (Math.random() - 0.5) * 5.0,
          vy: (Math.random() - 0.5) * 5.0
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      const radius = 11;

      particles.forEach(p => {
        if (activeState === 'solid') {
          // Vibrate around fixed lattice position
          p.x = p.baseX + (Math.random() - 0.5) * 2.2;
          p.y = p.baseY + (Math.random() - 0.5) * 2.2;
        } else if (activeState === 'liquid') {
          // Move within lower liquid region
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 30 + radius || p.x > width - 30 - radius) p.vx *= -1;
          if (p.y < height * 0.42 || p.y > height - 18 - radius) p.vy *= -1;
        } else {
          // Move rapidly across entire container
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < radius + 8 || p.x > width - radius - 8) p.vx *= -1;
          if (p.y < radius + 8 || p.y > height - radius - 8) p.vy *= -1;
        }

        // Draw 3D-looking sphere particle matching Rajah 2.2 blue spheres
        const grad = ctx.createRadialGradient(p.x - 3, p.y - 3, 2, p.x, p.y, radius);
        grad.addColorStop(0, '#93c5fd');
        grad.addColorStop(0.6, '#0284c7');
        grad.addColorStop(1, '#1e3a8a');

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeState]);

  const handleSelectState = (state: MatterState) => {
    setActiveState(state);
    setSelectedProcess(null);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  const handleSelectProcess = (proc: ProcessInfo) => {
    setSelectedProcess(proc);
    setActiveState(proc.to);
    analytics.recordSimulationClick(SIM_ID, 1);
    analytics.recordSimulationCompleted(SIM_ID);
  };

  const prop = STATE_PROPERTIES[activeState];

  return (
    <div className="space-y-6">
      {/* State Selector Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          {(['solid', 'liquid', 'gas'] as MatterState[]).map(s => (
            <button
              key={s}
              onClick={() => handleSelectState(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeState === s
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {STATE_PROPERTIES[s].label}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
          Rajah 2.2: Teori Kinetik Jirim (m.s. 25)
        </span>
      </div>

      {/* Main Simulation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Particle Canvas + 6 State Change Processes */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          
          <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3 flex flex-col items-center relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Visualisasi 2D Susunan & Pergerakan Zarah: <strong className={prop.color}>{prop.label}</strong>
            </span>
            <canvas
              ref={canvasRef}
              width={320}
              height={220}
              className="w-full max-w-[320px] h-[220px] rounded-xl border border-slate-300 bg-white shadow-inner"
            />
          </div>

          {/* Heat Indicator Legend matching Rajah 2.2 */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Tenaga haba diserap</span>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 flex items-center gap-2">
              <Snowflake className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Tenaga haba dibebaskan</span>
            </div>
          </div>

        </div>

        {/* Right: Process Triggers & Properties Table */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          {/* 6 Physical State Changes Buttons */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Klik Proses Perubahan Keadaan Jirim:
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {PROCESSES.map(proc => {
                const isAbsorb = proc.heatType === 'absorbed';
                const isSelected = selectedProcess?.id === proc.id;
                return (
                  <button
                    key={proc.id}
                    onClick={() => handleSelectProcess(proc)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? isAbsorb
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                          : 'bg-sky-600 text-white border-sky-600 shadow-md'
                        : isAbsorb
                        ? 'bg-rose-50/60 hover:bg-rose-100/80 border-rose-200 text-rose-950'
                        : 'bg-sky-50/60 hover:bg-sky-100/80 border-sky-200 text-sky-950'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{proc.name}</span>
                      <span>{isAbsorb ? '🔥' : '❄️'}</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 flex items-center gap-1 ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                      <span>{STATE_PROPERTIES[proc.from].label.split(' ')[0]}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                      <span>{STATE_PROPERTIES[proc.to].label.split(' ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Process Description */}
          {selectedProcess && (
            <div className={`p-3 rounded-xl border text-xs space-y-1 ${
              selectedProcess.heatType === 'absorbed' ? 'bg-rose-50 border-rose-200' : 'bg-sky-50 border-sky-200'
            }`}>
              <p className="font-bold text-slate-900">
                Proses {selectedProcess.name} ({selectedProcess.heatType === 'absorbed' ? 'Tenaga Haba Diserap' : 'Tenaga Haba Dibebaskan'}):
              </p>
              <p className="text-[11px] text-slate-700 leading-relaxed">{selectedProcess.description}</p>
              <p className="text-[10px] text-slate-500 pt-0.5"><strong>Contoh:</strong> {selectedProcess.examples}</p>
            </div>
          )}

          {/* Current State Properties Box (Exact Textbook Points) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h4 className={`font-bold flex items-center gap-1.5 ${prop.color}`}>
              <Sparkles className="w-3.5 h-3.5" /> Ciri-ciri Keadaan {prop.label}:
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
              <li><strong>Susunan zarah:</strong> {prop.arrangement}</li>
              <li><strong>Tenaga kinetik:</strong> {prop.kineticEnergy}</li>
              <li><strong>Daya tarikan:</strong> {prop.attraction}</li>
              <li><strong>Pergerakan:</strong> {prop.movement}</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
