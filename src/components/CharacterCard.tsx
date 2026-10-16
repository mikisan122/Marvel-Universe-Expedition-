import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ChevronRight, ShieldCheck, Skull, HelpCircle, Loader2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import type { Character } from '../types/character';

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isToggling, setIsToggling] = useState(false);
  const [imageError, setImageError] = useState(false);

  const favorited = isFavorite(character.id);
  const alignment = character.biography?.alignment?.toLowerCase();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login', { state: { message: 'Inicia sesión para guardar a este personaje en tus favoritos.' } });
      return;
    }

    try {
      setIsToggling(true);
      await toggleFavorite(character);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsToggling(false);
    }
  };

  // Image source priority
  const imageUrl = character.images?.lg || character.images?.md || character.images?.sm;

  // Alignment badge info
  const getAlignmentBadge = () => {
    if (alignment === 'good') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-500/30">
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          <span>Héroe</span>
        </span>
      );
    }
    if (alignment === 'bad') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-950/70 text-red-300 border border-red-600/40">
          <Skull className="w-3 h-3 text-[#ED1D24]" />
          <span>Villano</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
        <HelpCircle className="w-3 h-3 text-zinc-400" />
        <span>Neutral</span>
      </span>
    );
  };

  // Combat overall score
  const statsValues = character.powerstats ? Object.values(character.powerstats) : [];
  const overallPower = statsValues.length > 0
    ? Math.round(statsValues.reduce((a, b) => a + (b || 0), 0) / statsValues.length)
    : 0;

  return (
    <div className="group relative bg-[#121212] border border-[#242424] hover:border-[#ED1D24] transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_0_25px_-5px_rgba(237,29,36,0.25)]">
      {/* Top Banner & Favorite Action */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d0d0d]">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={character.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-top filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#141414] text-gray-500">
            <span className="font-bebas text-3xl text-gray-400">{character.name}</span>
            <span className="text-xs uppercase tracking-wider mt-1">Marvel Comics</span>
          </div>
        )}

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div>{getAlignmentBadge()}</div>

          <button
            onClick={handleFavoriteClick}
            disabled={isToggling}
            aria-label={favorited ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
            className={`pointer-events-auto w-9 h-9 flex items-center justify-center border transition-all duration-200 ${
              favorited
                ? 'bg-[#ED1D24] border-[#ED1D24] text-white shadow-lg shadow-red-900/50 scale-105'
                : 'bg-[#080808]/80 hover:bg-[#ED1D24] border-white/20 hover:border-[#ED1D24] text-gray-300 hover:text-white'
            }`}
          >
            {isToggling ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current text-white' : ''}`} />
            )}
          </button>
        </div>

        {/* Bottom Image Stats Bar */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs font-mono">
          <span className="text-[11px] text-gray-300 bg-black/70 px-2 py-0.5 border border-white/10 uppercase tracking-wider">
            ID #{character.id}
          </span>
          {overallPower > 0 && (
            <span className="text-[11px] text-white font-bold bg-[#ED1D24]/90 px-2 py-0.5 uppercase tracking-wider">
              PWR {overallPower}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-oswald text-xl font-bold uppercase tracking-wide text-white group-hover:text-[#ED1D24] transition-colors leading-tight line-clamp-1">
            {character.name}
          </h3>
          <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
            {character.biography?.fullName || 'Identidad no revelada'}
          </p>
        </div>

        {/* First Appearance or Occupation snippet */}
        <div className="pt-2 border-t border-[#1f1f1f] text-[11px] text-gray-400 line-clamp-1">
          <span className="text-gray-400">Debut: </span>
          <span className="text-gray-300 font-medium">
            {character.biography?.firstAppearance || 'Información no disponible'}
          </span>
        </div>

        {/* View Details Link */}
        <Link
          to={`/personajes/${character.id}`}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#1a1a1a] hover:bg-[#ED1D24] text-gray-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-[#2b2b2b] hover:border-[#ED1D24]"
        >
          <span>Ver Expediente</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
