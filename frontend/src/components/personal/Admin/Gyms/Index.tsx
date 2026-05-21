import { use, useState } from 'react';

import { MdOutlineLocationOn } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';

import { getGymsIdAndName } from '../../../../utils/api';

import { IconContext } from '../../../../utils/contexts';

import GymForm from './GymForm/Index.tsx';
import GymList from './GymList.tsx';

export default function AdminGyms () {
  const iconMode = use(IconContext);

  const [formMode, setFormMode] = useState('hidden');
  const [selectedGymId, setSelectedGymId] = useState('');

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['gymsIdAndName'],
    queryFn: () => getGymsIdAndName()
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
          <GymList
            data={data}
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
