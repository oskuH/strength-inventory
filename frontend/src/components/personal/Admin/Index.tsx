// work in progress

import { useQuery } from '@tanstack/react-query';

import { getEquipmentIdAndName, getGymsIdAndName } from '../../../utils/api';

import Model from './Model';

export default function Admin () {
  const gymsQuery = useQuery({
    queryKey: ['gyms'],
    queryFn: () => getGymsIdAndName()
  });

  const equipmentQuery = useQuery({
    queryKey: ['equipment'],
    queryFn: () => getEquipmentIdAndName()
  });

  if (gymsQuery.isPending || equipmentQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (gymsQuery.isError) {
    return <p>Error: {gymsQuery.error.message}</p>;
  }

  if (equipmentQuery.isError) {
    return <p>Error: {equipmentQuery.error.message}</p>;
  }

  return (
    <div
      className='
      flex flex-1 justify-center items-stretch w-full overflow-hidden'
    >
      <div className='flex flex-1 gap-3 p-3 min-w-90 max-w-145'>
        <Model model='gym' data={gymsQuery.data} />
        <Model model='equipment' data={equipmentQuery.data} />
      </div>
    </div>
  );
}
