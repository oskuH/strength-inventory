import { useLocation } from '@tanstack/react-router';

import {
  MdOutlineAdminPanelSettings, MdOutlineLocationOn
} from 'react-icons/md';
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightCollapseFilled,
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarRightExpandFilled,
  TbLogin2
} from 'react-icons/tb';
import { CgGym } from 'react-icons/cg';

interface PageTitleProps {
  pathname: string
  iconMode: boolean
}

function PageTitle ({ pathname, iconMode }: PageTitleProps) {
  if (pathname === '/gyms') {
    return (
      <p>
        {iconMode
          ? <MdOutlineLocationOn className='text-2xl' />
          : 'gyms'}
      </p>
    );
  } else if (pathname === '/equipment') {
    return (
      <p>
        {iconMode
          ? <CgGym className='text-2xl' />
          : 'equipment'}
      </p>
    );
  } else if (pathname === '/login') {
    return (
      <p>
        {iconMode
          ? <TbLogin2 className='text-2xl' />
          : 'login'}
      </p>
    );
  } else if (pathname === '/admin') {
    return (
      <p>
        {iconMode
          ? <MdOutlineAdminPanelSettings className='text-2xl' />
          : 'admin'}
      </p>
    );
  }
}

interface NavbarProps {
  sidebarLeftVisible: boolean
  setSidebarLeftVisible: React.Dispatch<React.SetStateAction<boolean>>
  sidebarRightVisible: boolean
  setSidebarRightVisible: React.Dispatch<React.SetStateAction<boolean>>
  iconMode: boolean
}

export default function Navbar ({
  sidebarLeftVisible,
  setSidebarLeftVisible,
  sidebarRightVisible,
  setSidebarRightVisible,
  iconMode
}: NavbarProps) {
  const pathname = useLocation({
    select: (location) => location.pathname
  });

  return (
    <nav
      className='
      md:hidden flex justify-between items-center
      bg-secondary dark:bg-secondary-dark p-1
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
      <PageTitle pathname={pathname} iconMode={iconMode} />
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
