// work in progress
import { useState } from 'react';

import {
  useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';

import {
  deleteGymEquipment,
  getEquipment,
  getGymEquipment,
  postGymEquipment,
  setGymEquipmentCount
} from '../../../../../../utils/api';

import AvailableList from './AvailableList';
import CurrentList from './CurrentList';

interface GymEquipmentProps {
  gymId: string
  gymName: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
}

export default function GymEquipment (
  { gymId, gymName, setEditForm }: GymEquipmentProps
) {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');

  const gymEquipmentQuery = useQuery({
    queryKey: ['gymEquipment', gymId],
    queryFn: () => getGymEquipment({ gymId: gymId })
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
      /* the backend method for adding a relationship returns void by default,
      thus the query is invalidated instead of modified */
      await queryClient.invalidateQueries({
        queryKey: ['gymEquipment', gymId]
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
          gymId
        ], updatedGymEquipment);
      }
    }
  });

  const removeEquipmentMutation = useMutation({
    mutationFn: ({ gymId, equipmentId }:
    { gymId: string, equipmentId: string }) =>
      deleteGymEquipment({ gymId: gymId, equipmentId: equipmentId }),
    onSuccess: async (removedEquipmentId) => {
      if (gymEquipmentQuery.data) {
        const updatedGymEquipment
          = gymEquipmentQuery.data.filter((equipment) => {
            return equipment.id !== removedEquipmentId;
          });

        await queryClient.setQueryData([
          'gymEquipment',
          gymId
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

  const equipmentIdsAndNames
    = equipmentQuery.data.map(({ id, name }) => ({ id, name }));

  let filteredEquipment: { id: string, name: string }[] = equipmentIdsAndNames;
  if (search !== '') {
    filteredEquipment = equipmentIdsAndNames.filter((piece) => {
      return (
        piece.name.toLowerCase().includes(search.toLowerCase()));
    });
  }

  return (
    <div
      className='flex flex-1 flex-col min-h-0 overflow-y-scroll'
    >
      <h3 className='self-center mb-3'>Editing equipment for {gymName}</h3>
      {!search
        ? (
          <CurrentList
            gymId={gymId}
            gymEquipment={gymEquipmentQuery.data}
            setEquipmentCountMutation={setEquipmentCountMutation}
            removeEquipmentMutation={removeEquipmentMutation}
          />
        )
        : (
          <div
            className='
            flex flex-1 bg-background dark:bg-background-dark
            overflow-y-scroll overflow-x-scroll'
          >
            <AvailableList
              gymId={gymId}
              filteredEquipment={filteredEquipment}
              addEquipmentMutation={addEquipmentMutation}
            />
          </div>
        )}
      <div className='flex flex-col gap-1 mt-5 mb-3'>
        <input
          type='text'
          value={search}
          placeholder='search to add new equipment'
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className='bg-background dark:bg-background-dark pl-1'
        />
        {/* <div className='flex justify-around'>
          <button
            onClick={() => {
              addEquipmentMutation.mutate({
                gymId: gymId, equipmentId: selectedPieceId
              });
              setSelectedPieceId('');
            }}
            disabled={!selectedPieceId}
            className='
            flex flex-1 justify-center border border-dotted
            bg-primary dark:bg-primary-dark p-1 text-sm
            enabled:cursor-pointer enabled:hover:border-solid
            disabled:text-secondary dark:disabled:text-secondary-dark'
          >
            add selected equipment
          </button>
        </div> */}
        {/* <div
          className='
          flex flex-1 bg-background dark:bg-background-dark
          overflow-y-scroll overflow-x-scroll'
        >
          <List
            data={filteredEquipment}
            gymId={selectedPieceId}
            setSelectedItemId={setSelectedPieceId}
          />
        </div> */}
      </div>
      <button
        onClick={() => {
          setEditForm('');
        }}
        className='cursor-pointer'
      >
        return
      </button>
    </div>
  );
}
