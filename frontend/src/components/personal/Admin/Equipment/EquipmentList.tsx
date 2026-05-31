import { use, useState } from 'react';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthContext, IconContext } from '../../../../utils/contexts';
import { deleteEquipment } from '../../../../utils/api';

import List from './List';

interface EquipmentListProps {
  data: { id: string, name: string }[] | undefined
  selectedPieceId: string
  setSelectedPieceId: React.Dispatch<React.SetStateAction<string>>
  setFormMode: React.Dispatch<React.SetStateAction<string>>
}

export default function EquipmentList (
  { data, selectedPieceId, setSelectedPieceId, setFormMode }: EquipmentListProps
) {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const deleteEquipmentMutation = useMutation({
    mutationFn: (id: string) =>
      deleteEquipment({ id: id, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      void queryClient.invalidateQueries({ queryKey: ['equipmentIdAndName'] });
      setSelectedPieceId('');
    }
  });

  const [search, setSearch] = useState('');

  let filteredItems: { id: string, name: string }[] | undefined = data;
  if (search !== '' && data) {
    filteredItems = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase())
        || item.id === selectedPieceId);
    });
  }

  return (
    <div className='flex flex-1 flex-col gap-1'>
      <input
        type='text'
        value={search}
        placeholder='search'
        autoComplete='off'
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
            setSelectedPieceId('');
            setFormMode('create');
          }}
        >
          {iconMode
            ? <TbPlus className='text-xl md:text-2xl' />
            : 'create'}
        </button>
        <button
          disabled={!selectedPieceId}
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
          disabled={!selectedPieceId}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-sm md:text-base
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
          onClick={() => {
            deleteEquipmentMutation.mutate(selectedPieceId);
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
          selectedItemId={selectedPieceId}
          setSelectedItemId={setSelectedPieceId}
        />
      </div>
    </div>
  );
}
