import { useState } from 'react';

import type { Hours } from '@strength-inventory/schemas';

interface OpeningHoursDayInputProps {
  group: 'everyone' | 'members'
  day: 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'
  editedHours: Hours | undefined
}

export default function OpeningHoursDayInput (
  { group, day, editedHours }: OpeningHoursDayInputProps
) {
  const [openTime, setOpenTime] = useState(editedHours?.[day]
    ? editedHours[day][0]
      ? String(editedHours[day][0])
      : ''
    : '');
  const [closeTime, setCloseTime] = useState(editedHours?.[day]
    ? editedHours[day][1]
      ? String(editedHours[day][1])
      : ''
    : '');

  return (
    <div className='flex gap-1'>
      <span className='p-1 w-7'>{day}</span>
      <input
        id={`${group}${day}Open`}
        name={`${group}${day}Open`}
        type='number'
        min='0'
        max={closeTime}
        value={openTime}
        onChange={(event) => {
          setOpenTime(event.target.value);
        }}
        className='
        flex bg-background dark:bg-background-dark w-10'
      />
      <span>-</span>
      <input
        id={`${group}${day}Close`}
        name={`${group}${day}Close`}
        type='number'
        min={openTime}
        max='24'
        value={closeTime}
        onChange={(event) => {
          setCloseTime(event.target.value);
        }}
        className='
        flex bg-background dark:bg-background-dark w-10'
      />
    </div>
  );
}
