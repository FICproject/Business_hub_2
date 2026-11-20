import { isAtLeast18 } from '@business-hub/shared-utils';

export interface RegistrationInput {
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  password: string;
  confirmPassword?: string;
  roles: string[];
  termsAccepted: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export const validateRegistration = (input: RegistrationInput): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!input.fullName || input.fullName.trim().length < 3) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 3 characters long.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address.' });
  }

  const phoneRegex = /^[0-9+() -]{7,15}$/;
  if (!input.mobile || !phoneRegex.test(input.mobile)) {
    errors.push({ field: 'mobile', message: 'Please provide a valid mobile number.' });
  }

  if (!input.dob) {
    errors.push({ field: 'dob', message: 'Date of birth is required.' });
  } else if (!isAtLeast18(input.dob)) {
    errors.push({ field: 'dob', message: 'All users must be at least 18 years old to join Business Hub.' });
  }

  if (!input.password || input.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long.' });
  }

  if (input.confirmPassword !== undefined && input.password !== input.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
  }

  if (!input.roles || input.roles.length === 0) {
    errors.push({ field: 'roles', message: 'At least one user category / role must be selected.' });
  }

  if (!input.termsAccepted) {
    errors.push({ field: 'termsAccepted', message: 'You must accept the Terms of Service and Privacy Policy.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLogin = (input: { email: string; password: string }): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!input.email || !input.email.includes('@')) {
    errors.push({ field: 'email', message: 'Valid email is required.' });
  }

  if (!input.password) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
