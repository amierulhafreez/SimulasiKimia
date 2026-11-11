import React, { useState } from 'react';
import { analytics } from '../services/analytics';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, Scale, Sparkles, ArrowRight } from 'lucide-react';

interface EquationProblem {
  id: string;
  name: string;
  reactants: { name: string; formula: string; atoms: Record<string, number>; defaultCoeff: number }[];
  products: { name: string; formula: string; atoms: Record<string, number>; defaultCoeff: number }[];
  targetCoeffs: { reactants: number[]; products: number[] };
}

const EQUATIONS: EquationProblem[] = [
  {
    id: 'eq1',
    name: 'Pembentukan Air (H₂ + O₂ → H₂O)',
    reactants: [
      { name: 'Gas Hidrogen', formula: 'H₂', atoms: { H: 2 }, defaultCoeff: 1 },
      { name: 'Gas Oksigen', formula: 'O₂', atoms: { O: 2 }, defaultCoeff: 1 }
    ],
    products: [
      { name: 'Air', formula: 'H₂O', atoms: { H: 2, O: 1 }, defaultCoeff: 1 }
    ],
    targetCoeffs: { reactants: [2, 1], products: [2] }
  },
  {
    id: 'eq2',
    name: 'Sintesis Ammonia (Proses Haber: N₂ + H₂ → NH₃)',
    reactants: [
      { name: 'Gas Nitrogen', formula: 'N₂', atoms: { N: 2 }, defaultCoeff: 1 },
      { name: 'Gas Hidrogen', formula: 'H₂', atoms: { H: 2 }, defaultCoeff: 1 }
    ],
    products: [
      { name: 'Gas Ammonia', formula: 'NH₃', atoms: { N: 1, H: 3 }, defaultCoeff: 1 }
    ],
    targetCoeffs: { reactants: [1, 3], products: [2] }
  },
  {
    id: 'eq3',
    name: 'Tindak Balas Logam & Asid (Mg + HCl → MgCl₂ + H₂)',
    reactants: [
      { name: 'Magnesium', formula: 'Mg', atoms: { Mg: 1 }, defaultCoeff: 1 },
      { name: 'Asid Hidroklorik', formula: 'HCl', atoms: { H: 1, Cl: 1 }, defaultCoeff: 1 }
    ],
    products: [
      { name: 'Magnesium Klorida', formula: 'MgCl₂', atoms: { Mg: 1, Cl: 2 }, defaultCoeff: 1 },
      { name: 'Gas Hidrogen', formula: 'H₂', atoms: { H: 2 }, defaultCoeff: 1 }
    ],
    targetCoeffs: { reactants: [1, 2], products: [1, 1] }
  }
];

export const ChemicalEquationBalancer: React.FC = () => {
  const SIM_ID = 'penyeimbangan-persamaan-kimia';
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const eq = EQUATIONS[currentIdx];

  const [reactantCoeffs, setReactantCoeffs] = useState<number[]>(eq.reactants.map(r => r.defaultCoeff));
  const [productCoeffs, setProductCoeffs] = useState<number[]>(eq.products.map(p => p.defaultCoeff));

  const changeReactantCoeff = (index: number, delta: number) => {
    setReactantCoeffs(prev => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(8, next[index] + delta));
      analytics.recordSimulationClick(SIM_ID, 1);
      return next;
    });
  };

  const changeProductCoeff = (index: number, delta: number) => {
    setProductCoeffs(prev => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(8, next[index] + delta));
      analytics.recordSimulationClick(SIM_ID, 1);
      return next;
    });
  };

  // Calculate atom sums on both sides
  const getAtomCounts = () => {
    const left: Record<string, number> = {};
    const right: Record<string, number> = {};

    eq.reactants.forEach((r, idx) => {
      const coeff = reactantCoeffs[idx];
      Object.entries(r.atoms).forEach(([atom, count]) => {
        left[atom] = (left[atom] || 0) + count * coeff;
      });
    });

    eq.products.forEach((p, idx) => {
      const coeff = productCoeffs[idx];
      Object.entries(p.atoms).forEach(([atom, count]) => {
        right[atom] = (right[atom] || 0) + count * coeff;
      });
    });

    const allAtoms = Array.from(new Set([...Object.keys(left), ...Object.keys(right)]));
    const isBalanced = allAtoms.every(a => left[a] === right[a]);

    return { left, right, allAtoms, isBalanced };
  };

  const { left, right, allAtoms, isBalanced } = getAtomCounts();

  React.useEffect(() => {
    if (isBalanced) {
      analytics.recordSimulationCompleted(SIM_ID);
      confetti({ particleCount: 70, spread: 60 });
    }
  }, [isBalanced]);

  const handleSelectProblem = (idx: number) => {
    setCurrentIdx(idx);
    const newEq = EQUATIONS[idx];
    setReactantCoeffs(newEq.reactants.map(r => r.defaultCoeff));
    setProductCoeffs(newEq.products.map(p => p.defaultCoeff));
    analytics.recordSimulationClick(SIM_ID, 1);
  };

  return (
    <div className="space-y-6">
      {/* Problem Selection Tabs */}
      <div className="flex flex-wrap gap-2">
        {EQUATIONS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => handleSelectProblem(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              currentIdx === idx
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Equation Board */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
        
        {/* Interactive Equation Ribbon */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-center gap-4 text-slate-800">
          
          {/* Reactants */}
          <div className="flex items-center gap-3">
            {eq.reactants.map((r, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-xl font-bold text-slate-400">+</span>}
                <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <button 
                      onClick={() => changeReactantCoeff(i, 1)}
                      className="w-5 h-4 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 font-bold text-[10px] rounded flex items-center justify-center"
                    >▲</button>
                    <button 
                      onClick={() => changeReactantCoeff(i, -1)}
                      className="w-5 h-4 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 font-bold text-[10px] rounded flex items-center justify-center"
                    >▼</button>
                  </div>
                  <span className="font-mono font-extrabold text-xl text-purple-700 w-5 text-center">
                    {reactantCoeffs[i]}
                  </span>
                  <span className="font-display font-bold text-lg text-slate-900">{r.formula}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Arrow */}
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Products */}
          <div className="flex items-center gap-3">
            {eq.products.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-xl font-bold text-slate-400">+</span>}
                <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <button 
                      onClick={() => changeProductCoeff(i, 1)}
                      className="w-5 h-4 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 font-bold text-[10px] rounded flex items-center justify-center"
                    >▲</button>
                    <button 
                      onClick={() => changeProductCoeff(i, -1)}
                      className="w-5 h-4 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 font-bold text-[10px] rounded flex items-center justify-center"
                    >▼</button>
                  </div>
                  <span className="font-mono font-extrabold text-xl text-purple-700 w-5 text-center">
                    {productCoeffs[i]}
                  </span>
                  <span className="font-display font-bold text-lg text-slate-900">{p.formula}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>

        {/* Atom Balance Comparator */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-purple-600" />
            Semakan Bilangan Atom (Kiri vs Kanan):
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allAtoms.map(atom => {
              const lCount = left[atom] || 0;
              const rCount = right[atom] || 0;
              const match = lCount === rCount;

              return (
                <div 
                  key={atom}
                  className={`p-3 rounded-xl border flex items-center justify-between transition ${
                    match 
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                      : 'bg-rose-50/80 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-white border border-current font-bold text-xs flex items-center justify-center">
                      {atom}
                    </span>
                    <span className="text-xs font-semibold">Atom {atom}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <span>{lCount}</span>
                    <span className="text-slate-400">vs</span>
                    <span>{rCount}</span>
                    <span className="text-sm">{match ? '✅' : '❌'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Alert */}
        {isBalanced ? (
          <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-sm">Persamaan Kimia Seimbang! 🎉</p>
              <p className="text-slate-700">Hukum Keabadian Jisim dipenuhi: bilangan setiap jenis atom pada kedua-dua belah tindak balas adalah sama.</p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span>Ubah pekali menggunakan anak panah ▲ dan ▼ sehingga semua atom seimbang.</span>
            <button
              onClick={() => {
                setReactantCoeffs(eq.reactants.map(r => r.defaultCoeff));
                setProductCoeffs(eq.products.map(p => p.defaultCoeff));
              }}
              className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
