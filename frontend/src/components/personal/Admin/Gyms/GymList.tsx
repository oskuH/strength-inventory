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
      void queryClient.invalidateQueries({ queryKey: ['gymsIdAndName'] });
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
        type='search'
        value={search}
        placeholder='search'
        className='bg-background dark:bg-background-dark pl-1'
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
      <div className='flex justify-around'>
        <button
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-sm md:text-base
          cursor-pointer hover:border-solid'
          onClick={() => {
            setSelectedGymId('');
            setFormMode('create');
          }}
        >
          {iconMode
            ? <TbPlus className='text-xl md:text-2xl' />
            : 'create'}
        </button>
        <button
          disabled={!selectedGymId}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-sm md:text-base
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
          onClick={() => {
            setFormMode('edit');
          }}
        >
          {iconMode
            ? <TbEdit className='text-xl md:text-2xl' />
            : 'edit'}
        </button>
        <button
          disabled={!selectedGymId}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-sm md:text-base
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
          onClick={() => {
            deleteGymMutation.mutate(selectedGymId);
          }}
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
