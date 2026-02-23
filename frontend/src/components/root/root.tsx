import { Outlet } from '@tanstack/react-router';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Footer from './footer';
import Header from './header';
import SidebarLeft from './sidebar-left';
import SidebarRight from './sidebar-right';

export default function Root () {
  return (
    <>
      <div className='flex min-h-svh flex-col'>
        <Header />
        <div className='flex grow flex-col relative'>
          <SidebarLeft />
          <SidebarRight />
          <div className='flex grow flex-col'>
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  );
}
