// work in progress

import type { Gym } from '@strength-inventory/schemas';

interface GymEntryExtensionProps {
  activeExtension: string | null
  gym: Gym
}

export default function GymEntryExtension (
  { activeExtension, gym }: GymEntryExtensionProps
) {
  const openingHoursMembers = Object.fromEntries(
    Object.entries(gym.openingHoursMembers).map(([day, range]) => [
      day,
      range
        ? range.join('-')
        : ''
    ])
  );

  if (!activeExtension) {
    return null;
  }

  if (activeExtension === 'equipment') {
    return (
      <div
        className='flex p-3 outline'
      >
        equipment
      </div>
    );
  }

  if (activeExtension === 'memberships') {
    return (
      <div
        className='flex p-3 outline'
      >
        memberships
      </div>
    );
  }

  if (activeExtension === 'opening hours') {
    return (
      <div
        className='flex p-3 flex-col outline'
      >
        <div
          className='flex justify-around'
        >
          <div>MO {openingHoursMembers.MO}</div>
          <div>TU {openingHoursMembers.TU}</div>
          <div>WE {openingHoursMembers.WE}</div>
        </div>
        <div
          className='flex justify-around'
        >
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>
        <div
          className='flex justify-around'
        >
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>
    );
  }
}
