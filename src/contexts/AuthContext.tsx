import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getFriendlyAuthErrorMessage, handleFirestoreError, OperationType } from '../services/errorHandling';
import type { UserProfile, RegisterFormData, LoginFormData } from '../types/user';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  register: (data: RegisterFormData) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Synchronize Firestore user profile document
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      }
    } catch (error) {
      console.warn('Error fetching user profile from Firestore:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setAuthError(null);

  /**
   * Register with email, password, full name, updateProfile, and write to Firestore
   */
  const register = async ({ fullName, email, password }: RegisterFormData): Promise<void> => {
    setAuthError(null);
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const newUser = userCredential.user;

      // 2. Update display name in Firebase Auth
      await updateProfile(newUser, {
        displayName: fullName.trim(),
      });

      // 3. Send email verification (non-blocking if it fails in demo environment)
      try {
        await sendEmailVerification(newUser);
      } catch (e) {
        console.warn('Email verification send notice:', e);
      }

      // 4. Save basic info in Cloud Firestore (no passwords)
      const profileData: UserProfile = {
        uid: newUser.uid,
        displayName: fullName.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
      };

      const userDocPath = `users/${newUser.uid}`;
      try {
        await setDoc(doc(db, 'users', newUser.uid), profileData);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userDocPath);
      }

      setUserProfile(profileData);
      setUser({ ...newUser, displayName: fullName.trim() });
    } catch (error: any) {
      const friendlyMessage = getFriendlyAuthErrorMessage(error?.code || '');
      setAuthError(friendlyMessage || error.message);
      throw new Error(friendlyMessage || error.message);
    }
  };

  /**
   * Login with email and password
   */
  const login = async ({ email, password }: LoginFormData): Promise<void> => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await fetchUserProfile(userCredential.user.uid);
    } catch (error: any) {
      const friendlyMessage = getFriendlyAuthErrorMessage(error?.code || '');
      setAuthError(friendlyMessage || error.message);
      throw new Error(friendlyMessage || error.message);
    }
  };

  /**
   * One-click Google Sign-In
   */
  const loginWithGoogle = async (): Promise<void> => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const googleUser = userCredential.user;

      const profileData: UserProfile = {
        uid: googleUser.uid,
        displayName: googleUser.displayName || googleUser.email?.split('@')[0] || 'Agente Marvel',
        email: googleUser.email || '',
        createdAt: new Date().toISOString(),
        photoURL: googleUser.photoURL || undefined,
      };

      try {
        await setDoc(doc(db, 'users', googleUser.uid), profileData, { merge: true });
      } catch (err) {
        console.warn('Profile sync notice:', err);
      }

      setUserProfile(profileData);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        return;
      }
      const friendlyMessage = getFriendlyAuthErrorMessage(error?.code || '');
      setAuthError(friendlyMessage || error.message);
      throw new Error(friendlyMessage || error.message);
    }
  };

  /**
   * Sign out
   */
  const logout = async (): Promise<void> => {
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      setAuthError('Error al cerrar sesión. Por favor intenta nuevamente.');
      throw error;
    }
  };

  /**
   * Send Password Reset Email
   */
  const resetPassword = async (email: string): Promise<void> => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: any) {
      const friendlyMessage = getFriendlyAuthErrorMessage(error?.code || '');
      setAuthError(friendlyMessage || error.message);
      throw new Error(friendlyMessage || error.message);
    }
  };

  /**
   * Resend Verification Email
   */
  const resendVerificationEmail = async (): Promise<void> => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error: any) {
      const friendlyMessage = getFriendlyAuthErrorMessage(error?.code || '');
      setAuthError(friendlyMessage || error.message);
      throw new Error(friendlyMessage || error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        register,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        resendVerificationEmail,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
