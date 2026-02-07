import {
  createRootRouteWithContext,
  Link,
  Outlet
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  }
});

function RootComponent() {
  return (
    <>
      <div>
        <Link
          to='/'
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to='/gyms'
        >
          Gym search
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}