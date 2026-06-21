import { useState } from 'react';

import Piece from './Piece';

import type { GymGet, GymGetEquipment } from '@strength-inventory/schemas';

interface CategoryProps {
  name: string
  equipment: GymGetEquipment[]
  setClickedEquipment:
  React.Dispatch<React.SetStateAction<GymGetEquipment | null>>
}

function Category ({ name, equipment, setClickedEquipment }: CategoryProps) {
  const equipmentList = equipment.map(
    (piece) => (
      <li key={piece.id}>
        <button
          className='
            rounded-sm px-1 w-full text-left cursor-pointer
            hover:bg-primary dark:hover:bg-background-dark active:font-semibold'
          onClick={() => {
            setClickedEquipment(piece);
          }}
        >
          <p className='flex'>
            {piece.gymequipment.count < 5
              ? (
                <span className='font-light min-w-4'>
                  {piece.gymequipment.count}
                </span>
              )
              : (
                <span className='font-light min-w-4'>
                  {/* display counts higher than five as 5+, 10+, 15+...*/}
                  {Math.round(piece.gymequipment.count / 5) * 5}+
                </span>
              )}
            <span>{piece.name}</span>
          </p>
        </button>
      </li>
    )
  );

  return (
    <div>
      <h3 className='mb-1 text-sm font-bold'>{name}</h3>
      {equipment.length > 0
        ? <ul className='flex flex-col gap-1 text-xs'>{equipmentList}</ul>
        : <p className='text-xs'>-</p>}
    </div>
  );
}

export default function GymEquipment ({ gym }: { gym: GymGet }) {
  const [clickedEquipment, setClickedEquipment]
    = useState<GymGetEquipment | null>(null);

  const equipment = gym.equipment;

  const systems = equipment.filter((piece) => piece.category === 'system');
  systems.sort((a, b) => (a.name > b.name
    ? 1
    : -1));
  const freeWeights = equipment.filter(
    (piece) => piece.category === 'freeWeight'
  );
  freeWeights.sort((a, b) => (a.name > b.name
    ? 1
    : -1));
  const handleAttachments = equipment.filter(
    (piece) => piece.category === 'handleAttachment'
  );
  handleAttachments.sort((a, b) => (a.name > b.name
    ? 1
    : -1));
  const strengthMachines = equipment.filter(
    (piece) => piece.category === 'strengthMachine'
  );
  strengthMachines.sort((a, b) => (a.name > b.name
    ? 1
    : -1));
  const cardios = equipment.filter((piece) => piece.category === 'cardio');
  cardios.sort((a, b) => (a.name > b.name
    ? 1
    : -1));
  const accessoriesAndTools = equipment.filter(
    (piece) => piece.category === 'accessoryOrTool'
  );
  accessoriesAndTools.sort((a, b) => (a.name > b.name
    ? 1
    : -1));

  return (
    <div className='flex flex-1 border-x border-b p-3'>
      {clickedEquipment
        ? (
          <Piece
            equipment={clickedEquipment}
            setClickedEquipment={setClickedEquipment}
          />
        )
        : (
          <div className='flex flex-1 min-w-0'>
            <div className='flex flex-col gap-2 pr-1 w-1/2'>
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
            <div className='flex flex-col gap-2 pl-1 w-1/2'>
              <Category
                name='strength machines'
                equipment={strengthMachines}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='accessories and tools'
                equipment={accessoriesAndTools}
                setClickedEquipment={setClickedEquipment}
              />
              <Category
                name='cardio'
                equipment={cardios}
                setClickedEquipment={setClickedEquipment}
              />
            </div>
          </div>
        )}
    </div>
  );
}
