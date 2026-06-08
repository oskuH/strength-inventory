import { useState } from 'react';

import { z } from 'zod';

import {
  type OpeningHoursException, OpeningHoursExceptionSchema
} from '@strength-inventory/schemas';

interface EditFormProps {
  exception: OpeningHoursException
  setEditedException: React.Dispatch<React.SetStateAction<string>>
  exceptions: OpeningHoursException[]
  setExceptions:
  React.Dispatch<React.SetStateAction<OpeningHoursException[]>>
}

export default function EditForm ({
  exception, setEditedException, exceptions, setExceptions
}: EditFormProps) {
  const [date, setDate] = useState(exception.date.toISOString().split('T')[0]);
  const [from, setFrom] = useState(String(exception.hours[0]));
  const [to, setTo] = useState(String(exception.hours[1]));
  const [members, setMembers] = useState(exception.concernsMembers);
  const [reason, setReason] = useState(exception.reason);
  const [error, setError] = useState('');

  function handleSubmit (event: React.SubmitEvent) {
    event.preventDefault();

    try {
      const editedException = {
        id: exception.id,
        date: new Date(date),
        hours: [Number(from), Number(to)],
        concernsMembers: members,
        reason: reason
      };

      const validatedEditedException
        = OpeningHoursExceptionSchema.parse(editedException);

      const newExceptions = exceptions.map((obj) => {
        if (obj.id === exception.id) {
          return validatedEditedException;
        }

        return obj;
      });
      setExceptions(newExceptions);
      setEditedException('');
      setError('');
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const messages = err.issues.map((issue) => issue.message);
        console.error(messages);
        setError(err.issues[0].message);
      } else {
        setError('ERROR');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-1 border p-1'>
      <h5 className='font-bold'>edit exception</h5>

      <div className='flex gap-1'>
        <input
          id='date'
          name='date'
          type='date'
          value={date}
          required
          className='bg-secondary dark:bg-tertiary-dark p-1 w-30'
          onChange={(event) => {
            setDate(event.target.value);
          }}
        />
        <div className='flex gap-1'>
          <input
            id='from'
            name='from'
            type='number'
            value={from}
            placeholder='from'
            min='0'
            max={to}
            onChange={(event) => {
              setFrom(event.target.value);
            }}
            required
            className='bg-secondary dark:bg-tertiary-dark w-12'
          />
          <span className='self-center'>-</span>
          <input
            id='to'
            name='to'
            type='number'
            value={to}
            placeholder='to'
            min={from}
            max='24'
            required
            className='bg-secondary dark:bg-tertiary-dark w-12'
            onChange={(event) => {
              setTo(event.target.value);
            }}
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
          value={reason}
          required
          className='border bg-secondary dark:bg-tertiary-dark pl-1'
          onChange={(event) => {
            setReason(event.target.value);
          }}
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
          apply
        </button>
        <button
          onClick={() => {
            setEditedException('');
          }}
          className='
          ml-0.5 border border-black dark:border-white
          bg-red-400 dark:bg-red-800 w-1/2
          hover:border-white hover:dark:border-black
          active:border-white active:dark:border-black active:font-bold
          cursor-pointer'
        >
          cancel
        </button>
      </div>

      {error
        ? <p className='text-red-700 dark:text-red-400'>{error}</p>
        : null}
    </form>
  );
}
