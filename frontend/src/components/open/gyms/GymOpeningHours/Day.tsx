import { use } from 'react';

import { FaLock } from 'react-icons/fa6';

import { IconContext } from '../../../../utils/contexts';

interface DayProps {
  day: string,
  hours: string | undefined
  highlighted: boolean
  exception: string | undefined
  setExceptionReason: React.Dispatch<React.SetStateAction<string>>
}

export default function Day ({
  day, hours, highlighted, exception, setExceptionReason
}: DayProps) {
  const iconMode = use(IconContext);

  return (
    <button
      className={`rounded-md px-2 w-24
        ${highlighted
      ? 'bg-secondary dark:bg-secondary-dark'
      : ''
    }
        ${exception
      ? `outline-2 outline-dashed hover:outline-solid
        hover:cursor-help`
      : ''
    }`}
      onClick={() => {
        if (exception) {
          setExceptionReason(exception);
        }
      }}
    >
      {hours
        ? (
          <p className='flex justify-between w-full'>
            <span className=''>{day}</span>
            <span className=''>{hours}</span>
          </p>
        )
        : iconMode
          ? (
            <p className='flex justify-between items-center w-full'>
              <span className=''>{day}</span>
              <FaLock className='text-sm' />
            </p>
          )
          : (
            <p className='flex justify-between w-full'>
              <span className=''>{day}</span>
              <span className=''>closed</span>
            </p>
          )}
    </button>
  );
}
