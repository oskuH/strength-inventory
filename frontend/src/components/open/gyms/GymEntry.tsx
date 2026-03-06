import { useState } from 'react';

import GymEntryButton from './GymEntryButton';
import GymEntryExtension from './GymEntryExtension';

import { type Gym } from '@strength-inventory/schemas';

export default function GymEntry ({ gym }: { gym: Gym; }) {
  const [activeExtension, setActiveExtension] = useState<string | null>(null);

  function handleToggle (id: string) {
    setActiveExtension(activeExtension === id
      ? null
      : id);
  }

  return (
    <div
      className='
      flex mb-3 w-75 md:w-135 outline rounded-sm flex-col
       text-primary-text dark:text-primary-text-dark'
    >
      <div
        className='
        flex outline rounded-sm flex-col md:flex-row bg-red-900'
      >
        <div
          className='
          flex p-3 outline flex-col w-75 md:w-60 min-h-18
          bg-primary dark:bg-primary-dark'
        >
          <p className='font-bold'>{gym.name}</p>
          <p className='text-sm'>{gym.street} {gym.streetNumber}, {gym.city}</p>
        </div>
        <div
          className='
          flex grow min-h-18
          bg-secondary dark:bg-secondary-dark'
        >
          <GymEntryButton
            activeExtension={activeExtension}
            handleToggle={handleToggle}
            title='equipment'
          />
          <GymEntryButton
            activeExtension={activeExtension}
            handleToggle={handleToggle}
            title='memberships'
          />
          <GymEntryButton
            activeExtension={activeExtension}
            handleToggle={handleToggle}
            title='opening hours'
          />
        </div>
      </div>

      <div className='bg-tertiary dark:bg-tertiary-dark'>
        <GymEntryExtension activeExtension={activeExtension} gym={gym} />
      </div>
    </div>
  );
}
