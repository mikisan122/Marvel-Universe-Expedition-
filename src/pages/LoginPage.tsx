import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Redirect destination if user was attempting to reach a protected page
  const from = (location.state as any)?.from?.pathname || '/';
  const redirectMessage = (location.state as any)?.message;

  const handleGoogleLogin = async () => {
    clearError();
    try {
      setLoadingGoogle(true);
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      // Handled in context
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim() || !password) return;

    try {
      setLoading(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      // Error handled in AuthContext and shown via authError
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#121212] border border-[#242424] p-8 shadow-2xl relative">
        {/* Top Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 bg-[#ED1D24] text-white px-3 py-1 font-bebas text-xl tracking-widest uppercase">
            MARVEL UNIVERSE
          </div>
          <h1 className="font-bebas text-4xl text-white tracking-wider uppercase">
            Acceso de Agente
          </h1>
          <p className="text-xs text-gray-400">
            Ingresa tus credenciales para acceder a los archivos clasificados.
          </p>
        </div>

        {/* Redirect Notice */}
        {redirectMessage && (
          <div className="mb-6 p-3.5 bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
            {redirectMessage}
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="mb-6 p-4 bg-red-950/70 border border-red-600/80 text-red-200 text-xs space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-[#ED1D24] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-white">Aviso de Acceso</p>
                <p className="mt-1 leading-relaxed">{authError}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-red-900/60">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#ED1D24] hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Acceder con Cuenta de Google
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Contraseña
              </label>
              <Link
                to="/recuperar-contrasena"
                className="text-xs text-gray-400 hover:text-[#ED1D24] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0a0a0a] border border-[#2e2e2e] focus:border-[#ED1D24] text-white text-sm focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#ED1D24] hover:bg-red-700 disabled:opacity-50 text-white font-oswald text-sm uppercase tracking-wider font-bold transition-all shadow-lg shadow-red-900/40 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#242424]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#121212] px-2 text-gray-400">O también</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="w-full py-3 bg-[#181818] hover:bg-[#252525] border border-[#333333] hover:border-gray-400 text-white font-oswald text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center space-x-2.5"
        >
          {loadingGoogle ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Acceder con Cuenta de Google</span>
        </button>

        {/* Bottom register link */}
        <div className="mt-8 pt-6 border-t border-[#1e1e1e] text-center text-xs text-gray-400">
          ¿Aún no tienes una cuenta?{' '}
          <Link to="/registro" className="text-[#ED1D24] hover:text-red-400 font-bold uppercase tracking-wider">
            Regístrate Gratis
          </Link>
        </div>
      </div>
    </div>
  );
};
