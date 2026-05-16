import { use, useState } from 'react';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteEquipment } from '../../../../utils/api';
import { IconContext } from '../../../../utils/contexts';

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
  const [search, setSearch] = useState('');

  const iconMode = use(IconContext);
  const queryClient = useQueryClient();

  const deleteEquipmentMutation = useMutation({
    mutationFn: (id: string) => deleteEquipment({ id: id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      void queryClient.invalidateQueries({ queryKey: ['equipmentIdAndName'] });
      setSelectedPieceId('');
    }
  });

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
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        className='bg-background dark:bg-background-dark pl-1'
      />
      <div className='flex justify-around'>
        <button
          onClick={() => {
            setSelectedPieceId('');
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
          disabled={!selectedPieceId}
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
            deleteEquipmentMutation.mutate(selectedPieceId);
          }}
          disabled={!selectedPieceId}
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
          selectedItemId={selectedPieceId}
          setSelectedItemId={setSelectedPieceId}
        />
      </div>
    </div>
  );
}
