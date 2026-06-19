// used by CreateEditDeleteList

interface SimpleListProps {
  data: { id: string, name: string }[] | undefined
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
}

export default function SimpleList (
  { data, selectedItemId, setSelectedItemId, setFormMode }: SimpleListProps
) {
  if (!data) {
    return (
      <ol>
        <li>no data</li>
      </ol>
    );
  }

  data.sort((a, b) => (a.name > b.name
    ? 1
    : -1));

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
            onDoubleClick={() => {
              setSelectedItemId(item.id);
              setFormMode('edit');
            }}
          >
            <p>{item.name}</p>
          </button>
        </li>
      ))}
    </ol>
  );
}
