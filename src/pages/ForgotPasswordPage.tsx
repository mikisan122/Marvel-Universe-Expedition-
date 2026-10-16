import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword, authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email.trim()) return;

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#121212] border border-[#242424] p-8 shadow-2xl relative">
        <Link
          to="/login"
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Login</span>
        </Link>

        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 bg-[#ED1D24] text-white px-3 py-1 font-bebas text-xl tracking-widest uppercase">
            RECUPERACIÓN
          </div>
          <h1 className="font-bebas text-4xl text-white tracking-wider uppercase">
            Restablecer Contraseña
          </h1>
          <p className="text-xs text-gray-400">
            Ingresa tu correo electrónico registrado y te enviaremos las instrucciones para restablecer tu acceso.
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-600/60 text-red-200 text-xs flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#ED1D24] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error</p>
              <p className="mt-0.5">{authError}</p>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-500/50 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h2 className="font-oswald text-lg text-white uppercase tracking-wider font-bold">
              Correo Enviado
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Hemos enviado un enlace de recuperación a <strong className="text-white">{email}</strong>. Revisa tu
              bandeja de entrada o la carpeta de spam para restablecer tu contraseña.
            </p>
            <Link
              to="/login"
              className="inline-block mt-3 px-6 py-2.5 bg-[#ED1D24] hover:bg-red-700 text-white font-oswald text-xs uppercase tracking-wider font-bold transition-colors"
            >
              Regresar a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agente@marvel.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#2e2e2e] focus:border-[#ED1D24] text-white text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#ED1D24] hover:bg-red-700 disabled:opacity-50 text-white font-oswald text-sm uppercase tracking-wider font-bold transition-all shadow-lg shadow-red-900/40 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando enlace...</span>
                </>
              ) : (
                <span>Enviar Enlace de Recuperación</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
