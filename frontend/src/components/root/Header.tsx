import { Link } from '@tanstack/react-router';

export default function Header () {
  return (
    <div
      className='
      flex justify-center bg-primary text-primary-text
      dark:bg-primary-dark dark:text-primary-text-dark'
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
