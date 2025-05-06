/**
 * Mock authentication service
 */
import { LoginSchema, ValidationError } from '@/lib/validate';
import type { LoginInput } from '@/lib/validate/auth';

// Simple localStorage keys for "persistence"
const AUTH_TOKEN_KEY = 'link-it-auth-token';
const USER_KEY = 'link-it-user';

/**
 * Simple login function that validates credentials
 */
export async function login(credentials: LoginInput): Promise<{ token: string; user: { email: string } }> {
  // Validate input with Zod schema
  const validationResult = LoginSchema.safeParse(credentials);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error);
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // For demo purposes, we'll accept any valid email/password
  // In a real app, this would call a backend API
  const { email } = credentials;
  
  // Generate a fake token
  const token = `token-${Math.random().toString(36).substring(2, 15)}`;
  
  // Store in localStorage for "persistence"
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ email }));
  
  return {
    token,
    user: { email }
  };
}

/**
 * Simple logout function
 */
export async function logout(): Promise<void> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Clear localStorage
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return !!token;
}

/**
 * Get current user
 */
export function getCurrentUser(): { email: string } | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) {
    return null;
  }
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}
