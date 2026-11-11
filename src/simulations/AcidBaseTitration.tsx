import React, { useState, useEffect } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Droplets,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lock,
  FlaskConical,
  Table2,
  Eye,
} from 'lucide-react';

type IndicatorType = 'fenolftalein' | 'metil-jingga';
type DripSpeed = 'slow' | 'fast';

interface TitrationRecord {
  label: string;
  initial: number;
  final: number;
  volume: number;
  indicator: IndicatorType;
}

const SIM_ID = 'pentitratan-asid-alkali';
const ENDPOINT_VOLUME = 25.0; // 25.0 cm³ KOH 1.0 M + HNO₃ 1.0 M => Va = 25.00 cm³
const ACID_MOLARITY = 1.0; // mol dm⁻³ (1.0 M)
const ALKALI_MOLARITY = 1.0; // mol dm⁻³ (1.0 M)
const ALKALI_VOLUME = 25.0; // cm³

export const AcidBaseTitration: React.FC = () => {
  const [indicator, setIndicator] = useState<IndicatorType>('fenolftalein');
  const [buretteVolume, setBuretteVolume] = useState<number>(0.0); // 0.00 to 50.00 cm³
  const [isDripping, setIsDripping] = useState<boolean>(false);
  const [dripSpeed, setDripSpeed] = useState<DripSpeed>('slow');
  const [isSwirling, setIsSwirling] = useState<boolean>(false);
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [endpointReached, setEndpointReached] = useState<boolean>(false);
  const [stoppedAssessment, setStoppedAssessment] = useState<
    'none' | 'early' | 'exact' | 'overshot'
  >('none');
  const [hasRecordedCompletion, setHasRecordedCompletion] = useState<boolean>(false);
  const [records, setRecords] = useState<TitrationRecord[]>([]);

  // Drip loop: keeps running past 25.00 cm³ unless user clicks Stop
  useEffect(() => {
    if (!isDripping) return;

    const timer = setInterval(() => {
      setBuretteVolume((prev) => {
        if (prev >= 50.0) {
          setIsDripping(false);
          return 50.0;
        }
        const step = dripSpeed === 'slow' ? 0.1 : 0.5;
        const next = Math.min(50.0, Math.round((prev + step) * 100) / 100);
        return next;
      });
    }, dripSpeed === 'slow' ? 280 : 110);

    return () => clearInterval(timer);
  }, [isDripping, dripSpeed]);

  // Lock/record endpoint flag when burette crosses/reaches 25.00 cm³, WITHOUT stopping the simulation
  useEffect(() => {
    if (buretteVolume >= ENDPOINT_VOLUME && !endpointReached) {
      setEndpointReached(true);
    }
  }, [buretteVolume, endpointReached]);

  // Trigger completion evaluation when user stops at max burette (50.00 cm³) automatically
  useEffect(() => {
    if (buretteVolume >= 50.0 && hasStarted && !isDripping && stoppedAssessment === 'none') {
      setStoppedAssessment('overshot');
    }
  }, [buretteVolume, hasStarted, isDripping, stoppedAssessment]);

  const evaluateAtStop = (vol: number) => {
    if (!hasStarted && vol === 0) return;
    if (vol < 24.9) {
      setStoppedAssessment('early');
    } else if (vol <= 25.1) {
      setStoppedAssessment('exact');
      if (!hasRecordedCompletion) {
        setHasRecordedCompletion(true);
        analytics.recordSimulationCompleted(SIM_ID);
      }
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setStoppedAssessment('overshot');
    }
  };

  const handleToggleDrip = () => {
    analytics.recordSimulationClick(SIM_ID, 1);
    if (isDripping) {
      // User clicked Henti / Tutup Pili Buret
      setIsDripping(false);
      evaluateAtStop(buretteVolume);
    } else {
      if (buretteVolume >= 50.0) return;
      setHasStarted(true);
      setStoppedAssessment('none');
      setIsDripping(true);
    }
  };

  const handleAddSingleDrop = (stepAmount: number) => {
    if (isDripping || buretteVolume >= 50.0) return;
    analytics.recordSimulationClick(SIM_ID, 1);
    setHasStarted(true);
    const next = Math.min(50.0, Math.round((buretteVolume + stepAmount) * 100) / 100);
    setBuretteVolume(next);
    if (next >= ENDPOINT_VOLUME && !endpointReached) {
      setEndpointReached(true);
    }
    evaluateAtStop(next);
  };

  const handleSelectIndicator = (nextInd: IndicatorType) => {
    if (nextInd === indicator) return;
    analytics.recordSimulationClick(SIM_ID, 1);
    setIndicator(nextInd);
    setIsDripping(false);
    setBuretteVolume(0.0);
    setHasStarted(false);
    setEndpointReached(false);
    setStoppedAssessment('none');
  };

  const handleSwirl = () => {
    setIsSwirling(true);
    analytics.recordSimulationClick(SIM_ID, 1);
    setTimeout(() => setIsSwirling(false), 650);
  };

  const handleReset = () => {
    setIsDripping(false);
    setBuretteVolume(0.0);
    setHasStarted(false);
    setEndpointReached(false);
    setStoppedAssessment('none');
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  const handleSaveToTable = () => {
    if (buretteVolume <= 0 || records.length >= 4) return;
    const labels = ['Kasar', '1', '2', '3'];
    setRecords((prev) => [
      ...prev,
      {
        label: labels[prev.length] ?? String(prev.length + 1),
        initial: 0.0,
        final: buretteVolume,
        volume: buretteVolume,
        indicator,
      },
    ]);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  // Indicator color logic strictly following Jadual 6.5 (KSSM Tingkatan 4 m.s. 172)
  const getSolutionVisual = () => {
    if (indicator === 'fenolftalein') {
      if (buretteVolume < 24.5) {
        return {
          fill: '#ec4899',
          opacity: 0.72,
          colorName: 'Merah jambu',
          medium: 'Beralkali (lebihan OH⁻)',
        };
      }
      if (buretteVolume < 25.0) {
        return {
          fill: '#f9a8d4',
          opacity: 0.55,
          colorName: 'Merah jambu pudar (hampir takat akhir)',
          medium: 'Beralkali lemah',
        };
      }
      if (buretteVolume <= 25.05) {
        return {
          fill: '#e0f2fe',
          opacity: 0.45,
          colorName: 'Tidak berwarna',
          medium: 'Neutral — TAKAT AKHIR (H⁺ = OH⁻)',
        };
      }
      return {
        fill: '#e0f2fe',
        opacity: 0.45,
        colorName: 'Tidak berwarna (melebihi takat akhir)',
        medium: 'Berasid (lebihan H⁺)',
      };
    }

    // Metil jingga (Jadual 6.5: Alkali = Kuning, Neutral = Jingga, Asid = Merah)
    if (buretteVolume < 24.5) {
      return {
        fill: '#facc15',
        opacity: 0.78,
        colorName: 'Kuning',
        medium: 'Beralkali (lebihan OH⁻)',
      };
    }
    if (buretteVolume < 25.0) {
      return {
        fill: '#fbbf24',
        opacity: 0.82,
        colorName: 'Kuning ke jingga (hampir takat akhir)',
        medium: 'Beralkali lemah',
      };
    }
    if (buretteVolume <= 25.05) {
      return {
        fill: '#f97316',
        opacity: 0.85,
        colorName: 'Jingga',
        medium: 'Neutral — TAKAT AKHIR (H⁺ = OH⁻)',
      };
    }
    return {
      fill: '#ef4444',
      opacity: 0.82,
      colorName: 'Merah',
      medium: 'Berasid — Terlebih asid nitrik!',
    };
  };

  const solutionVisual = getSolutionVisual();

  // Burette geometry in SVG (0 cm³ at top y=48, 50 cm³ at bottom y=198 -> 3 px per cm³)
  const meniscusY = 48 + (buretteVolume / 50.0) * 150;
  const acidHeight = Math.max(0, 198 - meniscusY);

  // Flask liquid level rises slightly as acid enters (25 cm³ KOH -> 25..75 cm³ total)
  // Flask body bottom = 365, top of conical cone = 282
  const fillFraction = 0.34 + (buretteVolume / 50.0) * 0.34;
  const flaskLiquidTopY = 365 - fillFraction * 72;
  // Conical wall x-offset interpolates linearly from y=282 (halfWidth=14) to y=365 (halfWidth=52)
  const progressDownSlope = (flaskLiquidTopY - 282) / (365 - 282);
  const liquidTopHalfWidth = 14 + progressDownSlope * (52 - 14);
  const flaskCenterX = 278;

  const avgExactRecords = records.filter((r) => r.label !== 'Kasar');
  const averageVol =
    avgExactRecords.length > 0
      ? (avgExactRecords.reduce((s, r) => s + r.volume, 0) / avgExactRecords.length).toFixed(2)
      : null;

  return (
    <div className="space-y-5 text-slate-800">
      {/* Top Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
              <span>KSSM Tingkatan 4 • Bab 6: Asid, Bes dan Garam (Aktiviti 6.13)</span>
              <span className="px-2 py-0.5 bg-purple-100 rounded-full">Rajah 6.32 (m.s. 170–172)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Pentitratan Asid-Bes: Asid Nitrik ke dalam Larutan Kalium Hidroksida
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Pentitratan <strong className="text-purple-900">Asid nitrik, HNO₃ 1.0 mol dm⁻³ (1.0 M)</strong> daripada
              buret ke dalam kelalang kon berisi{' '}
              <strong className="text-purple-900">25.0 cm³ larutan KOH 1.0 mol dm⁻³ (1.0 M)</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => setShowFormula((v) => !v)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 flex items-center gap-1.5 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              {showFormula ? 'Tutup Formula' : 'Formula M₁V₁'}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 flex items-center gap-1.5 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Set Semula
            </button>
          </div>
        </div>
      </div>

      {/* Formula Panel */}
      {showFormula && (
        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-xs space-y-2.5 text-xs sm:text-sm">
          <div className="font-bold text-purple-900">Persamaan Kimia &amp; Pengiraan Stoikiometri Peneutralan (SP 6.7.3)</div>
          <div className="font-mono font-bold text-center py-2.5 px-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-950">
            HNO₃(ak) + KOH(ak) → KNO₃(ak) + H₂O(ce)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div><strong>Kemolaran Asid (Mₐ):</strong> {ACID_MOLARITY.toFixed(1)} mol dm⁻³ (1.0 M) HNO₃</div>
              <div><strong>Kemolaran Alkali (Mᵦ):</strong> {ALKALI_MOLARITY.toFixed(1)} mol dm⁻³ (1.0 M) KOH</div>
              <div><strong>Isi Padu Alkali (Vᵦ):</strong> {ALKALI_VOLUME.toFixed(1)} cm³</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="font-mono font-bold text-emerald-900">(Mₐ × Vₐ) / (Mᵦ × Vᵦ) = a / b = 1 / 1</div>
              <div className="mt-1 text-emerald-900">
                (1.0 × Vₐ) / (1.0 × 25.0) = 1 ➜ <strong>Vₐ (Takat Akhir) = 25.00 cm³</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: Rajah 6.32 Textbook SVG Diagram */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Susunan Radas Pentitratan (Rajah 6.32 Buku Teks T4)
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Penunjuk: {indicator === 'fenolftalein' ? 'Fenolftalein' : 'Metil jingga'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 overflow-hidden">
            <svg viewBox="0 0 600 430" className="w-full h-auto select-none">
              <defs>
                <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                  <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="standMetal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
              </defs>

              {/* Lab Bench Surface */}
              <rect x="20" y="392" width="560" height="14" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

              {/* RETORT STAND (Kaki retort) on the left - Base & Vertical Rod */}
              <rect x="85" y="378" width="135" height="14" rx="3" fill="#475569" stroke="#334155" strokeWidth="1.5" />
              <rect x="112" y="34" width="11" height="346" rx="3" fill="url(#standMetal)" stroke="#334155" strokeWidth="1.2" />
              {/* Retort Bosshead & Burette Clamp (Pengapit) */}
              <rect x="108" y="114" width="20" height="16" rx="2" fill="#334155" />
              <rect x="128" y="119" width="141" height="6" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1" />
              {/* Clamp Jaws holding the burette */}
              <rect x="263" y="114" width="30" height="16" rx="4" fill="none" stroke="#334155" strokeWidth="3.5" />

              {/* WHITE TILE (Jubin putih) directly under Conical Flask */}
              <polygon
                points="206,381 350,381 364,366 220,366"
                fill="#ffffff"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <rect x="206" y="381" width="144" height="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

              {/* CONICAL FLASK (Kelalang kon 250 cm³) sitting on White Tile */}
              <g
                onClick={handleSwirl}
                className="cursor-pointer"
                transform={isSwirling ? 'translate(4, 0) rotate(2 278 365)' : ''}
              >
                <title>Klik untuk goncang/pusarkan kelalang kon</title>

                {/* Liquid inside Conical Flask (KOH 1.0 M + Penunjuk) */}
                <path
                  d={`M ${flaskCenterX - liquidTopHalfWidth} ${flaskLiquidTopY}
                      L 226 365
                      Q 224 371 232 371
                      L 324 371
                      Q 332 371 330 365
                      L ${flaskCenterX + liquidTopHalfWidth} ${flaskLiquidTopY} Z`}
                  fill={solutionVisual.fill}
                  fillOpacity={solutionVisual.opacity}
                  className="transition-all duration-300"
                />
                {/* Meniscus/surface line inside flask */}
                <ellipse
                  cx={flaskCenterX}
                  cy={flaskLiquidTopY}
                  rx={liquidTopHalfWidth}
                  ry="3"
                  fill={solutionVisual.fill}
                  fillOpacity={Math.min(0.95, solutionVisual.opacity + 0.15)}
                  stroke="#64748b"
                  strokeOpacity="0.35"
                  strokeWidth="0.8"
                />

                {/* Glass outline of Conical Flask */}
                <path
                  d="M 264 252
                     L 264 282
                     L 223 364
                     Q 220 372 232 372
                     L 324 372
                     Q 336 372 333 364
                     L 292 282
                     L 292 252"
                  fill="url(#glassShine)"
                  fillOpacity="0.22"
                  stroke="#334155"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                {/* Flared rim of flask neck */}
                <ellipse cx="278" cy="252" rx="16" ry="3.2" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
              </g>

              {/* BURETTE (50.00 cm³) */}
              <g>
                {/* Burette tube outer */}
                <rect
                  x="269"
                  y="40"
                  width="18"
                  height="164"
                  rx="2"
                  fill="#ffffff"
                  fillOpacity="0.7"
                  stroke="#334155"
                  strokeWidth="2"
                />
                {/* Top flared opening */}
                <line x1="266" y1="40" x2="290" y2="40" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />

                {/* Acid (HNO₃ 1.0 M) column inside burette */}
                {acidHeight > 0 && (
                  <g>
                    <rect
                      x="270.5"
                      y={meniscusY}
                      width="15"
                      height={acidHeight}
                      fill="#7dd3fc"
                      fillOpacity="0.55"
                    />
                    {/* Concave meniscus line */}
                    <path
                      d={`M 270.5 ${meniscusY} Q 278 ${meniscusY + 3.5} 285.5 ${meniscusY}`}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="1.8"
                    />
                  </g>
                )}

                {/* Burette Scale Markings 0 to 50 from TOP to BOTTOM */}
                {[0, 10, 20, 30, 40, 50].map((val) => {
                  const yPos = 48 + (val / 50) * 150;
                  return (
                    <g key={val}>
                      <line x1="269" y1={yPos} x2="275" y2={yPos} stroke="#0f172a" strokeWidth="1.2" />
                      <text x="264" y={yPos + 3} textAnchor="end" fontSize="8.5" fontFamily="monospace" fill="#334155">
                        {val}
                      </text>
                      {/* Halfway minor ticks */}
                      {val < 50 && (
                        <line x1="269" y1={yPos + 15} x2="273" y2={yPos + 15} stroke="#64748b" strokeWidth="0.9" />
                      )}
                    </g>
                  );
                })}

                {/* Narrow neck down to stopcock */}
                <rect x="275" y="204" width="6" height="10" fill="#bae6fd" stroke="#334155" strokeWidth="1.5" />

                {/* Stopcock (Pili buret) - clickable */}
                <g onClick={handleToggleDrip} className="cursor-pointer">
                  <title>Klik pili buret untuk buka / tutup aliran HNO₃</title>
                  <rect x="273" y="214" width="10" height="10" rx="1.5" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
                  {/* Handle rotates: horizontal = closed, vertical = open */}
                  <rect
                    x={isDripping ? 276 : 267}
                    y={isDripping ? 210 : 217}
                    width={isDripping ? 4 : 22}
                    height={isDripping ? 18 : 4}
                    rx="1.5"
                    fill="#f59e0b"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                </g>

                {/* Tapered Burette Tip */}
                <path d="M 275.5 224 L 277 244 L 279 244 L 280.5 224 Z" fill="#e0f2fe" stroke="#334155" strokeWidth="1.3" />

                {/* Animated Falling Droplet when Dripping */}
                {isDripping && (
                  <path d="M 278 247 Q 281 253 278 256 Q 275 253 278 247 Z" fill="#0284c7">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,72"
                      dur={dripSpeed === 'slow' ? '0.45s' : '0.24s'}
                      repeatCount="indefinite"
                    />
                  </path>
                )}
              </g>

              {/* TEXTBOOK LABELS & LEADER LINES (Rajah 6.32 exact style) */}
              {/* Kaki retort */}
              <text x="40" y="96" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                Kaki retort
              </text>
              <line x1="96" y1="92" x2="112" y2="92" stroke="#334155" strokeWidth="1.2" />

              {/* Pengapit buret */}
              <text x="32" y="135" fill="#0f172a" fontSize="11" fontWeight="bold">
                Pengapit
              </text>
              <text x="32" y="148" fill="#0f172a" fontSize="11" fontWeight="bold">
                buret
              </text>
              <line x1="84" y1="138" x2="118" y2="124" stroke="#334155" strokeWidth="1.2" />

              {/* Buret */}
              <text x="320" y="54" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                Buret (50.00 cm³)
              </text>
              <line x1="288" y1="51" x2="316" y2="51" stroke="#334155" strokeWidth="1.2" />

              {/* Asid nitrik dalam buret */}
              <text x="320" y="138" fill="#0369a1" fontSize="11.5" fontWeight="bold">
                Asid nitrik, HNO₃
              </text>
              <text x="320" y="152" fill="#0369a1" fontSize="11" fontWeight="bold">
                1.0 mol dm⁻³ (1.0 M)
              </text>
              <line x1="288" y1="142" x2="316" y2="142" stroke="#0369a1" strokeWidth="1.2" />

              {/* Kelalang kon */}
              <text x="342" y="302" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                Kelalang kon (250 cm³)
              </text>
              <line x1="305" y1="299" x2="338" y2="299" stroke="#334155" strokeWidth="1.2" />

              {/* Larutan kalium hidroksida + penunjuk (left side as in Rajah 6.32) */}
              <text x="200" y="308" textAnchor="end" fill="#0f172a" fontSize="11" fontWeight="bold">
                25.0 cm³ larutan kalium
              </text>
              <text x="200" y="322" textAnchor="end" fill="#0f172a" fontSize="11" fontWeight="bold">
                hidroksida, KOH 1.0 M
              </text>
              <text x="200" y="336" textAnchor="end" fill="#7e22ce" fontSize="10.5" fontWeight="bold">
                + {indicator === 'fenolftalein' ? 'fenolftalein' : 'metil jingga'}
              </text>
              <line x1="205" y1="328" x2="255" y2="346" stroke="#334155" strokeWidth="1.2" />

              {/* Jubin putih */}
              <text x="380" y="376" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                Jubin putih
              </text>
              <line x1="355" y1="373" x2="376" y2="373" stroke="#334155" strokeWidth="1.2" />

              {/* Zoomed Meniscus Magnifier Card (Langkah Berjaga-jaga m.s. 171) */}
              <g transform="translate(442, 18)">
                <rect width="142" height="106" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="71" y="16" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">
                  PARAS MENISKUS (MATA SEGARIS)
                </text>
                {/* Magnified Tube */}
                <rect x="46" y="25" width="46" height="58" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
                {/* Water up to center */}
                <rect x="47" y="54" width="44" height="28" fill="#7dd3fc" fillOpacity="0.55" />
                {/* Concave Meniscus */}
                <path d="M 47 51 Q 69 59 91 51" fill="none" stroke="#0284c7" strokeWidth="2.2" />
                {/* Eye Level Dotted Line tangent to bottom of meniscus */}
                <line x1="30" y1="55" x2="112" y2="55" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
                {/* Eye icon */}
                <ellipse cx="20" cy="55" rx="7" ry="4" fill="none" stroke="#dc2626" strokeWidth="1.3" />
                <circle cx="20" cy="55" r="2" fill="#dc2626" />
                <text x="71" y="97" textAnchor="middle" fill="#0f172a" fontSize="11.5" fontFamily="monospace" fontWeight="bold">
                  {buretteVolume.toFixed(2)} cm³
                </text>
              </g>
            </svg>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              Petua: Klik kelalang kon untuk menggoncang, atau klik terus pili buret pada rajah.
            </span>
            <button
              onClick={handleSwirl}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold transition cursor-pointer"
            >
              Goncang Kelalang Kon
            </button>
          </div>
        </div>

        {/* RIGHT 5 COLS: Indicator Choice, Readouts & Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Indicator Choice (Fenolftalein vs Metil jingga) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              1. Pilih Penunjuk Asid-Bes (Jadual 6.5)
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSelectIndicator('fenolftalein')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  indicator === 'fenolftalein'
                    ? 'bg-pink-50 border-pink-500 ring-2 ring-pink-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900">Fenolftalein</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Merah jambu → <strong className="text-slate-900">Tidak berwarna</strong>
                </div>
              </button>

              <button
                onClick={() => handleSelectIndicator('metil-jingga')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  indicator === 'metil-jingga'
                    ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900">Metil Jingga</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Kuning → <strong className="text-orange-700">Jingga</strong> → Merah
                </div>
              </button>
            </div>
          </div>

          {/* 2. Readings: Live Burette Volume + Locked Endpoint Marker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Bacaan Isi Padu Asid HNO₃ (1.0 M)
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                Ketepatan ±0.05 cm³
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Live Continuous Burette Volume */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] font-semibold text-slate-500">Bacaan Buret Semasa</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 mt-0.5">
                  {buretteVolume.toFixed(2)} <span className="text-xs font-normal text-slate-500">cm³</span>
                </div>
              </div>

              {/* Locked/Marked Endpoint Volume when reached */}
              <div
                className={`p-3 border rounded-xl transition ${
                  endpointReached
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-slate-50 border-dashed border-slate-300'
                }`}
              >
                <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Rekod Takat Akhir
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-mono font-extrabold mt-0.5 ${
                    endpointReached ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {endpointReached ? '25.00' : '--.--'}{' '}
                  <span className="text-xs font-normal text-slate-500">cm³</span>
                </div>
              </div>
            </div>

            {/* Live Indicator & Endpoint Warning */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Warna Larutan:</span>
                <span className="font-bold text-slate-900">{solutionVisual.colorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Keadaan Medium:</span>
                <span
                  className={`font-bold ${
                    buretteVolume >= 24.9 && buretteVolume <= 25.1
                      ? 'text-emerald-700'
                      : buretteVolume > 25.1
                      ? 'text-red-600'
                      : 'text-purple-700'
                  }`}
                >
                  {solutionVisual.medium}
                </span>
              </div>
              {endpointReached && isDripping && (
                <div className="pt-1.5 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  Takat akhir (25.00 cm³) telah dicapai! Tekan &ldquo;Hentikan Pentitratan&rdquo; segera atau asid akan terus mengalir.
                </div>
              )}
            </div>
          </div>

          {/* 3. Titration Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">2. Kawalan Pili Buret</h4>

            <button
              onClick={handleToggleDrip}
              disabled={!isDripping && buretteVolume >= 50.0}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-40 ${
                isDripping
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isDripping ? (
                <>
                  <Square className="w-4 h-4" />
                  Hentikan Pentitratan (Tutup Pili Buret)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Buka Pili Buret (Titrat Asid HNO₃)
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddSingleDrop(0.05)}
                disabled={isDripping || buretteVolume >= 50.0}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                Titis 1 Titis (+0.05)
              </button>
              <button
                onClick={() => handleAddSingleDrop(0.5)}
                disabled={isDripping || buretteVolume >= 50.0}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5 text-indigo-600" />
                Alir Sedikit (+0.50)
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <span className="font-semibold text-slate-700">Kelajuan Aliran Buret:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setDripSpeed('slow')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    dripSpeed === 'slow' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Perlahan (0.10)
                </button>
                <button
                  onClick={() => setDripSpeed('fast')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    dripSpeed === 'fast' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Laju (0.50)
                </button>
              </div>
            </div>

            {/* Assessment Feedback after Stop */}
            {stoppedAssessment === 'exact' && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-emerald-950">
                  <div className="font-bold">Tepat pada Takat Akhir!</div>
                  <p>
                    Anda berjaya menghentikan pentitratan pada bacaan <strong>{buretteVolume.toFixed(2)} cm³</strong>{' '}
                    (sepadan dengan takat akhir teori <strong>25.00 cm³</strong>).
                  </p>
                </div>
              </div>
            )}

            {stoppedAssessment === 'early' && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-amber-950">
                  <div className="font-bold">Terlalu Awal ({buretteVolume.toFixed(2)} cm³)</div>
                  <p>
                    Larutan KOH masih belum dineutralkan sepenuhnya. Teruskan titisan sebanyak{' '}
                    <strong>{(ENDPOINT_VOLUME - buretteVolume).toFixed(2)} cm³</strong> lagi sehingga warna penunjuk bertukar.
                  </p>
                </div>
              </div>
            )}

            {stoppedAssessment === 'overshot' && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-red-950">
                  <div className="font-bold">Terlebih Titrat! ({buretteVolume.toFixed(2)} cm³)</div>
                  <p>
                    Anda tidak menghentikan pentitratan tepat pada takat akhir (<strong>25.00 cm³</strong>). Isi padu asid melebihi takat akhir sebanyak{' '}
                    <strong>+{(buretteVolume - ENDPOINT_VOLUME).toFixed(2)} cm³</strong>. Klik Set Semula untuk mencuba lagi.
                  </p>
                </div>
              </div>
            )}

            {!isDripping && buretteVolume > 0 && records.length < 4 && (
              <button
                onClick={handleSaveToTable}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Table2 className="w-3.5 h-3.5" />
                Rekod Bacaan ({buretteVolume.toFixed(2)} cm³) ke Jadual 6.4
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Reference: Jadual 6.4 (Records) & Jadual 6.5 (Indicator Colors) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Jadual 6.4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="font-bold text-slate-900 text-sm">Jadual 6.4: Rekod Pentitratan Anda</h4>
            {averageVol && (
              <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Purata (1–3): {averageVol} cm³
              </span>
            )}
          </div>
          {records.length === 0 ? (
            <p className="text-xs text-slate-500">
              Jalankan pentitratan dan klik &ldquo;Rekod Bacaan ke Jadual 6.4&rdquo; untuk mencatat bacaan Kasar, 1, 2, dan 3.
            </p>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2">Pentitratan</th>
                  <th className="p-2">Penunjuk</th>
                  <th className="p-2">Bacaan Awal</th>
                  <th className="p-2">Bacaan Akhir</th>
                  <th className="p-2">Isi Padu HNO₃</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="p-2 font-bold">{r.label}</td>
                    <td className="p-2">{r.indicator === 'fenolftalein' ? 'Fenolftalein' : 'Metil jingga'}</td>
                    <td className="p-2 font-mono">{r.initial.toFixed(2)}</td>
                    <td className="p-2 font-mono">{r.final.toFixed(2)}</td>
                    <td
                      className={`p-2 font-mono font-bold ${
                        r.volume >= 24.9 && r.volume <= 25.1 ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {r.volume.toFixed(2)} cm³
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Jadual 6.5 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-x-auto">
          <h4 className="font-bold text-slate-900 text-sm mb-2.5">
            Jadual 6.5: Warna Penunjuk (Buku Teks m.s. 172)
          </h4>
          <table className="w-full text-xs text-center border-collapse border border-slate-200">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="p-2 border border-teal-600 text-left">Penunjuk</th>
                <th className="p-2 border border-teal-600">Asid (V &gt; 25.00)</th>
                <th className="p-2 border border-teal-600">Neutral (25.00 cm³)</th>
                <th className="p-2 border border-teal-600">Alkali (V &lt; 25.00)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="p-2 border border-slate-200 font-bold text-left">Fenolftalein</td>
                <td className="p-2 border border-slate-200">Tidak berwarna</td>
                <td className="p-2 border border-slate-200 font-semibold text-sky-700">Tidak berwarna</td>
                <td className="p-2 border border-slate-200 font-semibold text-pink-600">Merah jambu</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-2 border border-slate-200 font-bold text-left">Metil jingga</td>
                <td className="p-2 border border-slate-200 font-semibold text-red-600">Merah</td>
                <td className="p-2 border border-slate-200 font-semibold text-orange-600">Jingga</td>
                <td className="p-2 border border-slate-200 font-semibold text-yellow-600">Kuning</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[11px] text-slate-500 mt-2">
            <strong>Perbincangan (m.s. 171):</strong> Jubin putih diletakkan di bawah kelalang kon supaya perubahan warna penunjuk pada takat akhir dapat diperhatikan dengan jelas.
          </p>
        </div>
      </div>
    </div>
  );
};
