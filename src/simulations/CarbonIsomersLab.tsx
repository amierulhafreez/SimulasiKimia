import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { Network, Share2, Sparkles, CheckCircle2, Info } from 'lucide-react';

interface IsomerOption {
  id: string;
  name: string;
  iupac: string;
  molecularFormula: string;
  type: string;
  structureAscii: string;
  description: string;
}

const ISOMER_SETS = [
  {
    family: 'Isomer Butana (C₄H₁₀)',
    isomers: [
      {
        id: 'butane_straight',
        name: 'Butana (Rantai Lurus)',
        iupac: 'Butana',
        molecularFormula: 'C₄H₁₀',
        type: 'Isomer Rantai',
        structureAscii: `  H   H   H   H
  |   |   |   |
H-C - C - C - C-H
  |   |   |   |
  H   H   H   H`,
        description: 'Rantai berterusan 4 atom karbon.'
      },
      {
        id: 'isobutane',
        name: '2-Metilpropana (Bercabang)',
        iupac: '2-Metilpropana',
        molecularFormula: 'C₄H₁₀',
        type: 'Isomer Rantai',
        structureAscii: `      H
      |
    H-C-H
  H   |   H
  |   |   |
H-C - C - C-H
  |   |   |
  H   H   H`,
        description: 'Rantai terpanjang 3 atom karbon dengan cabang metil pada C-2.'
      }
    ]
  },
  {
    family: 'Isomer Butena (C₄H₈)',
    isomers: [
      {
        id: 'but_1_ene',
        name: 'But-1-ena',
        iupac: 'But-1-ena',
        molecularFormula: 'C₄H₈',
        type: 'Isomer Kedudukan',
        structureAscii: `  H   H   H
  |   |   |
H-C = C - C - C-H
  |       |   |
  H       H   H`,
        description: 'Ikatan ganda dua C=C terletak pada karbon pertama (C-1).'
      },
      {
        id: 'but_2_ene',
        name: 'But-2-ena',
        iupac: 'But-2-ena',
        molecularFormula: 'C₄H₈',
        type: 'Isomer Kedudukan',
        structureAscii: `  H           H
  |           |
H-C - C = C - C-H
  |   |   |   |
  H   H   H   H`,
        description: 'Ikatan ganda dua C=C terletak pada karbon kedua (C-2).'
      }
    ]
  }
];

export const CarbonIsomersLab: React.FC = () => {
  const SIM_ID = 'penentuan-isomer';
  const [selectedFamilyIdx, setSelectedFamilyIdx] = useState<number>(0);
  const [selectedIsomerIdx, setSelectedIsomerIdx] = useState<number>(0);

  const currentFamily = ISOMER_SETS[selectedFamilyIdx];
  const currentIsomer = currentFamily.isomers[selectedIsomerIdx];

  const handleSelectIsomer = (familyIdx: number, isomerIdx: number) => {
    setSelectedFamilyIdx(familyIdx);
    setSelectedIsomerIdx(isomerIdx);
    analytics.recordSimulationClick(SIM_ID, 1);
    analytics.recordSimulationCompleted(SIM_ID);
  };

  return (
    <div className="space-y-6">
      {/* Family Tabs */}
      <div className="flex flex-wrap gap-2">
        {ISOMER_SETS.map((fam, idx) => (
          <button
            key={fam.family}
            onClick={() => handleSelectIsomer(idx, 0)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedFamilyIdx === idx
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {fam.family}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* Left: Structure Viewer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[340px] bg-slate-900 text-slate-100 rounded-2xl p-6 relative border border-slate-800">
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
              {currentIsomer.type}
            </span>
            <span className="font-mono text-xs text-amber-400 font-bold">{currentIsomer.molecularFormula}</span>
          </div>

          {/* ASCII Structural Formula with clean monospaced rendering */}
          <pre className="font-mono text-sm leading-relaxed text-emerald-400 font-bold bg-black/40 p-6 rounded-xl border border-slate-800 shadow-inner overflow-x-auto max-w-full text-center">
            {currentIsomer.structureAscii}
          </pre>

          <span className="text-xs text-slate-300 font-display font-bold mt-4">
            Formula Struktur: {currentIsomer.name}
          </span>
        </div>

        {/* Right: Isomer Selection & IUPAC Rule Guide */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Pilih Isomer untuk Dipaparkan:
            </h4>

            <div className="space-y-2">
              {currentFamily.isomers.map((iso, idx) => (
                <button
                  key={iso.id}
                  onClick={() => handleSelectIsomer(selectedFamilyIdx, idx)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    selectedIsomerIdx === idx
                      ? 'bg-purple-50 border-purple-400 text-purple-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{iso.iupac}</p>
                    <p className="text-[11px] text-slate-500">{iso.description}</p>
                  </div>
                  {selectedIsomerIdx === idx && (
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* IUPAC Rules Tip */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5 text-slate-700">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Peraturan Penamaan IUPAC SPM:
              </span>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Kenal pasti rantai karbon terpanjang yang mengandungi kumpulan berfungsi.</li>
                <li>Nomborkan rantai karbon dari hujung yang paling hampir dengan ikatan ganda dua atau cabang.</li>
                <li>Namakan cabang alkil (cth: metil, etil) beserta nombor kedudukannya.</li>
              </ol>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 font-semibold text-center">
            Definisi: Isomer ialah molekul dengan formula molekul sama tetapi formula struktur berbeza.
          </div>

        </div>

      </div>
    </div>
  );
};
