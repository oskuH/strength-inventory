import { use, useState } from 'react';

import { MdOutlineLocationOn } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';

import { getGymsIdAndName } from '../../../../utils/api';

import { IconContext } from '../../../../utils/contexts';

import GymForm from './GymForm/Index.tsx';
import GymList from './GymList.tsx';

export default function AdminGyms () {
  const [selectedGymId, setSelectedGymId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const iconMode = use(IconContext);

  const gymsQuery = useQuery({
    queryKey: ['gymsIdAndName'],
    queryFn: () => getGymsIdAndName()
  });

  if (gymsQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (gymsQuery.isError) {
    return <p>Error: {gymsQuery.error.message}</p>;
  }

  return (
    <div
      className='
      flex flex-1 flex-col gap-1 border bg-secondary dark:bg-secondary-dark
      p-3 text-primary-text dark:text-primary-text-dark'
    >
      <h2 className='self-center font-bold'>
        {iconMode
          ? <MdOutlineLocationOn className='text-2xl' />
          : 'Gyms'}
      </h2>
      {formMode === 'hidden'
        ? (
          <GymList
            data={gymsQuery.data}
            selectedGymId={selectedGymId}
            setSelectedGymId={setSelectedGymId}
            setFormMode={setFormMode}
          />
        )
        : (
          <GymForm
            formMode={formMode}
            setFormMode={setFormMode}
            selectedGymId={selectedGymId}
            setSelectedGymId={setSelectedGymId}
          />
        ) }
    </div>
  );
}
