import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <div className='flex basis-full justify-center bg-yellow-300'>
      <Link
        to='/'
        activeOptions={{ exact: true }}
      >
        STRength_inventORY
      </Link>
    </div>
  );
}