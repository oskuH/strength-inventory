import { Link } from '@tanstack/react-router';

export default function SidebarRight (
  { sidebarRightVisible }: { sidebarRightVisible: boolean }
) {
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
      <Link
        to='/lists'
        className='m-1'
      >
        Lists
      </Link>
      <Link
        to='/mygyms'
        className='m-1'
      >
        My gyms
      </Link>
    </nav>
  );
}
