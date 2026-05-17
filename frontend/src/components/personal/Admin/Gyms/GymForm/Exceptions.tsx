import { use, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TbEdit, TbMinus, TbPlus } from 'react-icons/tb';

import { IconContext } from '../../../../../utils/contexts';

import { type OpeningHoursException } from '@strength-inventory/schemas';

interface ExceptionProps {
  exception: OpeningHoursException
  selectedExceptionId: string
  setSelectedExceptionId: React.Dispatch<React.SetStateAction<string>>
}

function Exception ({
  exception, selectedExceptionId, setSelectedExceptionId
}: ExceptionProps) {
  const { id, date, hours, reason, concernsMembers } = exception;

  return (
    <button
      onClick={() => {
        setSelectedExceptionId(id);
      }}
      aria-pressed={id === selectedExceptionId}
      className='
      flex flex-col min-w-full
      aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600 text-left'
    >
      <span className='flex flex-col md:flex-row md:gap-2'>
        <span>{date.toLocaleDateString('en-GB')}</span>
        <span>{hours[0]}-{hours[1]}</span>
        {concernsMembers
          ? <span>Members: yes</span>
          : <span>Members: no</span>}
      </span>
      <span className=''>Reason: {reason}</span>
    </button>
  );
}

interface ExceptionAddFormProps {
  exceptions: OpeningHoursException[] | undefined
  setExceptions:
  React.Dispatch<React.SetStateAction<OpeningHoursException[] | undefined>>
  setAddException: React.Dispatch<React.SetStateAction<boolean>>
}

function ExceptionAddForm ({
  exceptions, setExceptions, setAddException
}: ExceptionAddFormProps) {
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [members, setMembers] = useState(false);
  const [reason, setReason] = useState('');

  function handleSubmit (e: React.SubmitEvent) {
    e.preventDefault();
    let newExceptions;
    if (exceptions) {
      newExceptions = [
        ...exceptions, {
          id: uuidv4(),
          date: new Date(date),
          hours: [Number(from), Number(to)],
          concernsMembers: members,
          reason: reason
        }
      ];
    } else {
      newExceptions = [
        {
          id: uuidv4(),
          date: new Date(date),
          hours: [Number(from), Number(to)],
          concernsMembers: members,
          reason: reason
        }
      ];
    }
    setExceptions(newExceptions);
    setAddException(false);
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-1 border p-1'>
      <h5 className='font-bold'>add new exception</h5>

      <div className='flex gap-1'>
        <input
          id='date'
          name='date'
          type='date'
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
          }}
          className='bg-tertiary dark:bg-tertiary-dark p-1 w-30'
        />
        <div className='flex gap-1'>
          <input
            id='from'
            name='from'
            type='number'
            min='0'
            max={to}
            value={from}
            onChange={(event) => {
              setFrom(event.target.value);
            }}
            className='bg-background dark:bg-background-dark w-10'
          />
          <span>-</span>
          <input
            id='to'
            name='to'
            type='number'
            min={from}
            max='24'
            value={to}
            onChange={(event) => {
              setTo(event.target.value);
            }}
            className='bg-background dark:bg-background-dark w-10'
          />
        </div>
      </div>

      <div className='flex gap-1'>
        <label htmlFor='members'>applies to members</label>
        <input
          id='members'
          name='members'
          type='checkbox'
          value='members'
          checked={members}
          onChange={() => {
            setMembers(!members);
          }}
        />
      </div>

      <div className='flex flex-col'>
        <label htmlFor='reason'>reason</label>
        <textarea
          id='reason'
          name='reason'
          defaultValue={reason}
          onChange={(event) => {
            setReason(event.target.value);
          }}
          className='border bg-tertiary dark:bg-tertiary-dark pl-1'
        />
      </div>
      <div className='flex justify-around mt-2'>
        <button
          type='submit'
          className='
          mr-0.5 border border-black dark:border-white
          bg-green-500 dark:bg-green-700 w-1/2
          hover:border-white hover:dark:border-black
          active:border-white active:dark:border-black active:font-bold
          cursor-pointer'
        >
          add
        </button>
        <button
          onClick={() => {
            setAddException(false);
          }}
          className='ml-0.5 border border-black dark:border-white
          bg-red-400 dark:bg-red-800 w-1/2
          hover:border-white hover:dark:border-black
          active:border-white active:dark:border-black active:font-bold
          cursor-pointer'
        >
          cancel
        </button>
      </div>
    </form>
  );
}

interface ExceptionEditFormProps {
  exception: OpeningHoursException
  setEditedException: React.Dispatch<React.SetStateAction<string>>
  exceptions: OpeningHoursException[]
  setExceptions:
  React.Dispatch<React.SetStateAction<OpeningHoursException[] | undefined>>
}

function ExceptionEditForm ({
  exception, setEditedException, exceptions, setExceptions
}: ExceptionEditFormProps) {
  const [date, setDate] = useState(exception.date.toISOString().split('T')[0]);
  const [from, setFrom] = useState(exception.hours[0]);
  const [to, setTo] = useState(exception.hours[1]);
  const [members, setMembers] = useState(exception.concernsMembers);
  const [reason, setReason] = useState(exception.reason);

  function handleSubmit (e: React.SubmitEvent) {
    e.preventDefault();
    const newExceptions = exceptions.map((obj) => {
      if (obj.id === exception.id) {
        return {
          ...obj,
          date: new Date(date),
          hours: [from, to],
          concernsMembers: members,
          reason: reason
        };
      }

      return obj;
    });
    setExceptions(newExceptions);
    setEditedException('');
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-1 border p-1'>
      <h5 className='font-bold'>edit exception</h5>

      <input
        id='date'
        name='date'
        type='date'
        value={date}
        onChange={(event) => {
          setDate(event.target.value);
        }}
        required
        className='w-26'
      />
      <div className='flex gap-1'>
        <input
          id='from'
          name='from'
          type='number'
          min='0'
          max={to}
          value={from}
          onChange={(event) => {
            setFrom(Number(event.target.value));
          }}
          required
          className='bg-secondary dark:bg-secondary-dark w-11'
        />
        <span>-</span>
        <input
          id='to'
          name='to'
          type='number'
          min={from}
          max='24'
          value={to}
          onChange={(event) => {
            setTo(Number(event.target.value));
          }}
          required
          className='bg-secondary dark:bg-secondary-dark w-11'
        />
      </div>
      <div className='flex gap-1'>
        <label htmlFor='members'>Members</label>
        <input
          id='members'
          name='members'
          type='checkbox'
          value='members'
          checked={members}
          onChange={() => {
            setMembers(!members);
          }}
        />
      </div>
      <label htmlFor='reason' className='self-center'>Reason</label>
      <textarea
        id='reason'
        name='reason'
        defaultValue={reason}
        onChange={(event) => {
          setReason(event.target.value);
        }}
        required
        className='border'
      />
      <div className='flex justify-around'>
        <button type='submit' className='cursor-pointer'>
          apply
        </button>
        <button
          onClick={() => {
            setEditedException('');
          }}
          className='cursor-pointer'
        >
          cancel
        </button>
      </div>
    </form>
  );
}

interface ExceptionsProps {
  exceptions: OpeningHoursException[] | undefined
  setExceptions:
  React.Dispatch<React.SetStateAction<OpeningHoursException[] | undefined>>
}

export default function Exceptions ({
  exceptions, setExceptions
}: ExceptionsProps) {
  const [selectedExceptionId, setSelectedExceptionId] = useState('');
  const [addException, setAddException] = useState(false);
  const [editedException, setEditedException] = useState('');

  const iconMode = use(IconContext);

  return (
    <div className='flex flex-col gap-1'>
      <h4 className='text-sm font-bold'>exceptional opening hours</h4>
      <div className='flex justify-around'>
        <button
          onClick={() => {
            setAddException(true);
          }}
          disabled={addException}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-xs
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
        >
          {iconMode
            ? <TbPlus className='text-base' />
            : 'add'}
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
          onClick={() => {
            const newExceptions = exceptions?.filter((obj) => {
              if (obj.id !== selectedExceptionId) {
                return obj;
              }
            });

            setExceptions(newExceptions);
            setSelectedExceptionId('');
          }}
          disabled={!selectedExceptionId}
          className='
          border border-dotted
          bg-primary dark:bg-primary-dark p-1 text-xs
          enabled:cursor-pointer enabled:hover:border-solid
          disabled:text-secondary dark:disabled:text-secondary-dark'
        >
          {iconMode
            ? <TbMinus className='text-base' />
            : 'remove'}
        </button>
      </div>
      {addException
        ? (
          <ExceptionAddForm
            exceptions={exceptions}
            setExceptions={setExceptions}
            setAddException={setAddException}
          />
        )
        : ''}
      <ol
        className='
        flex flex-col gap-1 p-1 bg-background dark:bg-background-dark'
      >
        {exceptions?.map((exception) => (
          exception.id !== editedException
            ? (
              <li key={exception.id}>
                <Exception
                  exception={exception}
                  selectedExceptionId={selectedExceptionId}
                  setSelectedExceptionId={setSelectedExceptionId}
                />
              </li>
            )
            : (
              <li key={exception.id}>
                <ExceptionEditForm
                  exception={exception}
                  setEditedException={setEditedException}
                  exceptions={exceptions}
                  setExceptions={setExceptions}
                />
              </li>
            )
        ))}
      </ol>
    </div>
  );
}
