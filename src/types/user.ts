export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  photoURL?: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface PasswordValidationRules {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}
