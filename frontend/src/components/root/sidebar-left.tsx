import { Link } from '@tanstack/react-router';

export default function SidebarLeft() {
  return (
    <div className='absolute left-0 h-full flex p-1 w-24 flex-col bg-blue-500'>
      <h2 className='font-bold'>Find</h2>
      <Link
        to='/gyms'
      >
        Gyms
      </Link>
      <Link
        to='/equipment'
      >
        Equipment
      </Link>
    </div>
  );
}