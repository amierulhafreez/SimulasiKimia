import React, { useState, useEffect } from 'react';
import {
  Zap,
  Flame,
  AlertTriangle,
  Recycle,
  CheckCircle2,
  RotateCcw,
  Droplets,
  Info,
  HelpCircle,
} from 'lucide-react';
import { analytics } from '../services/analytics';

const SIM_ID = 'pengekstrakan-aluminium';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      'Apakah tujuan menambah kriolit (Na₃AlF₆) ke dalam leburan aluminium oksida (Al₂O₃) semasa pengekstrakan aluminium?',
    options: [
      'Bertindak sebagai mangkin untuk meningkatkan kelajuan pengaliran arus',
      'Menurunkan takat lebur aluminium oksida daripada 2000 °C kepada sekitar 950 °C',
      'Mengelakkan anod karbon daripada bertindak balas dengan gas oksigen',
      'Menjadikan ketumpatan aluminium lebih rendah supaya terapung di permukaan',
    ],
    correctIndex: 1,
    explanation:
      'Alumina (Al₂O₃) tulen mempunyai takat lebur yang sangat tinggi (~2000 °C). Penambahan kriolit (Na₃AlF₆) menurunkan takat lebur campuran kepada sekitar 950 °C bagi menjimatkan tenaga elektrik dan kos operasi.',
  },
  {
    id: 2,
    question:
      'Mengapakah elektrod anod daripada karbon perlu diganti dari semasa ke semasa? (Cabaran Minda KSSM)',
    options: [
      'Anod karbon larut ke dalam leburan kriolit',
      'Ion Al³⁺ memendap pada anod dan menyalutinya',
      'Gas oksigen yang terhasil di anod bertindak balas dengan karbon panas membentuk gas CO₂',
      'Suhu 950 °C meleburkan blok anod karbon secara langsung',
    ],
    correctIndex: 2,
    explanation:
      'Di anod (+), gas oksigen (O₂) terhasil (2O²⁻ → O₂ + 4e⁻). Pada suhu tinggi, oksigen mengoksidakan anod karbon (C + O₂ → CO₂), menyebabkan anod karbon terhakis dan perlu diganti.',
  },
  {
    id: 3,
    question: 'Manakah persamaan setengah yang betul berlaku di katod (-) semasa proses ini?',
    options: [
      'Al³⁺(ce) + 3e⁻ → Al(ce)',
      '2O²⁻(ce) → O₂(g) + 4e⁻',
      'Al(ce) → Al³⁺(ce) + 3e⁻',
      'O₂(g) + 4e⁻ → 2O²⁻(ce)',
    ],
    correctIndex: 0,
    explanation:
      'Ion aluminium bercas positif (Al³⁺) tertarik ke katod karbon (-) yang melapisi bekas sel dan mengalami penurunan dengan menerima 3 elektron untuk membentuk leburan aluminium tulen.',
  },
];

export const AluminumExtractionLab: React.FC = () => {
  const [hasCryolite, setHasCryolite] = useState(true);
  const [powerOn, setPowerOn] = useState(false);
  const [elapsedCycles, setElapsedCycles] = useState(0); // 0 to 100
  const [tapOpen, setTapOpen] = useState(false);
  const [collectedAluminum, setCollectedAluminum] = useState(0);
  const [activeTab, setActiveTab] = useState<'simulasi' | 'persamaan' | 'alam' | 'kuiz'>('simulasi');

  // Quiz state
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const operatingTemp = hasCryolite ? 950 : 2000;
  // Electrolysis can proceed cleanly with cryolite (in practice ~950°C); without cryolite we show warning that 2000°C is needed (or extreme energy cost)
  const isMolten = hasCryolite || elapsedCycles > 0;
  const anodeWearPercent = Math.min(75, Math.round(elapsedCycles * 0.75));
  const moltenAlLevel = Math.max(0, Math.min(100, elapsedCycles * 0.9 - collectedAluminum * 0.8));

  useEffect(() => {
    if (!powerOn) return;
    const interval = setInterval(() => {
      setElapsedCycles((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 350);
    return () => clearInterval(interval);
  }, [powerOn]);

  useEffect(() => {
    if (!tapOpen || moltenAlLevel <= 5) return;
    const drain = setInterval(() => {
      setCollectedAluminum((prev) => Math.min(100, prev + 4));
    }, 250);
    return () => clearInterval(drain);
  }, [tapOpen, moltenAlLevel]);

  const handleTogglePower = () => {
    const next = !powerOn;
    setPowerOn(next);
    if (next) {
      analytics.recordSimulationClick(SIM_ID);
    }
  };

  const handleToggleCryolite = () => {
    setHasCryolite((prev) => !prev);
    analytics.recordSimulationClick(SIM_ID);
  };

  const handleReplaceAnode = () => {
    setElapsedCycles(0);
    setTapOpen(false);
    setCollectedAluminum(0);
    analytics.recordSimulationClick(SIM_ID);
  };

  const handleReset = () => {
    setPowerOn(false);
    setHasCryolite(true);
    setElapsedCycles(0);
    setTapOpen(false);
    setCollectedAluminum(0);
    setAnswers({});
    setQuizSubmitted(false);
  };

  const handleAnswerSelect = (qId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    analytics.recordSimulationClick(SIM_ID);
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const score = QUIZ_QUESTIONS.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    if (score >= 2) {
      analytics.recordSimulationCompleted(SIM_ID);
    }
  };

  const quizScore = QUIZ_QUESTIONS.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  // Anode shrink visual factor
  const anodeCorrosionPx = (anodeWearPercent / 100) * 28;

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border border-indigo-200 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              <span>KSSM Tingkatan 5 • Bab 1: Keseimbangan Redoks (1.5)</span>
              <span className="px-2 py-0.5 bg-indigo-100 rounded-full">Rajah 1.37 (m.s. 48–49)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Pengekstrakan Aluminium daripada Bauksit (Al₂O₃) secara Elektrolisis
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Aluminium lebih reaktif daripada karbon dalam Siri Kereaktifan Logam, maka diekstrak melalui{' '}
              <strong className="text-slate-800">elektrolisis leburan alumina (Al₂O₃)</strong> bersama{' '}
              <strong className="text-slate-800">kriolit (Na₃AlF₆)</strong>.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="self-start md:self-center inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 shadow-sm transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Set Semula
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'simulasi', label: '1. Radas & Elektrolisis (Rajah 1.37)' },
          { id: 'persamaan', label: '2. Persamaan Setengah & Cabaran Minda' },
          { id: 'alam', label: '3. Bauksit, Enap Cemar & Kitar Semula' },
          { id: 'kuiz', label: '4. Uji Kefahaman KSSM' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as typeof activeTab);
              analytics.recordSimulationClick(SIM_ID);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SIMULATION */}
      {activeTab === 'simulasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Rajah 1.37 SVG */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Susunan Sel Elektrolisis Industri (Rajah 1.37)
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    hasCryolite
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Suhu Operasi: {operatingTemp} °C
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    powerOn
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  {powerOn ? 'Arus Mengalir (DC)' : 'Suis Dimatikan'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 overflow-hidden">
              <svg viewBox="0 0 640 430" className="w-full h-auto select-none">
                <defs>
                  <linearGradient id="moltenElectrolyte" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={hasCryolite ? '#fb923c' : '#ef4444'} stopOpacity="0.88" />
                    <stop offset="100%" stopColor={hasCryolite ? '#ea580c' : '#b91c1c'} stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="moltenAl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                  <linearGradient id="steelShell" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                </defs>

                {/* DC Power Supply Box at top left */}
                <rect x="30" y="18" width="120" height="46" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
                <text x="90" y="38" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                  BEKALAN KUASA DC
                </text>
                <text
                  x="90"
                  y="54"
                  textAnchor="middle"
                  fill={powerOn ? '#4ade80' : '#94a3b8'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {powerOn ? 'HIDUP (ON)' : 'MATI (OFF)'}
                </text>

                {/* Positive Wire (+) to Anode Busbar */}
                <path
                  d="M 150 32 L 455 32"
                  fill="none"
                  stroke={powerOn ? '#ef4444' : '#94a3b8'}
                  strokeWidth="4"
                />
                <circle cx="168" cy="32" r="9" fill="#ef4444" />
                <text x="168" y="36" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                  +
                </text>

                {/* Negative Wire (-) to Carbon Cathode Lining */}
                <path
                  d="M 30 48 L 16 48 L 16 320 L 62 320"
                  fill="none"
                  stroke={powerOn ? '#2563eb' : '#94a3b8'}
                  strokeWidth="4"
                />
                <circle cx="16" cy="180" r="9" fill="#2563eb" />
                <text x="16" y="184" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                  −
                </text>

                {/* Outer Steel Shell (Lapisan keluli) */}
                <path
                  d="M 60 130 L 60 365 L 545 365 L 545 335 L 575 335 L 575 315 L 545 315 L 545 130 L 520 130 L 520 342 L 85 342 L 85 130 Z"
                  fill="url(#steelShell)"
                  stroke="#1e293b"
                  strokeWidth="2"
                />

                {/* Inner Carbon Cathode Lining (Katod daripada karbon) */}
                <path
                  d="M 85 135 L 85 342 L 520 342 L 520 135 L 495 135 L 495 318 L 110 318 L 110 135 Z"
                  fill="#1e293b"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />

                {/* Right Drain Cutaway in Cathode & Steel for Tap Hole */}
                <rect x="495" y="294" width="80" height="22" fill="#e2e8f0" stroke="#334155" strokeWidth="1.5" />

                {/* Molten Electrolyte (Leburan campuran Al2O3 dan kriolit) */}
                <rect x="110" y="168" width="385" height="150" fill="url(#moltenElectrolyte)" />

                {/* Molten Aluminum Layer at Bottom (Leburan aluminium) */}
                {moltenAlLevel > 0 && (
                  <rect
                    x="110"
                    y={318 - Math.max(14, (moltenAlLevel / 100) * 34)}
                    width="385"
                    height={Math.max(14, (moltenAlLevel / 100) * 34)}
                    fill="url(#moltenAl)"
                  />
                )}

                {/* Crust / Surface bubbles */}
                <line x1="110" y1="168" x2="495" y2="168" stroke="#fed7aa" strokeWidth="3" strokeDasharray="6 4" />

                {/* 3 Carbon Anode Rods & Blocks (Anod daripada karbon) */}
                {[175, 295, 415].map((cx, idx) => (
                  <g key={idx}>
                    {/* Copper clamp/rod */}
                    <rect x={cx - 6} y="32" width="12" height="72" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                    {/* Carbon Anode Block - shrinks at bottom as corroded */}
                    <rect
                      x={cx - 34 + anodeCorrosionPx * 0.25}
                      y="102"
                      width={68 - anodeCorrosionPx * 0.5}
                      height={118 - anodeCorrosionPx}
                      rx="4"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="2"
                    />
                    <text x={cx} y="138" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                      +
                    </text>

                    {/* O2 & CO2 Bubbles when Power On */}
                    {powerOn && (
                      <g>
                        <circle cx={cx - 38} cy="195" r="4.5" fill="#fef08a" opacity="0.9">
                          <animate attributeName="cy" values="205;150" dur="1.4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0" dur="1.4s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={cx + 38} cy="185" r="4" fill="#e0f2fe" opacity="0.9">
                          <animate attributeName="cy" values="198;145" dur="1.1s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0" dur="1.1s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    )}
                  </g>
                ))}

                {/* Moving Ions inside Electrolyte when Power On */}
                {powerOn && (
                  <g>
                    {/* Al3+ ions moving down toward Carbon Cathode */}
                    {[145, 240, 355, 455].map((ix, i) => (
                      <g key={`al-${i}`}>
                        <circle cx={ix} cy="245" r="11" fill="#eff6ff" stroke="#1d4ed8" strokeWidth="1.5">
                          <animate
                            attributeName="cy"
                            values="230;282;230"
                            dur={`${2.2 + i * 0.3}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                        <text x={ix} y="249" textAnchor="middle" fill="#1e3a8a" fontSize="9" fontWeight="bold">
                          Al³⁺
                          <animate
                            attributeName="y"
                            values="234;286;234"
                            dur={`${2.2 + i * 0.3}s`}
                            repeatCount="indefinite"
                          />
                        </text>
                      </g>
                    ))}

                    {/* O2- ions moving up toward Carbon Anodes */}
                    {[210, 330, 445].map((ox, i) => (
                      <g key={`o-${i}`}>
                        <circle cx={ox} cy="235" r="11" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5">
                          <animate
                            attributeName="cy"
                            values="255;205;255"
                            dur={`${2.0 + i * 0.25}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                        <text x={ox} y="239" textAnchor="middle" fill="#991b1b" fontSize="9" fontWeight="bold">
                          O²⁻
                          <animate
                            attributeName="y"
                            values="259;209;259"
                            dur={`${2.0 + i * 0.25}s`}
                            repeatCount="indefinite"
                          />
                        </text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Molten Aluminum Flowing Out + Collection Ladle/Container */}
                {tapOpen && moltenAlLevel > 5 && (
                  <path
                    d="M 575 300 Q 595 302 595 352"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                )}
                {/* Plug/Stopper when tap is closed */}
                {!tapOpen && <rect x="568" y="294" width="10" height="22" fill="#475569" rx="2" />}

                {/* Collection Container */}
                <path d="M 562 348 L 570 398 L 620 398 L 628 348 Z" fill="#475569" stroke="#1e293b" strokeWidth="2" />
                {collectedAluminum > 0 && (
                  <rect
                    x="571"
                    y={396 - (collectedAluminum / 100) * 38}
                    width="48"
                    height={(collectedAluminum / 100) * 38}
                    fill="#cbd5e1"
                  />
                )}

                {/* KSSM Rajah 1.37 Labels & Leader Lines */}
                {/* Anod daripada karbon */}
                <text x="530" y="74" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                  Anod daripada karbon (+)
                </text>
                <line x1="525" y1="70" x2="438" y2="112" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 2" />

                {/* Lapisan keluli */}
                <text x="20" y="230" fill="#0f172a" fontSize="11" fontWeight="bold">
                  Lapisan
                </text>
                <text x="20" y="243" fill="#0f172a" fontSize="11" fontWeight="bold">
                  keluli
                </text>
                <line x1="56" y1="235" x2="72" y2="235" stroke="#334155" strokeWidth="1.2" />

                {/* Katod daripada karbon */}
                <text x="125" y="390" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                  Katod daripada karbon (−)
                </text>
                <line x1="205" y1="376" x2="205" y2="332" stroke="#334155" strokeWidth="1.2" />

                {/* Leburan campuran Al2O3 + kriolit */}
                <text x="515" y="182" fill="#9a3412" fontSize="11" fontWeight="bold">
                  Leburan campuran
                </text>
                <text x="515" y="196" fill="#9a3412" fontSize="11" fontWeight="bold">
                  Al₂O₃ dan kriolit
                </text>
                <text x="515" y="210" fill="#9a3412" fontSize="10.5">
                  ({hasCryolite ? '≈ 950 °C' : '2000 °C diperlukan'})
                </text>
                <line x1="510" y1="188" x2="470" y2="210" stroke="#9a3412" strokeWidth="1.2" />

                {/* Leburan aluminium */}
                <text x="345" y="390" fill="#334155" fontSize="11.5" fontWeight="bold">
                  Leburan aluminium (Al)
                </text>
                <line x1="395" y1="376" x2="395" y2="310" stroke="#475569" strokeWidth="1.2" />

                {/* Leburan aluminium mengalir keluar */}
                <text x="515" y="266" fill="#0f172a" fontSize="11" fontWeight="bold">
                  Leburan aluminium
                </text>
                <text x="515" y="280" fill="#0f172a" fontSize="11" fontWeight="bold">
                  mengalir keluar
                </text>

                {/* Gas O2 / CO2 label when power is ON */}
                {powerOn && (
                  <text x="295" y="88" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="bold">
                    ↑ Gas O₂ terhasil → bertindak balas dengan C membentuk CO₂ ↑
                  </text>
                )}
              </svg>
            </div>
          </div>

          {/* Right 5 cols: Controls & Live Readings */}
          <div className="lg:col-span-5 space-y-4">
            {/* Control Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                Kawalan Sel Elektrolisis
              </h4>

              {/* Cryolite Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    Campuran Kriolit (Na₃AlF₆)
                  </span>
                  <button
                    onClick={handleToggleCryolite}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      hasCryolite
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {hasCryolite ? 'Ditambah (950 °C)' : 'Tanpa Kriolit (2000 °C)'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {hasCryolite
                    ? 'Kriolit menurunkan takat lebur aluminium oksida daripada 2000 °C kepada sekitar 950 °C — menjimatkan tenaga elektrik dan kos!'
                    : 'Tanpa kriolit, alumina (Al₂O₃) tulen memerlukan suhu sangat tinggi (2000 °C) untuk melebur, menyebabkan penggunaan tenaga elektrik yang terlalu mahal.'}
                </p>
              </div>

              {/* DC Power Button */}
              <button
                onClick={handleTogglePower}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                  powerOn
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                {powerOn ? 'Matikan Bekalan Kuasa DC' : 'Hidupkan Bekalan Kuasa DC'}
              </button>

              {/* Tap Valve & Anode Replacement */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setTapOpen((prev) => !prev);
                    analytics.recordSimulationClick(SIM_ID);
                  }}
                  disabled={moltenAlLevel <= 5}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    tapOpen
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  {tapOpen ? 'Tutup Salur Keluar' : 'Keluarkan Leburan Al'}
                </button>

                <button
                  onClick={handleReplaceAnode}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Ganti Anod Karbon
                </button>
              </div>
            </div>

            {/* Live Status & Observations */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Pemerhatian Semasa</h4>

              {/* Anode Wear Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Kakisan Anod Karbon (C + O₂ → CO₂)</span>
                  <span className={anodeWearPercent > 50 ? 'text-red-600' : 'text-slate-800'}>
                    {anodeWearPercent}% terhakis
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      anodeWearPercent > 50 ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${anodeWearPercent}%` }}
                  />
                </div>
                {anodeWearPercent >= 50 && (
                  <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Anod karbon semakin menipis! Perlu diganti dari semasa ke semasa.
                  </p>
                )}
              </div>

              {/* Molten Al readout */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Leburan Al di Dasar</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{Math.round(moltenAlLevel)}%</div>
                  <div className="text-[11px] text-slate-500">Lebih tumpat daripada elektrolit</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Hasil Al Dikumpul</div>
                  <div className="text-lg font-bold text-indigo-700 mt-0.5">{Math.round(collectedAluminum)}%</div>
                  <div className="text-[11px] text-slate-500">Logam aluminium tulen</div>
                </div>
              </div>

              {isMolten && powerOn ? (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1">
                  <p>
                    <strong>Anod (+):</strong> Ion O²⁻ menyahcas membebaskan gelembung gas O₂ yang mengoksidakan karbon menjadi CO₂.
                  </p>
                  <p>
                    <strong>Katod (−):</strong> Ion Al³⁺ menerima elektron membentuk leburan logam aluminium berkilat di dasar bekas.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  Klik <strong>Hidupkan Bekalan Kuasa DC</strong> untuk memulakan pergerakan ion Al³⁺ dan O²⁻.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EQUATIONS */}
      {activeTab === 'persamaan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
              Elektrod Positif: Anod Karbon (+)
            </div>
            <h4 className="font-bold text-slate-900">Tindak Balas Pengoksidaan</h4>
            <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 font-mono text-base font-bold text-red-900 text-center">
              2O²⁻(ce) → O₂(g) + 4e⁻
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ion oksida (<strong className="text-slate-800">O²⁻</strong>) bergerak ke blok anod karbon, melepaskan 4 elektron
              (mengalami <strong className="text-slate-800">pengoksidaan</strong>) untuk menghasilkan gas oksigen (<strong className="text-slate-800">O₂</strong>).
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> Cabaran Minda (Buku Teks m.s. 49):
              </div>
              <p>
                Pada suhu ~950 °C, gas O₂ bertindak balas dengan anod karbon:
              </p>
              <p className="font-mono font-bold text-center py-1">C(p) + O₂(g) → CO₂(g)</p>
              <p>Akibatnya, anod karbon terhakis dan perlu diganti dari semasa ke semasa.</p>
            </div>
          </div>

          <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              Elektrod Negatif: Katod Karbon (−)
            </div>
            <h4 className="font-bold text-slate-900">Tindak Balas Penurunan</h4>
            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 font-mono text-base font-bold text-blue-900 text-center">
              Al³⁺(ce) + 3e⁻ → Al(ce)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ion aluminium (<strong className="text-slate-800">Al³⁺</strong>) bergerak ke katod karbon yang melapisi bekas sel dan menerima
              3 elektron (mengalami <strong className="text-slate-800">penurunan</strong>) membentuk leburan logam aluminium.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900">Persamaan Kimia Keseluruhan:</div>
              <p className="font-mono font-bold text-center text-sm text-indigo-800 py-1">
                2Al₂O₃(ce) → 4Al(ce) + 3O₂(g)
              </p>
              <p>
                Leburan aluminium mempunyai ketumpatan yang lebih tinggi berbanding leburan kriolit-alumina, jadi ia tenggelam di dasar dan disalurkan keluar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENVIRONMENTAL IMPACT & RECYCLING */}
      {activeTab === 'alam' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Kesan Pengekstrakan Aluminium daripada Bauksit
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-700 list-disc pl-5">
              <li>
                <strong>Penulenan bauksit kepada alumina (Al₂O₃)</strong> menghasilkan sisa berbahaya iaitu{' '}
                <strong className="text-red-700">enap cemar merah (red sludge)</strong> yang sangat beralkali dan bertoksik serta boleh mencemari sumber air dan tanah.
              </li>
              <li>
                <strong>Penggunaan tenaga elektrik yang amat tinggi</strong> selalunya datang daripada pembakaran bahan api fosil, yang membebaskan gas rumah hijau.
              </li>
              <li>
                <strong>Pembebasan gas karbon dioksida (CO₂)</strong> daripada hakisan anod karbon menyumbang kepada pemanasan global.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Recycle className="w-5 h-5 text-emerald-600" />
              Kepentingan Mengitar Semula Aluminium (KSSM m.s. 48)
            </h4>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <div className="text-3xl font-extrabold text-emerald-700">95% Penjimatan Tenaga</div>
              <p className="text-xs text-emerald-800 mt-1">
                Mengitar semula aluminium hanya memerlukan sekitar 5% tenaga berbanding mengekstraknya daripada bauksit!
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Mengurangkan perlombongan bauksit dan penghasilan enap cemar merah toksik.</li>
              <li>Memelihara sumber semula jadi untuk generasi akan datang dan mengurangkan pencemaran udara/air.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: QUIZ */}
      {activeTab === 'kuiz' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Uji Kefahaman Pengekstrakan Aluminium</h4>
            {quizSubmitted && (
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                Skor: {quizScore} / {QUIZ_QUESTIONS.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, qIdx) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <p className="text-sm font-semibold text-slate-900">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === oIdx;
                    const isCorrect = oIdx === q.correctIndex;
                    let optionClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                    if (quizSubmitted) {
                      if (isCorrect) optionClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                      else if (isSelected) optionClass = 'bg-red-50 border-red-400 text-red-900';
                    } else if (isSelected) {
                      optionClass = 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswerSelect(q.id, oIdx)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${optionClass}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong>Penerangan:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl transition cursor-pointer disabled:cursor-not-allowed"
            >
              Semak Jawapan
            </button>
          ) : (
            <button
              onClick={() => {
                setAnswers({});
                setQuizSubmitted(false);
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition cursor-pointer"
            >
              Cuba Semula
            </button>
          )}
        </div>
      )}
    </div>
  );
};
