import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, BookOpen, Flame, Users, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080808] border-t border-[#1f1f1f] text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <span className="bg-[#ED1D24] text-white px-2.5 py-0.5 font-bebas text-2xl tracking-widest font-black uppercase">
                MARVEL
              </span>
              <span className="text-white font-bebas text-2xl tracking-wider uppercase font-bold">
                UNIVERSE
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Plataforma interactiva del Universo Marvel para explorar expedientes clasificados,
              biografías de héroes y villanos, atributos de combate y organizar tu colección personal de personajes.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
              <span className="inline-flex items-center space-x-1.5 bg-[#141414] border border-[#2a2a2a] px-2.5 py-1">
                <BookOpen className="w-3.5 h-3.5 text-[#ED1D24]" />
                <span>Archivo Marvel Comics</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-[#141414] border border-[#2a2a2a] px-2.5 py-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Expedientes Clasificados</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-[#141414] border border-[#2a2a2a] px-2.5 py-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Multiverso Expandido</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-white font-oswald text-sm uppercase tracking-wider font-bold mb-4 border-l-2 border-[#ED1D24] pl-2">
              Exploración
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Base Central
                </Link>
              </li>
              <li>
                <Link to="/personajes" className="hover:text-white transition-colors">
                  Directorio de Personajes
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="hover:text-white transition-colors">
                  Colección de Favoritos
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Acceso de Agentes
                </Link>
              </li>
              <li>
                <Link to="/registro" className="hover:text-white transition-colors">
                  Reclutamiento de Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Marvel Universe Factions */}
          <div>
            <h3 className="text-white font-oswald text-sm uppercase tracking-wider font-bold mb-4 border-l-2 border-[#ED1D24] pl-2">
              Equipos & Facciones
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#ED1D24] rounded-full" />
                <span className="text-gray-300">Los Vengadores (Avengers)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span className="text-gray-300">X-Men (Patrulla-X)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span className="text-gray-300">Los Cuatro Fantásticos</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span className="text-gray-300">Guardianes de la Galaxia</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                <span className="text-gray-300">Defensores & S.H.I.E.L.D.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-8 border-t border-[#181818] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            © {new Date().getFullYear()} MARVEL UNIVERSE — Archivo y Enciclopedia Digital de Marvel Comics.
          </p>
          <p className="text-center sm:text-right">
            Todos los personajes, nombres e imágenes son marcas registradas de © Marvel Entertainment, LLC & Disney.
          </p>
        </div>
      </div>
    </footer>
  );
};
