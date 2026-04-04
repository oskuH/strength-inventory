import { createContext } from 'react';

import { type UserFrontend } from '@strength-inventory/schemas';

interface AuthState {
  isAuthenticated: boolean
  user: UserFrontend
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  login: async () => {
    await Promise.resolve();
  },
  logout: function () {}
});

export const IconContext = createContext(false);

/* export function useAuth () {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} */
