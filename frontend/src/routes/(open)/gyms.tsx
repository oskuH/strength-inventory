import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getGyms } from '../../utils/api';

import { type Gym } from '../../utils/types';

import Footer from '../../components/footer';

export const Route = createFileRoute('/(open)/gyms')({
  component: Gyms
});

function GymEntry({ gym }: { gym: Gym; }) {
  return (
    <div className='flex'>
      {gym.name} {gym.chain} {gym.street} {gym.streetNumber} {gym.city} {gym.notes}
    </div>
  );
}

function Gyms() {
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
    <div className='flex basis-full flex-col'>
      <div className='flex basis-full'>
        <ol>
          {data.map(gym =>
            <li key={gym.id}><GymEntry gym={gym} /></li>
          )}
        </ol>
      </div>
      <Footer />
    </div>
  );
}