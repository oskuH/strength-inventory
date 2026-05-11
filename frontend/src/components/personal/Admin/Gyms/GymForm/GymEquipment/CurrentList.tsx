// work in progress
import { TiDelete, TiDeleteOutline } from 'react-icons/ti';

import { type UseMutationResult } from '@tanstack/react-query';

import { type GymGetEquipment } from '@strength-inventory/schemas';

interface CurrentListProps {
  gymId: string,
  gymEquipment: GymGetEquipment[]
  setEquipmentCountMutation: UseMutationResult<{
    id: string;
    gymId: string;
    equipmentId: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
  }, Error, {
    relationshipId: string;
    count: number;
  }>,
  removeEquipmentMutation: UseMutationResult<string, Error, {
    gymId: string;
    equipmentId: string;
  }>
}

export default function CurrentList ({
  gymId, gymEquipment, setEquipmentCountMutation, removeEquipmentMutation
}: CurrentListProps) {
  return (
    <div className='flex flex-1 overflow-y-scroll'>
      <ol className='min-w-full text-sm'>
        {gymEquipment.map((piece) => (
          <li
            key={piece.id}
            className='
            flex items-center px-1 min-w-full
            hover:bg-gray-300 hover:dark:bg-gray-600'
          >
            <p
              className='flex-1 overflow-hidden text-clip whitespace-nowrap'
            >
              {piece.name}
            </p>
            <div
              className='px-1 w-15'
            >
              - 3 +
            </div>
            <div className='flex w-5'>
              <button
                onClick={() => {
                  removeEquipmentMutation.mutate({
                    gymId, equipmentId: piece.id
                  });
                }}
                className='group relative flex cursor-pointer'
              >
                <TiDeleteOutline
                  className='
                  text-red-500 text-xl
                  group-hover:opacity-0 group-active:opacity-0'
                />
                <TiDelete
                  className='
                  absolute opacity-0 text-red-500 text-xl
                  group-hover:opacity-100 group-active:opacity-100'
                />
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
