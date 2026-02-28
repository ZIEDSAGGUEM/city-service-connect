import { authApi } from './api';
import type { User, UserRole } from './types';

export type { User, UserRole };

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

// Sign up with email and password
export const signUp = async ({ email, password, name, role }: SignUpData): Promise<{ message: string }> => {
  console.log('🔵 Attempting registration:', { email, name, role });
  
  try {
    const response = await authApi.register({
      email,
      password,
      name,
      role,
    });

    console.log('✅ Registration successful:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Registration error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Sign in with email and password
export const signIn = async ({ email, password }: SignInData): Promise<AuthResponse> => {
  console.log('🔵 Attempting login:', { email });
  
  try {
    const response = await authApi.login({ email, password });

    console.log('✅ Login successful:', response);

    // Store token in localStorage
    localStorage.setItem('access_token', response.accessToken);

    return response;
  } catch (error: any) {
    console.error('❌ Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await authApi.getMe();
  return response;
};

// Verify email
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await authApi.verifyEmail(token);
  return response;
};

// Resend verification email
export const resendVerificationEmail = async (email: string): Promise<{ message: string }> => {
  const response = await authApi.resendVerification(email);
  return response;
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  const response = await authApi.requestPasswordReset(email);
  return response;
};

// Reset password
export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const response = await authApi.resetPassword(token, newPassword);
  return response;
};
