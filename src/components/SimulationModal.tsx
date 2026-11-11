import React, { useEffect } from 'react';
import { SimulationItem } from '../types/simulation';
import { analytics } from '../services/analytics';
import { AcidBaseTitration } from '../simulations/AcidBaseTitration';
import { GasTestLab } from '../simulations/GasTestLab';
import { LatexCoagulation } from '../simulations/LatexCoagulation';
import { NaphthaleneCooling } from '../simulations/NaphthaleneCooling';
import { ChemicalEquationBalancer } from '../simulations/ChemicalEquationBalancer';
import { CationAnionLab } from '../simulations/CationAnionLab';
import { ElectrolysisLab } from '../simulations/ElectrolysisLab';
import { ThermochemistryLab } from '../simulations/ThermochemistryLab';
import { CarbonIsomersLab } from '../simulations/CarbonIsomersLab';
import { ReactivityLab } from '../simulations/ReactivityLab';
import { SaltSolubilityLab } from '../simulations/SaltSolubilityLab';
import { CovalentFormulaLab } from '../simulations/CovalentFormulaLab';
import { SoapMakingLab } from '../simulations/SoapMakingLab';
import { IntermolecularForcesLab } from '../simulations/IntermolecularForcesLab';
import { X, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  simulation: SimulationItem | null;
  onClose: () => void;
}

export const SimulationModal: React.FC<Props> = ({ simulation, onClose }) => {
  useEffect(() => {
    if (simulation) {
      analytics.recordSimulationView(simulation.id);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [simulation]);

  if (!simulation) return null;

  const renderSimulationContent = () => {
    switch (simulation.id) {
      case 'pentitratan-asid-alkali':
        return <AcidBaseTitration />;
      case 'ujian-gas':
        return <GasTestLab />;
      case 'pemanasan-dan-penyejukkan-naftalena':
        return <NaphthaleneCooling />;
      case 'penyeimbangan-persamaan-kimia':
        return <ChemicalEquationBalancer />;
      case 'penggumpalan-lateks':
        return <LatexCoagulation />;
      case 'ujian-kation':
      case 'ujian-anion':
        return <CationAnionLab />;
      case 'elektrolisis':
        return <ElectrolysisLab />;
      case 'keterlarutan-garam':
        return <SaltSolubilityLab />;
      case 'penentuan-isomer':
      case 'formula-struktur-karbon':
        return <CarbonIsomersLab />;
      case 'kereaktifan-k1-dan-k17':
        return <ReactivityLab />;
      case 'penghasilan-sebatian-kovalen':
      case 'penghasilan-formula-kimia':
        return <CovalentFormulaLab />;
      case 'haba-penyesaran':
        return <ThermochemistryLab />;
      case 'penghasilan-sabun':
        return <SoapMakingLab />;
      case 'daya-tarikan-zarah':
        return <IntermolecularForcesLab />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                Modul Eksperimen Interaktif KSSM SPM
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {simulation.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                  <h4 className="text-xs uppercase font-bold text-slate-500">Standard Pembelajaran DSKP:</h4>
                  <p className="text-xs text-purple-900 font-medium">{simulation.learningStandard}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                  <h4 className="text-xs uppercase font-bold text-slate-500">Kata Kunci Penting SPM:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {simulation.tags.map((t, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
                <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" /> Prosedur Standard Makmal Maya:
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
                    <span>Sediakan radas dan bahan kimia mengikut sukatan stoikiometri yang tepat.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
                    <span>Jalankan pemanasan / tindak balas kimia dan perhatikan perubahan warna atau pembentukan gas.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">3</span>
                    <span>Catat data pemerhatian ke dalam jadual laporan amali Sains SPM.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              simulation.form === 'Tingkatan 4' 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {simulation.form}
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                {simulation.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{simulation.chapter}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition border border-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#fcfdff]">
          {renderSimulationContent()}
        </div>

      </div>
    </div>
  );
};
