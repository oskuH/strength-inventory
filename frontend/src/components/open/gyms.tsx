import { useQuery } from '@tanstack/react-query';
import { getGyms } from '../../utils/api';

import { type Gym } from '@strength-inventory/schemas';

import Footer from '../../components/root/footer';

function GymEntry({ gym }: { gym: Gym; }) {
  return (
    <div className='flex m-1 p-1 outline rounded-sm flex-col bg-gray-200'>
      <p>{gym.name} {gym.chain} {gym.street} {gym.streetNumber} {gym.city}</p>

      <p>{gym.notes}</p>
    </div>
  );
}

export default function Gyms() {
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
      <div className='flex basis-full flex-col'>
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