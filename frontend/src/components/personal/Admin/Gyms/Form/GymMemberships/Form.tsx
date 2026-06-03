// work in progress

import { useState } from 'react';

import ReturnButton from '../../../ReturnButton';

import type { GymGetMemberships } from '@strength-inventory/schemas';

import { FORM_RETURN_BUTTON_CLASSES } from '../../../../../../constants/theme';

interface FormProps {
  gymId: string
  currentMemberships: GymGetMemberships[]
  gymChain: string
  gymCountry: string
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
}

export default function Form ({
  gymId,
  currentMemberships,
  gymChain,
  gymCountry,
  formMode,
  setFormMode,
  setSelectedMembershipId
}: FormProps) {
  const [createMode, setCreateMode] = useState('');

  if (formMode === 'create') {
    if (!createMode) {
      return (
        <div className='flex flex-col gap-1'>
          <h4 className='self-center'>add new membership</h4>
          <button
            className={`${FORM_RETURN_BUTTON_CLASSES} w-full`}
            onClick={() => {
              setCreateMode('noChain');
            }}
          >
            <p className='text-sm'>gym's own membership</p>
          </button>
          <button
            className={`${FORM_RETURN_BUTTON_CLASSES} w-full`}
            onClick={() => {
              setCreateMode('chain');
            }}
          >
            <p className='text-sm'>chain membership</p>
          </button>
          <ReturnButton
            queryToInvalidate={['gymMemberships', gymId]}
            setFormMode={setFormMode}
          />
        </div>
      );
    } else if (createMode === 'noChain') {
      return (
        <div>
          RETURN THE FORM
        </div>
      );
    } else {  // createMode === 'chain'
      return (
        <div>
          RETURN CHAIN MEMBERSHIPS
        </div>
      );
    }
  }

  return (  // formMode === 'edit'
    <div>
      RETURN THE FORM, lock edits if chain membership
    </div>
  );
}
