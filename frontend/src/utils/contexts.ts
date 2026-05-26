import { createContext } from 'react';

import { type AuthState } from '@strength-inventory/schemas';

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  login: async () => {
    await Promise.resolve();
  },
  refresh: async () => {
    return await Promise.resolve('');
  },
  logout: async () => {
    await Promise.resolve();
  }
});

export const IconContext = createContext(false);
