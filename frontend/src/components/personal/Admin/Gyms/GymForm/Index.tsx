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
  interface formatSubmit {
    req: GymPostFrontend;
    exceptions: OpeningHoursException[] | undefined;
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

  /* Regular opening hours are currently not included in the form state.
  Thus, if creating a new gym fails after the form's own validation,
  entered hours will get erased.
  When editing a gym, changed hours revert back to their original values
  in a similar situation. */
  const [state, submitAction, isPending] = useActionState(submit, {
    success: false,
    error: null,
    /* submitFailed is used by form fields to determine whether
    to use state variables as default values */
    submitFailed: false,
    name: '',
    chain: '',
    street: '',
    streetNumber: '',
    city: '',
    district: '',
    url: '',
    notes: '',
    equipmentVisible: false,
    membershipsVisible: false,
    openingHoursVisible: false
  });

  /* Opening hours exceptions move with
  the above state variables and regular opening hours,
  but they have their own state for convenience.
  formatSubmit function attaches exceptions to
  the other variables before API calls. */
  const [exceptions, setExceptions]
    = useState<OpeningHoursException[] | undefined>();
  /* editForm denotes the subform opened
  on top of the base form */
  const [editForm, setEditForm] = useState('');

  interface State {
    success: boolean
    error: string | null
    submitFailed: boolean
    name: string
    chain: string | undefined
    street: string
    streetNumber: string
    city: string
    district: string
    url: string | undefined
    notes: string | undefined
    equipmentVisible: boolean
    membershipsVisible: boolean
    openingHoursVisible: boolean
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
          /* Upon a successful POST, state variables are returned
          empty because the form gets rerendered as an
          edit form with default values from gymQuery.*/
          return {
            success: true,
            error: null,
            submitFailed: false,
            name: '',
            chain: '',
            street: '',
            streetNumber: '',
            city: '',
            district: '',
            url: '',
            notes: '',
            equipmentVisible: false,
            membershipsVisible: false,
            openingHoursVisible: false
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
            error: errorMessage,
            submitFailed: true,
            name: formattedGym.name,
            chain: formattedGym.chain,
            street: formattedGym.street,
            streetNumber: formattedGym.streetNumber,
            city: formattedGym.city,
            district: formattedGym.district,
            url: formattedGym.url,
            notes: formattedGym.notes,
            equipmentVisible: formattedGym.equipmentVisible,
            membershipsVisible: formattedGym.membershipsVisible,
            openingHoursVisible: formattedGym.openingHoursVisible
          };
        }
      } else {  // formMode === 'edit'
        try {
          await putMutation.mutateAsync({
            id: selectedGymId, updatedGym: formattedGym
          });
          return {
            success: true,
            error: null,
            submitFailed: false,
            name: formattedGym.name,
            chain: formattedGym.chain,
            street: formattedGym.street,
            streetNumber: formattedGym.streetNumber,
            city: formattedGym.city,
            district: formattedGym.district,
            url: formattedGym.url,
            notes: formattedGym.notes,
            equipmentVisible: formattedGym.equipmentVisible,
            membershipsVisible: formattedGym.membershipsVisible,
            openingHoursVisible: formattedGym.openingHoursVisible
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
            error: errorMessage,
            submitFailed: true,
            name: formattedGym.name,
            chain: formattedGym.chain,
            street: formattedGym.street,
            streetNumber: formattedGym.streetNumber,
            city: formattedGym.city,
            district: formattedGym.district,
            url: formattedGym.url,
            notes: formattedGym.notes,
            equipmentVisible: formattedGym.equipmentVisible,
            membershipsVisible: formattedGym.membershipsVisible,
            openingHoursVisible: formattedGym.openingHoursVisible
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
        error: errorMessage,
        submitFailed: true,
        name: formData.get('name') as string,
        chain: formData.get('chain') as string,
        street: formData.get('street') as string,
        streetNumber: formData.get('streetNumber') as string,
        city: formData.get('city') as string,
        district: formData.get('district') as string,
        url: formData.get('url') as string,
        notes: formData.get('notes') as string,
        equipmentVisible: formData.get('equipmentVisibility') === 'visible'
          ? true
          : false,
        membershipsVisible:
          formData.get('membershipsVisibility') === 'visible'
            ? true
            : false,
        openingHoursVisible:
          formData.get('openingHoursVisibility') === 'visible'
            ? true
            : false
      };
    }
  }

  if (selectedGymId && gymQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (selectedGymId && gymQuery.isError) {
    return <p>Error: {gymQuery.error.message}</p>;
  }

  if (selectedGymId && gymQuery.isSuccess && !exceptions) {
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
                defaultValue={state.submitFailed
                  ? state.name
                  : editedGym?.name}
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
                defaultValue={state.submitFailed
                  ? state.chain
                  : editedGym?.chain}
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
                defaultValue={state.submitFailed
                  ? state.street
                  : editedGym?.street}
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
                defaultValue={state.submitFailed
                  ? state.streetNumber
                  : editedGym?.streetNumber}
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
                defaultValue={state.submitFailed
                  ? state.city
                  : editedGym?.city}
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
                defaultValue={state.submitFailed
                  ? state.district
                  : editedGym?.district}
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
                defaultValue={state.submitFailed
                  ? state.url
                  : editedGym?.url}
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
                defaultValue={state.submitFailed
                  ? state.notes
                  : editedGym?.notes}
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
                defaultChecked={state.submitFailed
                  ? state.equipmentVisible
                  : editedGym?.equipmentVisible}
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
                defaultChecked={state.submitFailed
                  ? state.membershipsVisible
                  : editedGym?.membershipsVisible}
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
                defaultChecked={state.submitFailed
                  ? state.openingHoursVisible
                  : editedGym?.openingHoursVisible}
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
