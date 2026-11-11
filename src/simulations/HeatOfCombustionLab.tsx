import React, { useState, useEffect } from 'react';
import {
  Flame,
  Thermometer,
  Scale,
  RotateCcw,
  Wind,
  Calculator,
  LineChart,
  CheckCircle2,
  BookOpen,
  Play,
  Square,
} from 'lucide-react';
import { analytics } from '../services/analytics';

const SIM_ID = 'haba-pembakaran';

type AlcoholKey = 'metanol' | 'etanol' | 'propanol' | 'butanol';

interface AlcoholSpec {
  id: AlcoholKey;
  name: string;
  formula: string;
  carbons: number;
  molarMass: number;
  theoryDeltaH: number; // kJ/mol (magnitude)
  initialLampMass: number; // g
  flameColorInner: string;
  flameColorOuter: string;
  sootLevel: 'Tiada / Sangat sedikit' | 'Sedikit jelaga' | 'Banyak jelaga hitam' | 'Sangat berjelaga hitam';
  sootOpacity: number;
  equation: string;
}

const ALCOHOLS: Record<AlcoholKey, AlcoholSpec> = {
  metanol: {
    id: 'metanol',
    name: 'Metanol',
    formula: 'CH₃OH',
    carbons: 1,
    molarMass: 32,
    theoryDeltaH: 725,
    initialLampMass: 148.0,
    flameColorInner: '#93c5fd',
    flameColorOuter: '#3b82f6',
    sootLevel: 'Tiada / Sangat sedikit',
    sootOpacity: 0.08,
    equation: 'CH₃OH(ce) + ³/₂O₂(g) → CO₂(g) + 2H₂O(ce)',
  },
  etanol: {
    id: 'etanol',
    name: 'Etanol',
    formula: 'C₂H₅OH',
    carbons: 2,
    molarMass: 46,
    theoryDeltaH: 1376,
    initialLampMass: 150.0,
    flameColorInner: '#bfdbfe',
    flameColorOuter: '#f59e0b',
    sootLevel: 'Sedikit jelaga',
    sootOpacity: 0.3,
    equation: 'C₂H₅OH(ce) + 3O₂(g) → 2CO₂(g) + 3H₂O(ce)',
  },
  propanol: {
    id: 'propanol',
    name: 'Propanol',
    formula: 'C₃H₇OH',
    carbons: 3,
    molarMass: 60,
    theoryDeltaH: 2020,
    initialLampMass: 152.0,
    flameColorInner: '#fde047',
    flameColorOuter: '#ea580c',
    sootLevel: 'Banyak jelaga hitam',
    sootOpacity: 0.6,
    equation: 'C₃H₇OH(ce) + ⁹/₂O₂(g) → 3CO₂(g) + 4H₂O(ce)',
  },
  butanol: {
    id: 'butanol',
    name: 'Butanol',
    formula: 'C₄H₉OH',
    carbons: 4,
    molarMass: 74,
    theoryDeltaH: 2675,
    initialLampMass: 154.0,
    flameColorInner: '#fef08a',
    flameColorOuter: '#dc2626',
    sootLevel: 'Sangat berjelaga hitam',
    sootOpacity: 0.85,
    equation: 'C₄H₉OH(ce) + 6O₂(g) → 4CO₂(g) + 5H₂O(ce)',
  },
};

interface RecordedResult {
  alcoholId: AlcoholKey;
  name: string;
  formula: string;
  carbons: number;
  m1: number;
  m2: number;
  massBurned: number;
  moles: number;
  deltaH: number;
  withWindshield: boolean;
}

const INITIAL_WATER_TEMP = 29.0;
const TARGET_TEMP_RISE = 30.0; // Textbook Eksperimen 3B step 8: kenaikan suhu 30 °C
const TARGET_FINAL_TEMP = INITIAL_WATER_TEMP + TARGET_TEMP_RISE; // 59.0 °C
const WATER_MASS = 200; // 200 cm³ air = 200 g
const SPECIFIC_HEAT = 4.2; // J g⁻¹ °C⁻¹
const Q_KJ = (WATER_MASS * SPECIFIC_HEAT * TARGET_TEMP_RISE) / 1000; // 25.2 kJ

export const HeatOfCombustionLab: React.FC = () => {
  const [selectedAlcohol, setSelectedAlcohol] = useState<AlcoholKey>('etanol');
  const [withWindshield, setWithWindshield] = useState(true);
  const [isBurning, setIsBurning] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isStirring, setIsStirring] = useState(true);
  const [records, setRecords] = useState<Partial<Record<AlcoholKey, RecordedResult>>>({});
  const [activeTab, setActiveTab] = useState<'eksperimen' | 'pengiraan' | 'graf' | 'perbincangan'>('eksperimen');

  const alcohol = ALCOHOLS[selectedAlcohol];

  // With windshield -> matches textbook reference values closely (~96% efficiency / textbook standard);
  // Without windshield -> significant heat lost to surroundings (~65% efficiency -> lower experimental ΔH)
  const efficiencyFactor = withWindshield ? 1.0 : 0.65;
  const effectiveDeltaH = Math.round(alcohol.theoryDeltaH * efficiencyFactor);
  const totalExpectedMassBurned = (Q_KJ / effectiveDeltaH) * alcohol.molarMass;

  const currentTemp = Number(
    (INITIAL_WATER_TEMP + (progress / 100) * TARGET_TEMP_RISE).toFixed(1)
  );
  const currentMassBurned = (progress / 100) * totalExpectedMassBurned;
  const currentLampMass = Number((alcohol.initialLampMass - currentMassBurned).toFixed(2));
  const isFinished = progress >= 100;

  useEffect(() => {
    if (!isBurning) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsBurning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [isBurning]);

  // Auto-record when heating hits +30 °C
  useEffect(() => {
    if (progress === 100) {
      const m1 = alcohol.initialLampMass;
      const m2 = Number((m1 - totalExpectedMassBurned).toFixed(2));
      const massBurned = Number((m1 - m2).toFixed(2));
      const moles = massBurned / alcohol.molarMass;
      const deltaH = Math.round(Q_KJ / moles);

      setRecords((prev) => {
        const updated: Partial<Record<AlcoholKey, RecordedResult>> = {
          ...prev,
          [selectedAlcohol]: {
            alcoholId: selectedAlcohol,
            name: alcohol.name,
            formula: alcohol.formula,
            carbons: alcohol.carbons,
            m1,
            m2,
            massBurned,
            moles,
            deltaH,
            withWindshield,
          },
        };
        if (Object.keys(updated).length >= 3) {
          analytics.recordSimulationCompleted(SIM_ID);
        }
        return updated;
      });
    }
  }, [progress, selectedAlcohol, alcohol, totalExpectedMassBurned, withWindshield]);

  const handleSelectAlcohol = (id: AlcoholKey) => {
    setSelectedAlcohol(id);
    setIsBurning(false);
    setProgress(0);
    analytics.recordSimulationClick(SIM_ID);
  };

  const handleStartStop = () => {
    if (isFinished) {
      setProgress(0);
      setIsBurning(true);
    } else {
      setIsBurning((prev) => !prev);
    }
    analytics.recordSimulationClick(SIM_ID);
  };

  const handleResetAll = () => {
    setIsBurning(false);
    setProgress(0);
    setRecords({});
    setWithWindshield(true);
    setSelectedAlcohol('etanol');
  };

  const recordedList = (['metanol', 'etanol', 'propanol', 'butanol'] as AlcoholKey[])
    .map((k) => records[k])
    .filter((r): r is RecordedResult => Boolean(r));

  return (
    <div className="space-y-6 text-slate-800">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border border-orange-200 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">
              <span>KSSM Tingkatan 5 • Bab 3: Termokimia (Eksperimen 3B)</span>
              <span className="px-2 py-0.5 bg-orange-100 rounded-full">Rajah 3.13 &amp; 3.14 (m.s. 133–135)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Menentukan Haba Pembakaran Pelbagai Alkohol (Metanol, Etanol, Propanol &amp; Butanol)
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Membandingkan haba pembakaran apabila 1 mol alkohol terbakar lengkap dalam oksigen berlebihan
              untuk memanaskan <strong className="text-slate-800">200 cm³ air</strong> sebanyak{' '}
              <strong className="text-slate-800">30.0 °C</strong>.
            </p>
          </div>
          <button
            onClick={handleResetAll}
            className="self-start md:self-center inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 shadow-sm transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Set Semula Semua
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'eksperimen', label: '1. Radas & Eksperimen 3B (Rajah 3.13)' },
          { id: 'pengiraan', label: '2. Langkah Pengiraan ΔH' },
          { id: 'graf', label: `3. Jadual & Graf Rajah 3.14 (${recordedList.length}/4)` },
          { id: 'perbincangan', label: '4. Perbincangan Buku Teks' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id as typeof activeTab);
              analytics.recordSimulationClick(SIM_ID);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === t.id
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXPERIMENT */}
      {activeTab === 'eksperimen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Rajah 3.13 Exact Textbook SVG */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Susunan Radas Eksperimen 3B (Rajah 3.13)
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                {alcohol.name} ({alcohol.formula})
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 overflow-hidden">
              <svg viewBox="0 0 620 420" className="w-full h-auto select-none">
                {/* Lab Bench */}
                <rect x="20" y="388" width="580" height="14" rx="4" fill="#94a3b8" />

                {/* Left & Right Windshields (Pengadang angin) */}
                {withWindshield && (
                  <g>
                    <rect x="135" y="135" width="12" height="253" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                    <rect x="405" y="135" width="12" height="253" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                    <text x="80" y="218" textAnchor="end" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                      Pengadang
                    </text>
                    <text x="80" y="232" textAnchor="end" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                      angin
                    </text>
                    <line x1="86" y1="223" x2="135" y2="223" stroke="#334155" strokeWidth="1.2" />

                    <text x="455" y="218" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                      Pengadang
                    </text>
                    <text x="455" y="232" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                      angin
                    </text>
                    <line x1="417" y1="223" x2="450" y2="223" stroke="#334155" strokeWidth="1.2" />
                  </g>
                )}

                {/* Tripod Stand (Tungku kaki tiga) */}
                <rect x="190" y="220" width="172" height="8" rx="2" fill="#334155" />
                <line x1="202" y1="228" x2="176" y2="388" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
                <line x1="350" y1="228" x2="376" y2="388" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
                <line x1="276" y1="228" x2="276" y2="388" stroke="#475569" strokeWidth="5" strokeLinecap="round" opacity="0.55" />

                {/* Pipe-clay Triangle (Segi tiga tanah liat) resting on tripod */}
                <rect x="198" y="213" width="156" height="7" rx="2" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
                <circle cx="215" cy="216.5" r="3" fill="#cbd5e1" />
                <circle cx="337" cy="216.5" r="3" fill="#cbd5e1" />

                {/* Copper Can (Bekas kuprum) */}
                <path
                  d="M 218 118 L 218 210 Q 218 214 224 214 L 328 214 Q 334 214 334 210 L 334 118"
                  fill="#fb923c"
                  fillOpacity="0.25"
                  stroke="#b45309"
                  strokeWidth="3.5"
                />
                {/* Water 200 cm³ inside copper can */}
                <rect x="220" y="145" width="112" height="67" fill="#38bdf8" fillOpacity="0.55" />
                {/* Water surface ripples */}
                <path
                  d="M 220 145 Q 248 142 276 145 T 332 145"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                />

                {/* Heat Convection / Bubbling when burning */}
                {isBurning && (
                  <g>
                    <circle cx="250" cy="198" r="3" fill="#ffffff" opacity="0.7">
                      <animate attributeName="cy" values="204;152" dur="1.1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="298" cy="195" r="2.5" fill="#ffffff" opacity="0.7">
                      <animate attributeName="cy" values="204;150" dur="0.9s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}

                {/* Soot Deposit on Bottom of Copper Can */}
                {progress > 15 && (
                  <ellipse
                    cx="276"
                    cy="214"
                    rx="38"
                    ry="4.5"
                    fill="#0f172a"
                    opacity={Math.min(alcohol.sootOpacity, (progress / 100) * alcohol.sootOpacity)}
                  />
                )}

                {/* Thermometer (0 °C - 100 °C) */}
                <g>
                  {/* Thermometer glass tube */}
                  <rect x="272" y="25" width="8" height="162" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                  {/* Scale ticks */}
                  {[45, 65, 85, 105, 125].map((ty, idx) => (
                    <line key={idx} x1="272" y1={ty} x2="276" y2={ty} stroke="#64748b" strokeWidth="1" />
                  ))}
                  {/* Red alcohol/mercury column scaling with temp */}
                  <rect
                    x="274"
                    y={128 - ((currentTemp - 25) / 40) * 65}
                    width="4"
                    height={54 + ((currentTemp - 25) / 40) * 65}
                    fill="#dc2626"
                  />
                  {/* Bulb */}
                  <circle cx="276" cy="187" r="6.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                  {/* Stirring arrows when stirring is active */}
                  {isStirring && isBurning && (
                    <path
                      d="M 255 135 Q 276 128 297 135"
                      fill="none"
                      stroke="#0369a1"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="-4 0; 4 0; -4 0"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </path>
                  )}
                </g>

                {/* Wooden Block (Bongkah kayu) */}
                <rect x="220" y="348" width="112" height="40" rx="2" fill="#d97706" fillOpacity="0.45" stroke="#92400e" strokeWidth="2" />
                <line x1="226" y1="360" x2="326" y2="360" stroke="#b45309" strokeWidth="1" opacity="0.5" />
                <line x1="226" y1="374" x2="326" y2="374" stroke="#b45309" strokeWidth="1" opacity="0.5" />

                {/* Spirit Lamp (Pelita) on Wooden Block */}
                <path
                  d="M 245 276 L 235 348 L 317 348 L 307 276 Z"
                  fill="#e2e8f0"
                  fillOpacity="0.65"
                  stroke="#475569"
                  strokeWidth="2"
                />
                {/* Alcohol Liquid inside Spirit Lamp (~3/4 full, lowers slightly as burned) */}
                <path
                  d={`M ${242 - (progress / 100) * 2} ${295 + (progress / 100) * 14} L 237 346 L 315 346 L ${
                    310 + (progress / 100) * 2
                  } ${295 + (progress / 100) * 14} Z`}
                  fill="#fef08a"
                  fillOpacity="0.7"
                />
                {/* Wick Holder & Wick */}
                <rect x="268" y="264" width="16" height="12" rx="2" fill="#64748b" />
                <line x1="276" y1="248" x2="276" y2="266" stroke="#334155" strokeWidth="3.5" />

                {/* Flame when Burning */}
                {isBurning && (
                  <g>
                    <path
                      d="M 276 216 Q 290 238 276 252 Q 262 238 276 216 Z"
                      fill={alcohol.flameColorOuter}
                      opacity="0.9"
                    >
                      <animate
                        attributeName="d"
                        values="M 276 216 Q 290 238 276 252 Q 262 238 276 216 Z;M 276 213 Q 293 237 276 252 Q 259 237 276 213 Z;M 276 216 Q 290 238 276 252 Q 262 238 276 216 Z"
                        dur="0.45s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 276 228 Q 283 242 276 251 Q 269 242 276 228 Z"
                      fill={alcohol.flameColorInner}
                    />
                  </g>
                )}

                {/* Textbook Labels (Rajah 3.13) */}
                <text x="355" y="45" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                  Termometer (0–100 °C)
                </text>
                <line x1="280" y1="42" x2="350" y2="42" stroke="#334155" strokeWidth="1.2" />

                <text x="355" y="138" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                  Bekas kuprum
                </text>
                <line x1="334" y1="135" x2="350" y2="135" stroke="#334155" strokeWidth="1.2" />

                <text x="155" y="165" textAnchor="end" fill="#0369a1" fontSize="11.5" fontWeight="bold">
                  Air (200 cm³)
                </text>
                <line x1="160" y1="162" x2="232" y2="168" stroke="#0369a1" strokeWidth="1.2" />

                <text x="360" y="200" fill="#0f172a" fontSize="11" fontWeight="bold">
                  Segi tiga tanah liat
                </text>
                <line x1="348" y1="214" x2="360" y2="204" stroke="#334155" strokeWidth="1.2" />

                <text x="455" y="295" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                  Tungku kaki tiga
                </text>
                <line x1="364" y1="292" x2="450" y2="292" stroke="#334155" strokeWidth="1.2" />

                <text x="148" y="322" textAnchor="end" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                  Pelita ({alcohol.name})
                </text>
                <line x1="154" y1="319" x2="245" y2="319" stroke="#334155" strokeWidth="1.2" />

                <text x="455" y="368" fill="#0f172a" fontSize="11.5" fontWeight="bold">
                  Bongkah kayu
                </text>
                <line x1="332" y1="365" x2="450" y2="365" stroke="#334155" strokeWidth="1.2" />

                {/* Digital Readout Cards embedded cleanly in SVG top-left */}
                <g transform="translate(22, 24)">
                  <rect width="142" height="58" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <text x="10" y="20" fill="#64748b" fontSize="10" fontWeight="bold">
                    SUHU AIR (θ)
                  </text>
                  <text x="10" y="45" fill="#dc2626" fontSize="21" fontWeight="bold">
                    {currentTemp.toFixed(1)} °C
                  </text>
                  <text x="95" y="44" fill="#64748b" fontSize="10">
                    / {TARGET_FINAL_TEMP.toFixed(1)}°
                  </text>
                </g>

                <g transform="translate(448, 66)">
                  <rect width="152" height="58" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <text x="10" y="20" fill="#64748b" fontSize="10" fontWeight="bold">
                    JISIM PELITA + ALKOHOL
                  </text>
                  <text x="10" y="45" fill="#0f172a" fontSize="20" fontWeight="bold">
                    {currentLampMass.toFixed(2)} g
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Right 5 cols: Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900">1. Pilih Alkohol</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {(['metanol', 'etanol', 'propanol', 'butanol'] as AlcoholKey[]).map((key) => {
                  const item = ALCOHOLS[key];
                  const recorded = Boolean(records[key]);
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectAlcohol(key)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer relative ${
                        selectedAlcohol === key
                          ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{item.name}</span>
                        {recorded && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="text-xs text-slate-600 font-mono mt-0.5">
                        {item.formula} (Mᵣ = {item.molarMass})
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Windshield & Stirring Toggles */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-slate-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Pengadang Angin</div>
                      <div className="text-[11px] text-slate-500">
                        {withWindshield
                          ? 'Dipasang (mengurangkan kehilangan haba)'
                          : 'Tiada (banyak haba hilang ke persekitaran)'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setWithWindshield((w) => !w);
                      setProgress(0);
                      setIsBurning(false);
                      analytics.recordSimulationClick(SIM_ID);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      withWindshield ? 'bg-emerald-600 text-white' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {withWindshield ? 'Aktif' : 'Dimatikan'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-slate-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Kacau Air dengan Termometer</div>
                      <div className="text-[11px] text-slate-500">Memastikan taburan haba sekata</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsStirring((s) => !s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isStirring ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isStirring ? 'Mengacau' : 'Pegun'}
                  </button>
                </div>
              </div>

              {/* Start Burn Button */}
              <button
                onClick={handleStartStop}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                  isBurning
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {isBurning ? (
                  <>
                    <Square className="w-4 h-4" />
                    Padamkan Nyalaan (Berhenti)
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {isFinished ? 'Ulang Pembakaran (+30.0 °C)' : 'Nyalakan Pelita & Panaskan Air'}
                  </>
                )}
              </button>
            </div>

            {/* Live Readings & Observations */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-orange-600" />
                Data Semasa ({alcohol.name})
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">Suhu Awal → Semasa</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {INITIAL_WATER_TEMP.toFixed(1)} → {currentTemp.toFixed(1)} °C
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">Jisim Alkohol Terbakar</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {currentMassBurned.toFixed(2)} g
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Pemerhatian Jelaga (KSSM):</strong> {alcohol.sootLevel} di bahagian bawah bekas kuprum.
                {alcohol.carbons >= 3 &&
                  ' Alkohol rantai panjang mempunyai peratus karbon per molekul yang lebih tinggi, menyebabkan pembakaran tidak lengkap.'}
              </div>

              {isFinished && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2">
                  <span>
                    Suhu naik <strong>30.0 °C</strong>! Data direkodkan (ΔH ={' '}
                    <strong>-{records[selectedAlcohol]?.deltaH} kJ mol⁻¹</strong>).
                  </span>
                  <button
                    onClick={() => setActiveTab('pengiraan')}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold shrink-0 cursor-pointer"
                  >
                    Lihat Kiraan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STEP-BY-STEP CALCULATIONS */}
      {activeTab === 'pengiraan' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-orange-600" />
              Pengiraan Haba Pembakaran ({alcohol.name}, {alcohol.formula})
            </h4>
            <div className="flex gap-1.5">
              {(['metanol', 'etanol', 'propanol', 'butanol'] as AlcoholKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectAlcohol(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    selectedAlcohol === key
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ALCOHOLS[key].name}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const m1 = alcohol.initialLampMass;
            const m2 = records[selectedAlcohol]?.m2 ?? Number((m1 - totalExpectedMassBurned).toFixed(2));
            const massBurned = Number((m1 - m2).toFixed(2));
            const moles = massBurned / alcohol.molarMass;
            const calcDeltaH = Math.round(Q_KJ / moles);

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
                  <div className="font-bold text-slate-900">Langkah 1: Jisim &amp; Bilangan Mol Alkohol Terbakar</div>
                  <p className="text-slate-700 font-mono text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    Jisim alkohol, m = m₁ − m₂ = {m1.toFixed(2)} − {m2.toFixed(2)} ={' '}
                    <strong>{massBurned.toFixed(2)} g</strong>
                  </p>
                  <p className="text-slate-700 font-mono text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    Bil. mol, n = m / Jisim molar = {massBurned.toFixed(2)} / {alcohol.molarMass} ={' '}
                    <strong>{moles.toFixed(4)} mol</strong>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
                  <div className="font-bold text-slate-900">Langkah 2: Haba Diserap Air &amp; Haba Pembakaran (ΔH)</div>
                  <p className="text-slate-700 font-mono text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    Q = m_air × c × θ = 200 × 4.2 × 30.0 = <strong>25,200 J = 25.2 kJ</strong>
                  </p>
                  <p className="text-slate-700 font-mono text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    ΔH = − Q / n = − 25.2 / {moles.toFixed(4)} ={' '}
                    <strong className="text-orange-700">−{calcDeltaH} kJ mol⁻¹</strong>
                  </p>
                </div>

                <div className="md:col-span-2 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="text-xs font-bold uppercase text-orange-800 mb-1">Persamaan Termokimia Pembakaran Lengkap</div>
                  <div className="font-mono font-bold text-slate-900 text-sm sm:text-base">
                    {alcohol.equation} &nbsp;&nbsp; ΔH = −{calcDeltaH} kJ mol⁻¹
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: TABLE & RAJAH 3.14 GRAPH */}
      {activeTab === 'graf' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm overflow-x-auto">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-orange-600" />
              Jadual Rekod Keputusan Eksperimen 3B
            </h4>
            {recordedList.length === 0 ? (
              <p className="text-sm text-slate-500">
                Belum ada alkohol yang diuji. Kembali ke tab <strong>1. Radas &amp; Eksperimen 3B</strong> dan jalankan pemanasan untuk setiap alkohol!
              </p>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-2.5">Alkohol</th>
                    <th className="p-2.5">Bil. Atom C</th>
                    <th className="p-2.5">Jisim Terbakar (g)</th>
                    <th className="p-2.5">Bil. Mol (mol)</th>
                    <th className="p-2.5">Haba Pembakaran (kJ mol⁻¹)</th>
                    <th className="p-2.5">Nilai Teori</th>
                  </tr>
                </thead>
                <tbody>
                  {recordedList.map((r) => (
                    <tr key={r.alcoholId} className="border-b border-slate-100">
                      <td className="p-2.5 font-bold">
                        {r.name} ({r.formula})
                      </td>
                      <td className="p-2.5">{r.carbons}</td>
                      <td className="p-2.5 font-mono">{r.massBurned.toFixed(2)}</td>
                      <td className="p-2.5 font-mono">{r.moles.toFixed(4)}</td>
                      <td className="p-2.5 font-mono font-bold text-orange-700">
                        −{r.deltaH} {!r.withWindshield && '(tanpa pengadang)'}
                      </td>
                      <td className="p-2.5 font-mono text-slate-500">−{ALCOHOLS[r.alcoholId].theoryDeltaH}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Rajah 3.14 Straight Line Graph */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-1">
              Graf Haba Pembakaran Melawan Bilangan Atom Karbon (Rajah 3.14, m.s. 135)
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Semakin bertambah bilangan atom karbon per molekul alkohol (penambahan satu kumpulan <strong>−CH₂−</strong>), semakin bertambah nilai haba pembakaran secara linear.
            </p>

            <svg viewBox="0 0 560 300" className="w-full max-w-2xl h-auto bg-slate-50 border border-slate-200 rounded-xl p-2">
              {/* Grid lines Y (0 to 3000) */}
              {[0, 500, 1000, 1500, 2000, 2500, 3000].map((val) => {
                const y = 250 - (val / 3000) * 210;
                return (
                  <g key={val}>
                    <line x1="80" y1={y} x2="510" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                    <text x="72" y={y + 4} textAnchor="end" fontSize="10" fill="#475569">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Axes */}
              <line x1="80" y1="30" x2="80" y2="250" stroke="#1e293b" strokeWidth="2" />
              <line x1="80" y1="250" x2="515" y2="250" stroke="#1e293b" strokeWidth="2" />

              {/* X ticks (1 to 4 C atoms) */}
              {[1, 2, 3, 4].map((c) => {
                const x = 80 + c * 95;
                return (
                  <g key={c}>
                    <line x1={x} y1="250" x2={x} y2="256" stroke="#1e293b" strokeWidth="1.5" />
                    <text x={x} y="272" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">
                      {c}
                    </text>
                  </g>
                );
              })}

              {/* Axis titles */}
              <text x="295" y="292" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#0f172a">
                Bilangan atom karbon per molekul alkohol
              </text>
              <text
                x="22"
                y="145"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#0f172a"
                transform="rotate(-90 22 145)"
              >
                Haba pembakaran (kJ mol⁻¹)
              </text>

              {/* Dotted Reference Theory Line */}
              <line
                x1={80 + 1 * 95}
                y1={250 - (725 / 3000) * 210}
                x2={80 + 4 * 95}
                y2={250 - (2675 / 3000) * 210}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Connected Student Recorded Points */}
              {recordedList.length >= 2 && (
                <polyline
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="2.5"
                  points={recordedList
                    .map((r) => `${80 + r.carbons * 95},${250 - (r.deltaH / 3000) * 210}`)
                    .join(' ')}
                />
              )}

              {recordedList.map((r) => {
                const x = 80 + r.carbons * 95;
                const y = 250 - (r.deltaH / 3000) * 210;
                return (
                  <g key={r.alcoholId}>
                    <circle cx={x} cy={y} r="5.5" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#9a3412">
                      {r.name} ({r.deltaH})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* TAB 4: DISCUSSION Q&A (KSSM m.s. 135) */}
      {activeTab === 'perbincangan' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            Soalan Perbincangan Eksperimen 3B (Buku Teks m.s. 135)
          </h4>
          {[
            {
              q: '1. Mengapakah bekas kuprum digunakan dan bukannya bikar kaca atau kasa dawai?',
              a: 'Kuprum ialah konduktor haba yang baik supaya haba daripada nyalaan dipindahkan ke air dengan cekap. Segi tiga tanah liat digunakan menggantikan kasa dawai untuk mengelakkan kasa dawai menyerap sebahagian haba.',
            },
            {
              q: '2. Mengapakah pengadang angin dan bongkah kayu digunakan dalam susunan radas (Rajah 3.13)?',
              a: 'Pengadang angin mengurangkan kehilangan haba ke persekitaran akibat tiupan angin. Bongkah kayu meninggikan kedudukan pelita supaya nyalaan pelita berada tepat berhampiran bahagian bawah bekas kuprum.',
            },
            {
              q: '3. Nyatakan hubungan antara bilangan atom karbon per molekul alkohol dengan haba pembakaran.',
              a: 'Apabila bilangan atom karbon per molekul alkohol bertambah (dengan penambahan satu kumpulan −CH₂− dalam ahli berturutan), haba pembakaran bertambah secara sekata kerana pembakaran menghasilkan lebih banyak molekul gas CO₂ dan H₂O serta membebaskan lebih banyak tenaga haba.',
            },
            {
              q: '4. Mengapakah nilai haba pembakaran yang diperoleh daripada eksperimen biasanya lebih rendah daripada nilai teori (contohnya etanol -1376 kJ mol⁻¹)?',
              a: 'Sebahagian haba hilang ke persekitaran, haba turut diserap oleh bekas kuprum dan radas, serta berlakunya pembakaran tidak lengkap (terbukti dengan jelaga hitam karbon pada dasar bekas kuprum).',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-sm text-slate-900">{item.q}</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
