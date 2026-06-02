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
      aria-pressed={selected}
      className='
      border bg-red dark:bg-red-dark p-1 w-15 cursor-pointer
      aria-pressed:bg-green'
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
      {availabilityType.toLocaleLowerCase()}
    </button>
  );
}
