import { Link } from '@tanstack/react-router';

import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { TbClock, TbContract } from 'react-icons/tb';
import { CgGym } from 'react-icons/cg';

interface IconToggleProps {
  iconMode: boolean;
  handleChange: () => void;
}

interface ThemeToggleProps {
  iconMode: boolean;
  darkMode: boolean;
  handleChange: () => void;
}

interface SidebarLeftProps {
  sidebarLeftVisible: boolean
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
        before:rounded-md before:bg-red-400 dark:before:bg-red-800
        peer-checked:before:bg-green-500 dark:peer-checked:before:bg-green-700
        before:w-10 before:h-5 before:content-[""]
        after:absolute after:right-7
        after:rounded-md after:bg-primary-dark dark:after:bg-primary
        after:w-3 after:h-3 after:content-[""]
        peer-hover:after:scale-120
        peer-checked:after:translate-x-5'
      />
    </div>
  );
}

function ThemeToggle ({ iconMode, darkMode, handleChange }: ThemeToggleProps) {
  return (
    <div
      className='
      flex relative rounded-md py-1 pr-1
      bg-secondary-dark dark:bg-secondary
      text-primary-text-dark dark:text-primary-text'
    >
      <div
        className='
        flex flex-1 flex-col justify-between items-center text-sm'
      >
        {iconMode
          ? (
            <div
              className='flex flex-1 flex-col justify-between py-0.5 text-xl'
            >
              <MdLightMode />
              <MdDarkMode />
            </div>
          )
          : (
            <>
              <p>light</p>
              <p>dark</p>
            </>
          )}
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
        before:rounded-md before:bg-tertiary dark:before:bg-tertiary-dark
        before:w-10 before:h-14 before:content-[""]
        after:absolute after:top-2 after:right-2
        after:rounded-md after:bg-primary-dark dark:after:bg-primary
        after:w-8 after:h-4 after:content-[""]
        peer-hover:after:scale-110
        peer-checked:after:translate-y-8'
      />
    </div>
  );
}

export default function SidebarLeft (
  { sidebarLeftVisible, iconMode, setIconMode, darkMode, setDarkMode }:
  SidebarLeftProps
) {
  return (
    <nav
      className={`
      absolute left-0 md:translate-x-0 flex flex-col gap-1 border-t border-r
      bg-secondary dark:bg-secondary-dark pt-3 pb-12 w-24 h-full
      text-primary-text dark:text-primary-text-dark text-sm
      ${sidebarLeftVisible
      ? 'translate-x-0'
      : '-translate-x-full'}`}
    >
      <h2 className='pl-2 text-base font-bold'>FIND</h2>
      <Link
        to='/gyms'
        className='pl-2 hover:bg-primary dark:hover:bg-background-dark'
      >
        gyms
      </Link>
      <Link
        to='/equipment'
        className='pl-2 hover:bg-primary dark:hover:bg-background-dark'
      >
        equipment
      </Link>

      <div className='flex flex-col gap-1 mt-auto p-1'>
        <IconToggle
          iconMode={iconMode}
          handleChange={() => {
            setIconMode(!iconMode);
          }}
        />
        <ThemeToggle
          iconMode={iconMode}
          darkMode={darkMode}
          handleChange={() => {
            setDarkMode(!darkMode);
          }}
        />
      </div>
    </nav>
  );
}
