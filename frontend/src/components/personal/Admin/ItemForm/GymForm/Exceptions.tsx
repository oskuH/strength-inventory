// work in progress
import { use, useState } from 'react';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';

import { IconContext } from '../../../../../utils/contexts';

import { type OpeningHoursException } from '@strength-inventory/schemas';

interface ExceptionsItemProps {
  exception: OpeningHoursException
  selectedExceptionId: string
  setSelectedExceptionId: React.Dispatch<React.SetStateAction<string>>
}

function ExceptionsItem ({
  exception, selectedExceptionId, setSelectedExceptionId
}: ExceptionsItemProps) {
  const { id, date, hours, reason, concernsMembers } = exception;

  return (
    <button
      onClick={() => {
        setSelectedExceptionId(id);
      }}
      aria-pressed={id === selectedExceptionId}
      className='
      flex flex-col min-w-full
      aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600'
    >
      <span className='flex gap-2'>
        <span>{date.toLocaleDateString('en-GB')}</span>
        <span>{hours[0]}-{hours[1]}</span>
        {concernsMembers
          ? <span>Members: yes</span>
          : <span>Members: no</span>}
      </span>
      <span>Reason: {reason}</span>
    </button>
  );
}

interface ExceptionsItemFormProps {
  exception: OpeningHoursException
  setEditedException: React.Dispatch<React.SetStateAction<string>>
}

function ExceptionsItemForm ({
  exception, setEditedException
}: ExceptionsItemFormProps) {
  return (
    <form>
      <input
        type='date' defaultValue={exception.date.toISOString().split('T')[0]}
      />
      <button
        onClick={() => {
          setEditedException('');
        }}
      >
        cancel edit
      </button>
    </form>
  );
}

interface ExceptionsProps {
  exceptions: OpeningHoursException[]
  setExceptions: React.Dispatch<React.SetStateAction<OpeningHoursException[]>>
}

export default function Exceptions ({
  exceptions, setExceptions
}: ExceptionsProps) {
  const [selectedExceptionId, setSelectedExceptionId] = useState('');
  const [createException, setCreateException] = useState(false);
  const [editedException, setEditedException] = useState('');

  const iconMode = use(IconContext);

  return (
    <div className='flex flex-col'>
      <span>exceptions</span>
      <div className='flex justify-around'>
        <button
          onClick={() => {
            setCreateException(true);
          }}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-xs
          cursor-pointer hover:border-solid'
        >
          {iconMode
            ? <TbPlus className='text-base' />
            : 'create'}
        </button>
        <button
          onClick={() => {
            setEditedException(selectedExceptionId);
            setSelectedExceptionId('');
          }}
          disabled={!selectedExceptionId || editedException !== ''}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-xs
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
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
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
        >
          {iconMode
            ? <TbMinus className='text-base' />
            : 'delete'}
        </button>
      </div>
      {createException
        ? (
          <form>
            <button
              onClick={() => {
                setCreateException(false);
              }}
            >
              cancel
            </button>
          </form>
        )
        : ''}
      <ol
        className='
        flex flex-col gap-1 p-1 bg-background dark:bg-background-dark'
      >
        {exceptions.map((exception) => (
          exception.id !== editedException
            ? (
              <li key={exception.id}>
                <ExceptionsItem
                  exception={exception}
                  selectedExceptionId={selectedExceptionId}
                  setSelectedExceptionId={setSelectedExceptionId}
                />
              </li>
            )
            : (
              <li key={exception.id}>
                <ExceptionsItemForm
                  exception={exception}
                  setEditedException={setEditedException}
                />
              </li>
            )
        ))}
      </ol>
    </div>
  );
}
