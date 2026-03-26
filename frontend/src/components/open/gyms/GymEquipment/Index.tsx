// work in progress

import { useState } from 'react';

import Piece from './Piece';

import type { Equipment, GymGet } from '@strength-inventory/schemas';

interface CategoryProps {
  name: string
  equipment: Equipment[]
  setClickedEquipment: React.Dispatch<React.SetStateAction<Equipment | null>>
}

function Category ({ name, equipment, setClickedEquipment }: CategoryProps) {
  const equipmentList = equipment.map(
    (piece) => (
      <li key={piece.id}>
        <button
          onClick={() => {
            setClickedEquipment(piece);
          }}
          className='cursor-pointer text-left'
        >
          {piece.name}
        </button>
      </li>
    )
  );

  return (
    <div>
      <h3 className='text-sm font-bold'>{name}</h3>
      <ul className='text-xs'>{equipmentList}</ul>
    </div>
  );
}

export default function GymEquipment ({ gym }: { gym: GymGet }) {
  const [clickedEquipment, setClickedEquipment]
    = useState<Equipment | null>(null);

  const equipment = gym.equipment;

  const systems = equipment.filter((piece) => piece.category === 'system');
  const freeWeights = equipment.filter(
    (piece) => piece.category === 'freeWeight'
  );
  const handleAttachments = equipment.filter(
    (piece) => piece.category === 'handleAttachment'
  );
  const strengthMachines = equipment.filter(
    (piece) => piece.category === 'strengthMachine'
  );
  const cardios = equipment.filter((piece) => piece.category === 'cardio');
  const accessoriesAndTools = equipment.filter(
    (piece) => piece.category === 'accessoryOrTool'
  );

  return (
    <div className='flex border-x border-b p-3 flex-1'>
      {clickedEquipment
        ? (
          <Piece
            equipment={clickedEquipment}
            setClickedEquipment={setClickedEquipment}
          />
        )
        : (
          <div className='flex flex-1 justify-evenly gap-3'>
            <div className='flex flex-col gap-2 wrap-break-word'>
              <Category
                name='systems'
                equipment={systems}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='free weights'
                equipment={freeWeights}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='handle attachments'
                equipment={handleAttachments}
                setClickedEquipment={setClickedEquipment}
              />
            </div>
            <div className='flex flex-col gap-2 wrap-break-word'>
              <Category
                name='strength machines'
                equipment={strengthMachines}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='cardio'
                equipment={cardios}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='accessories and tools'
                equipment={accessoriesAndTools}
                setClickedEquipment={setClickedEquipment}
              />
            </div>
          </div>
        )}
    </div>
  );
}
