import React, { useEffect } from 'react';
import { SimulationItem } from '../types/simulation';
import { analytics } from '../services/analytics';
import { AcidBaseTitration } from '../simulations/AcidBaseTitration';
import { GasTestLab } from '../simulations/GasTestLab';
import { LatexCoagulation } from '../simulations/LatexCoagulation';
import { X, Sparkles, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';

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
      case 'penggumpalan-lateks':
        return <LatexCoagulation />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                Modul Eksperimen Interaktif KSSM SPM
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {simulation.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-black/30 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs uppercase font-bold text-slate-400">Standard Pembelajaran DSKP:</h4>
                  <p className="text-xs text-purple-300 font-medium">{simulation.learningStandard}</p>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs uppercase font-bold text-slate-400">Kata Kunci Penting SPM:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {simulation.tags.map((t, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Checklist / Steps */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" /> Prosedur Standard Makmal Maya:
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-200 flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
                    <span>Sediakan radas dan bahan kimia mengikut sukatan stoikiometri yang tepat.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-200 flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
                    <span>Jalankan pemanasan / tindak balas kimia dan perhatikan perubahan warna atau pembentukan gas.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-200 flex items-center justify-center text-[10px] shrink-0 font-bold">3</span>
                    <span>Catat data pemerhatian ke dalam jadual laporan amali Sains SPM.</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    analytics.recordSimulationClick(simulation.id, 1);
                    analytics.recordSimulationCompleted(simulation.id);
                    alert('Tahniah! Modul eksperimen disemak.');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition"
                >
                  Tandakan Selesai Ulangkaji Topik Ini
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121324] border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              simulation.form === 'Tingkatan 4' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {simulation.form}
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {simulation.title}
              </h3>
              <p className="text-xs text-slate-400">{simulation.chapter}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {renderSimulationContent()}
        </div>

      </div>
    </div>
  );
};
