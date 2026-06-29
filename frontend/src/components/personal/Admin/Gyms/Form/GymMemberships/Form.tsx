import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getMembershipsByCountry } from '../../../../../../utils/api';

import { Form as MembershipForm } from '../../../Memberships/Form/Index';
import MembershipList from '../../../MembershipList';
import ReturnButton from '../../../ReturnButton';

import { FORM_RETURN_BUTTON_CLASSES } from '../../../../../../constants/theme';

interface FormProps {
  gymId: string
  gymCountry: string
  gymChain: string
  currentMembershipIds: string[]
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  selectedMembershipId: string
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function Form ({
  gymId,
  gymCountry,
  gymChain,
  currentMembershipIds,
  formMode,
  setFormMode,
  selectedMembershipId,
  setSelectedMembershipId,
  setParentNotification
}: FormProps) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['membershipsByCountry', gymCountry],
    queryFn: () => getMembershipsByCountry({ country: gymCountry })
  });

  const [createMode, setCreateMode] = useState('');

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  const chainMemberships = data.filter((membership) => {
    return membership.chain === gymChain;
  });

  if (formMode === 'create') {
    if (!createMode) {
      return (
        <div className='flex flex-col gap-3'>
          <h4 className='self-center'>add new membership</h4>
          <button
            className={`${FORM_RETURN_BUTTON_CLASSES} w-full`}
            onClick={() => {
              setCreateMode('noChain');
            }}
          >
            <p className='text-sm'>gym's own membership</p>
          </button>

          <div className='flex flex-col gap-0.5'>
            <button
              disabled={chainMemberships.length === 0}
              className={`
                ${FORM_RETURN_BUTTON_CLASSES} w-full
                disabled:border-dashed
                disabled:bg-secondary dark:disabled:bg-secondary-dark
                disabled:cursor-not-allowed`}
              onClick={() => {
                setCreateMode('chain');
              }}
            >
              <p className='text-sm'>chain membership</p>
            </button>
            {chainMemberships.length === 0
              ? (
                <p className='self-center text-xs'>
                  not available for this gym
                </p>
              )
              : null}
          </div>

          <ReturnButton
            queriesToInvalidate={[['gymMemberships', gymId]]}
            setFormMode={setFormMode}
            unsavedChanges={false}
          />
        </div>
      );
    } else if (createMode === 'noChain') {
      return (
        <MembershipForm
          formMode={formMode}
          setFormMode={setFormMode}
          selectedMembershipId={selectedMembershipId}
          defaultCountry=''
          defaultChain=''
          usedInGymMemberships={true}
          addToGym={true}
          gymId={gymId}
          setParentNotification={setParentNotification}
        />
      );
    } else {  // createMode === 'chain'
      return (
        <div className='flex flex-col gap-3'>
          <h3 className='flex justify-center text-base'>
            select a chain membership to add
          </h3>
          <MembershipList
            memberships={chainMemberships}
            filterType='chain'
            setFormMode={setFormMode}
            setParentNotification={setParentNotification}
            highlightChainMemberships={false}
            setSelectedMembershipId={setSelectedMembershipId}
            disabledMembershipIds={currentMembershipIds}
            gymId={gymId}
          />
          <ReturnButton
            queriesToInvalidate={[['gymMemberships', gymId]]}
            setFormMode={setFormMode}
            unsavedChanges={false}
          />
        </div>
      );
    }
  }

  return (  // formMode === 'edit'
    <MembershipForm
      formMode={formMode}
      setFormMode={setFormMode}
      selectedMembershipId={selectedMembershipId}
      defaultCountry=''
      defaultChain=''
      usedInGymMemberships={true}
      addToGym={false}
      gymId={gymId}
      setParentNotification={setParentNotification}
    />
  );
}
