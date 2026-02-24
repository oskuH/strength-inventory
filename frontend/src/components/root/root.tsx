import { useEffect, useState } from 'react';

import { Outlet } from '@tanstack/react-router';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Footer from './footer';
import Header from './header';
import SidebarLeft from './sidebar-left';
import SidebarRight from './sidebar-right';

export default function Root () {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      return true;
    } else {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'theme',
      darkMode
        ? 'dark'
        : 'light'
    );

    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [darkMode]);

  return (
    <>
      <div className='flex min-h-svh flex-col'>
        <Header />
        <div className='flex grow flex-col relative'>
          <SidebarLeft darkMode={darkMode} setDarkMode={setDarkMode} />
          <SidebarRight />
          <div className='flex grow flex-col bg-orange-50 dark:bg-olive-700'>
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
