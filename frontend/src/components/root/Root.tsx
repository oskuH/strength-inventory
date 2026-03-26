import { useEffect, useState } from 'react';

import { Outlet } from '@tanstack/react-router';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { IconContext } from '../../utils/contexts';

import Footer from './Footer';
import Header from './Header';
import Navbar from './Navbar';
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

  const [sidebarLeftVisible, setSidebarLeftVisible] = useState(false);
  const [sidebarRightVisible, setSidebarRightVisible] = useState(false);

  return (
    <IconContext value={iconMode}>
      <div className='flex flex-col min-h-svh'>
        <Header />
        <Navbar
          sidebarLeftVisible={sidebarLeftVisible}
          setSidebarLeftVisible={setSidebarLeftVisible}
          sidebarRightVisible={sidebarRightVisible}
          setSidebarRightVisible={setSidebarRightVisible}
        />
        <div className='flex relative flex-col flex-1'>
          <SidebarLeft
            sidebarLeftVisible={sidebarLeftVisible}
            iconMode={iconMode}
            setIconMode={setIconMode}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <SidebarRight sidebarRightVisible={sidebarRightVisible} />
          <div
            className='
            flex flex-col bg-background dark:bg-background-dark flex-1
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
