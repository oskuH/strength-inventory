// work in progress

import { useState } from 'react';

import { TbWorldWww } from 'react-icons/tb';

import type { Equipment, GymGet } from '@strength-inventory/schemas';

interface PieceProps {
  equipment: Equipment
  setClickedEquipment: React.Dispatch<React.SetStateAction<Equipment | null>>
}

function Piece ({ equipment, setClickedEquipment }: PieceProps) {
  const {
    name,
    manufacturer,
    code,
    weightUnit,
    weight,
    startingWeight,
    availableWeights,
    maximumWeight,
    url,
    notes
  } = equipment;

  let notNullUrl: string | undefined;
  if (url !== null) {
    notNullUrl = url;
  }

  let weights;
  if (availableWeights) {
    weights = availableWeights.join(' / ');
  }

  return (
    <div className='flex flex-col gap-2 basis-full'>
      <button
        onClick={() => {
          setClickedEquipment(null);
        }}
        className='flex justify-center cursor-pointer'
      >CLOSE
      </button>
      <h3 className='font-bold'>
        {notNullUrl
          ? (
            <a
              href={notNullUrl}
              target='_blank'
              className='
              flex items-center gap-1 cursor-pointer hover:text-blue-600'
            >
              {name} <TbWorldWww className='text-xl' />
            </a>
          )
          : name}
      </h3>
      <div className='flex gap-3'>
        <div
          className='
          flex flex-col gap-1 grow basis-1/2 wrap-break-word'
        >
          {/* backend does not support images, yet */}
          <p className='hidden'>image</p>
          <p>Manufacturer: {manufacturer}</p>
          <p>Code: {code}</p>
        </div>
        {weightUnit
          ? (
            <div className='flex flex-col gap-1 basis-1/2'>
              {weight
                ? (
                  <div>
                    <h4 className='inline mr-1'>Weight:</h4>
                    {weight} {weightUnit}
                  </div>
                )
                : null}
              {startingWeight
                ? (
                  <div>
                    <h4 className='inline mr-1'>Starting weight:</h4>
                    {startingWeight} {weightUnit}
                  </div>
                )
                : null}
              {maximumWeight
                ? (
                  <div>
                    <h4 className='inline mr-1'>Maximum weight:</h4>
                    {maximumWeight} {weightUnit}
                  </div>
                )
                : null}
              {availableWeights
                ? (
                  <div>
                    <h4 className='inline mr-1'>
                      Available weights ({weightUnit}):
                    </h4>
                    {weights}
                  </div>
                )
                : null}
            </div>
          )
          : null}
      </div>
      <p>{notes}</p>
    </div>
  );
}

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
          <div className='flex gap-3'>
            <div className='flex flex-col gap-2 wrap-break-word basis-1/2'>
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
            <div className='flex flex-col gap-2 wrap-break-word basis-1/2'>
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
