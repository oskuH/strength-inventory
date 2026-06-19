import { TbWorldWww } from 'react-icons/tb';

import type { Membership } from '@strength-inventory/schemas';

interface AvailabilityItemProps {
  itemName: string;
  availability: boolean;
}

function AvailabilityItem ({ itemName, availability }: AvailabilityItemProps) {
  return (
    <div className='mr-1'>
      {availability
        ? <p className='text-green-dark dark:text-green'>{itemName}</p>
        : <p className='text-red-dark dark:text-red'>{itemName}</p>}
    </div>
  );
}

interface PriceProps {
  fee: number
  currency: string
}

function Price ({ fee, currency }: PriceProps) {
  const ISOfee = ['DKK', 'ISK'];

  if (currency in ISOfee) {
    return (
      <span className='flex items-center'>
        {currency} {fee}
      </span>
    );
  } else if (currency === 'EUR') {
    return (
      <span className='flex items-center'>
        {fee} €
      </span>
    );
  } else if (currency === 'NOK') {
    return (
      <span className='flex items-center'>
        {fee} kr.
      </span>
    );
  } else if (currency === 'SEK') {
    return (
      <span className='flex items-center'>
        {fee} kr
      </span>
    );
  } else {
    return <span>{fee} {currency}</span>;
  }
}

export default function Membership (
  { membership }: { membership: Membership; }
) {
  const {
    name,
    feeCurrency,
    membershipFee,
    validity,
    validityUnit,
    commitment,
    commitmentUnit,
    initiationFee,
    availability,
    url,
    notes
  } = membership;

  let notNullUrl: string | undefined;
  if (url) {
    notNullUrl = url;
  }

  return (
    <div
      className='
        flex gap-3
        border bg-secondary dark:bg-secondary-dark p-3 w-63 min-h-45 text-sm'
    >
      <div className='flex flex-col gap-1 wrap-break-word basis-2/3 min-w-0'>
        {notNullUrl
          ? (
            <a
              href={notNullUrl}
              target='_blank'
              className='flex items-center gap-1 font-bold hover:text-blue-600'
            >
              <h3>{name} <TbWorldWww className='text-xl' /></h3>
            </a>
          )
          : <p className='font-bold'>{name}</p>}
        <div>
          <h4>Availability</h4>
          <div className='flex text-xs'>
            <AvailabilityItem
              itemName='desk'
              availability={availability.Desk}
            />
            <AvailabilityItem
              itemName='web'
              availability={availability.Web}
            />
            <AvailabilityItem
              itemName='app'
              availability={availability.App}
            />
            <AvailabilityItem
              itemName='other'
              availability={availability.Other}
            />
          </div>
        </div>
        <div>
          <h4>Notes</h4>
          <p className='wrap-break-word text-xs'>
            {notes
              ? notes
              : 'none'}
          </p>
        </div>
      </div>
      <div className='flex flex-col gap-1 basis-1/3'>
        <Price fee={membershipFee} currency={feeCurrency} />
        <div>
          <h4>Valid for:</h4>
          {validity === 1
            ? <p className='text-xs'>{validity} {validityUnit}</p>
            : <p className='text-xs'>{validity} {validityUnit}s</p>}
        </div>
        <div>
          <h4>Commitment:</h4>
          <div className='text-xs'>
            {commitment
              ? commitment === 1
                ? <p>{commitment} {commitmentUnit}</p>
                : <p>{commitment} {commitmentUnit}s</p>
              : <p>none</p>}
          </div>
        </div>
        <div>
          <h4>Initiation fee:</h4>
          <div className='text-xs'>
            {initiationFee
              ? (
                <p className='flex items-center'>
                  <Price fee={initiationFee} currency={feeCurrency} />
                </p>
              )
              : 'none'}
          </div>
        </div>
      </div>
    </div>
  );
}
