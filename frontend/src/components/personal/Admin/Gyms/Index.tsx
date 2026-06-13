import { use, useState } from 'react';

import { mutationOptions, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { MdOutlineLocationOn } from 'react-icons/md';

import { deleteGym, getGymsIdAndName } from '../../../../utils/api';

import { AuthContext, IconContext } from '../../../../utils/contexts';

import CreateEditDeleteList from '../CreateEditDeleteList.tsx';
import Form from './Form/Index.tsx';

export default function AdminGyms () {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const [formMode, setFormMode] = useState('hidden');
  const [selectedGymId, setSelectedGymId] = useState('');

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['gymsIdAndName'],
    queryFn: () => getGymsIdAndName()
  });

  const deleteMutationOptions = mutationOptions({
    mutationFn: (id: string) =>
      deleteGym({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gyms'] });
      void queryClient.invalidateQueries({ queryKey: ['gymsIdAndName'] });
      setSelectedGymId('');
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
          ? <MdOutlineLocationOn className='text-2xl' />
          : 'gyms'}
      </h2>

      {formMode === 'hidden'
        ? (
          <CreateEditDeleteList
            data={data}
            selectedItemId={selectedGymId}
            setSelectedItemId={setSelectedGymId}
            setFormMode={setFormMode}
            deleteMutationOptions={deleteMutationOptions}
          />
        )
        : (
          <Form
            formMode={formMode}
            setFormMode={setFormMode}
            selectedGymId={selectedGymId}
            setSelectedGymId={setSelectedGymId}
          />
        )}
    </div>
  );
}
