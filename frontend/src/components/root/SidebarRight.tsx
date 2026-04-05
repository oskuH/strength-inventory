import { use } from 'react';

import { Link, useNavigate } from '@tanstack/react-router';

import { AuthContext } from '../../utils/contexts';

export default function SidebarRight (
  { sidebarRightVisible }: { sidebarRightVisible: boolean }
) {
  const auth = use(AuthContext);
  const navigate = useNavigate();

  async function handleLogout () {
    try {
      await auth.logout();
      await navigate({ to: location.pathname, reloadDocument: true });
    } catch (err: unknown) {
      console.error('Logout failed', err);
    }
  }

  return (
    <nav
      className={`
      absolute right-0 md:translate-x-0 flex flex-col items-stretch
      border-t border-l
      bg-secondary dark:bg-secondary-dark pt-3 w-24 h-full
      text-primary-text dark:text-primary-text-dark text-sm
      ${sidebarRightVisible
      ? 'translate-x-0'
      : 'translate-x-full'}`}
    >
      {!auth.isAuthenticated
        ? (
          <div className='flex flex-col items-stretch gap-1'>
            <Link
              to='/login'
              search={() => ({ redirect: location.pathname })}
              className='
              flex justify-end pr-2 cursor-pointer
              hover:bg-primary dark:hover:bg-background-dark'
            >
              log in
            </Link>
          </div>
        )
        : (
          <div className='flex flex-col items-stretch gap-1'>
            <button
              onClick={() => {
                handleLogout().catch(() => {});
              }}
              className='
              flex justify-end pr-2 cursor-pointer
              hover:bg-primary dark:hover:bg-background-dark'
            >
              <span className=''>log out</span>
            </button>
            <Link
              to='/admin'
              className='
              flex justify-end pr-2
              hover:bg-primary dark:hover:bg-background-dark'
            >
              admin
            </Link>
          </div>
        )}
    </nav>
  );
}
