import type { Hours } from '@strength-inventory/schemas';

interface OpeningHoursDayInputProps {
  group: 'everyone' | 'members'
  day: 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'
  editedHours: Hours | undefined
}

export default function OpeningHoursDayInput (
  { group, day, editedHours }: OpeningHoursDayInputProps
) {
  return (
    <div className='flex gap-1'>
      <span className='w-5'>{day}</span>
      <input
        id={`${group}${day}Open`}
        name={`${group}${day}Open`}
        type='number'
        min='0'
        max='24'
        defaultValue={editedHours?.[day]
          ? editedHours[day][0]
            ? editedHours[day][0]
            : undefined
          : undefined}
        className='flex flex-1 dark:bg-background-dark md:w-9'
      />
      <span>-</span>
      <input
        id={`${group}${day}Close`}
        name={`${group}${day}Close`}
        type='number'
        min='0'
        max='24'
        defaultValue={editedHours?.[day]
          ? editedHours[day][1]
            ? editedHours[day][1]
            : undefined
          : undefined}
        className='flex flex-1 dark:bg-background-dark md:w-9'
      />
    </div>
  );
}
