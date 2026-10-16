import { auth } from '../config/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid ?? null,
      email: currentUser?.email ?? null,
      emailVerified: currentUser?.emailVerified ?? null,
      isAnonymous: currentUser?.isAnonymous ?? null,
      tenantId: currentUser?.tenantId ?? null,
      providerInfo: currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está registrado. Si ya tienes cuenta, inicia sesión.';
    case 'auth/invalid-email':
      return 'El formato de correo electrónico no es válido.';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil. Cumple con los requisitos de seguridad.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Credenciales inválidas. Revisa tu correo y contraseña.';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido desactivada temporalmente.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Por favor espera unos minutos antes de reintentar.';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu acceso a internet.';
    case 'auth/operation-not-allowed':
      return 'El registro mediante correo y contraseña no se encuentra habilitado en este momento. Por favor utiliza el botón "Acceder con Cuenta de Google" para continuar de inmediato.';
    case 'auth/popup-closed-by-user':
      return 'La ventana de inicio de sesión de Google fue cerrada antes de completar la autenticación.';
    case 'auth/cancelled-popup-request':
      return 'Solicitud de autenticación cancelada.';
    case 'auth/requires-recent-login':
      return 'Por seguridad, debes volver a iniciar sesión para realizar esta acción.';
    default:
      return 'Ocurrió un error en la autenticación. Por favor intenta nuevamente.';
  }
}
