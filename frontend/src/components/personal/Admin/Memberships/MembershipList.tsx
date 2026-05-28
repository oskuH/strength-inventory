// work in progress

import { useState } from 'react';

import { skipToken, useQuery } from '@tanstack/react-query';

import { getMembershipsByCountry } from '../../../../utils/api';

interface MembershipListProps {
  selectedMembershipId: string
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>;
}

export default function MembershipList ({
  selectedMembershipId,
  setSelectedMembershipId
}: MembershipListProps) {
  const [country, setCountry] = useState('');
  const [chain, setChain] = useState('');

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['membershipsByCountry', country],
    queryFn: country
      ? () => getMembershipsByCountry({ country: country })
      : skipToken  // disable this query when no country has yet been selected
  });

  console.log(data);

  return (
    <div className='flex flex-1 flex-col gap-1 text-xs'>
      <div className='flex flex-col'>
        <label htmlFor='country'>
          country
        </label>
        <select
          id='country'
          name='country'
          value={country}
          className='
          border bg-tertiary dark:bg-tertiary-dark pl-1 cursor-pointer'
          onChange={(event) => {
            setCountry(event.target.value);
            if (event.target.value === '') {
              setChain('');
            }
          }}
        >
          <option value=''>-- please select a country --</option>
          <option value='Denmark'>DEN</option>
          <option value='Finland'>FIN</option>
          <option value='Iceland'>ICE</option>
          <option value='Norway'>NOR</option>
          <option value='Sweden'>SWE</option>
        </select>
      </div>

      <div hidden={!country} className='flex flex-col'>
        <label htmlFor='chain'>
          chain
        </label>
        <input
          id='chain'
          name='chain'
          type='text'
          value={chain}
          className='border bg-tertiary dark:bg-tertiary-dark pl-1'
          onChange={(event) => {
            setChain(event.target.value);
          }}
        />
      </div>

      <div
        hidden={!country}
        className='
        flex flex-1 bg-background dark:bg-background-dark
        overflow-y-scroll overflow-x-scroll'
      >
        {isPending
          ? 'loading...'
          : data && data.length > 0
            ? 'there is data!'
            : 'no data.'}
      </div>

      {isError
        ? <div>{error.message}</div>
        : null}
    </div>
  );
}
