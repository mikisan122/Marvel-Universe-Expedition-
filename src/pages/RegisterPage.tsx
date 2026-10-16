import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail, User, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, loginWithGoogle, authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleRegister = async () => {
    clearError();
    try {
      setLoadingGoogle(true);
      await loginWithGoogle();
      navigate('/');
    } catch {
      // Handled in context
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Password rules validation logic
  const password = formData.password;
  const rules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'El nombre completo es obligatorio.';
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Introduce una dirección de correo electrónico válida.';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (!isPasswordValid) {
      errors.password = 'La contraseña no cumple con todos los requisitos de seguridad.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contraseña.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      setLoading(true);
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccessMessage(
        '¡Registro completado con éxito! Tu cuenta de agente ha sido creada. Acceso concedido al archivo Marvel.'
      );

      // Redirigir a la página principal después de mostrar el mensaje
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch {
      // Error is handled in context and displayed via authError
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#121212] border border-[#242424] p-8 shadow-2xl relative">
        {/* Top Header Accent */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 bg-[#ED1D24] text-white px-3 py-1 font-bebas text-xl tracking-widest uppercase">
            MARVEL UNIVERSE
          </div>
          <h1 className="font-bebas text-4xl text-white tracking-wider uppercase">
            Crear Cuenta de Agente
          </h1>
          <p className="text-xs text-gray-400">
            Registro seguro para acceder a los archivos clasificados de Marvel.
          </p>
        </div>

        {/* Global Error Alert */}
        {authError && (
          <div className="mb-6 p-4 bg-red-950/70 border border-red-600/80 text-red-200 text-xs space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-[#ED1D24] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-white">Aviso de Registro</p>
                <p className="mt-1 leading-relaxed">{authError}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-red-900/60">
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#ED1D24] hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Acceder de Inmediato con Google
              </button>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs flex items-start space-x-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-300">¡Registro Exitoso!</p>
              <p className="mt-0.5">{successMessage}</p>
              <p className="mt-2 text-[11px] text-emerald-400/80">Redirigiendo a la pantalla principal...</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre completo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Nombre Completo <span className="text-[#ED1D24]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ej. Peter Parker"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#2e2e2e] focus:border-[#ED1D24] text-white text-sm focus:outline-none transition-colors"
              />
            </div>
            {clientErrors.fullName && (
              <p className="text-[11px] text-red-400 mt-1">{clientErrors.fullName}</p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Correo Electrónico <span className="text-[#ED1D24]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="agente@marvel.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#2e2e2e] focus:border-[#ED1D24] text-white text-sm focus:outline-none transition-colors"
              />
            </div>
            {clientErrors.email && (
              <p className="text-[11px] text-red-400 mt-1">{clientErrors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Contraseña <span className="text-[#ED1D24]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            {clientErrors.password && (
              <p className="text-[11px] text-red-400 mt-1">{clientErrors.password}</p>
            )}

            {/* Password Security Strength Checklist */}
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-3 mt-2 space-y-1.5 text-[11px]">
              <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                Requisitos de Seguridad de Contraseña:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-gray-400">
                <span className={rules.minLength ? 'text-emerald-400 font-medium' : ''}>
                  {rules.minLength ? '✓' : '•'} Mínimo 8 caracteres
                </span>
                <span className={rules.hasUpper ? 'text-emerald-400 font-medium' : ''}>
                  {rules.hasUpper ? '✓' : '•'} Una mayúscula (A-Z)
                </span>
                <span className={rules.hasLower ? 'text-emerald-400 font-medium' : ''}>
                  {rules.hasLower ? '✓' : '•'} Una minúscula (a-z)
                </span>
                <span className={rules.hasNumber ? 'text-emerald-400 font-medium' : ''}>
                  {rules.hasNumber ? '✓' : '•'} Un número (0-9)
                </span>
                <span className={rules.hasSpecial ? 'text-emerald-400 font-medium' : ''}>
                  {rules.hasSpecial ? '✓' : '•'} Carácter especial (!@#$...)
                </span>
              </div>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Confirmar Contraseña <span className="text-[#ED1D24]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0a0a0a] border border-[#2e2e2e] focus:border-[#ED1D24] text-white text-sm focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {clientErrors.confirmPassword && (
              <p className="text-[11px] text-red-400 mt-1">{clientErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#ED1D24] hover:bg-red-700 disabled:opacity-50 text-white font-oswald text-sm uppercase tracking-wider font-bold transition-all shadow-lg shadow-red-900/40 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creando cuenta de agente...</span>
              </>
            ) : (
              <span>Registrarse y Crear Perfil</span>
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
          onClick={handleGoogleRegister}
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
          <span>Registrarse con Cuenta de Google</span>
        </button>

        {/* Footer Link to Login */}
        <div className="mt-8 pt-6 border-t border-[#1e1e1e] text-center text-xs text-gray-400">
          ¿Ya tienes una cuenta registrada?{' '}
          <Link to="/login" className="text-[#ED1D24] hover:text-red-400 font-bold uppercase tracking-wider">
            Inicia Sesión Aquí
          </Link>
        </div>
      </div>
    </div>
  );
};
