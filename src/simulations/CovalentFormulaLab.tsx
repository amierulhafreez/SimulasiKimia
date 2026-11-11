import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Atom, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface MoleculeOption {
  id: string;
  name: string;
  formula: string;
  electronsShared: string;
  bondType: string;
  lewisStructure: string;
  explanation: string;
}

const MOLECULES: MoleculeOption[] = [
  {
    id: 'h2o',
    name: 'Air',
    formula: 'H₂O',
    electronsShared: '2 pasang elektron dikongsi (2 ikatan kovalen tunggal)',
    bondType: 'Ikatan Kovalen Tunggal',
    lewisStructure: `   H : O : H
       ..`,
    explanation: 'Atom oksigen (susunan elektron 2.6) memerlukan 2 elektron untuk mencapai susunan oktet 2.8. Setiap atom hidrogen (susunan 1) menyumbang 1 elektron untuk mencapai susunan duplet 2.'
  },
  {
    id: 'o2',
    name: 'Gas Oksigen',
    formula: 'O₂',
    electronsShared: '2 pasang elektron (4 elektron) dikongsi',
    bondType: 'Ikatan Kovalen Ganda Dua',
    lewisStructure: `  :O :: O:`,
    explanation: 'Setiap atom oksigen menyumbangkan 2 elektron untuk dikongsi bersama bagi mencapai susunan oktet yang stabil.'
  },
  {
    id: 'n2',
    name: 'Gas Nitrogen',
    formula: 'N₂',
    electronsShared: '3 pasang elektron (6 elektron) dikongsi',
    bondType: 'Ikatan Kovalen Ganda Tiga',
    lewisStructure: `  :N ::: N:`,
    explanation: 'Setiap atom nitrogen (susunan 2.5) memerlukan 3 elektron untuk mencapai susunan oktet 2.8, membentuk ikatan ganda tiga yang sangat kuat.'
  },
  {
    id: 'ch4',
    name: 'Gas Metana',
    formula: 'CH₄',
    electronsShared: '4 pasang elektron dikongsi (4 ikatan kovalen tunggal)',
    bondType: 'Ikatan Kovalen Tunggal',
    lewisStructure: `       H
       :
   H : C : H
       :
       H`,
    explanation: 'Satu atom karbon (susunan 2.4) berkongsi 4 elektron dengan 4 atom hidrogen untuk membentuk sebatian kovalen neutral.'
  }
];

export const CovalentFormulaLab: React.FC = () => {
  const SIM_ID = 'penghasilan-sebatian-kovalen';
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const mol = MOLECULES[selectedIdx];
  const [isShared, setIsShared] = useState<boolean>(false);

  const handleShareElectrons = () => {
    setIsShared(true);
    analytics.recordSimulationClick(SIM_ID, 1);
    analytics.recordSimulationCompleted(SIM_ID);
    confetti({ particleCount: 60, spread: 55 });
  };

  const handleSelectMol = (idx: number) => {
    setSelectedIdx(idx);
    setIsShared(false);
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  return (
    <div className="space-y-6">
      {/* Molecule Switch */}
      <div className="flex flex-wrap gap-2">
        {MOLECULES.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => handleSelectMol(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedIdx === idx
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{m.name}</span>
            <span className="font-mono text-[10px] bg-black/10 px-1 py-0.2 rounded font-bold">{m.formula}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Lewis Structure & Orbitals */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[340px] bg-slate-900 text-slate-100 rounded-2xl p-6 relative border border-slate-800">
          
          <div className="absolute top-4 left-4 bg-indigo-950/80 px-3 py-1 rounded-xl border border-indigo-800 text-xs text-indigo-300 font-bold">
            {mol.bondType}
          </div>

          {/* Graphic Visualization */}
          <div className="flex flex-col items-center space-y-4">
            <pre className="font-mono text-base font-extrabold text-cyan-400 bg-black/50 p-6 rounded-2xl border border-slate-800 shadow-inner text-center">
              {mol.lewisStructure}
            </pre>
            
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              Susunan Elektron Oktet / Duplet Stabil
            </div>
          </div>

          <span className="text-xs text-slate-400 mt-4">
            Struktur Lewis Perkongsian Elektron: {mol.name} ({mol.formula})
          </span>
        </div>

        {/* Right: Explanations & Theory */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Pembentukan Ikatan Kovalen:
            </h4>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Bilangan Elektron Dikongsi:</span>
                <p className="text-slate-900 font-bold text-sm text-indigo-700">{mol.electronsShared}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-500">Penerangan Konsep SPM:</span>
                <p className="text-slate-700 leading-relaxed pt-0.5">{mol.explanation}</p>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1 text-slate-700">
              <span className="font-bold text-indigo-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Kata Kunci SPM:
              </span>
              <p className="text-[11px] text-slate-600">
                Atom-atom bukan logam menyumbang dan <strong>berkongsi pasangan elektron</strong> untuk mencapai susunan elektron oktet (8) atau duplet (2) yang stabil.
              </p>
            </div>
          </div>

          <button
            onClick={handleShareElectrons}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition"
          >
            <Atom className="w-4 h-4" /> Sahkan Pembentukan Ikatan
          </button>

        </div>

      </div>
    </div>
  );
};
