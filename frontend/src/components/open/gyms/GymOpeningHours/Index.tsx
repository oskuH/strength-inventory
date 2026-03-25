// work in progress

import { use, useId, useState } from 'react';

import { BsPeople, BsPeopleFill } from 'react-icons/bs';
import { FaAddressCard, FaRegAddressCard } from 'react-icons/fa6';

import ModeButton from './ModeButton';
import OpeningHours from './OpeningHours';

import type { GymGet } from '@strength-inventory/schemas';

import { IconContext } from '../../../../utils/contexts';

export default function GymOpeningHours ({ gym }: { gym: GymGet }) {
  const [hoursMode, setHoursMode] = useState('regular');
  const [membersOnly, setMembersOnly] = useState(
    () => {
      if (Object.keys(gym.openingHoursEveryone).length === 0) {
        return true;
      } else {
        return false;
      }
    }
  );
  const [disableMembersOnlySwitch, setDisableMembersOnlySwitch] = useState(
    () => {
      if (
        Object.keys(gym.openingHoursEveryone).length === 0
        || Object.keys(gym.openingHoursMembers).length === 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  );

  const iconMode = use(IconContext);

  function handleHoursModeToggle (title: string) {
    setHoursMode(title);
  }

  const membersOnlyCheckboxId = useId();

  return (
    <div
      className='flex flex-col border-x border-b p-3'
    >
      <div className='flex pb-3'>
        <OpeningHours
          gym={gym}
          hoursMode={hoursMode}
          membersOnly={membersOnly}
        />
      </div>

      <div className='flex pb-3'>
        <div
          className='
          flex border divide-x
          bg-secondary dark:bg-secondary-dark
          basis-full min-h-12'
        >
          <ModeButton
            hoursMode={hoursMode}
            membersOnly={membersOnly}
            handleHoursModeToggle={handleHoursModeToggle}
            title='next week'
          />
          <ModeButton
            hoursMode={hoursMode}
            membersOnly={membersOnly}
            handleHoursModeToggle={handleHoursModeToggle}
            title='regular'
          />
          <ModeButton
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
        <input
          type='checkbox'
          id={membersOnlyCheckboxId}
          className='order-2 peer hidden'
          onChange={() => {
            setMembersOnly(!membersOnly);
          }}
          checked={membersOnly}
          disabled={disableMembersOnlySwitch}
        />
        <label
          htmlFor={membersOnlyCheckboxId}
          className='
          flex order-3 items-center peer-enabled:cursor-pointer
          before:rounded-md
          peer-enabled:before:bg-secondary-dark
          dark:peer-enabled:before:bg-secondary
          peer-disabled:before:bg-secondary
          dark:peer-disabled:before:bg-secondary-dark
          before:w-15 before:h-5 before:content-[""]
          after:absolute after:left-1/2 after:-ml-6.5
          peer-checked:after:translate-x-10
          after:rounded-md
          after:bg-primary dark:after:bg-primary-dark
          after:h-3 after:w-3 after:content-[""]
          peer-hover:peer-enabled:after:scale-120'
        />
        <div
          className='
          flex order-1 justify-end pr-3 flex-1
          font-bold peer-checked:font-normal
          text-secondary-dark peer-checked:text-current
          dark:text-secondary dark:peer-checked:text-current
          peer-checked:peer-disabled:text-primary
          dark:peer-checked:peer-disabled:text-primary-dark
          peer-checked:peer-disabled:line-through'
        >
          {iconMode
            ? membersOnly
              ? <BsPeople />
              : <BsPeopleFill />
            : <p className='text-xs md:text-sm'>everyone</p>}

        </div>
        <div
          className='
          flex order-4 pl-3 flex-1
          peer-checked:font-bold
          peer-checked:text-secondary-dark dark:peer-checked:text-secondary
          peer-checked:peer-disabled:text-secondary-dark
          dark:peer-checked:peer-disabled:text-secondary
          peer-disabled:text-primary
          dark:peer-disabled:text-primary-dark
          peer-checked:peer-disabled:no-underline
          peer-disabled:line-through'
        >
          {iconMode
            ? membersOnly
              ? <FaAddressCard />
              : <FaRegAddressCard />
            : <p className='text-xs md:text-sm'>members</p>}
        </div>
      </div>
    </div>
  );
}
