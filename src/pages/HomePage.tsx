import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, ArrowRight, Zap, Heart, BookOpen, Flame, Swords } from 'lucide-react';
import { getFeaturedMarvelCharacters } from '../services/superheroService';
import { CharacterCard } from '../components/CharacterCard';
import { useAuth } from '../contexts/AuthContext';
import type { Character } from '../types/character';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [featuredCharacters, setFeaturedCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getFeaturedMarvelCharacters()
      .then((data) => {
        if (isMounted) {
          setFeaturedCharacters(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Error al cargar personajes destacados');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-20">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-marvel-radial overflow-hidden border-b border-[#1f1f1f]">
        {/* Background ambient comic grid effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#ED1D24_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#181818] border border-[#ED1D24]/40 px-4 py-1.5 shadow-lg shadow-red-950/30">
            <span className="w-2 h-2 rounded-full bg-[#ED1D24] animate-ping" />
            <span className="text-xs uppercase tracking-widest font-bold text-gray-200">
              Directorio Oficial & Archivo Clasificado
            </span>
          </div>

          {/* Main Title - EXPLORE THE MARVEL UNIVERSE */}
          <div className="space-y-2">
            <h1 className="font-bebas text-6xl sm:text-8xl md:text-9xl text-white tracking-wider uppercase font-black drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              EXPLORE THE <span className="text-[#ED1D24]">MARVEL</span> UNIVERSE
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-gray-300 font-normal leading-relaxed">
              Descubre las biografías, identidades secretas y estadísticas de combate de los héroes y villanos más
              icónicos de Marvel Comics. Guarda y organiza tu colección personal de personajes predilectos.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/personajes"
              className="w-full sm:w-auto px-8 py-4 bg-[#ED1D24] hover:bg-red-700 text-white font-oswald text-base uppercase tracking-wider font-bold transition-all duration-200 shadow-xl shadow-red-900/40 flex items-center justify-center space-x-3 transform hover:-translate-y-1"
            >
              <span>Explorar personajes</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {user ? (
              <Link
                to="/favoritos"
                className="w-full sm:w-auto px-8 py-4 bg-[#181818] hover:bg-[#252525] border border-[#333333] hover:border-[#ED1D24] text-white font-oswald text-base uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <Heart className="w-5 h-5 text-[#ED1D24]" />
                <span>Mis Favoritos</span>
              </Link>
            ) : (
              <Link
                to="/registro"
                className="w-full sm:w-auto px-8 py-4 bg-[#181818] hover:bg-[#252525] border border-[#333333] hover:border-[#ED1D24] text-white font-oswald text-base uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <Shield className="w-5 h-5 text-gray-300" />
                <span>Crear Cuenta de Agente</span>
              </Link>
            )}
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-[#1f1f1f]">
            <div className="bg-[#121212]/80 border border-[#222222] p-4 text-center">
              <span className="font-bebas text-3xl sm:text-4xl text-[#ED1D24] block">260+</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Personajes Marvel</span>
            </div>
            <div className="bg-[#121212]/80 border border-[#222222] p-4 text-center">
              <span className="font-bebas text-3xl sm:text-4xl text-white block">6</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Habilidades de Combate</span>
            </div>
            <div className="bg-[#121212]/80 border border-[#222222] p-4 text-center">
              <span className="font-bebas text-3xl sm:text-4xl text-[#ED1D24] block">80+</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Años de Historias</span>
            </div>
            <div className="bg-[#121212]/80 border border-[#222222] p-4 text-center">
              <span className="font-bebas text-3xl sm:text-4xl text-white block">EXPEDIENTES</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Acceso Completo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Characters Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#222222]">
          <div>
            <div className="flex items-center space-x-2 text-[#ED1D24] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Selección Destacada</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider uppercase">
              Personajes Destacados
            </h2>
          </div>
          <Link
            to="/personajes"
            className="mt-3 sm:mt-0 text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-[#ED1D24] flex items-center space-x-1 transition-colors"
          >
            <span>Ver catálogo completo ({loading ? '...' : '269'})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-[#121212] border border-[#222222] h-96 animate-pulse p-4 flex flex-col justify-between">
                <div className="bg-[#1c1c1c] w-full h-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="bg-[#1c1c1c] h-5 w-3/4" />
                  <div className="bg-[#1c1c1c] h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-[#181818] border border-red-900/50 p-6 text-center text-gray-300 space-y-3">
            <p className="text-red-400 font-semibold">{error}</p>
            <p className="text-xs text-gray-400">Verifica tu conexión a la red de Marvel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCharacters.slice(0, 8).map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        )}
      </section>

      {/* Explanatory Marvel Lore Section */}
      <section className="bg-[#0e0e0e] border-y border-[#1f1f1f] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[#ED1D24] text-xs font-bold uppercase tracking-widest">
              Enciclopedia & Guía Táctica
            </span>
            <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider uppercase">
              Los Tres Pilares del Universo Marvel
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sumérgete en el vasto multiverso creado por las mentes más brillantes del cómic mundial y
              descubre el legado de héroes legendarios, archienemigos implacables y poderes sin límite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-[#141414] border border-[#242424] p-8 space-y-4 hover:border-[#ED1D24]/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-oswald text-xl uppercase tracking-wider text-white font-bold">
                1. Héroes & Protectores
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Desde las calles de Nueva York con Spider-Man y Daredevil hasta las misiones globales de los
                Vengadores y los X-Men, guerreros que luchan incansablemente por defender a la humanidad.
              </p>
              <div className="text-xs font-mono text-gray-500 pt-2 border-t border-[#222222]">
                Alineación: Defensores del Bien
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#141414] border border-[#242424] p-8 space-y-4 hover:border-[#ED1D24]/50 transition-colors">
              <div className="w-12 h-12 bg-[#ED1D24]/10 border border-[#ED1D24]/30 flex items-center justify-center text-[#ED1D24]">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-oswald text-xl uppercase tracking-wider text-white font-bold">
                2. Villanos & Amenazas
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Tiranos intergalácticos como Thanos, mutantes supremacistas como Magneto y genios maquiavélicos
                como Doctor Doom que ponen a prueba los límites del heroísmo en cada batalla cósmica.
              </p>
              <div className="text-xs font-mono text-gray-500 pt-2 border-t border-[#222222]">
                Alineación: Amenazas de Nivel Omega
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#141414] border border-[#242424] p-8 space-y-4 hover:border-[#ED1D24]/50 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Swords className="w-6 h-6" />
              </div>
              <h3 className="font-oswald text-xl uppercase tracking-wider text-white font-bold">
                3. Atributos de Combate
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Análisis táctico comparativo de las 6 habilidades esenciales: Inteligencia estratégica, Fuerza física,
                Velocidad sobrehumana, Resistencia, Poder destructor y Destreza en combate cuerpo a cuerpo.
              </p>
              <div className="text-xs font-mono text-gray-500 pt-2 border-t border-[#222222]">
                Evaluación: Escala Táctica 0 a 100
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      {!user && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#181818] via-[#221012] to-[#181818] border border-[#ED1D24]/40 p-8 sm:p-12 text-center space-y-6">
            <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider uppercase">
              ÚNETE AL UNIVERSO MARVEL
            </h2>
            <p className="max-w-xl mx-auto text-sm text-gray-300 leading-relaxed">
              Crea tu cuenta de agente para comenzar a guardar tus personajes favoritos y acceder a tu archivo
              personalizado de héroes y villanos en cualquier momento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/registro"
                className="px-8 py-3 bg-[#ED1D24] hover:bg-red-700 text-white font-oswald text-sm uppercase tracking-wider font-bold transition-all shadow-lg shadow-red-900/40"
              >
                Crear Cuenta de Agente
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-[#111111] hover:bg-black border border-[#444] text-white font-oswald text-sm uppercase tracking-wider font-bold transition-colors"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
