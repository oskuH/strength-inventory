import {
  IoAddCircle,
  IoAddCircleOutline,
  IoRemoveCircle,
  IoRemoveCircleOutline
} from 'react-icons/io5';
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
  removeEquipmentMutation: UseMutationResult<{
    gymId: string,
    equipmentId: string
  }, Error, {
    gymId: string;
    equipmentId: string;
  }>
}

export default function CurrentList ({
  gymId, gymEquipment, setEquipmentCountMutation, removeEquipmentMutation
}: CurrentListProps) {
  return (
    <div className='flex flex-1 min-h-15 overflow-y-scroll'>
      <ol className='min-w-full text-sm'>
        <hr />
        {gymEquipment.map((piece) => (
          <span key={piece.id}>
            <li
              key={piece.id}
              className='
              flex items-center px-1 min-w-full'
            >
              <p
                className='flex-1 overflow-hidden text-clip whitespace-nowrap'
              >
                {piece.name}
              </p>
              <div
                className='flex justify-center gap-1 w-20'
              >
                <button
                  onClick={() => {
                    if (piece.gymequipment.count > 1) {
                      setEquipmentCountMutation.mutate({
                        relationshipId: piece.gymequipment.id,
                        count: piece.gymequipment.count - 1
                      });
                    }
                  }}
                  className='group relative flex cursor-pointer'
                >
                  <IoRemoveCircleOutline
                    className='
                    text-xl
                    group-hover:opacity-0 group-active:opacity-0'
                  />
                  <IoRemoveCircle
                    className='
                    absolute opacity-0 text-xl
                    group-hover:opacity-100 group-active:opacity-100'
                  />
                </button>
                <span>{piece.gymequipment.count}</span>
                <button
                  onClick={() => {
                    setEquipmentCountMutation.mutate({
                      relationshipId: piece.gymequipment.id,
                      count: piece.gymequipment.count + 1
                    });
                  }}
                  className='group relative flex cursor-pointer'
                >
                  <IoAddCircleOutline
                    className='
                    text-xl
                    group-hover:opacity-0 group-active:opacity-0'
                  />
                  <IoAddCircle
                    className='
                    absolute opacity-0 text-xl
                    group-hover:opacity-100 group-active:opacity-100'
                  />
                </button>
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
            <hr />
          </span>
        ))}
      </ol>
    </div>
  );
}
