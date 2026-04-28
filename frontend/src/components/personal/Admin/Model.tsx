// work in progress

import { use, useState } from 'react';

import { CgGym } from 'react-icons/cg';
import { MdOutlineLocationOn } from 'react-icons/md';

import { IconContext } from '../../../utils/contexts';

import ItemForm from './ItemForm/Index';
import ItemList from './ItemList';

interface TitleProps {
  model: string
  iconMode: boolean
}

function Title ({ model, iconMode }: TitleProps) {
  if (model === 'gym') {
    return (
      <h2 className='self-center font-bold'>
        {iconMode
          ? <MdOutlineLocationOn className='text-2xl' />
          : 'Gyms'}
      </h2>
    );
  }

  if (model === 'equipment') {
    return (
      <h2 className='self-center font-bold'>
        {iconMode
          ? <CgGym className='text-2xl' />
          : 'Equipment'}
      </h2>
    );
  }
}

interface ModelProps {
  model: string,
  data: { id: string, name: string }[] | undefined
}

export default function Model ({ model, data }: ModelProps) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [formMode, setFormMode] = useState('hidden');

  const iconMode = use(IconContext);

  return (
    <div
      className='
      flex flex-col gap-1 border bg-secondary dark:bg-secondary-dark
      p-3 min-w-0 w-1/2
      text-primary-text dark:text-primary-text-dark'
    >
      <Title model={model} iconMode={iconMode} />
      {formMode === 'hidden'
        ? (
          <ItemList
            data={data}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            setFormMode={setFormMode}
          />
        )
        : (
          <ItemForm
            formMode={formMode}
            setFormMode={setFormMode}
            model={model}
            selectedItemId={selectedItemId}
          />
        ) }
    </div>
  );
}
