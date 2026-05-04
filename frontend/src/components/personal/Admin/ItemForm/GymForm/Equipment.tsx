// work in progress
import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getEquipment,
  getGymEquipment,
  postGymEquipment,
  setGymEquipmentCount
} from '../../../../../utils/api';

interface EquipmentProps {
  selectedItemId: string
  gymName: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
}

export default function Equipment (
  { selectedItemId, gymName, setEditForm }: EquipmentProps
) {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');

  const gymEquipmentQuery = useQuery({
    queryKey: ['gymEquipment', selectedItemId],
    queryFn: () => getGymEquipment({ gymId: selectedItemId })
  });

  const equipmentQuery = useQuery({
    queryKey: ['equipment'],
    queryFn: () => getEquipment()
  });

  const addEquipmentMutation = useMutation({
    mutationFn: ({ gymId, equipmentId }:
    { gymId: string, equipmentId: string }) =>
      postGymEquipment({ gymId: gymId, equipmentId: equipmentId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['gymEquipment', selectedItemId]
      });
    }
  });

  const setEquipmentCountMutation = useMutation({
    mutationFn: ({ relationshipId, count }:
    { relationshipId: string, count: number }) =>
      setGymEquipmentCount({ relationshipId: relationshipId, count: count }),
    onSuccess: async (editedRelationshipFromServer) => {
      if (gymEquipmentQuery.data) {
        const updatedGymEquipment = gymEquipmentQuery.data.map((equipment) => {
          if (equipment.gymequipment.id !== editedRelationshipFromServer.id) {
            return equipment;
          } else {
            equipment.gymequipment = editedRelationshipFromServer;
            return equipment;
          }
        });

        await queryClient.setQueryData([
          'gymEquipment',
          selectedItemId
        ], updatedGymEquipment);
      }
    }
  });

  if (gymEquipmentQuery.isPending || equipmentQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (gymEquipmentQuery.isError || equipmentQuery.isError) {
    if (gymEquipmentQuery.isError && equipmentQuery.isError) {
      return (
        <div>
          <p>Error: {gymEquipmentQuery.error.message}</p>
          <p>Error: {equipmentQuery.error.message}</p>
        </div>
      );
    } else if (gymEquipmentQuery.isError) {
      return <p>Error: {gymEquipmentQuery.error.message}</p>;
    } else if (equipmentQuery.isError) {
      return <p>Error: {equipmentQuery.error.message}</p>;
    }
  }

  return (
    <div
      className='flex flex-1 flex-col gap-1 min-h-0 overflow-y-scroll text-xs'
    >
      <h3>Editing equipment for {gymName}</h3>
      <div>
        gymEquipment list
      </div>
      <div className='flex flex-1 flex-col gap-1'>
        <input
          type='text'
          value={search}
          placeholder='search'
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className='bg-background dark:bg-background-dark pl-1'
        />
      </div>
      <button
        onClick={() => {
          setEditForm('');
        }}
      >
        return
      </button>
    </div>
  );
}
