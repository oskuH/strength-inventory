import { useEffect, useState } from 'react';

import { AuthContext } from './utils/contexts';
import { baseUrl } from './utils/api';

import {
  LoginResponseSchema, type UserFrontend, UserFrontendQuerySchema
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

    fetch(`${baseUrl}/login`, {
      headers: { Authorization: `Bearer ${token}` }
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
  }, [token]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  async function login (username: string, password: string) {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
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
        throw new Error('Authentication failed.');
      }
    }
  }

  function logout () {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth-token');
  }

  return (
    <AuthContext value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext>
  );
}
