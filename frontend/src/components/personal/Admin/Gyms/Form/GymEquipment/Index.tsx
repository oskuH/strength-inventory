import { use, useState } from 'react';

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
import { AuthContext } from '../../../../../../utils/contexts';

import AvailableList from './AvailableList';
import CurrentList from './CurrentList';
import EditFormReturnButton from '../EditFormReturnButton';

interface GymEquipmentProps {
  gymId: string
  gymName: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function GymEquipment (
  { gymId, gymName, setEditForm, setParentNotification }: GymEquipmentProps
) {
  const auth = use(AuthContext);

  const queryClient = useQueryClient();

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
      postGymEquipment({
        gymId: gymId,
        equipmentId: equipmentId,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: async (responseFromServer) => {
      await queryClient.invalidateQueries({
        queryKey: ['gymEquipment', responseFromServer.gymId]
      });
    }
  });

  const setEquipmentCountMutation = useMutation({
    mutationFn: ({ relationshipId, count }:
    { relationshipId: string, count: number }) =>
      setGymEquipmentCount({
        relationshipId: relationshipId,
        count: count,
        refresh: auth.refresh,
        logout: auth.logout
      }),
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
      deleteGymEquipment({
        gymId: gymId,
        equipmentId: equipmentId,
        refresh: auth.refresh,
        logout: auth.logout
      }),
    onSuccess: async (responseFromServer) => {
      if (gymEquipmentQuery.data) {
        const updatedGymEquipment
          = gymEquipmentQuery.data.filter((equipment) => {
            return equipment.id !== responseFromServer.equipmentId;
          });

        await queryClient.setQueryData([
          'gymEquipment',
          gymId
        ], updatedGymEquipment);
      }
    }
  });

  const [search, setSearch] = useState('');

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

  const equipmentIdsNamesProduction
    = equipmentQuery.data.map(({ id, name, outOfProduction }) =>
      ({ id, name, outOfProduction }));

  let filteredEquipment: {
    id: string, name: string, outOfProduction: boolean
  }[] = equipmentIdsNamesProduction;
  if (search !== '') {
    filteredEquipment = equipmentIdsNamesProduction.filter((piece) => {
      return (
        piece.name.toLowerCase().includes(search.toLowerCase()));
    });
  }

  return (
    <div
      className='flex flex-1 flex-col min-h-0'
    >
      <h3 className='self-center mb-3 text-center'>
        editing equipment for {gymName}
      </h3>
      <div className='flex flex-1 flex-col overflow-y-scroll'>
        <CurrentList
          gymId={gymId}
          gymEquipment={gymEquipmentQuery.data}
          setEquipmentCountMutation={setEquipmentCountMutation}
          removeEquipmentMutation={removeEquipmentMutation}
        />
        {search
          ? (
            <AvailableList
              gymId={gymId}
              currentEquipment={gymEquipmentQuery.data}
              filteredEquipment={filteredEquipment}
              addEquipmentMutation={addEquipmentMutation}
            />
          )
          : (
            null
          )}
        <div className='flex flex-col gap-1 mt-1 mb-3'>
          <input
            type='search'
            value={search}
            placeholder='search to add new equipment'
            className='bg-background dark:bg-background-dark pl-1'
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
        <EditFormReturnButton
          model='equipment'
          setEditForm={setEditForm}
          setParentNotification={setParentNotification}
        />
      </div>
    </div>
  );
}
