import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Trash2, ArrowRight, ShieldCheck, Skull, Shield, Loader2, Sparkles } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites, loading, removeFavorite } = useFavorites();

  const handleRemove = async (e: React.MouseEvent, characterId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFavorite(characterId);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#222222] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#ED1D24] text-xs font-bold uppercase tracking-widest mb-1">
            <Heart className="w-4 h-4 fill-current" />
            <span>Mi Archivo Personal</span>
          </div>
          <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-wider uppercase leading-none">
            MIS PERSONAJES FAVORITOS
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">
            Tu archivo clasificado de héroes y villanos favoritos. Accede a tu colección personal vinculada a tu cuenta de agente (
            <span className="text-white font-mono text-xs">{user?.email}</span>) en cualquier momento.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#141414] border border-[#2a2a2a] px-4 py-2.5">
          <Shield className="w-4 h-4 text-[#ED1D24]" />
          <div className="text-left">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Estado del Archivo</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Acceso Clasificado</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#ED1D24] animate-spin" />
          <p className="font-oswald text-sm uppercase tracking-wider text-gray-400">
            Cargando tu colección de favoritos...
          </p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-[#121212] border border-[#222222] p-12 sm:p-16 text-center space-y-6 max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 bg-[#1a1a1a] border border-[#333333] flex items-center justify-center mx-auto text-[#ED1D24]">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider uppercase">
              Tu Colección Está Vacía
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              Aún no has agregado ningún personaje a tus favoritos. Explora el catálogo de Marvel Comics y haz clic en el
              icono de corazón para guardarlos.
            </p>
          </div>
          <Link
            to="/personajes"
            className="inline-flex items-center space-x-2 px-6 py-3.5 bg-[#ED1D24] hover:bg-red-700 text-white font-oswald text-xs uppercase tracking-wider font-bold transition-all shadow-lg shadow-red-900/40"
          >
            <span>Explorar Personajes de Marvel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-[#1b1b1b] pb-2">
            <span>
              Total guardados: <strong className="text-white">{favorites.length}</strong>
            </span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Colección Sincronizada</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((item) => {
              const alignment = item.alignment?.toLowerCase();
              return (
                <div
                  key={item.characterId}
                  className="group relative bg-[#121212] border border-[#242424] hover:border-[#ED1D24] transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_0_25px_-5px_rgba(237,29,36,0.25)]"
                >
                  {/* Portrait Thumbnail */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d0d0d]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {alignment === 'good' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-900/80 text-blue-300 border border-blue-500/30">
                          <ShieldCheck className="w-3 h-3 text-blue-400" />
                          <span>Héroe</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-600/40">
                          <Skull className="w-3 h-3 text-[#ED1D24]" />
                          <span>Villano</span>
                        </span>
                      )}

                      <button
                        onClick={(e) => handleRemove(e, item.characterId)}
                        className="w-8 h-8 bg-black/80 hover:bg-[#ED1D24] text-gray-300 hover:text-white border border-white/20 hover:border-[#ED1D24] flex items-center justify-center transition-colors"
                        title="Eliminar de favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-[11px] text-gray-300 bg-black/70 px-2 py-0.5 border border-white/10 uppercase">
                        ID #{item.characterId}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-oswald text-xl font-bold uppercase tracking-wide text-white group-hover:text-[#ED1D24] transition-colors leading-tight line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                        {item.realName || 'Identidad no revelada'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#1f1f1f] flex items-center justify-between text-[11px] text-gray-400">
                      <span>Guardado el:</span>
                      <span className="text-gray-300 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={`/personajes/${item.characterId}`}
                      className="w-full flex items-center justify-between px-3 py-2 bg-[#1a1a1a] hover:bg-[#ED1D24] text-gray-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-[#2b2b2b] hover:border-[#ED1D24]"
                    >
                      <span>Ver Expediente</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
