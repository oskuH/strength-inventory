// work in progress

import { createFileRoute, Outlet } from '@tanstack/react-router';

import isTokenValid from '../utils/isTokenValid';

export const Route = createFileRoute('/_noAuth')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      console.log('authentication detected');
      const accessToken = localStorage.getItem('auth-token');
      /* Since the local storage is at the mercy of the user and their browser,
      isAuthenticated does not guarantee there being an access token. */
      if (!accessToken) {
        console.log('no token! logging out...');
        context.auth.logout();
      } else {
        if (!isTokenValid(accessToken)) {
          console.log('access token expired!');
          try {
            context.auth.refresh();  // Why is TS complaining here?
            // .refresh() throws if the refresh token has expired
          } catch {
            context.auth.logout();
            // logout suffices in routes not requiring authentication
          }
        } else {
          console.log('checks OK!');
        }
      }
    }
  },
  component: () => <Outlet />
});
