import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Shield, Heart, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

export const Navbar: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <div className="bg-[#ED1D24] text-white px-3 py-1 font-bebas text-2xl tracking-widest font-black uppercase shadow-lg shadow-red-900/40 transform -skew-x-6 transition-transform group-hover:scale-105">
              MARVEL
            </div>
            <span className="text-white font-bebas text-2xl tracking-wider uppercase font-bold text-gray-200 group-hover:text-white transition-colors">
              UNIVERSE
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'text-[#ED1D24] border-b-2 border-[#ED1D24]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/personajes"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'text-[#ED1D24] border-b-2 border-[#ED1D24]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Personajes
            </NavLink>

            <NavLink
              to="/favoritos"
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold tracking-wider uppercase flex items-center space-x-2 transition-all duration-200 ${
                  isActive
                    ? 'text-[#ED1D24] border-b-2 border-[#ED1D24]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Heart className="w-4 h-4 text-[#ED1D24]" />
              <span>Favoritos</span>
              {favorites.length > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-xs font-bold bg-[#ED1D24] text-white rounded-full animate-pulse">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          </div>

          {/* User Authentication Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-[#181818] border border-[#2a2a2a] px-3 py-1.5 rounded-none">
                  <div className="w-7 h-7 rounded-none bg-[#ED1D24] flex items-center justify-center font-bold text-xs text-white">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-[#ED1D24] font-semibold uppercase tracking-wider">Agente Activo</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="flex items-center space-x-1.5 bg-[#181818] hover:bg-[#ED1D24] text-gray-300 hover:text-white px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border border-[#333333] hover:border-[#ED1D24]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[#333333] transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-[#ED1D24] hover:bg-red-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-900/30 transform hover:-translate-y-0.5"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-[#262626] px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-gray-200 hover:text-white px-3 py-2 text-base font-semibold uppercase tracking-wider hover:bg-white/5"
            >
              Inicio
            </Link>
            <Link
              to="/personajes"
              onClick={closeMobileMenu}
              className="text-gray-200 hover:text-white px-3 py-2 text-base font-semibold uppercase tracking-wider hover:bg-white/5"
            >
              Personajes
            </Link>
            <Link
              to="/favoritos"
              onClick={closeMobileMenu}
              className="text-gray-200 hover:text-white px-3 py-2 text-base font-semibold uppercase tracking-wider hover:bg-white/5 flex items-center justify-between"
            >
              <span className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-[#ED1D24]" />
                <span>Favoritos</span>
              </span>
              {favorites.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-[#ED1D24] text-white rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>

          <div className="pt-3 border-t border-[#222222]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3 py-2 bg-[#181818]">
                  <div className="w-8 h-8 bg-[#ED1D24] text-white flex items-center justify-center font-bold text-sm">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.displayName || 'Usuario'}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-[#1f1f1f] hover:bg-[#ED1D24] text-white py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="text-center py-2 text-xs font-bold uppercase tracking-wider border border-[#333333] text-gray-200 hover:bg-white/5"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  onClick={closeMobileMenu}
                  className="text-center py-2 text-xs font-bold uppercase tracking-wider bg-[#ED1D24] text-white hover:bg-red-700"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
