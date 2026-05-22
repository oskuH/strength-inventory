// work in progress

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_noAuth')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        context.auth.logout();
      }
    }
  },
  component: () => <Outlet />
});
