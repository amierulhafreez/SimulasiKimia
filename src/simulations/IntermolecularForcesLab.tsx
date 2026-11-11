import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Magnet, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface BondComparison {
  name: string;
  substance: string;
  formula: string;
  boilingPoint: string;
  bondType: string;
  strength: string;
  explanation: string;
}

const COMPARISONS: BondComparison[] = [
  {
    name: 'Air (Ikatan Hidrogen)',
    substance: 'Air',
    formula: 'H₂O',
    boilingPoint: '100°C (Sangat Tinggi)',
    bondType: 'Ikatan Hidrogen (Kuat)',
    strength: 'Kuat',
    explanation: 'Atom H yang terikat kepada atom O yang sangat elektronegatif menghasilkan tarikan elektrostatik yang kuat antara molekul-molekul air yang bersebelahan. Lebih banyak tenaga haba diperlukan untuk memutuskan ikatan hidrogen ini.'
  },
  {
    name: 'Hidrogen Klorida (Daya Van der Waals)',
    substance: 'Gas Hidrogen Klorida',
    formula: 'HCl',
    boilingPoint: '-85°C (Rendah)',
    bondType: 'Daya Tarikan Antara Molekul Van der Waals (Lemah)',
    strength: 'Lemah',
    explanation: 'Molekul-molekul HCl hanya ditarik oleh daya tarikan Van der Waals yang lemah. Sedikit sahaja tenaga haba diperlukan untuk mengatasi daya ini.'
  },
  {
    name: 'Gas Metana (Daya Van der Waals Sangat Lemah)',
    substance: 'Metana',
    formula: 'CH₄',
    boilingPoint: '-161°C (Sangat Rendah)',
    bondType: 'Daya Van der Waals (Molekul Tidak Kutub)',
    strength: 'Sangat Lemah',
    explanation: 'Molekul CH₄ tidak mempunyai atom hidrogen yang terikat kepada atom N, O, atau F, jadi tiada ikatan hidrogen. Takat didihnya sangat rendah.'
  }
];

export const IntermolecularForcesLab: React.FC = () => {
  const SIM_ID = 'daya-tarikan-zarah';
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const comp = COMPARISONS[selectedIdx];

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    analytics.recordSimulationClick(SIM_ID, 1);
    analytics.recordSimulationCompleted(SIM_ID);
  };

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2">
        {COMPARISONS.map((c, idx) => (
          <button
            key={c.formula}
            onClick={() => handleSelect(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedIdx === idx
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{c.name}</span>
            <span className="font-mono text-[10px] bg-black/10 px-1 py-0.2 rounded font-bold">{c.formula}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Graphic Molecule Bond Comparison */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[340px] bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
          
          <div className="flex flex-col items-center space-y-6">
            
            <div className="flex items-center gap-6">
              {/* Molecule 1 */}
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-purple-400 shadow-md flex items-center justify-center font-bold text-lg text-purple-700">
                {comp.formula}
              </div>

              {/* Intermolecular Bond */}
              <div className="flex flex-col items-center">
                <div className={`h-1 w-16 ${comp.strength === 'Kuat' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-slate-300 border-t-2 border-dashed border-slate-400'}`}></div>
                <span className={`text-[9px] font-bold mt-1 ${comp.strength === 'Kuat' ? 'text-red-600' : 'text-slate-500'}`}>
                  {comp.bondType.includes('Hidrogen') ? 'Ikatan Hidrogen' : 'Daya Van der Waals'}
                </span>
              </div>

              {/* Molecule 2 */}
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-purple-400 shadow-md flex items-center justify-center font-bold text-lg text-purple-700">
                {comp.formula}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Takat Didih Sebatian:</span>
              <span className="font-mono font-extrabold text-xl text-purple-700">{comp.boilingPoint}</span>
            </div>

          </div>

          <span className="text-xs text-slate-500 mt-4 font-medium">
            Tarikan Antara Dua Molekul {comp.substance}
          </span>
        </div>

        {/* Right: Explanations */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Kekuatan Ikatan & Takat Didih:
            </h4>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Jenis Daya Tarikan:</span>
                <p className="text-slate-900 font-bold text-sm text-sky-800">{comp.bondType}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-500">Penerangan Saintifik SPM:</span>
                <p className="text-slate-700 leading-relaxed pt-0.5">{comp.explanation}</p>
              </div>
            </div>

            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs space-y-1 text-slate-700">
              <span className="font-bold text-sky-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Syarat Pembentukan Ikatan Hidrogen SPM:
              </span>
              <p className="text-[11px] text-slate-600">
                Wajib ada atom Hidrogen (H) yang terikat terus dengan atom yang sangat elektronegatif iaitu sama ada <strong>Nitrogen (N)</strong>, <strong>Oksigen (O)</strong>, atau <strong>Fluorin (F)</strong> [Ingat: <strong>NOF</strong>].
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center text-xs font-semibold text-slate-600">
            Ikatan Hidrogen &gt; Daya Van der Waals (Takat didih air lebih tinggi daripada hidrogen klorida)
          </div>

        </div>

      </div>
    </div>
  );
};
