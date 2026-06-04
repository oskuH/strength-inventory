import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getGymMemberships } from '../../../../../../utils/api';

import Form from './Form';
import List from './List';

interface GymMembershipsProps {
  gymId: string
  gymName: string
  gymCountry: string
  gymChain: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
}

export default function GymMemberships (
  { gymId, gymName, gymCountry, gymChain, setEditForm }: GymMembershipsProps
) {
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
      <h3 className='self-center text-center'>
        editing memberships for {gymName}
      </h3>

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
            gymCountry={gymCountry}
            gymChain={gymChain}
            currentMembershipIds={data.map((membership) => membership.id)}
            formMode={formMode}
            setFormMode={setFormMode}
            selectedMembershipId={selectedMembershipId}
            setSelectedMembershipId={setSelectedMembershipId}
          />
        )}
    </div>
  );
}
