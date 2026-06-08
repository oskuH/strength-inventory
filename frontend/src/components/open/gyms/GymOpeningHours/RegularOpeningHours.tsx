import { use } from 'react';

import { FaLock } from 'react-icons/fa6';

import { IconContext } from '../../../../utils/contexts';

import type { GymGet } from '@strength-inventory/schemas';

interface DayProps {
  day: string,
  hours: string | undefined
}

function Day ({ day, hours }: DayProps) {
  const iconMode = use(IconContext);

  return (
    <div>
      {hours
        ? (
          <p className='flex'>
            <span className='w-10 text-center'>{day}</span>
            <span className='w-12'>{hours}</span>
          </p>
        )
        : iconMode
          ? (
            <p className='flex items-center gap-1'>
              <span className='w-10 text-center'>{day}</span>
              <FaLock className='text-sm' />
            </p>
          )
          : (
            <p className='flex'>
              <span className='w-10 text-center'>{day}</span>
              <span className='w-12'>closed</span>
            </p>
          )}
    </div>
  );
}

interface RegularOpeningHoursProps {
  gym: GymGet
  membersOnly: boolean
}

export default function RegularOpeningHours ({
  gym,
  membersOnly
}: RegularOpeningHoursProps) {
  let openingHours;
  if (membersOnly) {
    openingHours = Object.fromEntries(
      Object.entries(gym.openingHoursMembers).map(([day, range]) => [
        day,
        range.join('-')
      ])
    );
  } else {
    openingHours = Object.fromEntries(
      Object.entries(gym.openingHoursEveryone).map(([day, range]) => [
        day,
        range.join('-')
      ])
    );
  }

  return (
    <>
      <div
        className='flex flex-col items-center basis-1/3'
      >
        <Day day='MO' hours={openingHours.MO} />
        <Day day='TU' hours={openingHours.TU} />
        <Day day='WE' hours={openingHours.WE} />
      </div>
      <div
        className='flex flex-col justify-center items-center basis-1/3'
      >
        <Day day='TH' hours={openingHours.TH} />
        <Day day='FR' hours={openingHours.FR} />
      </div>
      <div
        className='flex flex-col justify-center items-center basis-1/3'
      >
        <Day day='SA' hours={openingHours.SA} />
        <Day day='SU' hours={openingHours.SU} />
      </div>
    </>
  );
}
