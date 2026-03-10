import type { GymGet } from '@strength-inventory/schemas';

interface OpeningHoursProps {
  gym: GymGet
  hoursMode: string
  membersOnly: boolean
}

export default function OpeningHours ({
  gym,
  hoursMode,
  membersOnly
}: OpeningHoursProps) {
  const openingHoursEveryone = Object.fromEntries(
    Object.entries(gym.openingHoursEveryone).map(([day, range]) => [
      day,
      range
        ? range.join('-')
        : ''
    ])
  );

  const openingHoursMembers = Object.fromEntries(
    Object.entries(gym.openingHoursMembers).map(([day, range]) => [
      day,
      range
        ? range.join('-')
        : ''
    ])
  );

  if (hoursMode === 'regular' && !membersOnly) {
    return (
      <>
        <div
          className='flex flex-col items-center basis-1/3'
        >
          <div>MO {openingHoursEveryone.MO}</div>
          <div>TU {openingHoursEveryone.TU}</div>
          <div>WE {openingHoursEveryone.WE}</div>
        </div>
        <div
          className='flex flex-col justify-center items-center basis-1/3'
        >
          <div>TH {openingHoursEveryone.TH}</div>
          <div>FR {openingHoursEveryone.FR}</div>
        </div>
        <div
          className='flex flex-col justify-center items-center basis-1/3'
        >
          <div>SA {openingHoursEveryone.SA}</div>
          <div>SU {openingHoursEveryone.SU}</div>
        </div>
      </>
    );
  }

  if (hoursMode === 'regular' && membersOnly) {
    return (
      <>
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
      </>
    );
  }
}
