import { use } from 'react';

import { BiCalendarWeek } from 'react-icons/bi';
import { BsCalendar4Week } from 'react-icons/bs';
import { FaExclamation } from 'react-icons/fa';

import { IconContext } from '../../../../utils/contexts';

function ModeButtonIcon ({ title }: { title: string }) {
  if (title === 'next week') {
    return (
      <BsCalendar4Week className='text-xl' />
    );
  }

  if (title === 'regular') {
    return (
      <BiCalendarWeek className='text-2xl' />
    );
  }

  if (title === 'exceptions') {
    return (
      <FaExclamation />
    );
  }
}

interface ModeButtonProps {
  hoursMode: string
  membersOnly: boolean
  handleHoursModeToggle: (title: string) => void
  title: string
}

export default function ModeButton (
  {
    hoursMode,
    membersOnly,
    handleHoursModeToggle,
    title
  }: ModeButtonProps
) {
  const iconMode = use(IconContext);

  return (
    <button
      className='
      group flex justify-center items-center p-3 basis-1/3 cursor-pointer
      hover:bg-primary dark:hover:bg-background-dark
      active:inset-ring
      aria-pressed:bg-secondary-dark dark:aria-pressed:bg-secondary'
      aria-pressed={hoursMode === title}
      onClick={() => {
        handleHoursModeToggle(title);
      }}
    >
      <div
        className='
        group-aria-pressed:text-primary-text-dark
        dark:group-aria-pressed:text-primary-text'
      >
        {iconMode
          ? <ModeButtonIcon title={title} />
          : <p className='text-xs md:text-sm'>{title}</p>}
      </div>
    </button>
  );
}
