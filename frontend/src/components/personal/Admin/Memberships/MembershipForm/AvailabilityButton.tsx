// work in progress

import type { FormMembership } from './Index';

interface AvailabilityButtonProps {
  availabilityType: 'Desk' | 'Web' | 'App' | 'Other',
  selected: boolean,
  membership: FormMembership,
  setMembership: React.Dispatch<React.SetStateAction<FormMembership>>
}

export default function AvailabilityButton (
  { availabilityType, selected, membership, setMembership }:
  AvailabilityButtonProps
) {
  return (
    <button
      className='border p-1 w-15 cursor-pointer'
      onClick={() => {
        setMembership({
          ...membership,
          availability: {
            ...membership.availability,
            [availabilityType]: !membership.availability[availabilityType]
          }
        });
      }}
    >
      {availabilityType}
    </button>
  );
}
