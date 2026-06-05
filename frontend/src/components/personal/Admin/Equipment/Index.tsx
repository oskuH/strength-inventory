import { use, useState } from 'react';

import { mutationOptions, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { CgGym } from 'react-icons/cg';

import { deleteEquipment, getEquipmentIdAndName } from '../../../../utils/api';

import { AuthContext, IconContext } from '../../../../utils/contexts';

import CreateEditDeleteList from '../CreateEditDeleteList';
import Form from './Form/Index';

export default function AdminEquipment () {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const [selectedPieceId, setSelectedPieceId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['equipmentIdAndName'],
    queryFn: () => getEquipmentIdAndName()
  });

  const deleteMutationOptions = mutationOptions({
    mutationFn: (id: string) =>
      deleteEquipment({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      void queryClient
        .invalidateQueries({ queryKey: ['equipmentIdAndName'] });
      setSelectedPieceId('');
    }
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
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
          <CreateEditDeleteList
            data={data}
            selectedItemId={selectedPieceId}
            setSelectedItemId={setSelectedPieceId}
            setFormMode={setFormMode}
            deleteMutationOptions={deleteMutationOptions}
          />
        )
        : (
          <Form
            formMode={formMode}
            setFormMode={setFormMode}
            selectedPieceId={selectedPieceId}
          />
        )}
    </div>
  );
}
