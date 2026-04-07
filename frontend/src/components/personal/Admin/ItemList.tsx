// work in progress

import { use } from 'react';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';
import { CgGym } from 'react-icons/cg';
import { MdOutlineLocationOn } from 'react-icons/md';

import { IconContext } from '../../../utils/contexts';

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

function List ({ data }: { data: { id: string, name: string }[] | undefined }) {
  if (!data) {
    return (
      <ol>
        <li>no data</li>
      </ol>
    );
  }

  return (
    <ol>
      {data.map((item) => (
        <li key={item.id}>
          <button
            aria-pressed='false'
            className='flex pl-1 w-full aria-pressed:bg-gray-300'
          >
            <p className='truncate'>{item.name}</p>
          </button>
        </li>
      ))}
    </ol>
  );
}

interface ItemListProps {
  model: string,
  data: { id: string, name: string }[] | undefined
}

export default function ItemList ({ model, data }: ItemListProps) {
  const iconMode = use(IconContext);

  return (
    <div
      className='
      flex flex-col gap-1 border bg-secondary dark:bg-secondary-dark p-3 w-1/2
      text-primary-text dark:text-primary-text-dark'
    >
      <Title model={model} iconMode={iconMode} />
      <input
        type='text'
        placeholder='search'
        className='bg-background dark:bg-background-dark pl-1'
      />
      <div className='flex justify-around'>
        <button
          className='
          p-1 border border-dotted
          bg-primary dark:bg-primary-dark cursor-pointer'
        >
          {iconMode
            ? <TbPlus className='text-2xl' />
            : 'create'}
        </button>
        <button
          className='
          p-1 border border-dotted
          bg-primary dark:bg-primary-dark cursor-pointer'
        >
          {iconMode
            ? <TbEdit className='text-2xl' />
            : 'edit'}
        </button>
        <button
          className='
          p-1 border border-dotted
          bg-primary dark:bg-primary-dark cursor-pointer'
        >
          {iconMode
            ? <TbMinus className='text-2xl' />
            : 'delete'}
        </button>
      </div>
      <div
        className='
        flex flex-1 bg-background dark:bg-background-dark
        overflow-x-scroll overflow-y-scroll'
      >
        <List data={data} />
      </div>
    </div>
  );
}
