import { use, useState } from 'react';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';

import { IconContext } from '../../../../../../utils/contexts';

import Exception from './Exception';
import Form from './Form';

import { type OpeningHoursException } from '@strength-inventory/schemas';

interface OpeningHoursExceptionsProps {
  exceptions: OpeningHoursException[]
  setExceptions:
  React.Dispatch<React.SetStateAction<OpeningHoursException[]>>
}

export default function OpeningHoursExceptions ({
  exceptions, setExceptions
}: OpeningHoursExceptionsProps) {
  const iconMode = use(IconContext);

  const [selectedExceptionId, setSelectedExceptionId] = useState('');
  const [addException, setAddException] = useState(false);
  const [editedException, setEditedException] = useState('');

  return (
    <div className='flex flex-col gap-1'>
      <h4 className='text-sm font-bold'>exceptional opening hours</h4>
      <div className='flex justify-around'>
        <button
          disabled={addException}
          className='
            border border-dotted
            bg-primary dark:bg-primary-dark p-1 text-xs
            cursor-not-allowed enabled:cursor-pointer
            enabled:hover:border-solid
            disabled:text-secondary dark:disabled:text-secondary-dark'
          onClick={() => {
            setAddException(true);
          }}
        >
          {iconMode
            ? <TbPlus className='text-base' />
            : 'add'}
        </button>
        <button
          disabled={!selectedExceptionId || editedException !== ''}
          className='
            border border-dotted
            bg-primary dark:bg-primary-dark p-1 text-xs
            cursor-not-allowed enabled:cursor-pointer
            enabled:hover:border-solid
            disabled:text-secondary dark:disabled:text-secondary-dark'
          onClick={() => {
            setEditedException(selectedExceptionId);
            setSelectedExceptionId('');
          }}
        >
          {iconMode
            ? <TbEdit className='text-base' />
            : 'edit'}
        </button>
        <button
          disabled={!selectedExceptionId}
          className='
            border border-dotted
            bg-primary dark:bg-primary-dark p-1 text-xs
            cursor-not-allowed enabled:cursor-pointer
            enabled:hover:border-solid
            disabled:text-secondary dark:disabled:text-secondary-dark'
          onClick={() => {
            const newExceptions = exceptions.filter((obj) => {
              if (obj.id !== selectedExceptionId) {
                return obj;
              }
            });

            setExceptions(newExceptions);
            setSelectedExceptionId('');
          }}
        >
          {iconMode
            ? <TbMinus className='text-base' />
            : 'remove'}
        </button>
      </div>
      {addException
        ? (
          <Form
            exception={undefined}
            setEditedException={setEditedException}
            exceptions={exceptions}
            setExceptions={setExceptions}
            setAddException={setAddException}
          />
        )
        : ''}
      <ol
        className='flex flex-col p-1 bg-background dark:bg-background-dark'
      >
        <hr />
        {exceptions.map((exception) => (
          exception.id !== editedException
            ? (
              <li key={exception.id}>
                <Exception
                  exception={exception}
                  selectedExceptionId={selectedExceptionId}
                  setSelectedExceptionId={setSelectedExceptionId}
                />
                <hr />
              </li>
            )
            : (
              <li key={exception.id}>
                <Form
                  exception={exception}
                  setEditedException={setEditedException}
                  exceptions={exceptions}
                  setExceptions={setExceptions}
                  setAddException={setAddException}
                />
                <hr />
              </li>
            )
        ))}
      </ol>
    </div>
  );
}
