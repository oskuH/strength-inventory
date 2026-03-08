// work in progress, Equipment and Memberships components missing

import GymOpeningHours from './GymOpeningHours';

import type { Gym } from '@strength-inventory/schemas';

interface GymEntryExtensionProps {
  activeExtension: string | null
  gym: Gym
}

export default function GymExtension (
  { activeExtension, gym }: GymEntryExtensionProps
) {
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
      <GymOpeningHours gym={gym} />
    );
  }
}
