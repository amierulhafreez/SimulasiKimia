import React from 'react';
import { SimulationItem } from '../types/simulation';
import {
  Play,
  FlaskConical,
  Flame,
  Thermometer,
  Scale,
  Binary,
  Zap,
  Atom,
  BatteryCharging,
  Droplets,
  TestTube,
  Layers,
  Magnet,
  Disc,
  Network,
  Share2,
  Sparkles,
  FlameKindling,
  Timer,
  Fuel,
  Factory,
  Boxes,
  Beaker,
  Eye,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface Props {
  simulation: SimulationItem;
  views: number;
  completed: number;
  onSelect: (sim: SimulationItem) => void;
}

const renderIcon = (name: string, className: string) => {
  switch (name) {
    case 'FlaskConical': return <FlaskConical className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Thermometer': return <Thermometer className={className} />;
    case 'Scale': return <Scale className={className} />;
    case 'Binary': return <Binary className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Atom': return <Atom className={className} />;
    case 'BatteryCharging': return <BatteryCharging className={className} />;
    case 'Droplets': return <Droplets className={className} />;
    case 'TestTube': return <TestTube className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Magnet': return <Magnet className={className} />;
    case 'Disc': return <Disc className={className} />;
    case 'Network': return <Network className={className} />;
    case 'Share2': return <Share2 className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'FlameKindling': return <FlameKindling className={className} />;
    case 'Timer': return <Timer className={className} />;
    case 'Fuel': return <Fuel className={className} />;
    case 'Factory': return <Factory className={className} />;
    case 'Boxes': return <Boxes className={className} />;
    case 'Beaker': return <Beaker className={className} />;
    default: return <FlaskConical className={className} />;
  }
};

export const SimulationCard: React.FC<Props> = ({
  simulation,
  views,
  completed,
  onSelect,
}) => {
  const isT4 = simulation.form === 'Tingkatan 4';

  return (
    <div
      data-testid={`sim-card-${simulation.id}`}
      data-form={simulation.form}
      onClick={() => onSelect(simulation)}
      className="group relative rounded-[24px] p-6 bg-white border border-black/[0.06] flex flex-col justify-between cursor-pointer apple-bento-shadow apple-bento-shadow-hover"
    >
      <div className="space-y-4">
        {/* Card Header: Apple Minimal Icon Tile & Metadata */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
              isT4
                ? 'bg-[#eef4ff] text-[#0071e3] group-hover:bg-[#0071e3] group-hover:text-white'
                : 'bg-[#ecfdf5] text-[#059669] group-hover:bg-[#059669] group-hover:text-white'
            }`}
          >
            {renderIcon(simulation.iconName, 'w-5 h-5')}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isT4
                  ? 'bg-[#eef4ff] text-[#005bb5]'
                  : 'bg-[#ecfdf5] text-[#047857]'
              }`}
            >
              {simulation.form}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#86868b] font-medium">
              <Eye className="w-3 h-3" />
              <span className="tabular-nums">{views}</span>
            </div>
          </div>
        </div>

        {/* Title & Chapter */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#86868b] line-clamp-1">
            {simulation.chapter}
          </p>
          <h3 className="font-display font-semibold text-[17px] leading-snug text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2">
            {simulation.title}
          </h3>
        </div>

        {/* Concise Description */}
        <p className="text-[13px] text-[#6e6e73] line-clamp-2 leading-relaxed">
          {simulation.description}
        </p>
      </div>

      {/* Minimalist Card Footer */}
      <div className="pt-5 mt-5 border-t border-black/[0.06] flex items-center justify-between gap-2">
        <span className="text-[12px] text-[#6e6e73] flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="tabular-nums font-semibold text-[#1d1d1f]">{completed}</span>
          <span>selesai</span>
        </span>

        <button
          type="button"
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold inline-flex items-center gap-1 transition-all duration-200 ${
            isT4
              ? 'bg-[#0071e3]/10 text-[#0071e3] group-hover:bg-[#0071e3] group-hover:text-white'
              : 'bg-[#059669]/10 text-[#059669] group-hover:bg-[#059669] group-hover:text-white'
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Buka</span>
          <ChevronRight className="w-3.5 h-3.5 -ml-0.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
