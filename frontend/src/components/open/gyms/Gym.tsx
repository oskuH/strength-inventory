import { useState } from 'react';

import GymExtension from './GymExtension';
import GymExtensionButton from './GymExtensionButton';

import { type GymGet } from '@strength-inventory/schemas';

export default function GymGet ({ gym }: { gym: GymGet; }) {
  const [activeExtension, setActiveExtension] = useState<string | null>(null);

  function handleToggle (title: string) {
    setActiveExtension(activeExtension === title
      ? null
      : title);
  }

  return (
    <div
      className='
      flex mb-3 w-75 md:w-135 rounded-sm flex-col
      text-primary-text dark:text-primary-text-dark'
    >
      <div
        className='
        flex rounded-sm flex-col md:flex-row'
      >
        <div
          className='
          flex p-3 flex-col w-75 md:w-60 min-h-18
          bg-primary dark:bg-primary-dark
          border-x border-t md:border-x-0 md:border-l md:border-y'
        >
          <p className='font-bold'>{gym.name}</p>
          <p className='text-sm'>{gym.street} {gym.streetNumber}, {gym.city}</p>
        </div>
        <div
          className='
          flex grow min-h-18
          bg-secondary dark:bg-secondary-dark divide-x border'
        >
          <GymExtensionButton
            activeExtension={activeExtension}
            handleToggle={handleToggle}
            title='equipment'
          />
          <GymExtensionButton
            activeExtension={activeExtension}
            handleToggle={handleToggle}
            title='memberships'
          />
          <GymExtensionButton
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
