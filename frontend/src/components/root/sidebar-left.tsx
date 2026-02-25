import { Link } from '@tanstack/react-router';

import { TbClock, TbContract } from 'react-icons/tb';
import { CgGym } from 'react-icons/cg';

interface IconToggleProps {
  iconMode: boolean;
  handleChange: () => void;
}

interface ThemeToggleProps {
  darkMode: boolean;
  handleChange: () => void;
}

interface SidebarLeftProps {
  iconMode: boolean
  setIconMode: React.Dispatch<React.SetStateAction<boolean>>
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

function IconToggle ({ iconMode, handleChange }: IconToggleProps) {
  return (
    <div className='flex relative p-1'>
      <div className='flex flex-1 text-xs items-center'>
        <CgGym /><TbContract /><TbClock />
      </div>
      <input
        type='checkbox'
        id='icon-mode-checkbox'
        className='peer hidden'
        onChange={handleChange}
        checked={iconMode}
      />
      <label
        htmlFor='icon-mode-checkbox'
        className='
        flex items-center cursor-pointer
        before:content-[""] before:h-5 before:w-10 before:rounded-md
        before:bg-red-400 peer-checked:before:bg-green-500
        dark:before:bg-red-800 dark:peer-checked:before:bg-green-700
        after:content-[""] after:h-3 after:w-3 after:rounded-md
        after:bg-primary-dark dark:after:bg-primary
        after:absolute after:right-7
        peer-checked:after:translate-x-5'
      />
    </div>
  );
}

function ThemeToggle ({ darkMode, handleChange }: ThemeToggleProps) {
  return (
    <div
      className='
      flex relative rounded-md p-1
      bg-secondary-dark text-primary-text-dark
      dark:bg-secondary dark:text-primary-text'
    >
      <div className='flex flex-1 flex-col justify-between text-sm'>
        <p>light</p>
        <p>dark</p>
      </div>
      <input
        type='checkbox'
        id='dark-mode-checkbox'
        className='peer hidden'
        onChange={handleChange}
        checked={darkMode}
      />
      <label
        htmlFor='dark-mode-checkbox'
        className='
        flex items-center cursor-pointer
        before:content-[""] before:h-14 before:w-10 before:rounded-md
        before:bg-tertiary dark:before:bg-tertiary-dark
        after:content-[""] after:h-4 after:w-8 after:rounded-md
        after:bg-primary-dark dark:after:bg-primary
        after:absolute after:right-2 after:top-2
        peer-checked:after:translate-y-8'
      />
    </div>
  );
}

export default function SidebarLeft (
  { iconMode, setIconMode, darkMode, setDarkMode }: SidebarLeftProps
) {
  return (
    <div
      className='
      absolute left-0 h-full flex p-1 pb-12 w-24 flex-col gap-1
      bg-secondary text-primary-text
      dark:bg-secondary-dark dark:text-primary-text-dark'
    >
      <h2 className='font-bold'>Find</h2>
      <Link
        to='/gyms'
      >
        Gyms
      </Link>
      <Link
        to='/equipment'
      >
        Equipment
      </Link>

      <div className='mt-auto flex flex-col gap-1'>
        <IconToggle
          iconMode={iconMode}
          handleChange={() => {
            setIconMode(!iconMode);
          }}
        />
        <ThemeToggle
          darkMode={darkMode}
          handleChange={() => {
            setDarkMode(!darkMode);
          }}
        />
      </div>
    </div>
  );
}
