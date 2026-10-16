import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { AlignmentFilter, SortOption } from '../services/superheroService';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  alignment: AlignmentFilter;
  onAlignmentChange: (alignment: AlignmentFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  alignment,
  onAlignmentChange,
  sortBy,
  onSortChange,
  totalResults,
}) => {
  return (
    <div className="bg-[#121212] border border-[#222222] p-4 lg:p-6 mb-8 space-y-4">
      {/* Top Row: Search and Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="md:col-span-7 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, identidad real (ej: Peter Parker, Tony Stark)..."
            className="w-full pl-10 pr-10 py-2.5 bg-[#0a0a0a] border border-[#2e2e2e] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ED1D24] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-5 relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full pl-10 pr-8 py-2.5 bg-[#0a0a0a] border border-[#2e2e2e] text-white text-xs uppercase tracking-wider font-semibold focus:outline-none focus:border-[#ED1D24] transition-colors appearance-none cursor-pointer"
          >
            <option value="name-asc">Nombre: A → Z</option>
            <option value="name-desc">Nombre: Z → A</option>
            <option value="overall-desc">Mayor Poder General</option>
            <option value="power-desc">Mayor Poder Bruto</option>
            <option value="combat-desc">Mayor Habilidad de Combate</option>
            <option value="strength-desc">Mayor Fuerza</option>
            <option value="intelligence-desc">Mayor Inteligencia</option>
            <option value="speed-desc">Mayor Velocidad</option>
            <option value="durability-desc">Mayor Resistencia</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Bottom Row: Alignment Filter Tabs & Results count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1e1e1e]">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mr-1 flex items-center space-x-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ED1D24]" />
            <span className="hidden sm:inline">Bando:</span>
          </span>

          <button
            onClick={() => onAlignmentChange('all')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              alignment === 'all'
                ? 'bg-[#ED1D24] text-white border border-[#ED1D24]'
                : 'bg-[#181818] text-gray-300 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => onAlignmentChange('heroes')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              alignment === 'heroes'
                ? 'bg-blue-600 text-white border border-blue-500'
                : 'bg-[#181818] text-gray-300 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Héroes
          </button>

          <button
            onClick={() => onAlignmentChange('villains')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              alignment === 'villains'
                ? 'bg-red-800 text-white border border-red-700'
                : 'bg-[#181818] text-gray-300 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Villanos
          </button>

          <button
            onClick={() => onAlignmentChange('neutral')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              alignment === 'neutral'
                ? 'bg-zinc-600 text-white border border-zinc-500'
                : 'bg-[#181818] text-gray-300 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Neutrales
          </button>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Mostrando <span className="text-white font-bold">{totalResults}</span> personajes de Marvel Comics
        </div>
      </div>
    </div>
  );
};
