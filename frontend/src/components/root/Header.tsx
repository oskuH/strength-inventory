import { Link } from '@tanstack/react-router';

export default function Header () {
  return (
    <div
      className='
      flex justify-center bg-primary dark:bg-primary-dark p-1
      text-primary-text dark:text-primary-text-dark'
    >
      <Link
        to='/'
        activeOptions={{ exact: true }}
      >
        STRength_inventORY
      </Link>
    </div>
  );
}
