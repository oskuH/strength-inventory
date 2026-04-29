// work in progress
import { useActionState, useState } from 'react';

import {
  skipToken, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';

import { getGym, postGym } from '../../../../../utils/api';

import Exceptions from './Exceptions';

import {
  type GymPost,
  type GymPostFrontend,
  GymPostFrontendSchema,
  GymPostSchema,
  type Hours,
  type OpeningHoursException
} from '@strength-inventory/schemas';

interface OpeningHoursDayInputProps {
  group: 'everyone' | 'members'
  day: 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'
  editedHours: Hours | undefined
}

function OpeningHoursDayInput (
  { group, day, editedHours }: OpeningHoursDayInputProps
) {
  return (
    <div className='flex gap-1'>
      <span className='w-5'>{day}</span>
      <input
        id={`${group}${day}Open`}
        name={`${group}${day}Open`}
        type='number'
        min='0'
        max='24'
        defaultValue={editedHours?.[day]
          ? editedHours[day][0]
            ? editedHours[day][0]
            : undefined
          : undefined}
        className='flex flex-1 dark:bg-background-dark md:w-9'
      />
      <span>-</span>
      <input
        id={`${group}${day}Close`}
        name={`${group}${day}Close`}
        type='number'
        min='0'
        max='24'
        defaultValue={editedHours?.[day]
          ? editedHours[day][1]
            ? editedHours[day][1]
            : undefined
          : undefined}
        className='flex flex-1 dark:bg-background-dark md:w-9'
      />
    </div>
  );
}

interface GymFormProps {
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
}

const mockExceptions = [
  {
    id: '1ebcd386-4f55-4292-b209-b2ec931e7fe0',
    date: new Date('2026-04-17'),
    hours: [12, 21],
    reason: 'repairs in the morning',
    concernsMembers: true
  },
  {
    id: '55dee45c-d514-4b0c-b1f7-8e0f8e04abd5',
    date: new Date('2026-04-18'),
    hours: [15, 20],
    reason: 'staff shortage',
    concernsMembers: false
  }
];

export default function GymForm (
  { formMode, setFormMode, selectedItemId, setSelectedItemId }: GymFormProps
) {
  interface formatSubmit {
    req: GymPostFrontend
    exceptions: OpeningHoursException[]
  }

  function formatSubmit ({ req, exceptions }: formatSubmit) {
    const weekdays = [
      'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'
    ] as const;
    const openingHoursEveryone: Hours = {};
    const openingHoursMembers: Hours = {};

    weekdays.forEach((weekday) => {
      if (req[`everyone${weekday}Open`] || req[`everyone${weekday}Close`]) {
        openingHoursEveryone[weekday]
          = [req[`everyone${weekday}Open`], req[`everyone${weekday}Close`]];
      }
      if (req[`members${weekday}Open`] || req[`members${weekday}Close`]) {
        openingHoursMembers[weekday]
          = [req[`members${weekday}Open`], req[`members${weekday}Close`]];
      }
    });

    const {
      name,
      chain,
      street,
      streetNumber,
      district,
      city,
      url,
      equipmentVisible,
      membershipsVisible,
      openingHoursVisible,
      notes
    } = req;

    const formattedGym = {
      name: name,
      chain: chain,
      street: street,
      streetNumber: streetNumber,
      district: district,
      city: city,
      openingHoursEveryone: openingHoursEveryone,
      openingHoursMembers: openingHoursMembers,
      openingHoursExceptions: { data: exceptions },
      url: url,
      equipmentVisible: equipmentVisible,
      membershipsVisible: membershipsVisible,
      openingHoursVisible: openingHoursVisible,
      notes: notes
    };

    return formattedGym;
  }

  const queryClient = useQueryClient();

  const gymQuery = useQuery({
    queryKey: ['gym', selectedItemId],
    queryFn: selectedItemId
      ? () => getGym({ id: selectedItemId })
      : skipToken  // disable this query when selectedItemId === ''
  });

  const postMutation = useMutation({
    mutationFn: (newGym: GymPost) => postGym({ gym: newGym })
  });

  const [state, submitAction, isPending] = useActionState(submit, {
    success: false,
    error: null,
    submittedGymId: ''
  });
  const [exceptions, setExceptions]
    = useState<OpeningHoursException[]>(mockExceptions);

  // TODO: add useEffect for exceptions that triggers after the query

  if (selectedItemId && gymQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (selectedItemId && gymQuery.isError) {
    return <p>Error: {gymQuery.error.message}</p>;
  }

  const editedGym = gymQuery.data;

  interface State {
    success: boolean
    error: string | null
    submittedGymId: string
  }

  async function submit (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const validatedReq = GymPostFrontendSchema.parse(req);
      const formattedGym = formatSubmit({
        req: validatedReq, exceptions: exceptions
      });
      if (formMode === 'create') {
        try {
          const res = await postMutation.mutateAsync(formattedGym);
          return { success: true, error: null, submittedGymId: res.id };
        } catch {
          return {
            success: false,
            error: 'Error!',
            submittedGymId: ''
          };
        }
      } else { // formMode === 'edit'
        try { // TODO!
          const validatedReq = GymPostSchema.parse(req);
          const res = await postMutation.mutateAsync(validatedReq);
          return { success: true, error: null, submittedGymId: res.id };
        } catch {
          return {
            success: false,
            error: 'Error!',
            submittedGymId: ''
          };
        }
      }
    } catch {
      return {
        success: false,
        error: 'Validation error!',
        submittedGymId: ''
      };
    }
  }

  // submit function guarantees that neither of these conditions is truthy alone
  if (state.success && state.submittedGymId) {
    setSelectedItemId(state.submittedGymId);
    setFormMode('edit');
    void queryClient.invalidateQueries({ queryKey: ['gyms'] });
  }

  // TODO: different returns when editing equipment/memberships/managers

  return (
    <div className='min-h-0 overflow-y-scroll text-xs'>
      {formMode === 'create'
        ? <h3>create new gym</h3>
        : <h3>edit gym</h3>}  {/* formMode is either 'create' or 'edit' */}

      <form
        action={submitAction}
        className='flex flex-col gap-1'
      >
        <label htmlFor='name'>
          name
        </label>
        <input
          id='name'
          name='name'
          type='text'
          defaultValue={editedGym?.name}
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
          defaultValue={editedGym?.chain
            ? editedGym.chain
            : undefined}
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
          defaultValue={editedGym?.street}
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
          defaultValue={editedGym?.streetNumber}
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
          defaultValue={editedGym?.city}
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
          defaultValue={editedGym?.district}
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
          defaultValue={editedGym?.url
            ? editedGym.url
            : undefined}
          className='border'
          required
        />

        <label htmlFor='notes'>
          notes
        </label>
        <textarea
          id='notes'
          name='notes'
          defaultValue={editedGym?.notes
            ? editedGym.notes
            : undefined}
          className='border'
          required
        />

        <h4 className='font-bold'>opening hours</h4>
        <h5>everyone</h5>
        <div className='flex flex-col gap-1 md:gap-3 md:flex-row'>
          <div className='flex flex-col gap-1 md:basis-1/2'>
            <OpeningHoursDayInput
              group='everyone'
              day='MO'
              editedHours={editedGym?.openingHoursEveryone}
            />
            <OpeningHoursDayInput
              group='everyone'
              day='TU'
              editedHours={editedGym?.openingHoursEveryone}
            />
            <OpeningHoursDayInput
              group='everyone'
              day='WE'
              editedHours={editedGym?.openingHoursEveryone}
            />
            <OpeningHoursDayInput
              group='everyone'
              day='TH'
              editedHours={editedGym?.openingHoursEveryone}
            />
          </div>
          <div className='flex flex-col gap-1 md:justify-center md:basis-1/2'>
            <OpeningHoursDayInput
              group='everyone'
              day='FR'
              editedHours={editedGym?.openingHoursEveryone}
            />
            <OpeningHoursDayInput
              group='everyone'
              day='SA'
              editedHours={editedGym?.openingHoursEveryone}
            />
            <OpeningHoursDayInput
              group='everyone'
              day='SU'
              editedHours={editedGym?.openingHoursEveryone}
            />
          </div>
        </div>
        <h5>members</h5>
        <div className='flex flex-col gap-1 md:gap-3 md:flex-row'>
          <div className='flex flex-col gap-1 md:basis-1/2'>
            <OpeningHoursDayInput
              group='members'
              day='MO'
              editedHours={editedGym?.openingHoursMembers}
            />
            <OpeningHoursDayInput
              group='members'
              day='TU'
              editedHours={editedGym?.openingHoursMembers}
            />
            <OpeningHoursDayInput
              group='members'
              day='WE'
              editedHours={editedGym?.openingHoursMembers}
            />
            <OpeningHoursDayInput
              group='members'
              day='TH'
              editedHours={editedGym?.openingHoursMembers}
            />
          </div>
          <div className='flex flex-col gap-1 md:justify-center md:basis-1/2'>
            <OpeningHoursDayInput
              group='members'
              day='FR'
              editedHours={editedGym?.openingHoursMembers}
            />
            <OpeningHoursDayInput
              group='members'
              day='SA'
              editedHours={editedGym?.openingHoursMembers}
            />
            <OpeningHoursDayInput
              group='members'
              day='SU'
              editedHours={editedGym?.openingHoursMembers}
            />
          </div>
        </div>
      </form>
      <Exceptions exceptions={exceptions} setExceptions={setExceptions} />
      <button
        className='cursor-pointer'
      >
        submit changes
      </button>

      <hr />

      <div className='flex flex-col'>
        <button className='cursor-pointer'>edit equipment</button>
        <button className='cursor-pointer'>edit memberships</button>
        <button className='cursor-pointer'>edit managers</button>
        <button
          onClick={() => {
            setFormMode('hidden');
          }}
          className='cursor-pointer'
        >
          return
        </button>
      </div>
    </div>
  );
}
