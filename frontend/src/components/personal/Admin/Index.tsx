import { Link, Outlet, useLocation } from '@tanstack/react-router';

function AdminLink ({ pathname }: { pathname: string }) {
  const currentPathname = useLocation({
    select: (location) => location.pathname
  });

  const validPaths = ['equipment', 'gyms'];
  let to: string;
  if (validPaths.includes(pathname)) {
    to = `/admin/${pathname}`;
  } else {
    to = '/admin';
  }

  return (
    <Link
      to={to}
      disabled={to === '/admin'}
      className={`
        flex flex-1 justify-center border
        bg-tertiary dark:bg-tertiary-dark py-1 min-w-20
        text-primary-text dark:text-primary-text-dark text-xs
        hover:inset-ring active:font-bold
        ${currentPathname === to
      ? 'font-bold inset-ring'
      : ''
    }`}
    >
      {pathname}
    </Link>
  );
}

export default function AdminLayoutComponent () {
  return (
    <div
      className='
      flex flex-1 justify-center items-stretch w-full overflow-hidden'
    >
      <div className='flex flex-1 flex-col gap-1 p-3 min-w-90 max-w-145'>
        <nav className='flex justify-evenly gap-1'>
          <AdminLink pathname='gyms' />
          <AdminLink pathname='equipment' />
          {/* <AdminLink pathname='memberships' />
          <AdminLink pathname='users' /> */} {/* TODO */}
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
