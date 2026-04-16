// work in progress
import { useActionState } from 'react';

function OpeningHoursDayInput ({ group, day }: { group: string, day: string }) {
  return (
    <div className='flex gap-1'>
      <span className='w-5'>{day}</span>
      <input
        id={`${group}${day}Open`}
        name={`${group}${day}Open`}
        type='number'
        min='0'
        max='24'
        className='flex flex-1 dark:bg-background-dark md:w-9'
      />
      <span>-</span>
      <input
        id={`${group}${day}Close`}
        name={`${group}${day}Close`}
        type='number'
        min='0'
        max='24'
        className='flex flex-1 dark:bg-background-dark md:w-9'
      />
    </div>
  );
}

interface GymFormProps {
  formMode: string
  setFormMode: React.Dispatch<SetStateAction<string>>
}

export default function GymForm ({ formMode, setFormMode }: GymFormProps) {
  const [state, submitAction, isPending] = useActionState(submit, {
    success: false,
    error: null
  });

  interface State {
    success: boolean
    error: string | null
  }

  async function submit (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    if (formMode === 'create') {
      try {
        return;
      } catch {
        return {
          success: false,
          error: 'Error!'
        };
      }
    } else if (formMode === 'edit') {
      try {
        return;
      } catch {
        return {
          success: false,
          error: 'Error!'
        };
      }
    }
  }

  if (state.success) {
    setFormMode('hidden');
  }

  return (
    <div className='min-h-0 overflow-y-scroll'>
      {formMode === 'create'
        ? <h3>create new gym</h3>
        : <h3>edit gym</h3>}  {/* formMode is either 'create' or 'edit' */}

      <form
        action={submitAction}
        className='flex flex-col gap-1 text-sm'
      >
        <label htmlFor='name'>
          name
        </label>
        <input
          id='name'
          name='name'
          type='text'
          className='border'
          required
        />

        <label htmlFor='chain'>
          chain
        </label>
        <input
          id='chain'
          name='chain'
          type='text'
          className='border'
          required
        />

        <label htmlFor='street'>
          street
        </label>
        <input
          id='street'
          name='street'
          type='text'
          className='border'
          required
        />

        <label htmlFor='streetNumber'>
          street number
        </label>
        <input
          id='streetNumber'
          name='streetNumber'
          type='text'
          className='border'
          required
        />

        <label htmlFor='city'>
          city
        </label>
        <input
          id='city'
          name='city'
          type='text'
          className='border'
          required
        />

        <label htmlFor='district'>
          district
        </label>
        <input
          id='district'
          name='district'
          type='text'
          className='border'
          required
        />

        <label htmlFor='url'>
          url
        </label>
        <input
          id='url'
          name='url'
          type='url'
          className='border'
          required
        />

        <label htmlFor='notes'>
          notes
        </label>
        <textarea
          id='notes'
          name='notes'
          className='border'
          required
        />

        <label>opening hours</label>
        <label>everyone</label>
        <div className='flex flex-col gap-1 md:gap-3 md:flex-row'>
          <div className='flex flex-col gap-1 md:basis-1/2'>
            <OpeningHoursDayInput group='everyone' day='Mo' />
            <OpeningHoursDayInput group='everyone' day='Tu' />
            <OpeningHoursDayInput group='everyone' day='We' />
            <OpeningHoursDayInput group='everyone' day='Th' />
          </div>
          <div className='flex flex-col gap-1 md:justify-center md:basis-1/2'>
            <OpeningHoursDayInput group='everyone' day='Fr' />
            <OpeningHoursDayInput group='everyone' day='Sa' />
            <OpeningHoursDayInput group='everyone' day='Su' />
          </div>
        </div>
        <label>members</label>
        <div className='flex flex-col gap-1 md:gap-3 md:flex-row'>
          <div className='flex flex-col gap-1 md:basis-1/2'>
            <OpeningHoursDayInput group='members' day='Mo' />
            <OpeningHoursDayInput group='members' day='Tu' />
            <OpeningHoursDayInput group='members' day='We' />
            <OpeningHoursDayInput group='members' day='Th' />
          </div>
          <div className='flex flex-col gap-1 md:justify-center md:basis-1/2'>
            <OpeningHoursDayInput group='members' day='Fr' />
            <OpeningHoursDayInput group='members' day='Sa' />
            <OpeningHoursDayInput group='members' day='Su' />
          </div>
        </div>
        <label>exceptions</label>
      </form>
    </div>
  );
}
