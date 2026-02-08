import { Link } from '@tanstack/react-router';

export default function SidebarLeft() {
  return (
    <div className='flex flex-col bg-blue-500'>
      <Link
        to='/gyms'
        className='m-1'
      >
        Gym search
      </Link>
      <Link
        to='/equipment'
        className='m-1'
      >
        Equipment search
      </Link>
    </div>
  );
}