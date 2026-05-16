import { useActionState, useState } from 'react';

import {
  skipToken, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import { z } from 'zod';

import { getGym, postGym, putGym } from '../../../../../utils/api';

import Exceptions from './Exceptions';
import GymEquipment from './GymEquipment/Index';
import OpeningHoursDayInput from './OpeningHoursDayInput';

import {
  type GymPost,
  type GymPostFrontend,
  GymPostFrontendSchema,
  type Hours,
  type OpeningHoursException
} from '@strength-inventory/schemas';

interface GymFormProps {
  formMode: string;
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
  selectedGymId: string;
  setSelectedGymId: React.Dispatch<React.SetStateAction<string>>;
}

export default function GymForm (
  { formMode, setFormMode, selectedGymId, setSelectedGymId }: GymFormProps
) {
  interface formatSubmitProps {
    req: GymPostFrontend;
    exceptions: OpeningHoursException[] | undefined;
  }

  function formatSubmit ({ req, exceptions }: formatSubmitProps) {
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
      equipmentVisibility,
      membershipsVisibility,
      openingHoursVisibility,
      notes
    } = req;

    let equipmentVisible: boolean;
    let membershipsVisible: boolean;
    let openingHoursVisible: boolean;

    if (equipmentVisibility) {
      equipmentVisible = true;
    } else {
      equipmentVisible = false;
    }

    if (membershipsVisibility) {
      membershipsVisible = true;
    } else {
      membershipsVisible = false;
    }

    if (openingHoursVisibility) {
      openingHoursVisible = true;
    } else {
      openingHoursVisible = false;
    }

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
    queryKey: ['gym', selectedGymId],
    queryFn: selectedGymId
      ? () => getGym({ id: selectedGymId })
      : skipToken  // disable this query when creating a new gym
  });

  const postMutation = useMutation({
    mutationFn: (newGym: GymPost) => postGym({ gym: newGym }),
    onSuccess: (newGymFromServer) => {
      setSelectedGymId(newGymFromServer.id);
      setFormMode('edit');
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedGym }: { id: string, updatedGym: GymPost; }) =>
      putGym({ id: id, gym: updatedGym }),
    onSuccess: (editedGymFromServer) => {
      queryClient.setQueryData(['gym', selectedGymId], editedGymFromServer);
    }
  });

  const [state, submitAction, isPending] = useActionState(submit, {
    success: false,
    error: null
  });

  const [gym, setGym] = useState({
    name: '',
    chain: '',
    street: '',
    streetNumber: '',
    district: '',
    city: '',
    url: '',
    equipmentVisible: false,
    membershipsVisible: false,
    openingHoursVisible: false,
    notes: ''
  });

  /* Opening hours exceptions move with
  the above state variables and regular opening hours,
  but they have their own state for convenience.
  formatSubmit function attaches exceptions to
  the other variables before API calls. */
  const [exceptions, setExceptions]
    = useState<OpeningHoursException[] | undefined>();
  /* editForm denotes the subform opened on top of this form. */
  const [editForm, setEditForm] = useState('');

  interface State {
    success: boolean
    error: string | null
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
          await postMutation.mutateAsync(formattedGym);
          return {
            success: true,
            error: null
          };
        } catch (err: unknown) {
          let errorMessage: string;
          if (err instanceof Error) {
            errorMessage = err.message;
          } else {
            errorMessage = 'Unknown error!';
          }
          return {
            success: false,
            error: errorMessage
          };
        }
      } else {  // formMode === 'edit'
        try {
          await putMutation.mutateAsync({
            id: selectedGymId, updatedGym: formattedGym
          });
          return {
            success: true,
            error: null
          };
        } catch (err: unknown) {
          let errorMessage: string;
          if (err instanceof Error) {
            errorMessage = err.message;
          } else {
            errorMessage = 'Unknown error!';
          }
          return {
            success: false,
            error: errorMessage
          };
        }
      }
    } catch (err: unknown) {
      let errorMessage: string;
      if (err instanceof z.ZodError) {
        const messages = err.issues.map((issue) => issue.message);
        console.error(messages);
        errorMessage = err.issues[0].message;
      } else {
        errorMessage = 'Validation error!';
      }
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  if (selectedGymId && gymQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (selectedGymId && gymQuery.isError) {
    return <p>Error: {gymQuery.error.message}</p>;
  }

  /* Initialize the form fields when opened in edit mode.
  selectedGymId is only defined in edit mode.
  Moreover, !exceptions evaluates truthy only on the first render
  because a few lines below it is guaranteed to be defined. */
  if (selectedGymId && gymQuery.isSuccess && !exceptions) {
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
    } = gymQuery.data;

    setGym({
      name: name,
      chain: chain ?? '',
      street: street,
      streetNumber: streetNumber,
      district: district,
      city: city,
      url: url ?? '',
      equipmentVisible: equipmentVisible,
      membershipsVisible: membershipsVisible,
      openingHoursVisible: openingHoursVisible,
      notes: notes ?? ''
    });

    if (gymQuery.data.openingHoursExceptions.data) {
      setExceptions(gymQuery.data.openingHoursExceptions.data);
    } else {
      setExceptions([]);
    }
  }

  const editedGym = gymQuery.data;

  if (editedGym && editForm === 'equipment') {
    return (
      <GymEquipment
        gymId={selectedGymId}
        gymName={editedGym.name}
        setEditForm={setEditForm}
      />
    );
  }

  // TODO: different returns when editing memberships/managers

  return (
    <div className='flex flex-col min-h-0'>
      {/* second-highest <div> with px-3 ensures that
      the scrollbar stays clear of content */}
      <div className='flex flex-col gap-3 px-3 text-xs'>
        <h3 className='flex justify-center text-base'>
          {/* formMode is either 'create' or 'edit' */}
          {formMode === 'create'
            ? 'create new gym'
            : <span>editing {editedGym?.name}</span>}
        </h3>

        <form
          action={submitAction}
          className='flex flex-col gap-3'
        >
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col'>
              <label htmlFor='name'>
                name*
              </label>
              <input
                id='name'
                name='name'
                type='text'
                value={gym.name}
                onChange={(event) => {
                  setGym({ ...gym, name: event.target.value });
                }}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='chain'>
                chain
              </label>
              <input
                id='chain'
                name='chain'
                type='text'
                value={gym.chain}
                onChange={(event) => {
                  setGym({ ...gym, chain: event.target.value });
                }}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='street'>
                street*
              </label>
              <input
                id='street'
                name='street'
                type='text'
                value={gym.street}
                onChange={(event) => {
                  setGym({ ...gym, street: event.target.value });
                }}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='streetNumber'>
                street number*
              </label>
              <input
                id='streetNumber'
                name='streetNumber'
                type='text'
                value={gym.streetNumber}
                onChange={(event) => {
                  setGym({ ...gym, streetNumber: event.target.value });
                }}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='city'>
                city*
              </label>
              <input
                id='city'
                name='city'
                type='text'
                value={gym.city}
                onChange={(event) => {
                  setGym({ ...gym, city: event.target.value });
                }}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='district'>
                district*
              </label>
              <input
                id='district'
                name='district'
                type='text'
                value={gym.district}
                onChange={(event) => {
                  setGym({ ...gym, district: event.target.value });
                }}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='url'>
                url
              </label>
              <input
                id='url'
                name='url'
                type='url'
                value={gym.url}
                onChange={(event) => {
                  setGym({ ...gym, url: event.target.value });
                }}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='notes'>
                notes
              </label>
              <textarea
                id='notes'
                name='notes'
                value={gym.notes}
                onChange={(event) => {
                  setGym({ ...gym, notes: event.target.value });
                }}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
              />
            </div>

            <p>* = required</p>
          </div>

          <div className='flex flex-col gap-1'>
            <h4 className='text-sm font-bold'>regular opening hours</h4>
            <div>
              <h5>everyone</h5>
              <div className='flex flex-col gap-1 md:gap-10 md:flex-row'>
                <div className='flex flex-col gap-1'>
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
                </div>
                <div className='flex flex-col gap-1 md:justify-center'>
                  <OpeningHoursDayInput
                    group='everyone'
                    day='TH'
                    editedHours={editedGym?.openingHoursEveryone}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='FR'
                    editedHours={editedGym?.openingHoursEveryone}
                  />
                </div>
                <div className='flex flex-col gap-1 md:justify-center'>
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
            </div>
            <div>
              <h5>members</h5>
              <div className='flex flex-col gap-1 md:gap-10 md:flex-row'>
                <div className='flex flex-col gap-1'>
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
                </div>
                <div className='flex flex-col gap-1 md:justify-center'>
                  <OpeningHoursDayInput
                    group='members'
                    day='TH'
                    editedHours={editedGym?.openingHoursMembers}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='FR'
                    editedHours={editedGym?.openingHoursMembers}
                  />
                </div>
                <div className='flex flex-col gap-1 md:justify-center'>
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
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <h4 className='text-sm font-bold'>visibility toggles</h4>
            <div className='flex gap-1'>
              <label
                htmlFor='equipmentVisibility'
                hidden={formMode === 'create'}
                className='w-30'
              >
                equipment visible
              </label>
              <input
                id='equipmentVisibility'
                name='equipmentVisibility'
                type='checkbox'
                value='visible'
                checked={gym.equipmentVisible}
                onChange={() => {
                  setGym({ ...gym, equipmentVisible: !gym.equipmentVisible });
                }}
                hidden={formMode === 'create'}
              />
            </div>
            <div className='flex gap-1'>
              <label
                htmlFor='membershipsVisibility'
                hidden={formMode === 'create'}
                className='w-30'
              >
                memberships visible
              </label>
              <input
                id='membershipsVisibility'
                name='membershipsVisibility'
                type='checkbox'
                value='visible'
                checked={gym.membershipsVisible}
                onChange={() => {
                  setGym({
                    ...gym, membershipsVisible: !gym.membershipsVisible
                  });
                }}
                hidden={formMode === 'create'}
              />
            </div>
            <div className='flex gap-1'>
              <label htmlFor='openingHoursVisibility' className='w-30'>
                opening hours visible
              </label>
              <input
                id='openingHoursVisibility'
                name='openingHoursVisibility'
                type='checkbox'
                value='visible'
                checked={gym.openingHoursVisible}
                onChange={() => {
                  setGym({
                    ...gym, openingHoursVisible: !gym.openingHoursVisible
                  });
                }}
              />
            </div>
          </div>
          {/* actual submit button is below <Exceptions /> */}
          <input
            type='submit'
            id='submit-form'
            className='hidden'
            disabled={isPending}
          />
        </form>

        <Exceptions exceptions={exceptions} setExceptions={setExceptions} />

        {/* actual submit button outside the <form>
        to have <Exceptions /> appear as part of the form */}
        <label
          htmlFor='submit-form'
          tabIndex={0} /* make this tab-selectable */
          className={`
          flex justify-center border border-black dark:border-white
          bg-green-700 dark:bg-green-500 px-3 w-full
          text-primary-text-dark dark:text-primary-text text-base
          hover:border-white hover:dark:border-black active:font-bold
          ${!isPending
      ? 'cursor-pointer'
      : 'cursor-progress'
    }`}
        >
          {formMode === 'create'
            ? !isPending
              ? <span>create</span>
              : <span>creating...</span>
            : !isPending
              ? <span>save</span>
              : <span>saving...</span>}
        </label>

        {state.error
          ? (
            <div className='self-center text-red-700 dark:text-red-400'>
              {state.error}
            </div>
          )
          : null}


        {formMode === 'edit'
          ? <hr />
          : null}

        <div className='flex flex-col gap-1'>
          {formMode === 'edit'
            ? (
              <>
                <button
                  onClick={() => {
                    setEditForm('equipment');
                  }}
                  className='
                  border bg-tertiary dark:bg-tertiary-dark py-1 cursor-pointer
                  hover:bg-background dark:hover:bg-background-dark
                  active:font-bold'
                >
                  edit equipment
                </button>
                <button
                  className='
                  border bg-tertiary dark:bg-tertiary-dark py-1
                  text-red-700 dark:text-red-400 cursor-pointer
                  hover:bg-background dark:hover:bg-background-dark
                  active:font-bold'
                  disabled
                >
                  edit memberships {/* todo */}
                </button>
                <button
                  className='
                  border bg-tertiary dark:bg-tertiary-dark py-1
                  text-red-700 dark:text-red-400 enabled:cursor-pointer
                  enabled:hover:bg-background
                  enabled:dark:hover:bg-background-dark
                  enabled:active:font-bold'
                  disabled
                >
                  edit managers {/* todo */}
                </button>
              </>
            )
            : null}
          <button
            onClick={() => {
              void queryClient.invalidateQueries(
                { queryKey: ['gymsIdAndName'] }
              );
              setFormMode('hidden');
            }}
            className={`
            self-center border bg-tertiary dark:bg-tertiary-dark py-1
            w-9/10 cursor-pointer
            hover:bg-background dark:hover:bg-background-dark
            active:font-bold
            ${formMode === 'edit'
      ? 'mt-3'
      : ''
    }`}
          >
            return without saving
          </button>
        </div>
      </div>
    </div>
  );
}
