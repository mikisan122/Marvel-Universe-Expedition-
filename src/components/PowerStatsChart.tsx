import React from 'react';
import type { PowerStats } from '../types/character';
import { Brain, Zap, Gauge, Shield, Flame, Swords } from 'lucide-react';

interface PowerStatsChartProps {
  stats: PowerStats | undefined;
  compact?: boolean;
}

interface StatConfig {
  key: keyof PowerStats;
  label: string;
  icon: React.ElementType;
  barColor: string;
  glowColor: string;
}

const STAT_CONFIGS: StatConfig[] = [
  {
    key: 'intelligence',
    label: 'Inteligencia',
    icon: Brain,
    barColor: 'bg-blue-500',
    glowColor: 'shadow-blue-500/50',
  },
  {
    key: 'strength',
    label: 'Fuerza',
    icon: Zap,
    barColor: 'bg-[#ED1D24]',
    glowColor: 'shadow-red-600/50',
  },
  {
    key: 'speed',
    label: 'Velocidad',
    icon: Gauge,
    barColor: 'bg-amber-400',
    glowColor: 'shadow-amber-400/50',
  },
  {
    key: 'durability',
    label: 'Resistencia',
    icon: Shield,
    barColor: 'bg-orange-500',
    glowColor: 'shadow-orange-500/50',
  },
  {
    key: 'power',
    label: 'Poder',
    icon: Flame,
    barColor: 'bg-purple-500',
    glowColor: 'shadow-purple-500/50',
  },
  {
    key: 'combat',
    label: 'Combate',
    icon: Swords,
    barColor: 'bg-emerald-500',
    glowColor: 'shadow-emerald-500/50',
  },
];

export const PowerStatsChart: React.FC<PowerStatsChartProps> = ({ stats, compact = false }) => {
  if (!stats) {
    return (
      <div className="p-4 bg-[#141414] border border-[#222222] text-gray-400 text-sm italic">
        Estadísticas de habilidades no disponibles para este personaje.
      </div>
    );
  }

  // Calculate overall average power index
  const values = Object.values(stats);
  const total = values.reduce((acc, val) => acc + (val || 0), 0);
  const average = Math.round(total / (values.length || 1));

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-400 uppercase tracking-wider font-semibold">Nivel Global</span>
          <span className="text-[#ED1D24] font-bold font-mono">{average}/100</span>
        </div>
        <div className="w-full bg-[#1b1b1b] h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-600 to-[#ED1D24] h-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, average))}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] border border-[#222222] p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#222222]">
        <h3 className="font-oswald text-lg uppercase tracking-wider text-white font-bold flex items-center space-x-2">
          <span className="w-2 h-5 bg-[#ED1D24] inline-block mr-1"></span>
          <span>Atributos de Combate</span>
        </h3>
        <div className="text-right">
          <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Promedio</span>
          <span className="font-bebas text-2xl text-[#ED1D24] tracking-wider leading-none">
            {average} <span className="text-xs text-gray-400 font-sans">/ 100</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {STAT_CONFIGS.map(({ key, label, icon: Icon, barColor }) => {
          const rawValue = stats[key];
          const value = typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue : 0;
          const displayValue = value > 0 ? value : 'N/D';

          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2 text-gray-300 font-medium">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <span>{label}</span>
                </span>
                <span className="font-mono font-bold text-white text-xs">{displayValue}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1f1f1f] h-2.5 overflow-hidden relative">
                <div
                  className={`h-full ${barColor} transition-all duration-700 ease-out`}
                  style={{ width: `${value > 0 ? value : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
