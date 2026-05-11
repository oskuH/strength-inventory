import { use, useState } from 'react';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteGym } from '../../../../utils/api';
import { IconContext } from '../../../../utils/contexts';

import List from './List';

interface GymListProps {
  data: { id: string, name: string }[] | undefined
  selectedGymId: string
  setSelectedGymId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
}

export default function GymList (
  { data, selectedGymId, setSelectedGymId, setFormMode }: GymListProps
) {
  const [search, setSearch] = useState('');

  const iconMode = use(IconContext);
  const queryClient = useQueryClient();

  const deleteGymMutation = useMutation({
    mutationFn: (id: string) => deleteGym({ id: id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gyms'] });
      setSelectedGymId('');
    }
  });

  let filteredItems: { id: string, name: string }[] | undefined = data;
  if (search !== '' && data) {
    filteredItems = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase())
        || item.id === selectedGymId);
    });
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
            setSelectedGymId('');
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
          disabled={!selectedGymId}
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
            deleteGymMutation.mutate(selectedGymId);
          }}
          disabled={!selectedGymId}
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
          selectedItemId={selectedGymId}
          setSelectedItemId={setSelectedGymId}
        />
      </div>
    </div>
  );
}
