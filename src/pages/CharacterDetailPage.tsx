import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCharacterDetail } from '../hooks/useCharacterDetail';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { PowerStatsChart } from '../components/PowerStatsChart';
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Skull,
  HelpCircle,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Compass,
  Eye,
  Loader2,
  Share2,
  Check,
} from 'lucide-react';

export const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const characterId = id ? parseInt(id, 10) : undefined;
  const { character, loading, error } = useCharacterDetail(characterId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#ED1D24] animate-spin" />
        <p className="font-oswald text-base uppercase tracking-wider text-gray-400">
          Cargando expediente clasificado de Marvel...
        </p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-red-950/50 border border-[#ED1D24] text-[#ED1D24] flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <h1 className="font-bebas text-4xl text-white tracking-wider uppercase">
          Expediente no Encontrado
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          {error || 'No fue posible localizar el registro del personaje en la base de datos de Marvel Comics.'}
        </p>
        <Link
          to="/personajes"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#181818] hover:bg-[#ED1D24] border border-[#333333] hover:border-[#ED1D24] text-white font-oswald text-xs uppercase tracking-wider font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(character.id);
  const alignment = character.biography?.alignment?.toLowerCase();
  const imageUrl = character.images?.lg || character.images?.md || character.images?.sm;

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login', {
        state: { message: `Inicia sesión para agregar a ${character.name} a tus favoritos.` },
      });
      return;
    }

    try {
      setToggling(true);
      await toggleFavorite(character);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setToggling(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Helper for unavailable info display
  const renderText = (value?: string | null) => {
    if (!value || value.trim() === '-' || value.trim() === '') {
      return <span className="text-gray-500 italic">Información no disponible</span>;
    }
    return <span className="text-gray-200">{value}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/personajes"
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#ED1D24]" />
          <span>Volver a Personajes</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#222222] border border-[#2e2e2e] text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
          title="Copiar enlace del personaje"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Enlace Copiado</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </>
          )}
        </button>
      </div>

      {/* Main Character Header Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Large Portrait Image (5 Cols) */}
        <div className="lg:col-span-5 relative group">
          <div className="relative aspect-[3/4] w-full bg-[#101010] border-2 border-[#222222] overflow-hidden shadow-2xl">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={character.name}
                className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-102 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bebas text-4xl">
                {character.name}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Corner Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-[#ED1D24] text-white font-bebas text-lg tracking-widest px-3 py-1 uppercase shadow-md shadow-red-950">
                MARVEL COMICS
              </span>
            </div>

            {/* Bottom Image Subtitle */}
            <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-gray-400 flex justify-between items-center">
              <span>EXPEDIENTE #{character.id}</span>
              <span className="text-[#ED1D24] font-bold uppercase">
                {character.biography?.publisher || 'Marvel'}
              </span>
            </div>
          </div>

          {/* Large Favorite Action Button */}
          <div className="mt-4">
            <button
              onClick={handleToggleFavorite}
              disabled={toggling}
              className={`w-full py-3.5 px-6 font-oswald text-sm uppercase tracking-wider font-bold flex items-center justify-center space-x-3 transition-all duration-200 border ${
                isFav
                  ? 'bg-[#ED1D24] hover:bg-red-700 text-white border-[#ED1D24] shadow-lg shadow-red-900/40'
                  : 'bg-[#181818] hover:bg-[#ED1D24] text-gray-200 hover:text-white border-[#333333] hover:border-[#ED1D24]'
              }`}
            >
              {toggling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current text-white' : ''}`} />
              )}
              <span>
                {isFav ? 'Quitar de Mis Favoritos' : 'Guardar en Mis Favoritos'}
              </span>
            </button>
            {!user && (
              <p className="text-[11px] text-gray-400 text-center mt-2">
                * Requiere iniciar sesión con tu cuenta de agente
              </p>
            )}
          </div>
        </div>

        {/* Right: Character Info & Stats (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header Title & Badges */}
          <div className="border-b border-[#222222] pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {alignment === 'good' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-500/40">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Superhéroe</span>
                </span>
              )}
              {alignment === 'bad' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-600/50">
                  <Skull className="w-4 h-4 text-[#ED1D24]" />
                  <span>Supervillano</span>
                </span>
              )}
              {alignment !== 'good' && alignment !== 'bad' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                  <HelpCircle className="w-4 h-4 text-zinc-400" />
                  <span>Alineación Neutral</span>
                </span>
              )}

              <span className="px-3 py-1 text-xs font-mono font-bold bg-[#181818] text-gray-400 border border-[#2a2a2a] uppercase">
                {character.appearance?.gender || 'Género no especificado'}
              </span>

              {character.appearance?.race && (
                <span className="px-3 py-1 text-xs font-mono font-bold bg-[#181818] text-gray-400 border border-[#2a2a2a] uppercase">
                  Raza: {character.appearance.race}
                </span>
              )}
            </div>

            <h1 className="font-bebas text-5xl sm:text-7xl text-white tracking-wider uppercase leading-none">
              {character.name}
            </h1>

            <div className="text-lg text-gray-300 font-medium">
              <span className="text-gray-400 font-normal">Identidad real: </span>
              <span className="text-white font-bold">
                {character.biography?.fullName || 'Información no disponible'}
              </span>
            </div>
          </div>

          {/* Power Stats Visual Bars Component */}
          <div>
            <PowerStatsChart stats={character.powerstats} />
          </div>

          {/* Dossier Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box: Primera Aparición */}
            <div className="bg-[#121212] border border-[#222222] p-4 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#ED1D24] text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Primera Aparición</span>
              </div>
              <div className="text-sm">
                {renderText(character.biography?.firstAppearance)}
              </div>
            </div>

            {/* Box: Lugar de Nacimiento */}
            <div className="bg-[#121212] border border-[#222222] p-4 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#ED1D24] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Lugar de Nacimiento</span>
              </div>
              <div className="text-sm">
                {renderText(character.biography?.placeOfBirth)}
              </div>
            </div>

            {/* Box: Ocupación */}
            <div className="bg-[#121212] border border-[#222222] p-4 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#ED1D24] text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                <span>Ocupación</span>
              </div>
              <div className="text-sm">
                {renderText(character.work?.occupation)}
              </div>
            </div>

            {/* Box: Base de Operaciones */}
            <div className="bg-[#121212] border border-[#222222] p-4 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#ED1D24] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Base de Operaciones</span>
              </div>
              <div className="text-sm">
                {renderText(character.work?.base)}
              </div>
            </div>
          </div>

          {/* Group Affiliations */}
          <div className="bg-[#121212] border border-[#222222] p-5 space-y-2">
            <div className="flex items-center space-x-2 text-[#ED1D24] text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Afiliaciones & Equipos</span>
            </div>
            <div className="text-sm leading-relaxed">
              {renderText(character.connections?.groupAffiliation)}
            </div>
          </div>

          {/* Relatives / Familiares */}
          <div className="bg-[#121212] border border-[#222222] p-5 space-y-2">
            <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4 text-gray-400" />
              <span>Conexiones Familiares</span>
            </div>
            <div className="text-sm leading-relaxed">
              {renderText(character.connections?.relatives)}
            </div>
          </div>

          {/* Physical Attributes */}
          <div className="bg-[#121212] border border-[#222222] p-5 space-y-3">
            <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <Eye className="w-4 h-4 text-gray-400" />
              <span>Rasgos Físicos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#0a0a0a] p-2.5 border border-[#1f1f1f]">
                <span className="text-gray-400 block mb-0.5">Estatura</span>
                <span className="text-white font-mono font-bold">
                  {character.appearance?.height?.join(' / ') || 'N/D'}
                </span>
              </div>
              <div className="bg-[#0a0a0a] p-2.5 border border-[#1f1f1f]">
                <span className="text-gray-400 block mb-0.5">Peso</span>
                <span className="text-white font-mono font-bold">
                  {character.appearance?.weight?.join(' / ') || 'N/D'}
                </span>
              </div>
              <div className="bg-[#0a0a0a] p-2.5 border border-[#1f1f1f]">
                <span className="text-gray-400 block mb-0.5">Color de Ojos</span>
                <span className="text-white font-mono font-bold">
                  {character.appearance?.eyeColor || 'N/D'}
                </span>
              </div>
              <div className="bg-[#0a0a0a] p-2.5 border border-[#1f1f1f]">
                <span className="text-gray-400 block mb-0.5">Cabello</span>
                <span className="text-white font-mono font-bold">
                  {character.appearance?.hairColor || 'N/D'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
