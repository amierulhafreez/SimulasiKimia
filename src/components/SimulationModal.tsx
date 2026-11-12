import React, { useEffect } from 'react';
import { SimulationItem } from '../types/simulation';
import { analytics } from '../services/analytics';
import { AcidBaseTitration } from '../simulations/AcidBaseTitration';
import { GasTestLab } from '../simulations/GasTestLab';
import { LatexCoagulation } from '../simulations/LatexCoagulation';
import { NaphthaleneCooling } from '../simulations/NaphthaleneCooling';
import { ChemicalEquationBalancer } from '../simulations/ChemicalEquationBalancer';
import { AnionTestLab } from '../simulations/AnionTestLab';
import { CationTestLab } from '../simulations/CationTestLab';
import { ElectrolysisLab } from '../simulations/ElectrolysisLab';
import { ThermochemistryLab } from '../simulations/ThermochemistryLab';
import { CarbonIsomersLab } from '../simulations/CarbonIsomersLab';
import { CarbonStructureBuilderLab } from '../simulations/CarbonStructureBuilderLab';
import { ReactivityLab } from '../simulations/ReactivityLab';
import { SaltSolubilityLab } from '../simulations/SaltSolubilityLab';
import { CovalentFormulaLab } from '../simulations/CovalentFormulaLab';
import { IonicFormulaLab } from '../simulations/IonicFormulaLab';
import { SoapMakingLab } from '../simulations/SoapMakingLab';
import { IntermolecularForcesLab } from '../simulations/IntermolecularForcesLab';
import { StandardSolutionLab } from '../simulations/StandardSolutionLab';
import { RateOfReactionSizeLab } from '../simulations/RateOfReactionSizeLab';
import { RateOfReactionConcentrationLab } from '../simulations/RateOfReactionConcentrationLab';
import { RateOfReactionTemperatureLab } from '../simulations/RateOfReactionTemperatureLab';
import { RateOfReactionCatalystLab } from '../simulations/RateOfReactionCatalystLab';
import { StatesOfMatterLab } from '../simulations/StatesOfMatterLab';
import { IronExtractionLab } from '../simulations/IronExtractionLab';
import { AluminumExtractionLab } from '../simulations/AluminumExtractionLab';
import { HeatOfCombustionLab } from '../simulations/HeatOfCombustionLab';
import { FuelValueLab } from '../simulations/FuelValueLab';
import { MagnesiumOxideLab } from '../simulations/MagnesiumOxideLab';
import { CopperOxideLab } from '../simulations/CopperOxideLab';
import { Period3OxidesLab } from '../simulations/Period3OxidesLab';
import { AlloyHardnessLab } from '../simulations/AlloyHardnessLab';
import { UTubeElectronTransferLab } from '../simulations/UTubeElectronTransferLab';
import { IronIonConversionLab } from '../simulations/IronIonConversionLab';
import { HalogenDisplacementLab } from '../simulations/HalogenDisplacementLab';
import { VoltaicCellLab } from '../simulations/VoltaicCellLab';
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
        return <CationTestLab />;
      case 'ujian-anion':
        return <AnionTestLab />;
      case 'elektrolisis':
        return <ElectrolysisLab />;
      case 'keterlarutan-garam':
        return <SaltSolubilityLab />;
      case 'penentuan-isomer':
        return <CarbonIsomersLab />;
      case 'formula-struktur-karbon':
        return <CarbonStructureBuilderLab />;
      case 'kereaktifan-k1-dan-k17':
        return <ReactivityLab />;
      case 'penghasilan-sebatian-kovalen':
        return <CovalentFormulaLab />;
      case 'penghasilan-formula-kimia':
        return <IonicFormulaLab />;
      case 'haba-penyesaran':
        return <ThermochemistryLab />;
      case 'penghasilan-sabun':
        return <SoapMakingLab />;
      case 'daya-tarikan-zarah':
        return <IntermolecularForcesLab />;
      case 'penyediaan-larutan-piawai':
        return <StandardSolutionLab />;
      case 'kadar-tindak-balas-saiz':
        return <RateOfReactionSizeLab />;
      case 'kadar-tindak-balas-kepekatan':
        return <RateOfReactionConcentrationLab />;
      case 'kadar-tindak-balas-suhu':
        return <RateOfReactionTemperatureLab />;
      case 'kadar-tindak-balas-mangkin':
        return <RateOfReactionCatalystLab />;
      case 'keadaan-zarah-jirim':
        return <StatesOfMatterLab />;
      case 'pengekstrakan-besi':
        return <IronExtractionLab />;
      case 'pengekstrakan-aluminium':
        return <AluminumExtractionLab />;
      case 'haba-pembakaran':
        return <HeatOfCombustionLab />;
      case 'nilai-bahan-api':
        return <FuelValueLab />;
      case 'formula-empirik-mgo':
        return <MagnesiumOxideLab />;
      case 'formula-empirik-cuo':
        return <CopperOxideLab />;
      case 'sifat-oksida-kala-3':
        return <Period3OxidesLab />;
      case 'kekerasan-aloi-logam-tulen':
        return <AlloyHardnessLab />;
      case 'pemindahan-elektron-tiub-u':
        return <UTubeElectronTransferLab />;
      case 'penukaran-ion-ferum':
        return <IronIonConversionLab />;
      case 'penyesaran-halogen-halida':
        return <HalogenDisplacementLab />;
      case 'sel-kimia-voltan':
        return <VoltaicCellLab />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Simulasi Interaktif Bakal Tiba (Dalam Pembangunan)</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {simulation.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                  <h4 className="text-xs uppercase font-bold text-slate-500">Standard Pembelajaran DSKP:</h4>
                  <p className="text-xs text-slate-800 font-medium">{simulation.learningStandard}</p>
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

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-950">
                <BookOpen className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                <span>
                  Tajuk eksperimen ini telah didaftarkan mengikut susunan topik buku teks KSSM. Simulasi maya interaktif penuh bersama rajah radas dan pengiraan akan ditambah tidak lama lagi.
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              simulation.form === 'Tingkatan 4' 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {simulation.form}
            </span>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                {simulation.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{simulation.chapter}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition border border-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#fcfdff]">
          {renderSimulationContent()}
        </div>

      </div>
    </div>
  );
};
