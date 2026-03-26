import { TbWorldWww } from 'react-icons/tb';

import { type Equipment } from '@strength-inventory/schemas';

interface PieceProps {
  equipment: Equipment
  setClickedEquipment: React.Dispatch<React.SetStateAction<Equipment | null>>
}

export default function Piece ({ equipment, setClickedEquipment }: PieceProps) {
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
