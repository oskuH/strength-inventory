import { use, useState } from 'react';

import { FaRegAddressCard } from 'react-icons/fa';

import { IconContext } from '../../../../utils/contexts';

import Form from './Form/Index';
import List from './List';

export default function AdminMemberships () {
  const iconMode = use(IconContext);

  const [formMode, setFormMode] = useState('hidden');
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [country, setCountry] = useState('');
  const [chain, setChain] = useState('');

  return (
    <div
      className='
        flex flex-1 flex-col gap-1 border bg-secondary dark:bg-secondary-dark
        p-3 overflow-y-scroll text-primary-text dark:text-primary-text-dark'
    >
      <h2 className='self-center font-bold'>
        {iconMode
          ? <FaRegAddressCard className='text-2xl' />
          : 'memberships'}
      </h2>

      {formMode === 'hidden'
        ? (
          <List
            setFormMode={setFormMode}
            setSelectedMembershipId={setSelectedMembershipId}
            country={country}
            setCountry={setCountry}
            chain={chain}
            setChain={setChain}
          />
        )
        : (
          <Form
            formMode={formMode}
            setFormMode={setFormMode}
            selectedMembershipId={selectedMembershipId}
            country={country}
            chain={chain}
          />
        )}
    </div>
  );
}
