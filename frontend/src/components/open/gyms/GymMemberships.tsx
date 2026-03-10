// work in progress

import type { GymGet, Membership } from '@strength-inventory/schemas';

function Membership ({ membership }: { membership: Membership }) {
  const {
    name,
    price,
    priceCurrency,
    validity,
    validityUnit,
    commitment,
    commitmentUnit,
    availability,
    url,
    notes
  } = membership;

  return (
    <div className='flex p-3 w-58 bg-secondary-dark text-sm outline'>
      <div className='flex flex-col basis-2/3'>
        <p className='font-bold'>{name}</p>
        <p>Availability</p>
        <div className='flex'>
          <p className='mr-1'>desk</p>
          <p className='mr-1'>web</p>
          <p>app</p>
        </div>
        <p>Notes</p>
        <p>
          {notes
            ? notes
            : '-'}
        </p>
      </div>
      <div className='flex flex-col'>
        <p>{price} {priceCurrency}</p>
        <p>Valid for:</p>
        <p>{validity} {validityUnit}</p>
        <p>Commitment:</p>
        <div>
          {commitment
            ? <p>{commitment} {commitmentUnit}</p>
            : <p>none</p>}
        </div>
      </div>
    </div>
  );
}

export default function GymMemberships ({ gym }: { gym: GymGet }) {
  const memberships = gym.memberships;
  const membershipCount = memberships.length;

  if (membershipCount === 0) {
    return (
      <div className='flex p-3 outline'>
        {gym.name} does not have available memberships.
      </div>
    );
  }

  return (
    <div
      className='flex p-3 gap-3 justify-center items-center min-h-50 outline'
    >
      <p>l</p>
      <div>
        <Membership membership={memberships[0]} />
      </div>
      <p>r</p>
    </div>
  );
}
