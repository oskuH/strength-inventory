import GymEquipment from './GymEquipment/Index';
import GymMemberships from './GymMemberships/Index';
import GymOpeningHours from './GymOpeningHours/Index';

import type { GymGet } from '@strength-inventory/schemas';

interface GymEntryExtensionProps {
  activeExtension: string | null
  gym: GymGet
}

export default function GymExtension (
  { activeExtension, gym }: GymEntryExtensionProps
) {
  if (!activeExtension) {
    return null;
  }

  if (activeExtension === 'equipment') {
    return (
      <GymEquipment gym={gym} />
    );
  }

  if (activeExtension === 'memberships') {
    return (
      <GymMemberships gym={gym} />
    );
  }

  if (activeExtension === 'opening hours') {
    return (
      <GymOpeningHours gym={gym} />
    );
  }
}
