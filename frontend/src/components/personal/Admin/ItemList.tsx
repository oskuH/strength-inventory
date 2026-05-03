import { use, useState } from 'react';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteEquipment, deleteGym } from '../../../utils/api';
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
  model: string
  data: { id: string, name: string }[] | undefined
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
}

export default function ItemList (
  { model, data, selectedItemId, setSelectedItemId, setFormMode }: ItemListProps
) {
  const [search, setSearch] = useState('');

  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const deleteGymMutation = useMutation({
    mutationFn: (id: string) => deleteGym({ id: id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gyms'] });
      setSelectedItemId('');
    }
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: (id: string) => deleteEquipment({ id: id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setSelectedItemId('');
    }
  });

  let filteredItems: { id: string, name: string }[] | undefined = data;
  if (search !== '' && data) {
    filteredItems = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase())
        || item.id === selectedItemId);
    });
  }

  function handleDelete (id: string) {
    if (model === 'gym') {
      deleteGymMutation.mutate(id);
    } else if (model === 'equipment') {
      deleteEquipmentMutation.mutate(id);
    } else {
      return; // admin panel currently only has gyms and equipment
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-1'>
      <input
        type='text'
        value={search}
        placeholder='search'
        onChange={(event) => {
          setSearch(event.target.value);
        }}
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
          onClick={() => {
            handleDelete(selectedItemId);
          }}
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
