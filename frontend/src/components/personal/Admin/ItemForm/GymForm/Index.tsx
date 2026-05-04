import { useActionState, useState } from 'react';

import {
  skipToken, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import { z } from 'zod';

import { getGym, postGym, putGym } from '../../../../../utils/api';

import Equipment from './Equipment';
import Exceptions from './Exceptions';
import OpeningHoursDayInput from './OpeningHoursDayInput';

import {
  type GymPost,
  type GymPostFrontend,
  GymPostFrontendSchema,
  type Hours,
  type OpeningHoursException
} from '@strength-inventory/schemas';

interface GymFormProps {
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
}

export default function GymForm (
  { formMode, setFormMode, selectedItemId, setSelectedItemId }: GymFormProps
) {
  const queryClient = useQueryClient();

  interface formatSubmit {
    req: GymPostFrontend
    exceptions: OpeningHoursException[] | undefined
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

  const gymQuery = useQuery({
    queryKey: ['gym', selectedItemId],
    queryFn: selectedItemId
      ? () => getGym({ gymId: selectedItemId })
      : skipToken  // disable this query when selectedItemId === ''
  });

  const postMutation = useMutation({
    mutationFn: (newGym: GymPost) => postGym({ gym: newGym }),
    onSuccess: (newGymFromServer) => {
      setSelectedItemId(newGymFromServer.id);
      setFormMode('edit');
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedGym }: { id: string, updatedGym: GymPost }) =>
      putGym({ gymId: id, gym: updatedGym }),
    onSuccess: (editedGymFromServer) => {
      queryClient.setQueryData(['gym', selectedItemId], editedGymFromServer);
    }
  });

  /* Opening hours are currently not included in the form state.
  Thus, if creating a new gym fails after the form's own validation,
  entered hours will get erased.
  When editing a gym, changed hours revert back to their original values
  in a similar situation. */
  const [state, submitAction, isPending] = useActionState(submit, {
    success: false,
    error: null,
    submittedGymId: '',
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
  const [exceptions, setExceptions]
    = useState<OpeningHoursException[] | undefined>();
  const [editForm, setEditForm] = useState('');

  interface State {
    success: boolean
    error: string | null
    submittedGymId: string
    submitFailed: boolean
    name: string
    chain: string | null | undefined
    street: string
    streetNumber: string
    city: string
    district: string
    url: string | null | undefined
    notes: string | null | undefined
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
          const res = await postMutation.mutateAsync(formattedGym);
          return {
            success: true,
            error: null,
            submittedGymId: res.id,
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
          if (err instanceof Error) {
            return {
              success: false,
              error: err.message,
              submittedGymId: '',
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
          return {
            success: false,
            error: 'Unknown error!',
            submittedGymId: '',
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
      } else { // formMode === 'edit'
        try {
          const res
            = await putMutation.mutateAsync({
              id: selectedItemId, updatedGym: formattedGym
            });
          return {
            success: true,
            error: null,
            submittedGymId: res.id,
            submitFailed: false,
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
        } catch (err: unknown) {
          if (err instanceof Error) {
            return {
              success: false,
              error: err.message,
              submittedGymId: '',
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
          return {
            success: false,
            error: 'Unknown error!',
            submittedGymId: '',
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
      if (err instanceof z.ZodError) {
        const messages = err.issues.map((issue) => issue.message);
        console.error(messages);
        return {
          success: false,
          error: err.issues[0].message,
          submittedGymId: '',
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
      } else {
        return {
          success: false,
          error: 'Validation error!',
          submittedGymId: '',
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
  }

  if (selectedItemId && gymQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (selectedItemId && gymQuery.isError) {
    return <p>Error: {gymQuery.error.message}</p>;
  }

  if (selectedItemId && gymQuery.isSuccess && !exceptions) {
    if (gymQuery.data.openingHoursExceptions.data) {
      setExceptions(gymQuery.data.openingHoursExceptions.data);
    } else {
      setExceptions([]);
    }
  }
  const editedGym = gymQuery.data;

  if (editedGym && editForm === 'equipment') {
    return (
      <Equipment
        selectedItemId={selectedItemId}
        gymName={editedGym.name}
        setEditForm={setEditForm}
      />
    );
  }

  // TODO: different returns when editing memberships/managers

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
          defaultValue={state.submitFailed
            ? state.name
            : editedGym?.name}
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
          defaultValue={state.submitFailed
            ? state.chain
              ? state.chain
              : undefined
            : editedGym?.chain
              ? editedGym.chain
              : undefined}
          className='border'
        />

        <label htmlFor='street'>
          street
        </label>
        <input
          id='street'
          name='street'
          type='text'
          defaultValue={state.submitFailed
            ? state.street
            : editedGym?.street}
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
          defaultValue={state.submitFailed
            ? state.streetNumber
            : editedGym?.streetNumber}
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
          defaultValue={state.submitFailed
            ? state.city
            : editedGym?.city}
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
          defaultValue={state.submitFailed
            ? state.district
            : editedGym?.district}
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
          defaultValue={state.submitFailed
            ? state.url
              ? state.url
              : undefined
            : editedGym?.url
              ? editedGym.url
              : undefined}
          className='border'
        />

        <label htmlFor='notes'>
          notes
        </label>
        <textarea
          id='notes'
          name='notes'
          defaultValue={state.submitFailed
            ? state.notes
              ? state.notes
              : undefined
            : editedGym?.notes
              ? editedGym.notes
              : undefined}
          /* defaultValue={editedGym?.notes && state.notes === ''
            ? editedGym.notes
            : state.url} */
          className='border'
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
        <div className='flex gap-1'>
          <label htmlFor='equipmentVisibility' hidden={formMode === 'create'}>
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
          <label htmlFor='membershipsVisibility' hidden={formMode === 'create'}>
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
          <label htmlFor='openingHoursVisibility'>
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
        className='cursor-pointer'
        htmlFor='submit-form'
        tabIndex={0} /* make this tab-selectable */
      >
        {formMode === 'create'
          ? <span>create</span>
          : <span>save changes</span>}
      </label>

      <div className='text-red-600'>
        {state.error}
      </div>

      <hr />

      <div className='flex flex-col'>
        {formMode === 'edit'
          ? (
            <>
              <button
                className='cursor-pointer'
                onClick={() => {
                  setEditForm('equipment');
                }}
              >
                edit equipment
              </button>
              <button className='cursor-pointer text-red-400' disabled>
                edit memberships {/* todo */}
              </button>
              <button className='cursor-pointer text-red-400' disabled>
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
          className='cursor-pointer'
        >
          return
        </button>
      </div>
    </div>
  );
}
