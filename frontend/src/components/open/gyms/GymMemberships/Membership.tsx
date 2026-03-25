import { FaEuroSign } from 'react-icons/fa6';
import { TbWorldWww } from 'react-icons/tb';

import type { MembershipGet } from '@strength-inventory/schemas';

interface AvailabilityItemProps {
  itemName: string
  availability: boolean
}

function AvailabilityItem ({ itemName, availability }: AvailabilityItemProps) {
  return (
    <div className='mr-1'>
      {availability
        ? <p className='text-green-700 dark:text-green-500'>{itemName}</p>
        : <p className='text-red-500 dark:text-red-400'>{itemName}</p>}
    </div>
  );
}

function CurrencySymbol ({ feeCurrency }: { feeCurrency: string }) {
  if (feeCurrency === 'euro') {
    return <FaEuroSign className='-mb-0.5 text-xs' />;
  }
  // TODO: add more
  return <p>{feeCurrency}</p>;
}

export default function Membership (
  { membership }: { membership: MembershipGet }
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
  if (url !== null) {
    notNullUrl = url;
  }

  return (
    <div
      className='
      flex gap-3
      border bg-secondary dark:bg-secondary-dark p-3 w-63 text-sm'
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
        <p className='flex items-center'>
          {membershipFee} <CurrencySymbol feeCurrency={feeCurrency} />
        </p>
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
                  {initiationFee} <CurrencySymbol feeCurrency={feeCurrency} />
                </p>
              )
              : 'none'}
          </div>
        </div>
      </div>
    </div>
  );
}
