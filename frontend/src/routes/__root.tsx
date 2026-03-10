import { createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import notFoundComponent from '../components/root/NotFoundComponent';
import Root from '../components/root/Root';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: Root,
  notFoundComponent: notFoundComponent
});
