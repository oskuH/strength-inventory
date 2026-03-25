import { useState } from 'react';

import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

import Membership from './Membership';

import type { GymGet } from '@strength-inventory/schemas';

interface LeftArrowProps {
  membershipIndex: number
  setMembershipIndex: React.Dispatch<React.SetStateAction<number>>
}

function LeftArrow ({ membershipIndex, setMembershipIndex }: LeftArrowProps) {
  if (membershipIndex === 0) {
    return (
      <button
        disabled
        className='
        flex justify-end
        border border-primary dark:border-primary-dark
        bg-secondary dark:bg-secondary-dark w-25
        text-primary dark:text-primary-dark'
      >
        <FaCaretLeft />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        setMembershipIndex(membershipIndex - 1);
      }}
      className='
      flex justify-end border
      bg-secondary dark:bg-secondary-dark w-25
      cursor-pointer
      hover:scale-105 hover:bg-primary dark:hover:bg-background-dark
      active:scale-100'
    >
      <FaCaretLeft />
    </button>
  );
}

interface RightArrowProps {
  membershipIndex: number
  setMembershipIndex: React.Dispatch<React.SetStateAction<number>>
  membershipCount: number
}

function RightArrow ({
  membershipIndex,
  setMembershipIndex,
  membershipCount
}: RightArrowProps) {
  if (membershipIndex >= membershipCount - 1) {
    return (
      <button
        disabled
        className='
        flex
        border border-primary dark:border-primary-dark
        bg-secondary dark:bg-secondary-dark w-25
        text-primary dark:text-primary-dark'
      >
        <FaCaretRight />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        setMembershipIndex(membershipIndex + 1);
      }}
      className='
      flex border
      bg-secondary dark:bg-secondary-dark w-25
      cursor-pointer
      hover:bg-primary dark:hover:bg-background-dark hover:scale-105
      active:scale-100'
    >
      <FaCaretRight />
    </button>
  );
}

function LastMembership () {
  return (
    <div
      className='
      flex flex-col gap-1
      bg-secondary dark:bg-secondary-dark p-3 min-w-63 text-sm'
    >
      <p>Membership missing?</p>
      <a
        href=''
        target='_blank'
        className='border text-center hover:text-blue-600'
      > Send a report!
      </a>
    </div>
  );
}

export default function GymMemberships ({ gym }: { gym: GymGet }) {
  const memberships = gym.memberships;
  const membershipCount = memberships.length;
  const [membershipIndex, setMembershipIndex] = useState(0);

  if (membershipCount === 0) {
    return (
      <div className='flex border-x border-b p-3'>
        {gym.name} does not have available memberships.
      </div>
    );
  }

  return (
    <div className='flex flex-col border-x border-b gap-3 p-3'>
      <div className='flex justify-center gap-3'>
        <LeftArrow
          membershipIndex={membershipIndex}
          setMembershipIndex={setMembershipIndex}
        />
        <p className='text-xs'>{membershipIndex + 1}/{membershipCount}</p>
        <RightArrow
          membershipIndex={membershipIndex}
          setMembershipIndex={setMembershipIndex}
          membershipCount={membershipCount}
        />
      </div>
      <div className='flex justify-center gap-3'>
        <Membership membership={memberships[membershipIndex]} />
        {membershipCount > 1
          ? membershipIndex + 1 < membershipCount
            ? (
              <div className='hidden md:block'>
                <Membership membership={memberships[membershipIndex + 1]} />
              </div>
            )
            : (
              <div className='hidden md:block'>
                <LastMembership />
              </div>
            )
          : null}
      </div>
    </div>
  );
}
