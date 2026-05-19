import { use, useState } from 'react';

import { CgGym } from 'react-icons/cg';
import { useQuery } from '@tanstack/react-query';

import { getEquipmentIdAndName } from '../../../../utils/api';

import { IconContext } from '../../../../utils/contexts';

import EquipmentForm from './EquipmentForm/Index';
import EquipmentList from './EquipmentList';

export default function AdminEquipment () {
  const [selectedPieceId, setSelectedPieceId] = useState('');
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
      flex flex-1 flex-col gap-1 border bg-secondary dark:bg-secondary-dark
      p-3 overflow-y-scroll text-primary-text dark:text-primary-text-dark'
    >
      <h2 className='self-center font-bold'>
        {iconMode
          ? <CgGym className='text-2xl' />
          : 'equipment'}
      </h2>
      {formMode === 'hidden'
        ? (
          <EquipmentList
            data={equipmentQuery.data}
            selectedPieceId={selectedPieceId}
            setSelectedPieceId={setSelectedPieceId}
            setFormMode={setFormMode}
          />
        )
        : (
          <EquipmentForm
            formMode={formMode}
            setFormMode={setFormMode}
            selectedPieceId={selectedPieceId}
            setSelectedPieceId={setSelectedPieceId}
          />
        ) }
    </div>
  );
}
