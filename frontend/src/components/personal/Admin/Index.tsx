// work in progress

import { useQuery } from '@tanstack/react-query';

import { getEquipmentIdAndName, getGymsIdAndName } from '../../../utils/api';

import ItemList from './ItemList';

export default function Admin () {
  const gymsQuery = useQuery({
    queryKey: ['gyms'],
    queryFn: () => getGymsIdAndName()
  });

  const equipmentQuery = useQuery({
    queryKey: ['equipment'],
    queryFn: () => getEquipmentIdAndName()
  });

  return (
    <div
      className='flex flex-1 justify-center items-stretch w-full'
    >
      <div className='flex flex-1 gap-3 p-3 max-w-145'>
        <ItemList model='gym' data={gymsQuery.data} />
        <ItemList model='equipment' data={equipmentQuery.data} />
      </div>
    </div>
  );
}
