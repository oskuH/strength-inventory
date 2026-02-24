import { Link } from '@tanstack/react-router';

interface ToggleProps {
  darkMode: boolean;
  handleChange: () => void;
}

interface SidebarLeftProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

function Toggle ({ darkMode, handleChange }: ToggleProps) {
  return (
    <div
      className='
      flex relative rounded-md p-1 bg-secondary-dark text-primary-text-dark
      dark:bg-secondary dark:text-primary-text'
    >
      <div className='flex flex-1 flex-col justify-between'>
        <p>light</p>
        <p>dark</p>
      </div>
      <input
        type='checkbox'
        id='check'
        className='peer hidden'
        onChange={handleChange}
        checked={darkMode}
      />
      <label
        htmlFor='check'
        className='
        flex items-center cursor-pointer
        before:content-[""] before:h-14 before:w-10 before:rounded-md
        before:bg-tertiary dark:before:bg-tertiary-dark
        after:content-[""] after:h-4 after:w-8 after:rounded-md
        after:bg-primary-dark dark:after:bg-primary
        after:absolute after:right-2 after:top-2
        after:transition
        peer-checked:after:translate-y-8'
      />
    </div>
  );
}

export default function SidebarLeft (
  { darkMode, setDarkMode }: SidebarLeftProps
) {
  return (
    <div
      className='
      absolute left-0 h-full flex p-1 w-24 flex-col
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
      <Toggle
        darkMode={darkMode}
        handleChange={() => {
          setDarkMode(!darkMode);
        }}
      />
    </div>
  );
}
