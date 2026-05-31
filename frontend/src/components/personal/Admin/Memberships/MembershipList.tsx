import { skipToken, useQuery } from '@tanstack/react-query';

import { getMembershipsByCountry } from '../../../../utils/api';

import type { Membership } from '@strength-inventory/schemas';

interface MembershipListProps {
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  country: string
  setCountry: React.Dispatch<React.SetStateAction<string>>
  chain: string
  setChain: React.Dispatch<React.SetStateAction<string>>
}

interface ListProps
  extends Pick<MembershipListProps, 'setFormMode' | 'setSelectedMembershipId'> {
  memberships: Membership[]
}

function List ({
  memberships, setFormMode, setSelectedMembershipId
}: ListProps) {
  if (memberships.length === 0) {
    return (
      <div className='min-w-full'>
        <p className='p-1 text-center'>
          the selected chain does not have memberships
        </p>
        <hr />
        <button
          className='
            flex flex-col min-w-full p-1
            hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
          onClick={() => {
            setFormMode('create');
          }}
        >
          add new membership
        </button>
        <hr />
      </div>
    );
  }

  return (
    <ol className='min-w-full'>
      {memberships.map((membership) => (
        <li
          key={membership.id}
          className='flex flex-col min-w-full'
        >
          <button
            className='
            flex flex-col min-w-full p-1
            hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
            onClick={() => {
              setFormMode('edit');
              setSelectedMembershipId(membership.id);
            }}
          >
            <h3 className='flex truncate'>{membership.name}</h3>
            <div className='flex text-xs'>
              <span className='flex w-20'>
                {membership.membershipFee} {membership.feeCurrency}
              </span>
              <span className='flex w-20'>
                per {membership.validity} {membership.validityUnit}
              </span>
              {membership.commitment
                ? (
                  <span>
                    {/* eslint-disable-next-line @stylistic/max-len */}
                    {membership.commitment} {membership.commitmentUnit} commitment
                  </span>
                )
                : null}
            </div>
          </button>
          <hr />
        </li>
      ))}
      <li>
        <button
          className='
            flex flex-col min-w-full p-1
            hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
          onClick={() => {
            setFormMode('create');
          }}
        >
          add new membership
        </button>
        <hr />
      </li>
    </ol>
  );
}

export default function MembershipList ({
  setFormMode,
  setSelectedMembershipId,
  country,
  setCountry,
  chain,
  setChain
}: MembershipListProps) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['membershipsByCountry', country],
    queryFn: country
      ? () => getMembershipsByCountry({ country: country })
      : skipToken  // disable this query when no country has yet been selected
  });

  let filteredMemberships: Membership[] = [];
  if (chain && data) {
    filteredMemberships = data.filter((membership) => {
      return (
        membership.chain === chain
      );
    });
  }

  console.log(filteredMemberships);

  return (
    <div className='flex flex-1 flex-col gap-1 text-sm'>
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
        className='
        flex flex-1 bg-background dark:bg-background-dark
        overflow-y-scroll overflow-x-scroll'
      >
        {isPending
          ? 'loading...'
          : data && data.length > 0
            ? chain
              ? (
                <List
                  memberships={filteredMemberships}
                  setFormMode={setFormMode}
                  setSelectedMembershipId={setSelectedMembershipId}
                />
              )
              : (
                <p className='p-1'>
                  please select a chain to see its memberships
                </p>
              )
            : (
              <p className='p-1'>
                the selected country has no chain memberships
              </p>
            )}
      </div>

      {isError
        ? <div>{error.message}</div>
        : null}
    </div>
  );
}
