import { CiHeart } from 'react-icons/ci';
import { FaGithub } from 'react-icons/fa';

export default function Footer () {
  return (
    <div
      className='
      relative flex justify-center bg-primary dark:bg-primary-dark p-1
      text-primary-text dark:text-primary-text-dark text-sm'
    >
      <p className='flex gap-1'>
        made with <CiHeart className='text-xl' /> in Helsinki
      </p>
      <a
        href='https://github.com/oskuH/strength-inventory'
        target='_blank'
        className='absolute right-2 md:right-25'
      >
        <FaGithub className='text-xl' />
      </a>
    </div>
  );
}
