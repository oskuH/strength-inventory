// used by GymList and EquipmentList

interface ListProps {
  data: { id: string, name: string }[] | undefined
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
}

export default function List (
  { data, selectedItemId, setSelectedItemId }: ListProps
) {
  if (!data) {
    return (
      <ol>
        <li>no data</li>
      </ol>
    );
  }

  return (
    <ol className='min-w-full text-sm'>
      {data.map((item) => (
        <li key={item.id}>
          <button
            aria-pressed={item.id === selectedItemId}
            className='
            flex px-1 min-w-full whitespace-nowrap
            aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600'
            onClick={() => {
              setSelectedItemId(item.id);
            }}
          >
            <p>{item.name}</p>
          </button>
        </li>
      ))}
    </ol>
  );
}
