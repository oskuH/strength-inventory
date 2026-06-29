import { useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getGymMemberships } from '../../../../../../utils/api';

import Form from './Form';
import List from './List';
import Notification from '../../../../../Notification';

interface GymMembershipsProps {
  gymId: string
  gymName: string
  gymCountry: string
  gymChain: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function GymMemberships (
  { gymId, gymName, gymCountry, gymChain, setEditForm, setParentNotification }:
  GymMembershipsProps
) {
  const scrollTopRef = useRef(0);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['gymMemberships', gymId],
    queryFn: () => getGymMemberships({ gymId: gymId })
  });

  const [formMode, setFormMode] = useState('hidden');
  const [selectedMembershipId, setSelectedMembershipId] = useState('');

  const [notification, setNotification] = useState({
    type: '',
    message: ''
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div
      className='flex flex-1 flex-col gap-3 min-h-0'
    >
      <h3 className='self-center text-center'>
        editing memberships for {gymName}
      </h3>

      <div className='flex flex-1 flex-col overflow-y-scroll'>
        {formMode === 'hidden'
          ? (
            <div className='flex flex-1 overflow-y-scroll'>
              <List
                scrollTopRef={scrollTopRef}
                memberships={data}
                setFormMode={setFormMode}
                setSelectedMembershipId={setSelectedMembershipId}
                setEditForm={setEditForm}
                setParentNotification={setParentNotification}
              />
              <Notification
                type={notification.type}
                message={notification.message}
                setNotification={setNotification}
              />
            </div>
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
              setParentNotification={setNotification}
            />
          )}
      </div>
    </div>
  );
}
