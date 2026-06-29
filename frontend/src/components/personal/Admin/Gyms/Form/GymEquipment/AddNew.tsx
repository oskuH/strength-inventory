import { useState } from 'react';

import {
  IoAddCircle,
  IoAddCircleOutline,
  IoRemoveCircle,
  IoRemoveCircleOutline
} from 'react-icons/io5';
import { type UseMutationResult } from '@tanstack/react-query';

import { type Equipment } from '@strength-inventory/schemas';

interface AddNewProps {
  piece: Equipment
  gymId: string
  addEquipmentMutation: UseMutationResult<{
    gymId: string
    equipmentId: string
  }, Error, {
    gymId: string
    equipmentId: string
    count: number
  }>
  setEquipmentToAdd: React.Dispatch<React.SetStateAction<Equipment | null>>
}

export default function AddNew ({
  piece,
  gymId,
  addEquipmentMutation,
  setEquipmentToAdd
}: AddNewProps) {
  const [number, setNumber] = useState(1);

  return (
    <div
      className='
        flex flex-col items-center
        bg-background dark:bg-background-dark p-1'
    >
      <p className='text-center'>
        <span className='font-bold'>{piece.subcategory}</span>: {piece.name}
      </p>

      <div
        className='flex justify-center items-center mt-1 mb-2'
      >
        <button
          className='group relative flex cursor-pointer'
          onClick={() => {
            if (number > 1) {
              setNumber(number - 1);
            }
          }}
        >
          <IoRemoveCircleOutline
            className='
              text-xl group-hover:opacity-0 group-active:opacity-0'
          />
          <IoRemoveCircle
            className='
              absolute opacity-0 text-xl
              group-hover:opacity-100 group-active:opacity-100'
          />
        </button>
        <span className='w-6 text-center'>
          {number}
        </span>
        <button
          className='group relative flex cursor-pointer'
          onClick={() => {
            setNumber(number + 1);
          }}
        >
          <IoAddCircleOutline
            className='
              text-xl group-hover:opacity-0 group-active:opacity-0'
          />
          <IoAddCircle
            className='
              absolute opacity-0 text-xl
              group-hover:opacity-100 group-active:opacity-100'
          />
        </button>

        <button
          className='
            flex justify-center ml-5 border rounded-md
            bg-green dark:bg-green-dark px-1 w-15 cursor-pointer
            hover:inset-ring active:inset-ring active:font-bold'
          onClick={() => {
            addEquipmentMutation
              .mutate({ gymId, equipmentId: piece.id, count: number });
            setEquipmentToAdd(null);
          }}
        >
          add
        </button>
      </div>

      <button
        className='
          border rounded-md bg-red dark:bg-red-dark px-1 w-12 text-xs
          cursor-pointer hover:inset-ring active:inset-ring active:font-bold'
        onClick={() => {
          setEquipmentToAdd(null);
        }}
      >
        cancel
      </button>
    </div>
  );
}
