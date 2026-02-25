import { use } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TbClock, TbContract } from 'react-icons/tb';
import { CgGym } from 'react-icons/cg';

import { getGyms } from '../../utils/api';
import { IconContext } from '../../utils/contexts';

import { type Gym } from '@strength-inventory/schemas';

function GymEntry ({ gym }: { gym: Gym; }) {
  const iconMode = use(IconContext);

  return (
    <div
      className='
      flex mb-3 w-75 sm:w-150 outline rounded-sm flex-col
       text-primary-text dark:text-primary-text-dark'
    >
      <div
        className='
        flex outline rounded-sm flex-col sm:flex-row bg-red-900'
      >
        <div
          className='
          flex p-3 outline flex-col w-75 sm:w-70 min-h-18
          bg-primary dark:bg-primary-dark'
        >
          <p className='font-bold'>{gym.name}</p>
          <p className='text-sm'>{gym.street} {gym.streetNumber}, {gym.city}</p>
        </div>
        <div
          className='
          flex grow min-h-18
          bg-secondary dark:bg-secondary-dark'
        >
          <div
            className='
            flex
            w-1/3
            p-3
            justify-center
            items-center
            outline'
          >
            {iconMode
              ? <CgGym className='text-4xl' />
              : <p className='text-sm'>equipment</p>}
          </div>
          <div
            className='
            flex
            w-1/3
            p-3
            justify-center
            items-center
            outline'
          >
            {iconMode
              ? <TbContract className='text-4xl' />
              : <p className='text-sm'>memberships</p>}
          </div>
          <div
            className='
            flex
            w-1/3
            p-3
            justify-center
            items-center
            text-center
            outline'
          >
            {iconMode
              ? <TbClock className='text-4xl' />
              : <p className='text-sm'>opening hours</p>}
          </div>
        </div>
      </div>

      <div
        className='flex p-3 outline
        bg-tertiary dark:bg-tertiary-dark'
      >
        extension
      </div>
    </div>
  );
}

export default function Gyms () {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['gyms'],
    queryFn: () => getGyms()
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message} </p>;
  }

  return (
    <div className='flex flex-col'>
      <ol className='flex p-3 flex-col items-center'>
        {data.map((gym) =>
          <li key={gym.id}><GymEntry gym={gym} /></li>)}
      </ol>
    </div>
  );
}
