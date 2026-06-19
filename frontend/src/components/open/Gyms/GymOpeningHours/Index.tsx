import { use, useId, useState } from 'react';

import { BsPeople, BsPeopleFill } from 'react-icons/bs';
import { FaAddressCard, FaRegAddressCard } from 'react-icons/fa6';

import { IconContext } from '../../../../utils/contexts';

import ModeButton from './ModeButton';
import NextSevenDays from './NextSevenDays';
import RegularHours from './RegularHours';

import type { GymGet } from '@strength-inventory/schemas';

export default function GymOpeningHours ({ gym }: { gym: GymGet }) {
  const iconMode = use(IconContext);

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
  const [exceptionReason, setExceptionReason] = useState('');

  let disableMembersOnlySwitch: boolean;
  if (
    Object.keys(gym.openingHoursEveryone).length === 0
    || Object.keys(gym.openingHoursMembers).length === 0
  ) {
    disableMembersOnlySwitch = true;
  } else {
    disableMembersOnlySwitch = false;
  }

  function handleHoursModeToggle (title: string) {
    setHoursMode(title);
  }

  const membersOnlyCheckboxId = useId();

  return (
    <div
      className='flex flex-col border-x border-b py-3'
    >
      <div className='flex pb-3'>
        {hoursMode === 'regular'
          ? (
            <RegularHours
              gym={gym}
              membersOnly={membersOnly}
              setExceptionReason={setExceptionReason}
            />
          )
          : (
            <NextSevenDays
              gym={gym}
              membersOnly={membersOnly}
              setExceptionReason={setExceptionReason}
            />
          )}
      </div>

      <div className='flex relative mb-3'>
        <div
          className='
            flex flex-col border divide-y
            bg-secondary dark:bg-secondary-dark basis-full'
        >
          <ModeButton
            hoursMode={hoursMode}
            handleHoursModeToggle={handleHoursModeToggle}
            title='regular'
          />
          <ModeButton
            hoursMode={hoursMode}
            handleHoursModeToggle={handleHoursModeToggle}
            title='next seven days'
          />
        </div>

        {exceptionReason
          ? (
            <div
              className='
                absolute flex items-center opacity-95
                bg-secondary dark:bg-secondary-dark p-1 w-full h-full'
            >
              <p className='w-3/4 text-center text-sm'>{exceptionReason}</p>
              <button
                className='
                  flex-1 opacity-100 border rounded-md h-full cursor-pointer
                  hover:bg-primary dark:hover:bg-primary-dark'
                onClick={() => {
                  setExceptionReason('');
                }}
              >
                OK
              </button>
            </div>
          )
          : null}
      </div>

      <div
        className='
          flex relative justify-center items-center'
      >
        <input
          id={membersOnlyCheckboxId}
          type='checkbox'
          disabled={disableMembersOnlySwitch}
          checked={membersOnly}
          className='order-2 peer hidden'
          onChange={() => {
            setMembersOnly(!membersOnly);
            setExceptionReason('');
          }}
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
            after:h-3 after:w-3 after:content-[""] after:transition
            peer-hover:peer-enabled:after:scale-120'
        />
        <div
          className='
            flex order-1 justify-end pr-3 flex-1 font-bold
            peer-checked:font-normal
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
            : <p className='text-sm'>everyone</p>}

        </div>
        <div
          className='
            flex order-4 pl-3 flex-1 peer-checked:font-bold
            peer-checked:text-secondary-dark dark:peer-checked:text-secondary
            peer-checked:peer-disabled:text-secondary-dark
            dark:peer-checked:peer-disabled:text-secondary
            peer-disabled:text-primary dark:peer-disabled:text-primary-dark
            peer-checked:peer-disabled:no-underline
            peer-disabled:line-through'
        >
          {iconMode
            ? membersOnly
              ? <FaAddressCard />
              : <FaRegAddressCard />
            : <p className='text-sm'>members</p>}
        </div>
      </div>
    </div>
  );
}
