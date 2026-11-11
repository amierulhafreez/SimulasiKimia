import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { RotateCcw, Calculator, CheckCircle2, AlertTriangle, Info, ArrowRight, ArrowLeft, Eye } from 'lucide-react';

type Mode = 'solid' | 'dilution';

const SOLID_STEPS = [
  {
    step: 1,
    code: '(a)',
    title: 'Timbang & Tambah Air Suling',
    instruction: 'Timbang tepat 26.50 g pepejal natrium karbonat, Na₂CO₃ menggunakan penimbang elektronik. Masukkan ke dalam bikar 250 cm³ dan tambah 100.0 cm³ air suling.',
    actionLabel: 'Timbang 26.50 g & Tuang Air'
  },
  {
    step: 2,
    code: '(b)',
    title: 'Kacau Hingga Larut Sepenuhnya',
    instruction: 'Kacau campuran menggunakan rod kaca sehingga semua pepejal natrium karbonat, Na₂CO₃ terlarut sepenuhnya di dalam air suling.',
    actionLabel: 'Kacau Dengan Rod Kaca'
  },
  {
    step: 3,
    code: '(c)',
    title: 'Pindah ke Kelalang Volumetrik 250 cm³',
    instruction: 'Pindahkan larutan natrium karbonat ke dalam kelalang volumetrik 250 cm³ melalui corong turas.',
    actionLabel: 'Tuang Melalui Corong Turas'
  },
  {
    step: 4,
    code: '(d)',
    title: 'Bilas Bikar & Corong Turas',
    instruction: 'Bilaskan bikar dan corong turas dengan sedikit air suling daripada botol pencuci. Pastikan semua air bilasan dipindahkan ke dalam kelalang volumetrik.',
    actionLabel: 'Bilas & Pindahkan Air Bilasan'
  },
  {
    step: 5,
    code: '(e)',
    title: 'Laraskan Aras Meniskus (Penitis)',
    instruction: 'Alihkan corong turas. Tambah air suling hingga menghampiri tanda senggatan, kemudian gunakan penitis secara perlahan-lahan sehingga aras meniskus tepat segaris dengan tanda senggatan (elak ralat paralaks).',
    actionLabel: 'Titiskan Hingga Tanda Senggatan'
  },
  {
    step: 6,
    code: '(f)',
    title: 'Tutup & Goncang Sambil Telangkupkan',
    instruction: 'Tutupkan kelalang volumetrik dengan penutup. Goncangkan sambil telangkupkan kelalang volumetrik beberapa kali sehingga larutan menjadi sebati.',
    actionLabel: 'Tutup & Telangkupkan Sebati'
  }
];

const DILUTION_STEPS = [
  {
    step: 1,
    code: '(a)',
    title: 'Tuang Larutan Stok ke Bikar',
    instruction: 'Tuangkan larutan stok natrium karbonat, Na₂CO₃ 1.0 mol dm⁻³ (daripada Aktiviti 6.7) ke dalam sebuah bikar 100 cm³.',
    actionLabel: 'Tuang Larutan Stok 1.0 M'
  },
  {
    step: 2,
    code: '(b)',
    title: 'Sukat V₁ = 20.0 cm³ dengan Pipet',
    instruction: 'Gunakan pipet (yang telah dibilas dengan larutan stok) dan pengisi pipet untuk mengeluarkan tepat V₁ = 20.0 cm³ larutan stok Na₂CO₃ 1.0 mol dm⁻³.',
    actionLabel: 'Pipetkan 20.0 cm³ Larutan Stok'
  },
  {
    step: 3,
    code: '(c)',
    title: 'Pindah ke Kelalang Volumetrik 100 cm³',
    instruction: 'Pindahkan 20.0 cm³ larutan stok tersebut ke dalam kelalang volumetrik 100 cm³ yang bersih.',
    actionLabel: 'Pindah ke Kelalang 100 cm³'
  },
  {
    step: 4,
    code: '(d)',
    title: 'Tambah Air Suling Menghampiri Tanda Senggatan',
    instruction: 'Tambahkan air suling daripada botol pencuci sehingga paras larutan menghampiri tanda senggatan 100 cm³.',
    actionLabel: 'Tambah Air Suling'
  },
  {
    step: 5,
    code: '(e)',
    title: 'Laraskan Aras Meniskus dengan Penitis',
    instruction: 'Tambahkan air suling secara perlahan-lahan dengan penitis sehingga bahagian bawah meniskus tepat segaris dengan tanda senggatan.',
    actionLabel: 'Titiskan Hingga Meniskus Tepat'
  },
  {
    step: 6,
    code: '(f)',
    title: 'Tutup & Telangkupkan Beberapa Kali',
    instruction: 'Tutupkan kelalang volumetrik dan goncangkan serta telangkupkan beberapa kali sehingga larutan piawai Na₂CO₃ 0.2 mol dm⁻³ bercampur sebati.',
    actionLabel: 'Tutup & Goncang Sebati'
  }
];

export const StandardSolutionLab: React.FC = () => {
  const SIM_ID = 'penyediaan-larutan-piawai';
  const [mode, setMode] = useState<Mode>('solid');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showZoomMeniscus, setShowZoomMeniscus] = useState<boolean>(false);
  const [showNaohNote, setShowNaohNote] = useState<boolean>(false);

  // Interactive dilution calculator state
  const [m1, setM1] = useState<number>(1.0);
  const [m2, setM2] = useState<number>(0.2);
  const [v2, setV2] = useState<number>(100);
  const v1Calc = m1 > 0 ? +((m2 * v2) / m1).toFixed(2) : 0;

  const steps = mode === 'solid' ? SOLID_STEPS : DILUTION_STEPS;
  const activeStepObj = steps[currentStep - 1];

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setCurrentStep(1);
    setShowZoomMeniscus(false);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  const handleNext = () => {
    analytics.recordSimulationClick(SIM_ID, 1);
    if (currentStep < 6) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === 5) setShowZoomMeniscus(true);
      else setShowZoomMeniscus(false);
    } else {
      analytics.recordSimulationCompleted(SIM_ID);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setShowZoomMeniscus(prev === 5);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs (Aktiviti 6.7 vs Aktiviti 6.8) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-teal-50/80 border border-teal-200 p-3 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleModeSwitch('solid')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              mode === 'solid'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Aktiviti 6.7: Daripada Bahan Pepejal (Na₂CO₃ 1.0 M)
          </button>
          <button
            onClick={() => handleModeSwitch('dilution')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              mode === 'dilution'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Aktiviti 6.8: Kaedah Pencairan (1.0 M → 0.2 M)
          </button>
        </div>

        <button
          onClick={() => setShowNaohNote(!showNaohNote)}
          className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          {showNaohNote ? 'Tutup Nota NaOH' : 'Mengapa NaOH Tidak Sesuai?'}
        </button>
      </div>

      {showNaohNote && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs space-y-1.5 text-amber-950 animate-in fade-in duration-200">
          <p className="font-bold text-sm">Fakta Buku Teks KSSM (m.s. 163):</p>
          <p className="leading-relaxed">
            Natrium hidroksida (<strong>NaOH</strong>) tidak sesuai digunakan untuk menyediakan larutan piawai kerana bersifat <strong>higroskopik</strong> (menyerap lembapan/wap air di dalam udara) dan juga menyerap gas karbon dioksida di udara:
          </p>
          <div className="font-mono bg-white p-2 rounded-lg border border-amber-200 text-center font-bold text-amber-900">
            2NaOH(p) + CO₂(g) → Na₂CO₃(p) + H₂O(ce)
          </div>
          <p>Akibatnya, jisim pepejal NaOH tidak dapat ditimbang dengan tepat! Bahan yang sesuai ialah <strong>Na₂CO₃</strong> atau <strong>asid oksalik (H₂C₂O₄·2H₂O)</strong>.</p>
        </div>
      )}

      {/* Progress Stepper (a) to (f) matching Rajah 6.27 & Rajah 6.29 */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {steps.map(s => (
          <button
            key={s.step}
            onClick={() => {
              setCurrentStep(s.step);
              setShowZoomMeniscus(s.step === 5);
              analytics.recordSimulationClick(SIM_ID, 1);
            }}
            className={`p-2 rounded-xl border text-left transition ${
              currentStep === s.step
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : currentStep > s.step
                ? 'bg-teal-50 text-teal-800 border-teal-200'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="text-[10px] font-mono font-bold opacity-80">Langkah {s.code}</div>
            <div className="text-[11px] font-bold line-clamp-1">{s.title}</div>
          </button>
        ))}
      </div>

      {/* Main Lab Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Textbook-Exact SVG Apparatus Diagram */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[380px] bg-gradient-to-b from-slate-50 to-sky-50/40 rounded-2xl p-5 border border-slate-200 relative">
          
          <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs">
            {mode === 'solid' ? 'Rajah 6.27: Kelalang Volumetrik 250 cm³' : 'Rajah 6.29: Kelalang Volumetrik 100 cm³'} — Fasa {activeStepObj.code}
          </div>

          {/* Eye-level meniscus zoom helper in Step 5 */}
          {showZoomMeniscus && (
            <div className="absolute top-3 right-3 bg-white border-2 border-teal-500 rounded-2xl p-3 shadow-xl w-44 z-20 animate-in fade-in duration-300">
              <div className="flex items-center gap-1 text-[10px] font-bold text-teal-800 mb-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-600" /> Paras Mata (Elak Paralaks)
              </div>
              <svg viewBox="0 0 120 70" className="w-full h-16 bg-sky-50/40 rounded border border-slate-200">
                {/* Volumetric flask neck zoomed */}
                <line x1="42" y1="5" x2="42" y2="65" stroke="#475569" strokeWidth="2.5" />
                <line x1="78" y1="5" x2="78" y2="65" stroke="#475569" strokeWidth="2.5" />
                {/* Calibration mark (Tanda senggatan) */}
                <line x1="36" y1="38" x2="84" y2="38" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
                <text x="86" y="40" fontSize="7" fill="#dc2626" fontWeight="bold">Senggatan</text>
                {/* Concave Meniscus curve touching exact mark */}
                <path d="M 43 32 Q 60 44 77 32 L 77 65 L 43 65 Z" fill="#38bdf8" fillOpacity="0.45" />
                <path d="M 43 32 Q 60 44 77 32" fill="none" stroke="#0284c7" strokeWidth="2" />
                {/* Eye sight dashed line */}
                <line x1="8" y1="38" x2="42" y2="38" stroke="#0f766e" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="10" cy="38" r="3" fill="#0f766e" />
              </svg>
              <p className="text-[9px] text-slate-600 mt-1 text-center">Bahagian bawah meniskus tepat pada tanda senggatan.</p>
            </div>
          )}

          {/* SVG Apparatus for each step */}
          <svg viewBox="0 0 360 250" className="w-full max-w-md h-64 mt-4">
            {/* SOLID MODE: Aktiviti 6.7 */}
            {mode === 'solid' && currentStep === 1 && (
              <g>
                {/* Electronic Balance */}
                <rect x="35" y="185" width="110" height="32" rx="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                <rect x="55" y="193" width="70" height="16" rx="2" fill="#0f172a" />
                <text x="90" y="204" fontSize="9" fill="#34d399" fontFamily="monospace" fontWeight="bold" textAnchor="middle">26.50 g</text>
                <rect x="65" y="177" width="50" height="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                {/* Weighing boat with Na2CO3 white powder */}
                <path d="M 65 177 L 115 177 L 108 168 L 72 168 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M 76 173 Q 90 160 104 173 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <text x="90" y="232" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">Penimbang Elektronik (Na₂CO₃)</text>

                {/* Beaker + Wash Bottle pouring distilled water */}
                <path d="M 210 120 L 210 212 Q 210 218 218 218 L 282 218 Q 290 218 290 212 L 290 120" fill="#f0f9ff" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2.5" />
                {/* Liquid in beaker */}
                <rect x="212" y="165" width="76" height="51" rx="2" fill="#bae6fd" fillOpacity="0.6" />
                {/* Solid particles at bottom */}
                <circle cx="235" cy="211" r="3" fill="#ffffff" stroke="#94a3b8" />
                <circle cx="246" cy="213" r="3.5" fill="#ffffff" stroke="#94a3b8" />
                <circle cx="258" cy="210" r="3" fill="#ffffff" stroke="#94a3b8" />
                <circle cx="268" cy="213" r="3" fill="#ffffff" stroke="#94a3b8" />
                {/* Wash bottle pouring */}
                <g transform="translate(185, 55) rotate(25)">
                  <rect x="0" y="0" width="46" height="28" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.8" />
                  <path d="M 46 14 L 68 14 L 74 24" fill="none" stroke="#0284c7" strokeWidth="2" />
                  <text x="23" y="17" fontSize="7" fill="#0369a1" fontWeight="bold" textAnchor="middle">Air Suling</text>
                </g>
                <circle cx="250" cy="115" r="2" fill="#0ea5e9" />
                <circle cx="250" cy="135" r="2" fill="#0ea5e9" />
                <text x="250" y="232" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">Bikar 250 cm³ + 100 cm³ Air Suling</text>
              </g>
            )}

            {mode === 'solid' && currentStep === 2 && (
              <g>
                {/* Beaker with Glass Rod stirring */}
                <path d="M 135 110 L 135 212 Q 135 218 143 218 L 217 218 Q 225 218 225 212 L 225 110" fill="#f0f9ff" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2.5" />
                <rect x="137" y="155" width="86" height="61" rx="2" fill="#bae6fd" fillOpacity="0.7" />
                {/* Glass Rod */}
                <line x1="195" y1="60" x2="165" y2="210" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                <path d="M 162 85 A 20 8 0 1 1 198 85" fill="none" stroke="#ef4444" strokeWidth="1.8" />
                <polygon points="162,85 167,81 167,89" fill="#ef4444" />
                <text x="150" y="75" fontSize="9" fill="#dc2626" fontWeight="bold">Kacau</text>
                <text x="225" y="70" fontSize="9" fill="#334155" fontWeight="bold">Rod Kaca</text>
                <text x="180" y="235" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">Pepejal Na₂CO₃ Larut Sepenuhnya</text>
              </g>
            )}

            {mode === 'solid' && (currentStep === 3 || currentStep === 4) && (
              <g>
                {/* Volumetric Flask 250 cm3 */}
                <path d="M 168 85 L 168 140 C 130 155 125 218 155 218 L 205 218 C 235 218 230 155 192 140 L 192 85" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
                {/* Graduation mark */}
                <line x1="164" y1="115" x2="196" y2="115" stroke="#dc2626" strokeWidth="1.5" />
                <text x="202" y="118" fontSize="8" fill="#dc2626" fontWeight="bold">Tanda senggatan</text>
                {/* Liquid inside flask */}
                <path d={currentStep === 3 ? "M 139 185 C 135 215 150 216 155 216 L 205 216 C 210 216 225 215 221 185 Z" : "M 142 162 C 128 215 150 216 155 216 L 205 216 C 210 216 232 215 218 162 Z"} fill="#bae6fd" fillOpacity="0.75" />
                {/* Filter Funnel (Corong Turas) on top */}
                <path d="M 155 55 L 205 55 L 185 82 L 185 102 L 175 102 L 175 82 Z" fill="#e0f2fe" fillOpacity="0.6" stroke="#475569" strokeWidth="2" />
                <text x="215" y="70" fontSize="9" fill="#334155" fontWeight="bold">Corong Turas</text>
                {/* Beaker or Wash bottle pouring */}
                {currentStep === 3 ? (
                  <g transform="translate(88, 12) rotate(35)">
                    <path d="M 0 0 L 0 42 L 32 42 L 32 0" fill="#bae6fd" fillOpacity="0.5" stroke="#0284c7" strokeWidth="2" />
                  </g>
                ) : (
                  <g transform="translate(75, 18) rotate(20)">
                    <rect x="0" y="0" width="44" height="24" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.8" />
                    <path d="M 44 12 L 72 12 L 76 22" fill="none" stroke="#0284c7" strokeWidth="2" />
                    <text x="22" y="15" fontSize="6.5" fill="#0369a1" fontWeight="bold" textAnchor="middle">Air Suling</text>
                  </g>
                )}
                <circle cx="180" cy="88" r="2" fill="#0284c7" />
                <circle cx="180" cy="110" r="2" fill="#0284c7" />
                <text x="180" y="236" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">
                  {currentStep === 3 ? 'Pindah Larutan Melalui Corong Turas' : 'Bilas Bikar & Corong Turas Dengan Air Suling'}
                </text>
              </g>
            )}

            {mode === 'solid' && currentStep === 5 && (
              <g>
                {/* Volumetric Flask filled exactly to mark */}
                <path d="M 168 85 L 168 140 C 130 155 125 218 155 218 L 205 218 C 235 218 230 155 192 140 L 192 85" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
                {/* Liquid filling bulb + neck up to mark y=115 */}
                <path d="M 169 115 L 191 115 L 191 140 C 228 155 233 216 205 216 L 155 216 C 127 216 132 155 169 140 Z" fill="#7dd3fc" fillOpacity="0.65" />
                {/* Graduation mark */}
                <line x1="162" y1="115" x2="198" y2="115" stroke="#dc2626" strokeWidth="2" />
                <text x="204" y="118" fontSize="8" fill="#dc2626" fontWeight="bold">Tanda senggatan (250 cm³)</text>
                {/* Dropper (Penitis) */}
                <rect x="176" y="25" width="8" height="25" rx="3" fill="#334155" />
                <path d="M 176 50 L 184 50 L 181 70 L 179 70 Z" fill="#e0f2fe" stroke="#475569" strokeWidth="1.5" />
                <circle cx="180" cy="80" r="2.5" fill="#0ea5e9" />
                <text x="158" y="45" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="end">Penitis</text>
                <text x="180" y="236" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">Laraskan Aras Meniskus Tepat Segaris Tanda Senggatan</text>
              </g>
            )}

            {mode === 'solid' && currentStep === 6 && (
              <g>
                {/* Stoppered Volumetric Flask */}
                <path d="M 168 85 L 168 140 C 130 155 125 218 155 218 L 205 218 C 235 218 230 155 192 140 L 192 85" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
                <path d="M 169 115 L 191 115 L 191 140 C 228 155 233 216 205 216 L 155 216 C 127 216 132 155 169 140 Z" fill="#38bdf8" fillOpacity="0.65" />
                <line x1="162" y1="115" x2="198" y2="115" stroke="#dc2626" strokeWidth="1.5" />
                {/* Stopper (Penutup) */}
                <path d="M 171 68 L 189 68 L 187 86 L 173 86 Z" fill="#0284c7" />
                <circle cx="180" cy="63" r="6" fill="#0284c7" />
                <text x="155" y="68" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="end">Penutup</text>
                {/* Invert arrows */}
                <path d="M 118 145 A 30 30 0 0 1 130 105" fill="none" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrow)" />
                <path d="M 242 105 A 30 30 0 0 1 230 145" fill="none" stroke="#7c3aed" strokeWidth="2" />
                <text x="180" y="236" fontSize="9" fill="#0f766e" fontWeight="bold" textAnchor="middle">Larutan Piawai Na₂CO₃ 1.0 mol dm⁻³ Sedia Digunakan!</text>
              </g>
            )}

            {/* DILUTION MODE: Aktiviti 6.8 */}
            {mode === 'dilution' && currentStep === 1 && (
              <g>
                {/* Stock bottle pouring into beaker */}
                <path d="M 135 125 L 135 212 Q 135 218 143 218 L 217 218 Q 225 218 225 212 L 225 125" fill="#f0f9ff" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2.5" />
                <rect x="137" y="160" width="86" height="56" rx="2" fill="#818cf8" fillOpacity="0.45" />
                <text x="180" y="192" fontSize="8.5" fill="#312e81" fontWeight="bold" textAnchor="middle">Larutan Stok 1.0 M</text>
                <text x="180" y="236" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">Tuangkan Larutan Stok Na₂CO₃ ke Dalam Bikar</text>
              </g>
            )}

            {mode === 'dilution' && currentStep === 2 && (
              <g>
                {/* Beaker + Pipette drawing 20.0 cm3 */}
                <path d="M 135 140 L 135 212 Q 135 218 143 218 L 217 218 Q 225 218 225 212 L 225 140" fill="#f0f9ff" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2.5" />
                <rect x="137" y="170" width="86" height="46" rx="2" fill="#818cf8" fillOpacity="0.45" />
                {/* Bulb Pipette */}
                <path d="M 177 35 L 177 75 C 168 85 168 110 177 120 L 177 195 L 183 195 L 183 120 C 192 110 192 85 183 75 L 183 35 Z" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
                {/* Liquid inside pipette */}
                <path d="M 178 65 L 178 75 C 169 85 169 110 178 120 L 178 193 L 182 193 L 182 120 C 191 110 191 85 182 75 L 182 65 Z" fill="#6366f1" fillOpacity="0.65" />
                <line x1="173" y1="65" x2="187" y2="65" stroke="#dc2626" strokeWidth="1.5" />
                <text x="195" y="68" fontSize="8" fill="#4f46e5" fontWeight="bold">Pipet (V₁ = 20.0 cm³)</text>
                <text x="180" y="236" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">Gunakan Pengisi Pipet untuk Menyukat Tepat 20.0 cm³</text>
              </g>
            )}

            {mode === 'dilution' && currentStep === 3 && (
              <g>
                {/* Pipette transferring into Volumetric Flask 100 cm3 */}
                <path d="M 168 100 L 168 148 C 135 162 130 218 158 218 L 202 218 C 230 218 225 162 192 148 L 192 100" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
                <path d="M 140 192 C 136 215 152 216 158 216 L 202 216 C 208 216 224 215 220 192 Z" fill="#818cf8" fillOpacity="0.6" />
                <line x1="164" y1="125" x2="196" y2="125" stroke="#dc2626" strokeWidth="1.5" />
                {/* Pipette above neck */}
                <path d="M 177 10 L 177 45 C 170 52 170 70 177 77 L 177 110 L 183 110 L 183 77 C 190 70 190 52 183 45 L 183 10 Z" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.8" />
                <circle cx="180" cy="122" r="2.5" fill="#6366f1" />
                <text x="180" y="236" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">Pindahkan 20.0 cm³ Larutan Stok ke Kelalang Volumetrik 100 cm³</text>
              </g>
            )}

            {mode === 'dilution' && (currentStep === 4 || currentStep === 5 || currentStep === 6) && (
              <g>
                <path d="M 168 85 L 168 140 C 130 155 125 218 155 218 L 205 218 C 235 218 230 155 192 140 L 192 85" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
                <path 
                  d={currentStep === 4 
                    ? "M 169 130 L 191 130 L 191 140 C 228 155 233 216 205 216 L 155 216 C 127 216 132 155 169 140 Z"
                    : "M 169 115 L 191 115 L 191 140 C 228 155 233 216 205 216 L 155 216 C 127 216 132 155 169 140 Z"} 
                  fill="#818cf8" fillOpacity="0.45" 
                />
                <line x1="162" y1="115" x2="198" y2="115" stroke="#dc2626" strokeWidth="2" />
                <text x="204" y="118" fontSize="8" fill="#dc2626" fontWeight="bold">Tanda senggatan (100 cm³)</text>

                {currentStep === 4 && (
                  <g transform="translate(80, 20) rotate(22)">
                    <rect x="0" y="0" width="44" height="24" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.8" />
                    <path d="M 44 12 L 72 12 L 76 22" fill="none" stroke="#0284c7" strokeWidth="2" />
                    <text x="22" y="15" fontSize="6.5" fill="#0369a1" fontWeight="bold" textAnchor="middle">Air Suling</text>
                  </g>
                )}

                {currentStep === 5 && (
                  <g>
                    <rect x="176" y="25" width="8" height="25" rx="3" fill="#334155" />
                    <path d="M 176 50 L 184 50 L 181 70 L 179 70 Z" fill="#e0f2fe" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="180" cy="80" r="2.5" fill="#0ea5e9" />
                  </g>
                )}

                {currentStep === 6 && (
                  <g>
                    <path d="M 171 68 L 189 68 L 187 86 L 173 86 Z" fill="#4f46e5" />
                    <circle cx="180" cy="63" r="6" fill="#4f46e5" />
                  </g>
                )}

                <text x="180" y="236" fontSize="9" fill="#334155" fontWeight="bold" textAnchor="middle">
                  {currentStep === 4 ? 'Tambah Air Suling Hingga Menghampiri Tanda Senggatan' :
                   currentStep === 5 ? 'Laraskan Aras Meniskus dengan Penitis' :
                   'Larutan Piawai Na₂CO₃ 0.2 mol dm⁻³ Siap Disediakan!'}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Right: Step Instructions, Stoichiometry & Calculator */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            {/* Step Instruction Box */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
                  Prosedur {activeStepObj.code} daripada 6
                </span>
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">{activeStepObj.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{activeStepObj.instruction}</p>
            </div>

            {/* Stoichiometric Formula Box */}
            {mode === 'solid' ? (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-teal-600" /> Penghitungan Jisim Pepejal Na₂CO₃:
                </div>
                <div className="font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                  <p>n = (M × V) / 1000 = (1.0 × 250) / 1000 = <strong>0.25 mol</strong></p>
                  <p>Jisim Molar Na₂CO₃ = 2(23) + 12 + 3(16) = <strong>106 g mol⁻¹</strong></p>
                  <p>Jisim = 0.25 × 106 = <strong className="text-teal-700">26.50 g</strong></p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-600" /> Kalkulator Pencairan (M₁V₁ = M₂V₂):
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <label className="block">
                    <span className="text-slate-600 font-semibold">M₁ (Stok)</span>
                    <input type="number" step="0.1" min="0.1" value={m1} onChange={e => setM1(+e.target.value)} className="mt-0.5 w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-900" />
                  </label>
                  <label className="block">
                    <span className="text-slate-600 font-semibold">M₂ (Akhir)</span>
                    <input type="number" step="0.05" min="0.05" value={m2} onChange={e => setM2(+e.target.value)} className="mt-0.5 w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-900" />
                  </label>
                  <label className="block">
                    <span className="text-slate-600 font-semibold">V₂ (cm³)</span>
                    <input type="number" step="50" min="50" value={v2} onChange={e => setV2(+e.target.value)} className="mt-0.5 w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-900" />
                  </label>
                </div>
                <div className="font-mono text-xs bg-white p-2 rounded-lg border border-indigo-200 text-center text-indigo-900 font-bold">
                  V₁ Diperlukan = ({m2} × {v2}) / {m1} = <span className="text-indigo-600">{v1Calc} cm³</span>
                </div>
              </div>
            )}

            {/* Cabaran Minda / Discussion Question */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-slate-700 space-y-1">
              <p className="font-bold text-purple-900 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-purple-600" />
                {mode === 'solid' ? 'Soalan Perbincangan KSSM:' : 'Cabaran Minda (m.s. 165):'}
              </p>
              <p className="leading-relaxed">
                {mode === 'solid'
                  ? 'Mengapakah semua air bilasan bikar dan corong turas mesti dipindahkan ke dalam kelalang volumetrik? Supaya tiada zat terlarut Na₂CO₃ yang tertinggal bagi memastikan kepekatan tepat 1.0 mol dm⁻³.'
                  : 'Mengapakah pipet perlu dibilas dengan larutan stok Na₂CO₃ 1.0 mol dm⁻³ dan bukan air suling? Supaya titisan air suling tidak mencairkan larutan stok yang disukat ke dalam pipet.'}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Undur
            </button>

            <button
              onClick={handleNext}
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/25 transition"
            >
              {currentStep === 6 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Selesai Penyediaan!
                </>
              ) : (
                <>
                  <span>{activeStepObj.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              onClick={() => { setCurrentStep(1); setShowZoomMeniscus(false); }}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition"
              title="Reset Semula"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
