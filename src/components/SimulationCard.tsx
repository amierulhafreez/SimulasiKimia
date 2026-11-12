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
  CheckCircle2
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

export const SimulationCard: React.FC<Props> = ({ simulation, views, completed, onSelect }) => {
  const isT4 = simulation.form === 'Tingkatan 4';

  return (
    <div 
      data-testid={`sim-card-${simulation.id}`}
      data-form={simulation.form}
      onClick={() => onSelect(simulation)}
      className={`group relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xs cursor-pointer overflow-hidden transform hover:-translate-y-1 border ${
        isT4
          ? 'bg-gradient-to-br from-[#F0F7FF] via-[#E9F3FF] to-[#E3EEFF] hover:from-[#F4F9FF] hover:to-[#EBF3FF] border-[#B6D7FB] hover:border-purple-400 hover:shadow-lg hover:shadow-purple-600/15'
          : 'bg-white hover:bg-emerald-50/20 border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/10'
      }`}
    >
      <div className="space-y-3 relative z-10">
        
        {/* Card Header with Level badge and Icon */}
        <div className="flex items-start justify-between gap-2">
          
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition duration-200 border ${
            isT4
              ? 'bg-purple-100/90 border-purple-200 group-hover:bg-purple-600 group-hover:border-purple-600 text-purple-700 group-hover:text-white'
              : 'bg-emerald-50 border-emerald-200 group-hover:bg-emerald-600 group-hover:border-emerald-600 text-emerald-700 group-hover:text-white'
          }`}>
            {renderIcon(simulation.iconName, 'w-5 h-5')}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              isT4
                ? 'bg-purple-100 text-purple-800 border border-purple-300/80' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {simulation.form}
            </span>

            {/* Live interaction count tag */}
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <Eye className="w-3 h-3 text-slate-400" />
              <span>{views} views</span>
            </div>
          </div>

        </div>

        {/* Title and Chapter */}
        <div>
          <h3 className={`font-display font-bold text-base text-slate-900 transition duration-150 line-clamp-1 ${
            isT4 ? 'group-hover:text-purple-700' : 'group-hover:text-emerald-700'
          }`}>
            {simulation.title}
          </h3>
          <p className={`text-xs font-medium line-clamp-1 mt-0.5 ${
            isT4 ? 'text-slate-600' : 'text-slate-500'
          }`}>
            {simulation.chapter}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {simulation.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {simulation.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className={`text-[9px] px-2 py-0.5 rounded-md border ${
                isT4
                  ? 'bg-white/80 text-slate-700 border-[#C7DFFE]'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>

      </div>

      {/* Card Footer Button */}
      <div className={`pt-4 mt-4 border-t flex items-center justify-between relative z-10 ${
        isT4 ? 'border-[#C7DFFE]' : 'border-slate-100'
      }`}>
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-bold text-slate-700">{completed}</span> selesai
        </span>

        <button 
          className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition duration-150 shadow-2xs ${
            isT4
              ? 'bg-white/90 group-hover:bg-purple-600 border-purple-200 group-hover:border-purple-600 text-purple-700 group-hover:text-white'
              : 'bg-emerald-50 group-hover:bg-emerald-600 border-emerald-200 group-hover:border-emerald-600 text-emerald-700 group-hover:text-white'
          }`}
        >
          <span>Cuba Simulasi</span>
          <Play className="w-3 h-3 fill-current" />
        </button>
      </div>

    </div>
  );
};
