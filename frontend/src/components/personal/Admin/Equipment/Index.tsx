import { use, useState } from 'react';

import { CgGym } from 'react-icons/cg';
import { useQuery } from '@tanstack/react-query';

import { getEquipmentIdAndName } from '../../../../utils/api';

import { IconContext } from '../../../../utils/contexts';

import EquipmentForm from './EquipmentForm/Index';
import EquipmentList from './EquipmentList';

export default function AdminEquipment () {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const iconMode = use(IconContext);

  const equipmentQuery = useQuery({
    queryKey: ['equipmentIdAndName'],
    queryFn: () => getEquipmentIdAndName()
  });

  if (equipmentQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (equipmentQuery.isError) {
    return <p>Error: {equipmentQuery.error.message}</p>;
  }

  return (
    <div
      className='
      flex flex-col gap-1 border bg-secondary dark:bg-secondary-dark
      p-3 min-w-0 w-1/2
      text-primary-text dark:text-primary-text-dark'
    >
      <h2 className='self-center font-bold'>
        {iconMode
          ? <CgGym className='text-2xl' />
          : 'Equipment'}
      </h2>
      {formMode === 'hidden'
        ? (
          <EquipmentList
            data={equipmentQuery.data}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            setFormMode={setFormMode}
          />
        )
        : (
          <EquipmentForm
            formMode={formMode}
            setFormMode={setFormMode}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
          />
        ) }
    </div>
  );
}
