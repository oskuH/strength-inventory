import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getGyms } from '../../utils/api';

import Footer from '../../components/footer';

export const Route = createFileRoute('/(open)/gyms')({
  component: Gyms
});

function Gyms() {
  const { data, status } = useQuery({
    queryKey: ['gyms'],
    queryFn: () => getGyms()
  });

  if (status === 'pending') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error!</p>;
  }

  return (
    <div className='flex basis-full flex-col'>
      <div className='flex basis-full'>
        Gym search
      </div>
      <Footer />
    </div>
  );
}