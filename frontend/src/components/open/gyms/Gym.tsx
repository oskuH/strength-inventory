import { useState } from 'react';

import GymExtension from './GymExtension';
import GymExtensionButton from './GymExtensionButton';

import { type GymGet } from '@strength-inventory/schemas';

export default function Gym ({ gym }: { gym: GymGet; }) {
  const [activeExtension, setActiveExtension] = useState<string | null>(null);

  function handleToggle (title: string) {
    setActiveExtension(activeExtension === title
      ? null
      : title);
  }

  return (
    <div
      className='
      flex flex-col mb-3
      text-primary-text dark:text-primary-text-dark'
    >
      {/* Adapt the placement of the extension buttons to the screen size */}
      <div className='flex flex-col md:flex-row'>
        <div
          className='
          flex flex-col border-x border-t md:border-x-0 md:border-l md:border-y
          bg-primary dark:bg-primary-dark p-3 md:w-4/9 min-h-18'
        >
          <p className='font-bold'>{gym.name}</p>
          <p className='text-sm'>{gym.street} {gym.streetNumber}, {gym.city}</p>
        </div>
        <div
          className='
          flex border divide-x bg-secondary dark:bg-secondary-dark
          flex-1 min-h-18'
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
