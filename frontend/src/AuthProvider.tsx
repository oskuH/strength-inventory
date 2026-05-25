import { useEffect, useState } from 'react';

import { AuthContext } from './utils/contexts';
import { baseUrl } from './utils/api';

import {
  LoginRefreshResponseSchema,
  LoginResponseSchema,
  type UserFrontend,
  UserFrontendQuerySchema
} from '@strength-inventory/schemas';

export default function AuthProvider (
  { children }: { children: React.ReactNode }
) {
  const [token] = useState(() => localStorage.getItem('auth-token'));
  const [user, setUser] = useState<UserFrontend>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;

    const ctrl = new AbortController();
    fetch(`${baseUrl}/login`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: ctrl.signal
    })
      .then((res) => res.json())
      .then((userData) => {
        try {
          const validatedUserData = UserFrontendQuerySchema.parse(userData);
          setUser(validatedUserData);
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem('auth-token');
        }
      })
      .catch(() => {
        localStorage.removeItem('auth-token');
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      ctrl.abort();
    };
  }, [token]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  async function login (username: string, password: string) {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    if (res.ok) {
      const userData: unknown = await res.json();
      try {
        const validatedUserData = LoginResponseSchema.parse(userData);
        const validatedUser = {
          id: validatedUserData.id,
          username: validatedUserData.username,
          email: validatedUserData.email,
          emailVerified: validatedUserData.emailVerified,
          name: validatedUserData.name,
          role: validatedUserData.role
        };
        setUser(validatedUser);
        setIsAuthenticated(true);
        localStorage.setItem('auth-token', validatedUserData.token);
      } catch {
        throw Error('Authentication failed.');
      }
    } else {
      throw Error('Authentication failed.');
    }
  }

  async function refresh () {
    const res = await fetch(`${baseUrl}/login/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (res.ok) {
      const tokenData: unknown = await res.json();
      try {
        const validatedTokenData
          = LoginRefreshResponseSchema.parse(tokenData);
        localStorage.setItem('auth-token', validatedTokenData.token);
      } catch {
        throw Error('Access token refresh failed.');
      }
    }
  }

  async function logout () {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth-token');
    if (token) {
      await fetch(`${baseUrl}/logout`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  }

  return (
    <AuthContext value={{ isAuthenticated, user, login, refresh, logout }}>
      {children}
    </AuthContext>
  );
}
