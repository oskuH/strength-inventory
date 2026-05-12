import { type UseMutationResult } from '@tanstack/react-query';

import { MdOutlinePlaylistAddCheckCircle } from 'react-icons/md';

import { type GymGetEquipment } from '@strength-inventory/schemas';

interface AvailableListProps {
  gymId: string
  currentEquipment: GymGetEquipment[]
  filteredEquipment: { id: string, name: string }[]
  addEquipmentMutation: UseMutationResult<{
    gymId: string,
    equipmentId: string
  }, Error, {
    gymId: string;
    equipmentId: string;
  }>
}

export default function AvailableList (
  {
    gymId, currentEquipment, filteredEquipment, addEquipmentMutation
  }: AvailableListProps
) {
  const currentEquipmentIds = currentEquipment.map((piece) => {
    return piece.id;
  });

  return (
    <div className='flex max-h-9/10 overflow-y-scroll overflow-x-scroll'>
      <ol
        className='
        min-w-full text-sm
        bg-background dark:bg-background-dark'
      >
        <hr />
        {filteredEquipment.map((piece) => (
          <li key={piece.id}>
            <button
              onClick={() => {
                addEquipmentMutation.mutate({ gymId, equipmentId: piece.id });
              }}
              disabled={currentEquipmentIds.includes(piece.id)}
              className='
              flex gap-1 pl-1 min-w-full whitespace-nowrap
              enabled:cursor-pointer'
            >
              <span className='flex w-5'>
                {currentEquipmentIds.includes(piece.id)
                  ? (
                    <MdOutlinePlaylistAddCheckCircle
                      className='text-green-700 dark:text-green-500 text-xl'
                    />
                  )
                  : null}
              </span>
              <p>{piece.name}</p>
            </button>
            <hr />
          </li>
        ))}
      </ol>
    </div>
  );
}
