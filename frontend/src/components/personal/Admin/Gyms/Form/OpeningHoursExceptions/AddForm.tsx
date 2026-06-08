import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import {
  type OpeningHoursException, OpeningHoursExceptionSchema
} from '@strength-inventory/schemas';

interface AddFormProps {
  exceptions: OpeningHoursException[]
  setExceptions:
  React.Dispatch<React.SetStateAction<OpeningHoursException[]>>
  setAddException: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddForm ({
  exceptions, setExceptions, setAddException
}: AddFormProps) {
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [members, setMembers] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  function handleSubmit (event: React.SubmitEvent) {
    event.preventDefault();

    try {
      const newException = {
        id: uuidv4(),
        date: new Date(date),
        hours: [Number(from), Number(to)],
        concernsMembers: members,
        reason: reason
      };

      const validatedNewException
        = OpeningHoursExceptionSchema.parse(newException);

      let newExceptions;
      if (exceptions.length > 0) {
        newExceptions = [
          ...exceptions,
          validatedNewException
        ];
      } else {
        newExceptions = [validatedNewException];
      }

      setExceptions(newExceptions);
      setAddException(false);
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
      <h5 className='font-bold'>add new exception</h5>

      <div className='flex gap-1'>
        <input
          id='date'
          name='date'
          type='date'
          value={date}
          required
          className='bg-tertiary dark:bg-background-dark p-1 w-30'
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
            required
            className='bg-tertiary dark:bg-background-dark w-12'
            onChange={(event) => {
              setFrom(event.target.value);
            }}
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
            className='bg-tertiary dark:bg-background-dark w-12'
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
          className='border bg-tertiary dark:bg-tertiary-dark pl-1'
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
          add
        </button>
        <button
          type='submit'
          className='
          ml-0.5 border border-black dark:border-white
          bg-red-400 dark:bg-red-800 w-1/2
          hover:border-white hover:dark:border-black
          active:border-white active:dark:border-black active:font-bold
          cursor-pointer'
          onClick={() => {
            setAddException(false);
          }}
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
