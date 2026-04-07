import { useQuery } from '@tanstack/react-query';

import { getGyms } from '../../../utils/api';

import Gym from './Gym';

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
      <ol
        className='
        flex flex-col shrink-0 items-stretch mx-auto p-3 md:px-27
        w-full min-w-85 md:min-w-135 max-w-250'
      >
        {data.map((gym) =>
          <li key={gym.id}><Gym gym={gym} /></li>)}
      </ol>
    </div>
  );
}
