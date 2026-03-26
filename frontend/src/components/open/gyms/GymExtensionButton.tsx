import { use } from 'react';

import { CgGym } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { TbClock } from 'react-icons/tb';

import { IconContext } from '../../../utils/contexts';

function ButtonIcon ({ title }: { title: string }) {
  if (title === 'equipment') {
    return (
      <CgGym className='text-4xl' />
    );
  }

  if (title === 'memberships') {
    return (
      <FaRegAddressCard className='text-4xl' />
    );
  }

  if (title === 'opening hours') {
    return (
      <TbClock className='text-4xl' />
    );
  }
}

interface GymEntryButtonProps {
  activeExtension: string | null
  handleToggle: (title: string) => void
  title: string
}

export default function GymButton (
  { activeExtension, handleToggle, title }: GymEntryButtonProps
) {
  const iconMode = use(IconContext);

  return (
    <button
      className='
      group flex justify-center items-center p-3 basis-1/3 cursor-pointer
      hover:bg-primary dark:hover:bg-background-dark active:inset-ring
      aria-pressed:bg-secondary-dark dark:aria-pressed:bg-secondary'
      aria-pressed={activeExtension === title}
      onClick={() => {
        handleToggle(title);
      }}
    >
      <h3
        className='
        group-aria-pressed:text-primary-text-dark
        dark:group-aria-pressed:text-primary-text'
      >
        {iconMode
          ? <ButtonIcon title={title} />
          : <span className='text-sm md:text-xs'>{title}</span>}
      </h3>
    </button>
  );
}
