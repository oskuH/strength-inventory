import { useQuery } from '@tanstack/react-query';

import { getGyms } from '../../utils/api';

import { type Gym } from '@strength-inventory/schemas';

function GymEntry ({ gym }: { gym: Gym; }) {
  return (
    <div className='flex mb-3 w-75 sm:w-150 outline rounded-sm flex-col'>
      <div className='flex outline rounded-sm flex-col sm:flex-row bg-red-200'>
        <div className='flex p-3 outline flex-col w-75 sm:w-70 bg-gray-200'>
          <p className='font-bold'>{gym.name}</p>
          <p className='text-sm'>{gym.street} {gym.streetNumber}, {gym.city}</p>
        </div>
        <div className='flex grow bg-gray-300'>
          <p
            className='
            flex
            p-3
            grow
            justify-center
            items-center
            outline
            text-sm
            sm:text-base'
          >
            equipment
          </p>
          <p
            className='
            flex
            p-3
            grow
            justify-center
            items-center
            outline
            text-sm
            sm:text-base'
          >
            memberships
          </p>
          <p
            className='
            flex
            p-3
            grow
            justify-center
            items-center
            text-center
            outline
            text-sm
            sm:text-base'
          >
            opening hours
          </p>
        </div>
      </div>

      <div className='flex p-3 outline rounded-sm bg-white'>
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
