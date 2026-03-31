import { createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import notFoundComponent from '../components/root/NotFoundComponent';
import Root from '../components/root/Root';

import { type UserFrontend } from '@strength-inventory/schemas';

interface AuthState {
  isAuthenticated: boolean,
  user: UserFrontend,
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  auth: AuthState
}>()({
  component: Root,
  notFoundComponent: notFoundComponent
});
