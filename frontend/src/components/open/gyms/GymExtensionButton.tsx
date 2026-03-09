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
      group
      flex
      w-1/3
      p-3
      justify-center
      items-center
      outline
      aria-pressed:bg-secondary-dark
      dark:aria-pressed:bg-secondary'
      aria-pressed={activeExtension === title}
      onClick={() => {
        handleToggle(title);
      }}
    >
      <div
        className='
        group-aria-pressed:text-primary-text-dark
        dark:group-aria-pressed:text-primary-text'
      >
        {iconMode
          ? <ButtonIcon title={title} />
          : <p className='text-sm md:text-xs'>{title}</p>}
      </div>
    </button>
  );
}
