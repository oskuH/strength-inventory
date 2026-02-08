import {
  createRootRouteWithContext,
  Link,
  Outlet
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Header from '../components/header';
import SidebarLeft from '../components/sidebar-left';
import SidebarRight from '../components/sidebar-right';

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
      <div className='flex min-h-svh flex-col'>
        <Header />
        <div className='flex flex-1 flex-row'>
          <SidebarLeft />
          <div className='flex flex-1'>
            <Outlet />
          </div>
          <SidebarRight />
        </div>
      </div>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  );
}