import { Outlet } from '@tanstack/react-router';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Header from './header';
import SidebarLeft from './sidebar-left';
import SidebarRight from './sidebar-right';

export default function Root() {
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