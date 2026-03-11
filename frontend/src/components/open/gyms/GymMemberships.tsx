// work in progress

import { useState } from 'react';

import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { FaEuroSign } from 'react-icons/fa6';
import { TbWorldWww } from 'react-icons/tb';

import type { GymGet, Membership } from '@strength-inventory/schemas';

function CurrencySymbol ({ priceCurrency }: { priceCurrency: string }) {
  if (priceCurrency === 'euro') {
    return <FaEuroSign className='text-xs -mb-0.5' />;
  }
  // TODO: add more
  return <p>{priceCurrency}</p>;
}

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

  let notNullUrl: string | undefined;
  if (url !== null) {
    notNullUrl = url;
  }

  return (
    <div
      className='
      flex p-3 w-63 gap-1
      bg-secondary dark:bg-secondary-dark
      text-sm outline'
    >
      <div className='flex flex-col gap-1 basis-2/3 min-w-0 wrap-break-word'>
        {notNullUrl
          ? (
            <a
              href={notNullUrl}
              target='_blank'
              className='flex font-bold gap-1 hover:text-blue-600'
            >
              {name} <TbWorldWww className='text-xl' />
            </a>
          )
          : <p className='font-bold'>{name}</p>}
        <div>
          <p>Availability</p>
          <div className='flex text-xs'>
            <p className='mr-1'>desk</p>
            <p className='mr-1'>web</p>
            <p>app</p>
          </div>
        </div>
        <div>
          <p>Notes</p>
          <p className='wrap-break-word text-xs'>
            {notes
              ? notes
              : 'none'}
          </p>
        </div>
      </div>
      <div className='flex flex-col gap-1 basis-1/3'>
        <p className='flex items-center'>
          {price} <CurrencySymbol priceCurrency={priceCurrency} />
        </p>
        <div>
          <p>Valid for:</p>
          <p className='text-xs'>{validity} {validityUnit}</p>
        </div>
        <div>
          <p>Commitment:</p>
          <div className='text-xs'>
            {commitment
              ? <p>{commitment} {commitmentUnit}</p>
              : <p>none</p>}
          </div>
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
      <div className='flex p-3 border-x border-b'>
        {gym.name} does not have available memberships.
      </div>
    );
  }

  return (
    <div className='flex flex-col p-3 gap-3 min-h-48 border-x border-b'>
      <div className='flex justify-center gap-3'>
        <button
          className='
          flex basis-30 justify-end
          bg-secondary dark:bg-secondary-dark
          cursor-pointer outline
          hover:scale-105
          hover:bg-primary dark:hover:bg-background-dark
          active:scale-100'
        >
          <FaCaretLeft />
        </button>
        <button
          className='
          flex basis-30
          bg-secondary dark:bg-secondary-dark
          cursor-pointer outline
          hover:scale-105
          hover:bg-primary dark:hover:bg-background-dark
          active:scale-100'
        >
          <FaCaretRight />
        </button>
      </div>
      <div className='flex justify-center gap-3'>
        <Membership membership={memberships[0]} />
      </div>
    </div>
  );
}
