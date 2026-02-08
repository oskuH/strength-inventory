import { Link } from '@tanstack/react-router';

export default function SidebarRight() {
  return (
    <div className='flex flex-col items-end bg-red-500'>
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