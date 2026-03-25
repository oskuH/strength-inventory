import { Link } from '@tanstack/react-router';

export default function SidebarRight () {
  // Temporariliy hidden for dev purposes
  return (
    <div
      className='
      absolute right-0 h-full flex w-24 flex-col items-end
      bg-secondary text-primary-text
      dark:bg-secondary-dark dark:text-primary-text-dark hidden'
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
    </div>
  );
}
