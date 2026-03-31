import { createContext, use } from 'react';

import { type UserFrontend } from '@strength-inventory/schemas';

interface AuthState {
  isAuthenticated: boolean
  user: UserFrontend
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const IconContext = createContext(false);

export function useAuth () {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
