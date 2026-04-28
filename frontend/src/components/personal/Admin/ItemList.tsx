// work in progress

import { use, useState } from 'react';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';

import { IconContext } from '../../../utils/contexts';

interface ListProps {
  data: { id: string, name: string }[] | undefined
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
}

function List (
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
            onClick={() => {
              setSelectedItemId(item.id);
            }}
            aria-pressed={item.id === selectedItemId}
            className='
            flex px-1 min-w-full whitespace-nowrap
            aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600
            '
          >
            <p>{item.name}</p>
          </button>
        </li>
      ))}
    </ol>
  );
}

interface ItemListProps {
  data: { id: string, name: string }[] | undefined
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
}

export default function ItemList (
  { data, selectedItemId, setSelectedItemId, setFormMode }: ItemListProps
) {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(data);

  const iconMode = use(IconContext);

  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== '' && data) {
      const results = data.filter((item) => {
        return (
          item.name.toLowerCase().includes(keyword.toLowerCase())
          || item.id === selectedItemId);
      });
      setFilteredItems(results);
    } else {
      setFilteredItems(data);
    }

    setSearch(keyword);
  };

  return (
    <div className='flex flex-1 flex-col gap-1'>
      <input
        type='text'
        value={search}
        placeholder='search'
        onChange={filter}
        className='bg-background dark:bg-background-dark pl-1'
      />
      <div className='flex justify-around'>
        <button
          onClick={() => {
            setSelectedItemId('');
            setFormMode('create');
          }}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-sm md:text-base
          cursor-pointer hover:border-solid'
        >
          {iconMode
            ? <TbPlus className='text-xl md:text-2xl' />
            : 'create'}
        </button>
        <button
          onClick={() => {
            setFormMode('edit');
          }}
          disabled={!selectedItemId}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-sm md:text-base
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
        >
          {iconMode
            ? <TbEdit className='text-xl md:text-2xl' />
            : 'edit'}
        </button>
        <button
          disabled={!selectedItemId}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-sm md:text-base
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
        >
          {iconMode
            ? <TbMinus className='text-xl md:text-2xl' />
            : 'delete'}
        </button>
      </div>
      <div
        className='
        flex flex-1 bg-background dark:bg-background-dark
        overflow-y-scroll overflow-x-scroll'
      >
        <List
          data={filteredItems}
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
        />
      </div>
    </div>
  );
}
