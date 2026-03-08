import { useState } from 'react';

import GymButton from './GymButton';
import GymExtension from './GymExtension';

import { type Gym } from '@strength-inventory/schemas';

export default function Gym ({ gym }: { gym: Gym; }) {
  const [activeExtension, setActiveExtension] = useState<string | null>(null);

  function handleToggle (title: string) {
    setActiveExtension(activeExtension === title
      ? null
      : title);
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
          <GymButton
            activeExtension={activeExtension}
            handleToggle={handleToggle}
            title='equipment'
          />
          <GymButton
            activeExtension={activeExtension}
            handleToggle={handleToggle}
            title='memberships'
          />
          <GymButton
            activeExtension={activeExtension}
            handleToggle={handleToggle}
            title='opening hours'
          />
        </div>
      </div>

      <div className='bg-tertiary dark:bg-tertiary-dark'>
        <GymExtension activeExtension={activeExtension} gym={gym} />
      </div>
    </div>
  );
}
