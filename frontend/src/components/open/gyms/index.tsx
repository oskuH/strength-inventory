import { useQuery } from '@tanstack/react-query';

import { getGyms } from '../../../utils/api';

import GymEntry from './Gym';

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
