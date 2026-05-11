// work in progress
import { type UseMutationResult } from '@tanstack/react-query';

interface AvailableListProps {
  gymId: string
  filteredEquipment: { id: string, name: string }[]
  addEquipmentMutation: UseMutationResult<void, Error, {
    gymId: string;
    equipmentId: string;
  }>
}

export default function AvailableList (
  { gymId, filteredEquipment, addEquipmentMutation }: AvailableListProps
) {
  return (
    <ol className='min-w-full text-sm'>
      {filteredEquipment.map((piece) => (
        <li key={piece.id}>
          <button
            onClick={() => {
              addEquipmentMutation.mutate({ gymId, equipmentId: piece.id });
            }}
            className='
            flex px-1 min-w-full whitespace-nowrap
            aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600'
          >
            <p>{piece.name}</p>
          </button>
        </li>
      ))}
    </ol>
  );
}
