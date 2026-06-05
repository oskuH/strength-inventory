// used by
// - Memberships/List
// - GymMemberships/List
// - GymMemberships/Form

import { use } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MdOutlinePlaylistAddCheckCircle } from 'react-icons/md';

import { AuthContext } from '../../../utils/contexts';
import { postGymMembership } from '../../../utils/api';

import type { Membership } from '@strength-inventory/schemas';

interface MembershipListProps {
  memberships: Membership[]
  filterType: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  disabledMembershipIds: string[] | undefined
  gymId: string
}

export default function MembershipList ({
  memberships,
  filterType,
  setFormMode,
  setSelectedMembershipId,
  /* disabledMembershipIds is only defined when this component
  is being used by GymMemberships/Form.
  In this case, the list is being used to add chain memberships
  to a gym, which explains the conditionals further below. */
  disabledMembershipIds,
  /* gymId !== '' only when this component
  is being used by GymMemberships/Form. */
  gymId
}: MembershipListProps) {
  const auth = use(AuthContext);

  const queryClient = useQueryClient();

  const addToGymMutation = useMutation({
    mutationFn: ({ gymId, membershipId }:
    { gymId: string, membershipId: string }) =>
      postGymMembership({
        gymId: gymId,
        membershipId: membershipId,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries(
        { queryKey: ['gymMemberships', gymId] }
      );
      setFormMode('hidden');
    }
  });

  if (memberships.length === 0) {
    return (
      <div className='min-w-full bg-background dark:bg-background-dark'>
        <p className='p-1 text-center'>
          the selected {filterType} does not have memberships
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
    <ol
      className='
      flex-1 bg-background dark:bg-background-dark min-w-full overflow-y-scroll'
    >
      <hr />
      {memberships.map((membership) => (
        <li
          key={membership.id}
          className='flex flex-col min-w-full'
        >
          <button
            disabled={disabledMembershipIds?.includes(membership.id)}
            className='
            flex gap-1 min-w-full p-1 cursor-pointer
            enabled:hover:bg-gray-300 enabled:dark:hover:bg-gray-600
            disabled:cursor-default'
            onClick={() => {
              if (!disabledMembershipIds) {
                setFormMode('edit');
                setSelectedMembershipId(membership.id);
              } else {
                addToGymMutation
                  .mutate({ gymId: gymId, membershipId: membership.id });
              }
            }}
          >
            {disabledMembershipIds?.includes(membership.id)
              ? (
                <MdOutlinePlaylistAddCheckCircle
                  className='
                  self-center text-green-dark dark:text-green text-4xl'
                />
              )
              : null}
            <div className='flex flex-col'>
              <h3 className='flex truncate'>{membership.name}</h3>
              <div className='flex text-xs'>
                <span className='flex w-18'>
                  {membership.membershipFee} {membership.feeCurrency}
                </span>
                <span className='flex w-20'>
                  per {membership.validity} {membership.validityUnit}
                </span>
                {membership.commitment
                  ? (
                    <span className='flex truncate'>
                      {/* eslint-disable-next-line @stylistic/max-len */}
                      {membership.commitment} {membership.commitmentUnit} commitment
                    </span>
                  )
                  : null}
              </div>
            </div>
          </button>
          <hr />
        </li>
      ))}

      {disabledMembershipIds === undefined
        ? (
          <li>
            <button
              className='
                flex flex-col min-w-full p-1
                hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
              onClick={() => {
                setSelectedMembershipId('');
                setFormMode('create');
              }}
            >
              add new membership
            </button>
            <hr />
          </li>
        )
        : null}
    </ol>
  );
}
