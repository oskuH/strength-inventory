// work in progress

import { use, useState } from 'react';

import { BsCalendar4Week, BsPeople } from 'react-icons/bs';
import { BiCalendarWeek } from 'react-icons/bi';
import { FaExclamation } from 'react-icons/fa';
import { MdCardMembership } from 'react-icons/md';

import type { Gym } from '@strength-inventory/schemas';

import { IconContext } from '../../../utils/contexts';

function ButtonIcon ({ title }: { title: string }) {
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

interface GymOpeningHoursButtonProps {
  hoursMode: string
  membersOnly: boolean
  handleHoursModeToggle: (title: string) => void
  title: string
}

function GymOpeningHoursButton (
  {
    hoursMode,
    membersOnly,
    handleHoursModeToggle,
    title
  }: GymOpeningHoursButtonProps
) {
  const iconMode = use(IconContext);

  return (
    <button
      className='
      group
      flex
      basis-1/3
      p-3
      justify-center
      items-center
      outline
      aria-pressed:bg-secondary-dark
      dark:aria-pressed:bg-secondary'
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
          ? <ButtonIcon title={title} />
          : <p className='text-xs md:text-sm'>{title}</p>}
      </div>
    </button>
  );
}

export default function GymOpeningHours ({ gym }: { gym: Gym }) {
  const [hoursMode, setHoursMode] = useState('regular');
  const [membersOnly, setMembersOnly] = useState(false);

  const iconMode = use(IconContext);

  function handleHoursModeToggle (title: string) {
    setHoursMode(title);
  }

  const openingHoursMembers = Object.fromEntries(
    Object.entries(gym.openingHoursMembers).map(([day, range]) => [
      day,
      range
        ? range.join('-')
        : ''
    ])
  );

  return (
    <div
      className='flex p-3 flex-col outline'
    >
      <div className='flex pb-3'>

        <div
          className='flex flex-col items-center basis-1/3'
        >
          <div>MO {openingHoursMembers.MO}</div>
          <div>TU {openingHoursMembers.TU}</div>
          <div>WE {openingHoursMembers.WE}</div>
        </div>
        <div
          className='flex flex-col justify-center items-center basis-1/3'
        >
          <div>TH {openingHoursMembers.TH}</div>
          <div>FR {openingHoursMembers.FR}</div>
        </div>
        <div
          className='flex flex-col justify-center items-center basis-1/3'
        >
          <div>SA {openingHoursMembers.SA}</div>
          <div>SU {openingHoursMembers.SU}</div>
        </div>
      </div>

      <div className='flex pb-3'>
        <div
          className='
          flex basis-full min-h-12
          bg-secondary dark:bg-secondary-dark'
        >
          <GymOpeningHoursButton
            hoursMode={hoursMode}
            membersOnly={membersOnly}
            handleHoursModeToggle={handleHoursModeToggle}
            title='next week'
          />
          <GymOpeningHoursButton
            hoursMode={hoursMode}
            membersOnly={membersOnly}
            handleHoursModeToggle={handleHoursModeToggle}
            title='regular'
          />
          <GymOpeningHoursButton
            hoursMode={hoursMode}
            membersOnly={membersOnly}
            handleHoursModeToggle={handleHoursModeToggle}
            title='exceptions'
          />
        </div>
      </div>

      <div
        className='
        flex relative justify-center items-center'
      >
        <div className='flex flex-1 justify-end pr-3'>
          {iconMode
            ? <BsPeople />
            : <p className='text-xs md:text-sm'>everyone</p>}
        </div>
        <input
          type='checkbox'
          id='members-only-checkbox'
          className='peer hidden'
          onChange={() => {
            setMembersOnly(!membersOnly);
          }}
          checked={membersOnly}
        />
        <label
          htmlFor='members-only-checkbox'
          className='
          flex items-center cursor-pointer
          before:content-[""] before:h-5 before:w-15 before:rounded-md
          before:bg-secondary-dark dark:before:bg-secondary
          after:content-[""] after:h-3 after:w-3 after:rounded-md
          after:bg-primary dark:after:bg-primary-dark
          after:absolute after:left-28 after:md:left-58
          peer-checked:after:translate-x-10'
        />
        <div className='flex flex-1 pl-3'>
          {iconMode
            ? <MdCardMembership />
            : <p className='text-xs md:text-sm'>members</p>}
        </div>
      </div>
    </div>
  );
}
