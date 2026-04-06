import { createContext } from 'react';

import { type UserFrontend } from '@strength-inventory/schemas';

interface AuthState {
  isAuthenticated: boolean
  user: UserFrontend
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  login: async () => {
    await Promise.resolve();
  },
  logout: async () => {
    await Promise.resolve();
  }
});

export const IconContext = createContext(false);
