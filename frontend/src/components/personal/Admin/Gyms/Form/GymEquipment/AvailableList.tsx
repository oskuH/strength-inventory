import { MdOutlinePlaylistAddCheckCircle } from 'react-icons/md';
import { type UseMutationResult } from '@tanstack/react-query';

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
              disabled={currentEquipmentIds.includes(piece.id)
                || addEquipmentMutation.isPending}
              className='
              flex gap-1 pl-1 min-w-full whitespace-nowrap
              enabled:cursor-pointer'
              onClick={() => {
                addEquipmentMutation.mutate({ gymId, equipmentId: piece.id });
              }}
            >
              <span className='flex w-5'>
                {currentEquipmentIds.includes(piece.id)
                  ? (
                    <MdOutlinePlaylistAddCheckCircle
                      className='text-green-dark dark:text-green text-xl'
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
