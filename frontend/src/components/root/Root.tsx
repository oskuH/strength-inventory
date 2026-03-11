import { useEffect, useState } from 'react';

import { Outlet } from '@tanstack/react-router';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { IconContext } from '../../utils/contexts';

import Footer from './Footer';
import Header from './Header';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';

export default function Root () {
  const [iconMode, setIconMode] = useState(() => {
    const savedVisuals = localStorage.getItem('visuals');
    if (savedVisuals === 'icons') {
      return true;
    } else {
      return false;
    }
  });

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
    <IconContext value={iconMode}>
      <div className='flex min-h-svh flex-col'>
        <Header />
        <div className='flex grow flex-col relative'>
          <SidebarLeft
            iconMode={iconMode}
            setIconMode={setIconMode}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <SidebarRight />
          <div
            className='
            flex grow flex-col bg-background dark:bg-background-dark
            transition'
          >
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </IconContext >
  );
}
