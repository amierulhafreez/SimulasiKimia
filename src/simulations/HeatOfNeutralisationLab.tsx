import React, { useEffect, useRef, useState } from 'react';
import {
  Beaker,
  Calculator,
  Flame,
  RotateCcw,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import { analytics } from '../services/analytics';

type AcidId = 'hcl' | 'hno3' | 'h2so4' | 'ch3cooh';
type AlkaliId = 'naoh' | 'koh' | 'nh3';
type ConcValue = 0.5 | 1.0 | 2.0;

interface AcidSpec {
  id: AcidId;
  formula: string;
  name: string;
  strength: 'strong' | 'weak';
  basicity: 1 | 2;
  badge: string;
}

interface AlkaliSpec {
  id: AlkaliId;
  formula: string;
  name: string;
  strength: 'strong' | 'weak';
  badge: string;
}

const ACIDS: AcidSpec[] = [
  { id: 'hcl', formula: 'HCl', name: 'Asid hidroklorik', strength: 'strong', basicity: 1, badge: 'Asid kuat monobes' },
  { id: 'hno3', formula: 'HNO₃', name: 'Asid nitrik', strength: 'strong', basicity: 1, badge: 'Asid kuat monobes' },
  { id: 'h2so4', formula: 'H₂SO₄', name: 'Asid sulfurik', strength: 'strong', basicity: 2, badge: 'Asid kuat dwibes' },
  { id: 'ch3cooh', formula: 'CH₃COOH', name: 'Asid etanoik', strength: 'weak', basicity: 1, badge: 'Asid lemah monobes' },
];

const ALKALIS: AlkaliSpec[] = [
  { id: 'naoh', formula: 'NaOH', name: 'Natrium hidroksida', strength: 'strong', badge: 'Alkali kuat' },
  { id: 'koh', formula: 'KOH', name: 'Kalium hidroksida', strength: 'strong', badge: 'Alkali kuat' },
  { id: 'nh3', formula: 'NH₃', name: 'Larutan ammonia', strength: 'weak', badge: 'Alkali lemah' },
];

function getDeltaH(acid: AcidSpec, alkali: AlkaliSpec): number {
  if (acid.strength === 'strong' && alkali.strength === 'strong') return -57.0;
  if (acid.strength === 'weak' && alkali.strength === 'strong') return -55.0;
  if (acid.strength === 'strong' && alkali.strength === 'weak') return -52.0;
  return -50.0;
}

function getThermochemicalEquation(acid: AcidSpec, alkali: AlkaliSpec, deltaH: number): string {
  const dh = deltaH.toFixed(1);
  if (acid.id === 'hcl' && alkali.id === 'naoh') return `HCl(ak) + NaOH(ak) → NaCl(ak) + H₂O(ce)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'hcl' && alkali.id === 'koh') return `HCl(ak) + KOH(ak) → KCl(ak) + H₂O(ce)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'hcl' && alkali.id === 'nh3') return `HCl(ak) + NH₃(ak) → NH₄Cl(ak)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'hno3' && alkali.id === 'naoh') return `HNO₃(ak) + NaOH(ak) → NaNO₃(ak) + H₂O(ce)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'hno3' && alkali.id === 'koh') return `HNO₃(ak) + KOH(ak) → KNO₃(ak) + H₂O(ce)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'hno3' && alkali.id === 'nh3') return `HNO₃(ak) + NH₃(ak) → NH₄NO₃(ak)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'h2so4' && alkali.id === 'naoh') return `½ H₂SO₄(ak) + NaOH(ak) → ½ Na₂SO₄(ak) + H₂O(ce)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'h2so4' && alkali.id === 'koh') return `½ H₂SO₄(ak) + KOH(ak) → ½ K₂SO₄(ak) + H₂O(ce)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'h2so4' && alkali.id === 'nh3') return `½ H₂SO₄(ak) + NH₃(ak) → ½ (NH₄)₂SO₄(ak)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'ch3cooh' && alkali.id === 'naoh') return `CH₃COOH(ak) + NaOH(ak) → CH₃COONa(ak) + H₂O(ce)   ΔH = ${dh} kJ mol⁻¹`;
  if (acid.id === 'ch3cooh' && alkali.id === 'koh') return `CH₃COOH(ak) + KOH(ak) → CH₃COOK(ak) + H₂O(ce)   ΔH = ${dh} kJ mol⁻¹`;
  return `CH₃COOH(ak) + NH₃(ak) → CH₃COONH₄(ak)   ΔH = ${dh} kJ mol⁻¹`;
}

interface RecordRow {
  pair: string;
  conc: number;
  deltaTheta: string;
  deltaH: string;
}

const CalorimeterCanvas: React.FC<{
  isRunning: boolean;
  progress: number;
  currentTemp: number;
  maxTemp: number;
  acidFormula: string;
  alkaliFormula: string;
}> = ({ isRunning, progress, currentTemp, maxTemp, acidFormula, alkaliFormula }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ isRunning, progress, currentTemp, maxTemp, acidFormula, alkaliFormula });
  stateRef.current = { isRunning, progress, currentTemp, maxTemp, acidFormula, alkaliFormula };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const startMs = performance.now();

    const drawLeader = (
      targetX: number,
      targetY: number,
      side: 'left' | 'right',
      textX: number,
      textY: number,
      label: string
    ) => {
      ctx.save();
      ctx.font = '700 9px ui-sans-serif, system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      const tw = ctx.measureText(label).width;
      ctx.textAlign = side === 'left' ? 'left' : 'right';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(label, textX, textY);

      const lineStartX = side === 'left' ? textX + tw + 4 : textX - tw - 4;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lineStartX, textY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(targetX, targetY, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = (now: number) => {
      const t = (now - startMs) / 1000;
      const dpr = window.devicePixelRatio || 1;
      const cssW = 460;
      const cssH = 240;
      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
      }

      const {
        isRunning: running,
        progress: prog,
        currentTemp: curT,
        maxTemp: maxT,
        acidFormula: acF,
        alkaliFormula: alF,
      } = stateRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cssW, cssH);

      // Bench
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(14, 214, 432, 7);

      const cupCx = 185;
      const cupBottom = 214;
      const cupTop = 104;

      // Polystyrene Cup (Cawan polistirena)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cupCx - 48, cupTop);
      ctx.lineTo(cupCx - 38, cupBottom);
      ctx.lineTo(cupCx + 38, cupBottom);
      ctx.lineTo(cupCx + 48, cupTop);
      ctx.closePath();

      // Liquid inside cup (rises when poured)
      ctx.save();
      ctx.clip();
      const fillFrac = prog > 0 ? 0.42 + Math.min(1, prog / 0.3) * 0.34 : 0.42;
      const liqTop = cupBottom - (cupBottom - cupTop) * fillFrac;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.fillRect(cupCx - 50, liqTop, 100, cupBottom - liqTop);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cupCx - 50, liqTop);
      ctx.lineTo(cupCx + 50, liqTop);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = 'rgba(241, 245, 249, 0.35)';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.restore();

      // Perforated Lid (Penutup berlubang)
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.fillRect(cupCx - 52, cupTop - 6, 104, 6);
      ctx.strokeRect(cupCx - 52, cupTop - 6, 104, 6);

      // Thermometer (0 - 110 °C)
      const thermX = cupCx - 10;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(thermX - 3.5, 22, 7, 152);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(thermX - 3.5, 22, 7, 152);
      // Bulb
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(thermX, 176, 5, 0, Math.PI * 2);
      ctx.fill();
      // Mercury column
      const mercH = 40 + ((curT - 25) / 25) * 85;
      ctx.fillRect(thermX - 1.5, 174 - Math.min(140, mercH), 3, Math.min(140, mercH));

      // Stirring Rod (Rod pengacau) — animates up/down when stirring
      const stirOffset = running && prog > 0.25 && prog < 0.95 ? Math.sin(t * 14) * 6 : 0;
      const rodX = cupCx + 18;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rodX, 42 + stirOffset);
      ctx.lineTo(rodX, 192 + stirOffset);
      ctx.stroke();
      // Stirrer ring at bottom
      ctx.beginPath();
      ctx.ellipse(rodX, 192 + stirOffset, 8, 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Pouring Alkali stream during start of animation (prog < 0.3)
      if (running && prog > 0 && prog < 0.3) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cupCx - 62, 58);
        ctx.quadraticCurveTo(cupCx - 22, 72, cupCx - 8, 98);
        ctx.stroke();
        ctx.restore();
      }

      // Digital Thermometer Readout Pill
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = prog >= 0.9 ? '#dc2626' : '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(thermX + 12, 22, 62, 22, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = prog >= 0.9 ? '#dc2626' : '#0f172a';
      ctx.font = '800 11px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${curT.toFixed(1)} °C`, thermX + 43, 33);
      ctx.restore();

      // Textbook Leader Labels
      drawLeader(thermX - 3, 56, 'left', 14, 56, 'Termometer (0–110 °C)');
      drawLeader(cupCx - 50, cupTop - 3, 'left', 14, 98, 'Penutup berlubang');
      drawLeader(cupCx - 43, 155, 'left', 14, 155, 'Cawan polistirena');
      drawLeader(rodX, 66, 'left', 14, 196, 'Rod pengacau');

      // Solution label
      ctx.fillStyle = '#0369a1';
      ctx.font = '700 9px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${acF} + ${alF} (100 cm³)`, cupCx, 229);

      // ==========================================
      // MINI GRAPH: SUHU (°C) MELAWAN MASA (s)
      // ==========================================
      const gx = 292;
      const gy = 30;
      const gw = 152;
      const gh = 112;

      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(gx, gy, gw, gh, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = '800 9px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Graf Suhu (°C) vs Masa (s)', gx + gw / 2, gy + 12);

      // Axes
      const ox = gx + 24;
      const oy = gy + gh - 18;
      const axW = gw - 36;
      const axH = gh - 40;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ox, gy + 22);
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox + axW, oy);
      ctx.stroke();

      // Plot temperature curve
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const steps = Math.max(1, Math.floor(prog * 30));
      for (let i = 0; i <= steps; i++) {
        const u = i / 30;
        const px = ox + u * axW;
        // Smooth rise reaching peak at u=0.8
        const rise = u < 0.8 ? Math.sin((u / 0.8) * (Math.PI / 2)) : 1 - (u - 0.8) * 0.08;
        const tempAtU = 28.0 + (maxT - 28.0) * rise;
        const py = oy - Math.min(1, (tempAtU - 26) / 20) * axH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '600 8px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('28°', ox - 3, oy - 4);
      ctx.textAlign = 'center';
      ctx.fillText('Masa (s)', ox + axW / 2, oy + 11);
      ctx.restore();

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[460px] aspect-[460/240] mx-auto block rounded-xl border border-slate-200 bg-white"
    />
  );
};

const SubmicroIonCanvas: React.FC<{ acid: AcidSpec; alkali: AlkaliSpec }> = ({
  acid,
  alkali,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ acid, alkali });
  stateRef.current = { acid, alkali };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const startMs = performance.now();

    const render = (now: number) => {
      const t = (now - startMs) / 1000;
      const dpr = window.devicePixelRatio || 1;
      const cssW = 250;
      const cssH = 190;
      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
      }

      const { acid: ac, alkali: al } = stateRef.current;
      const hasWeak = ac.strength === 'weak' || al.strength === 'weak';

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, cssW, cssH);

      // Magnifier circle
      ctx.strokeStyle = hasWeak ? '#f59e0b' : '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(125, 95, 76, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.stroke();

      // H+ and OH- ions combining into H2O
      const pulse = Math.sin(t * 3) * 3;
      // H+ (Red)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(90 + pulse, 82, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 10px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('H⁺', 90 + pulse, 85);

      // OH- (Blue)
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(160 - pulse, 82, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('OH⁻', 160 - pulse, 85);

      // Outward heat arrows (Red)
      ctx.fillStyle = '#dc2626';
      ctx.font = '800 9.5px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('H₂O + Haba Dibebaskan ↗', 125, 50);

      if (hasWeak) {
        // Neutral weak molecule absorbing small heat to ionise
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(72, 114, 106, 24, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#92400e';
        ctx.font = '700 8.5px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(
          `${ac.strength === 'weak' ? ac.formula : al.formula} (Molekul Neutral)`,
          125,
          129
        );
        ctx.fillStyle = '#b45309';
        ctx.font = '700 8px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('↘ Sebahagian haba diserap untuk mengion', 125, 154);
      } else {
        ctx.fillStyle = '#059669';
        ctx.font = '700 9px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('Pengionan 100% Lengkap!', 125, 126);
        ctx.fillStyle = '#475569';
        ctx.font = '600 8.5px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('Semua haba dibebaskan ke larutan', 125, 142);
      }

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[250px] aspect-[250/190] mx-auto block rounded-xl border border-slate-200 bg-slate-50"
    />
  );
};

export const HeatOfNeutralisationLab: React.FC = () => {
  const [acidId, setAcidId] = useState<AcidId>('hcl');
  const [alkaliId, setAlkaliId] = useState<AlkaliId>('naoh');
  const [conc, setConc] = useState<ConcValue>(1.0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [records, setRecords] = useState<RecordRow[]>([]);

  const acid = ACIDS.find((a) => a.id === acidId)!;
  const alkali = ALKALIS.find((a) => a.id === alkaliId)!;

  // Thermochemistry calculations
  const deltaH = getDeltaH(acid, alkali);
  const molAcid = (conc * 50.0) / 1000;
  const molHPlus = molAcid * acid.basicity;
  const molOHMinus = (conc * 50.0) / 1000;
  const molWater = Math.min(molHPlus, molOHMinus); // Limiting reactant
  const heatQ = molWater * Math.abs(deltaH) * 1000; // in Joules
  const mass = 100.0; // 50 + 50 cm3 * 1.0 g/cm3
  const c = 4.2;
  const deltaTheta = heatQ / (mass * c);
  const initialTemp = 28.0;
  const maxTemp = initialTemp + deltaTheta;
  const currentTemp = initialTemp + deltaTheta * Math.min(1, progress / 0.85);

  const recordedRef = useRef(false);

  useEffect(() => {
    if (!isRunning) return;
    const start = performance.now();
    let frameId = 0;
    let logged = false;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 2200);
      setProgress(p);
      if (p >= 1 && !logged) {
        logged = true;
        setRecords((prev) => [
          {
            pair: `${acid.formula} + ${alkali.formula}`,
            conc,
            deltaTheta: `+${deltaTheta.toFixed(1)} °C`,
            deltaH: `${deltaH.toFixed(1)} kJ mol⁻¹`,
          },
          ...prev.slice(0, 4),
        ]);
        if (!recordedRef.current) {
          recordedRef.current = true;
          analytics.recordSimulationCompleted('haba-peneutralan');
        }
      }
      if (p < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, acid.formula, alkali.formula, conc, deltaTheta, deltaH]);

  const handleReset = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const handleSelectChange = () => {
    setIsRunning(false);
    setProgress(0);
  };

  // Dynamic gap height for Energy Level Diagram (scales from 50 to 57)
  const energyGapPx = 38 + ((Math.abs(deltaH) - 48) / 10) * 26;

  return (
    <div className="bg-slate-50 text-slate-900 p-2 sm:p-3 rounded-2xl flex flex-col gap-2.5 font-sans">
      {/* BARIS ATAS: 3 LAJUR */}
      <div className="grid grid-cols-1 lg:grid-cols-[265px_1fr_260px] gap-2.5 items-stretch">
        {/* 1. PANEL KAWALAN PEMBOLEH UBAH (KIRI) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between space-y-2.5">
          <div className="space-y-2">
            <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Beaker className="w-3.5 h-3.5 text-rose-600" />
              <span>Pemboleh Ubah (50.0 cm³ setiap satu)</span>
            </div>

            {/* Pilihan Asid */}
            <div>
              <div className="text-[10px] font-extrabold text-red-700 mb-1">Asid (50.0 cm³):</div>
              <div className="grid grid-cols-2 gap-1">
                {ACIDS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setAcidId(a.id);
                      handleSelectChange();
                    }}
                    className={`p-1.5 rounded-lg border text-left transition cursor-pointer ${
                      acidId === a.id
                        ? 'bg-red-50 border-red-500 text-red-950 font-extrabold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs leading-tight">{a.formula}</div>
                    <div className="text-[9px] text-slate-500 truncate">{a.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pilihan Alkali */}
            <div>
              <div className="text-[10px] font-extrabold text-blue-700 mb-1">Alkali (50.0 cm³):</div>
              <div className="grid grid-cols-3 gap-1">
                {ALKALIS.map((al) => (
                  <button
                    key={al.id}
                    onClick={() => {
                      setAlkaliId(al.id);
                      handleSelectChange();
                    }}
                    className={`p-1.5 rounded-lg border text-center transition cursor-pointer ${
                      alkaliId === al.id
                        ? 'bg-blue-50 border-blue-500 text-blue-950 font-extrabold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs leading-tight">{al.formula}</div>
                    <div className="text-[8.5px] text-slate-500 truncate">{al.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Kepekatan */}
            <div>
              <div className="text-[10px] font-extrabold text-slate-700 mb-1">Kepekatan Larutan:</div>
              <div className="grid grid-cols-3 gap-1">
                {([0.5, 1.0, 2.0] as ConcValue[]).map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setConc(val);
                      handleSelectChange();
                    }}
                    className={`py-1 rounded-lg border text-[11px] font-extrabold transition cursor-pointer ${
                      conc === val
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {val.toFixed(1)} M
                  </button>
                ))}
              </div>
            </div>

            {/* Butang Aksi */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  setProgress(0);
                  setIsRunning(true);
                }}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-sm cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Tuang Alkali ke dalam Asid & Kacau</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Set Semula Eksperimen</span>
              </button>
            </div>
          </div>

          {/* Jadual Rekod Perbandingan */}
          <div className="border-t border-slate-200 pt-2">
            <div className="text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              Rekod Perbandingan Percubaan
            </div>
            {records.length === 0 ? (
              <div className="text-[10.5px] text-slate-400 italic">
                Jalankan eksperimen untuk merekod Δθ dan ΔH.
              </div>
            ) : (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {records.map((r, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-200 font-bold"
                  >
                    <span>
                      {r.pair} ({r.conc}M)
                    </span>
                    <span className="text-rose-700">{r.deltaTheta}</span>
                    <span className="text-indigo-700">{r.deltaH}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. KANVAS KALORIMETER MAKROSKOPIK (TENGAH) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-600" />
              <span>Kalorimeter Cawan Polistirena</span>
            </span>
            <div className="text-[11px] font-bold text-slate-600">
              T₁ = 28.0 °C | T₂ = 28.0 °C →{' '}
              <span className="text-rose-600 font-extrabold">
                T_maks = {progress >= 0.85 ? `${maxTemp.toFixed(1)} °C` : `${currentTemp.toFixed(1)} °C`}
              </span>
            </div>
          </div>

          <CalorimeterCanvas
            isRunning={isRunning}
            progress={progress}
            currentTemp={currentTemp}
            maxTemp={maxTemp}
            acidFormula={acid.formula}
            alkaliFormula={alkali.formula}
          />

          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <strong>Kenaikan Suhu (Δθ):</strong>{' '}
            {progress >= 0.85
              ? `${maxTemp.toFixed(1)} − 28.0 = +${deltaTheta.toFixed(1)} °C`
              : 'Klik "Tuang Alkali ke dalam Asid & Kacau" untuk mengukur kenaikan suhu.'}
          </div>
        </div>

        {/* 3. KANTA PEMBESAR SUBMIKROSKOPIK (KANAN ATAS) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between space-y-2">
          <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Kanta Pengionan & Haba</span>
          </div>
          <SubmicroIonCanvas acid={acid} alkali={alkali} />
          <div className="text-[10.5px] text-slate-700 bg-amber-50 p-2 rounded-xl border border-amber-200 leading-relaxed">
            {acid.strength === 'strong' && alkali.strength === 'strong'
              ? 'Asid kuat & alkali kuat mengion 100%. Haba peneutralan piawai ialah -57.0 kJ mol⁻¹.'
              : 'Asid/alkali lemah mengion separa. Sebahagian haba diserap untuk mengionkan molekul neutral, mengurangkan nilai |ΔH|.'}
          </div>
        </div>
      </div>

      {/* BARIS BAWAH: KALKULATOR 4 LANGKAH & GAMBAR RAJAH ARAS TENAGA */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-2.5">
        {/* Kalkulator 4 Langkah */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-2">
          <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kalkulator 4 Langkah Termokimia (c = 4.2 J g⁻¹ °C⁻¹, ρ = 1.0 g cm⁻³)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-extrabold text-slate-700">Langkah 1: Perubahan Haba (Q = mcθ)</div>
              <div className="font-mono text-[11px] text-slate-900 mt-0.5">
                Q = 100.0 × 4.2 × {deltaTheta.toFixed(1)} = <strong>{heatQ.toFixed(0)} J</strong>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-extrabold text-slate-700">Langkah 2: Bilangan Mol Air (n = MV/1000)</div>
              <div className="font-mono text-[11px] text-slate-900 mt-0.5">
                n = ({conc.toFixed(1)} × 50.0) / 1000 = <strong>{molWater.toFixed(3)} mol</strong>
                {acid.basicity === 2 && (
                  <span className="block text-[9.5px] text-amber-700 font-sans">
                    *{alkali.formula} ialah reaktan pengehad (nisbah 1:2)
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-extrabold text-slate-700">Langkah 3: Haba Peneutralan (ΔH = -Q / n)</div>
              <div className="font-mono text-[11px] text-rose-700 mt-0.5">
                ΔH = -{(heatQ / 1000).toFixed(2)} kJ / {molWater.toFixed(3)} = <strong>{deltaH.toFixed(1)} kJ mol⁻¹</strong>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <div className="font-extrabold text-slate-300 text-[10px]">Langkah 4: Persamaan Termokimia</div>
              <div className="font-mono text-[10.5px] mt-0.5 leading-snug">
                {getThermochemicalEquation(acid, alkali, deltaH)}
              </div>
            </div>
          </div>
        </div>

        {/* Gambar Rajah Aras Tenaga Dinamik */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
            Gambar Rajah Aras Tenaga (Eksotermik)
          </div>
          <div className="flex items-center gap-3 py-1">
            <div className="flex flex-col items-center justify-center border-l-2 border-b-2 border-slate-700 px-4 py-2 flex-1 relative min-h-[96px]">
              {/* Reactant level */}
              <div className="w-36 border-t-2 border-red-600 text-[10px] font-extrabold text-red-800 text-center pb-1">
                Bahan Tindak Balas ({acid.formula} + {alkali.formula})
              </div>
              {/* Arrow down */}
              <div
                className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-rose-700 border-l-2 border-dashed border-rose-500 pl-2"
                style={{ height: `${energyGapPx}px` }}
              >
                <span>↓ ΔH = {deltaH.toFixed(1)} kJ mol⁻¹</span>
              </div>
              {/* Product level */}
              <div className="w-36 border-t-2 border-blue-600 text-[10px] font-extrabold text-blue-800 text-center pt-1">
                Hasil (Garam + H₂O)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatOfNeutralisationLab;
