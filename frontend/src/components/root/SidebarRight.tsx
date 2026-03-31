import { use } from 'react';

import { Link } from '@tanstack/react-router';

import { AuthContext } from '../../utils/contexts';

export default function SidebarRight (
  { sidebarRightVisible }: { sidebarRightVisible: boolean }
) {
  const auth = use(AuthContext);

  return (
    <nav
      className={`
      absolute right-0 md:translate-x-0 flex flex-col items-end
      border-t border-l
      bg-secondary dark:bg-secondary-dark pt-3 w-24 h-full
      text-primary-text dark:text-primary-text-dark
      ${sidebarRightVisible
      ? 'translate-x-0'
      : 'translate-x-full'}`}
    >
      {!auth?.isAuthenticated
        ? (
          <Link
            to='/login'
            search={() => ({ redirect: location.href })}
            className='m-1'
          >
            Login
          </Link>
        )
        : (
          <Link
            to='/admin'
            className='m-1'
          >
            Admin
          </Link>
        )}
    </nav>
  );
}
