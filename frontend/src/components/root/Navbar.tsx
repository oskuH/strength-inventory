import { useLocation } from '@tanstack/react-router';

import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightCollapseFilled,
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarRightExpandFilled
} from 'react-icons/tb';

interface NavbarProps {
  sidebarLeftVisible: boolean
  setSidebarLeftVisible: React.Dispatch<React.SetStateAction<boolean>>
  sidebarRightVisible: boolean
  setSidebarRightVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Navbar ({
  sidebarLeftVisible,
  setSidebarLeftVisible,
  sidebarRightVisible,
  setSidebarRightVisible
}: NavbarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  let pageTitle = pathname;

  // TODO: add more
  if (pathname === '/gyms') {
    pageTitle = 'gyms';
  } else if (pathname === '/equipment') {
    pageTitle = 'equipment';
  } else if (pathname === '/login') {
    pageTitle = 'log in';
  }

  return (
    <nav
      className='
      md:hidden flex justify-between items-center
      bg-secondary dark:bg-secondary-dark px-1
      text-primary-text dark:text-primary-text-dark'
    >
      <button
        className='group relative w-4 h-4 cursor-pointer'
        onClick={() => {
          setSidebarLeftVisible(!sidebarLeftVisible);
        }}
      >
        {sidebarLeftVisible
          ? (
            <div>
              <TbLayoutSidebarLeftCollapseFilled
                className='
                absolute inset-0 opacity-0 m-auto group-hover:opacity-100'
              />
              <TbLayoutSidebarLeftCollapse
                className='absolute inset-0 m-auto group-hover:opacity-0'
              />
            </div>
          )
          : (
            <div>
              <TbLayoutSidebarLeftExpandFilled
                className='
                absolute inset-0 opacity-0 m-auto group-hover:opacity-100'
              />
              <TbLayoutSidebarLeftExpand
                className='absolute inset-0 m-auto group-hover:opacity-0'
              />
            </div>
          )}
      </button>
      <p>{pageTitle}</p>
      <button
        className='group relative w-4 h-4 cursor-pointer'
        onClick={() => {
          setSidebarRightVisible(!sidebarRightVisible);
        }}
      >
        {sidebarRightVisible
          ? (
            <div>
              <TbLayoutSidebarRightCollapseFilled
                className='
                absolute inset-0 opacity-0 m-auto group-hover:opacity-100'
              />
              <TbLayoutSidebarRightCollapse
                className='absolute inset-0 m-auto group-hover:opacity-0'
              />
            </div>
          )
          : (
            <div>
              <TbLayoutSidebarRightExpandFilled
                className='
                absolute inset-0 opacity-0 m-auto group-hover:opacity-100'
              />
              <TbLayoutSidebarRightExpand
                className='absolute inset-0 m-auto group-hover:opacity-0'
              />
            </div>
          )}
      </button>
    </nav>
  );
}
