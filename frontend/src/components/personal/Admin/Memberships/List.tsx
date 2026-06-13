import { skipToken, useQuery } from '@tanstack/react-query';

import { getMembershipsByCountry } from '../../../../utils/api';

import MembershipList from '../MembershipList';

import type { Membership } from '@strength-inventory/schemas';

interface ListProps {
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  country: string
  setCountry: React.Dispatch<React.SetStateAction<string>>
  chain: string
  setChain: React.Dispatch<React.SetStateAction<string>>
}

export default function List ({
  setFormMode,
  setSelectedMembershipId,
  country,
  setCountry,
  chain,
  setChain
}: ListProps) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['membershipsByCountry', country],
    queryFn: country
      ? () => getMembershipsByCountry({ country: country })
      : skipToken  // disable this query when no country has yet been selected
  });

  let filteredMemberships: Membership[] = [];
  if (chain && data) {
    filteredMemberships = data.filter((membership) => {
      return membership.chain === chain;
    });
  }

  return (
    <div className='flex flex-1 flex-col gap-1 overflow-y-scroll text-sm'>
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
          autoComplete='off'
          className='border bg-tertiary dark:bg-tertiary-dark pl-1'
          onChange={(event) => {
            setChain(event.target.value);
          }}
        />
      </div>

      <div
        hidden={!country}
        className='flex flex-1 overflow-y-scroll overflow-x-scroll'
      >
        {isPending
          ? 'loading...'
          : chain
            ? (
              <MembershipList
                memberships={filteredMemberships}
                filterType='chain'
                setFormMode={setFormMode}
                setSelectedMembershipId={setSelectedMembershipId}
                disabledMembershipIds={undefined}
                gymId=''
              />
            )
            : (
              <p
                className='flex-1 bg-background dark:bg-background-dark p-1'
              >
                please select a chain to see its memberships (case-sensitive)
              </p>
            )}
      </div>

      {isError
        ? <div>{error.message}</div>
        : null}
    </div>
  );
}
