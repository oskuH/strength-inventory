import { MdOutlinePlaylistAddCheckCircle, MdOutlineStarRate }
  from 'react-icons/md';

import { type Equipment, type GymGetEquipment }
  from '@strength-inventory/schemas';

interface AvailableListProps {
  currentEquipment: GymGetEquipment[]
  filteredEquipment: Equipment[]
  setEquipmentToAdd: React.Dispatch<React.SetStateAction<Equipment | null>>
}

export default function AvailableList (
  {
    currentEquipment, filteredEquipment, setEquipmentToAdd
  }: AvailableListProps
) {
  const currentEquipmentIds = currentEquipment.map((piece) => {
    return piece.id;
  });

  return (
    <div
      className='
        flex bg-background dark:bg-background-dark
        max-h-9/10 overflow-y-scroll overflow-x-scroll'
    >
      <ul className='min-w-full text-sm'>
        <hr />
        {filteredEquipment.map((piece) => (
          <li key={piece.id}>
            <button
              disabled={currentEquipmentIds.includes(piece.id)}
              className='
                flex items-center gap-1 pl-1 min-w-full whitespace-nowrap
                enabled:cursor-pointer'
              onClick={() => {
                setEquipmentToAdd(piece);
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
              {piece.outOfProduction
                ? <MdOutlineStarRate className='text-base' />
                : null}
            </button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
