// work in progress

import { use, useState } from 'react';

import {
  useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';

import {
  deleteGymMembership,
  getGymMemberships,
  postGymMembership
} from '../../../../../../utils/api';
import { AuthContext } from '../../../../../../utils/contexts';

import Form from './Form';
import List from './List';

interface GymMembershipsProps {
  gymId: string
  gymName: string
  gymChain: string
  gymCountry: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
}

export default function GymMemberships (
  { gymId, gymName, gymChain, gymCountry, setEditForm }: GymMembershipsProps
) {
  const auth = use(AuthContext);

  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['gymMemberships', gymId],
    queryFn: () => getGymMemberships({ gymId: gymId })
  });

  const [formMode, setFormMode] = useState('hidden');
  const [selectedMembershipId, setSelectedMembershipId] = useState('');

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div
      className='flex flex-1 flex-col gap-3 min-h-0 overflow-y-scroll'
    >
      <h3 className='self-center'>editing memberships for {gymName}</h3>

      {formMode === 'hidden'
        ? (
          <List
            memberships={data}
            setFormMode={setFormMode}
            setSelectedMembershipId={setSelectedMembershipId}
            setEditForm={setEditForm}
          />
        )
        : (
          <Form
            gymId={gymId}
            currentMemberships={data}
            gymChain={gymChain}
            gymCountry={gymCountry}
            formMode={formMode}
            setFormMode={setFormMode}
            setSelectedMembershipId={setSelectedMembershipId}
          />
        )}
    </div>
  );
}
