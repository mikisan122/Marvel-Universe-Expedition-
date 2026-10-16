import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { CharactersPage } from '../pages/CharactersPage';
import { CharacterDetailPage } from '../pages/CharacterDetailPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-6">
    <div className="w-20 h-20 bg-red-950/40 border border-[#ED1D24] text-[#ED1D24] flex items-center justify-center font-bebas text-5xl">
      404
    </div>
    <div className="space-y-2">
      <h1 className="font-bebas text-5xl text-white tracking-wider uppercase">
        Sector del Multiverso no Encontrado
      </h1>
      <p className="text-gray-400 text-sm max-w-md mx-auto">
        La ruta a la que intentas acceder no existe en esta realidad o ha sido alterada por la Bruja Escarlata.
      </p>
    </div>
    <Link
      to="/"
      className="inline-flex items-center space-x-2 px-6 py-3 bg-[#ED1D24] hover:bg-red-700 text-white font-oswald text-xs uppercase tracking-wider font-bold transition-all shadow-lg shadow-red-900/40"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Volver a la Base de Operaciones</span>
    </Link>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/personajes" element={<CharactersPage />} />
        <Route path="/personajes/:id" element={<CharacterDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />

        {/* Protected Private Routes */}
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
