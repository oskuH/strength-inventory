import { use } from 'react';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';

import { AuthContext } from './utils/contexts';
// import { useAuth } from './utils/contexts';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!  // Set by <AuthProvider> in main.tsx
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function InnerApp () {
  const auth = use(AuthContext);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  );
}
