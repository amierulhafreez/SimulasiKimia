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
  Eye,
  CheckCircle2
} from 'lucide-react';

interface Props {
  simulation: SimulationItem;
  views: number;
  completed: number;
  onSelect: (sim: SimulationItem) => void;
}

// Icon mapper
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
    default: return <FlaskConical className={className} />;
  }
};

export const SimulationCard: React.FC<Props> = ({ simulation, views, completed, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(simulation)}
      className="group relative bg-[#131427]/80 hover:bg-[#181a33] border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/30 cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      {/* Decorative gradient blur on hover */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-600/10 group-hover:bg-purple-600/20 rounded-full blur-2xl transition duration-300 pointer-events-none"></div>

      <div className="space-y-3 relative z-10">
        
        {/* Card Header with Level badge and Icon */}
        <div className="flex items-start justify-between gap-2">
          
          <div className="w-11 h-11 rounded-xl bg-purple-950/50 border border-purple-500/30 group-hover:border-purple-400 flex items-center justify-center text-purple-300 transition duration-300">
            {renderIcon(simulation.iconName, 'w-5 h-5')}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              simulation.form === 'Tingkatan 4' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {simulation.form}
            </span>

            {/* Live interaction count tag */}
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Eye className="w-3 h-3 text-slate-500" />
              <span>{views} views</span>
            </div>
          </div>

        </div>

        {/* Title and Chapter */}
        <div>
          <h3 className="font-display font-bold text-base text-white group-hover:text-purple-300 transition duration-200 line-clamp-1">
            {simulation.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
            {simulation.chapter}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
          {simulation.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {simulation.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>

      </div>

      {/* Card Footer Button */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300">{completed}</span> selesai
        </span>

        <button 
          className="px-3 py-1.5 rounded-lg bg-purple-600/30 group-hover:bg-purple-600 border border-purple-500/40 text-purple-200 group-hover:text-white text-xs font-semibold flex items-center gap-1.5 transition duration-200 shadow"
        >
          <span>Cuba Simulasi</span>
          <Play className="w-3 h-3 fill-current" />
        </button>
      </div>

    </div>
  );
};
