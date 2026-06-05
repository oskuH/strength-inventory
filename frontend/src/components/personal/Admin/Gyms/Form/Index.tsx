import { use, useActionState, useState } from 'react';

import { skipToken, useMutation, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { TbEdit, TbPlus } from 'react-icons/tb';

import { AuthContext, IconContext } from '../../../../../utils/contexts';
import { getGym, postGym, putGym } from '../../../../../utils/api';
import handleSubmitError from '../../../../../utils/handleSubmitError';

import GymEquipment from './GymEquipment/Index';
import GymMemberships from './GymMemberships/Index';
import OpeningHoursDayInput from './OpeningHoursDayInput';
import OpeningHoursExceptions from './OpeningHoursExceptions/Index';
import ReturnButton from '../../ReturnButton';

import { FORM_INPUT_CLASSES } from '../../../../../constants/theme';

import {
  type GymPost,
  type GymPostFrontend,
  GymPostFrontendSchema,
  type Hours,
  type OpeningHoursException
} from '@strength-inventory/schemas';

interface FormProps {
  formMode: string;
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
  selectedGymId: string;
  setSelectedGymId: React.Dispatch<React.SetStateAction<string>>;
}

export default function Form (
  { formMode, setFormMode, selectedGymId, setSelectedGymId }: FormProps
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
      country,
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
      country: country,
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

  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const gymQuery = useQuery({
    queryKey: ['gym', selectedGymId],
    queryFn: selectedGymId
      ? () => getGym({ id: selectedGymId })
      : skipToken  // disable this query when creating a new gym
  });

  const postMutation = useMutation({
    mutationFn: (newGym: GymPost) =>
      postGym({ gym: newGym, refresh: auth.refresh, logout: auth.logout }),
    onSuccess: (newGymFromServer) => {
      setSelectedGymId(newGymFromServer.id);
      setFormMode('edit');
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedGym }: { id: string, updatedGym: GymPost; }) =>
      putGym({
        id: id, gym: updatedGym, refresh: auth.refresh, logout: auth.logout
      }),
    onSuccess: (editedGymFromServer) => {
      queryClient.setQueryData(['gym', selectedGymId], editedGymFromServer);
    }
  });

  const [gym, setGym] = useState({
    name: '',
    chain: '',
    street: '',
    streetNumber: '',
    district: '',
    city: '',
    country: '',
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
          return handleSubmitError(err);
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
          return handleSubmitError(err);
        }
      }
    } catch (err: unknown) {
      return handleSubmitError(err);
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
      country,
      openingHoursExceptions,
      url,
      equipmentVisible,
      membershipsVisible,
      openingHoursVisible,
      notes
    } = gymQuery.data;

    setGym({
      name: name,
      chain: chain,
      street: street,
      streetNumber: streetNumber,
      district: district,
      city: city,
      country: country,
      url: url ?? '',
      equipmentVisible: equipmentVisible,
      membershipsVisible: membershipsVisible,
      openingHoursVisible: openingHoursVisible,
      notes: notes
    });

    if (openingHoursExceptions.data) {
      setExceptions(openingHoursExceptions.data);
    } else {
      setExceptions([]);
    }
  }

  if (editForm === 'equipment') {
    return (
      <GymEquipment
        gymId={selectedGymId}
        gymName={gym.name}
        setEditForm={setEditForm}
      />
    );
  }

  if (editForm === 'memberships') {
    return (
      <GymMemberships
        gymId={selectedGymId}
        gymName={gym.name}
        gymCountry={gym.country}
        gymChain={gym.chain}
        setEditForm={setEditForm}
      />
    );
  }

  // TODO post-1.0: return for editing managers

  return (
    <div className='flex flex-col min-h-0'>
      <h3 className='flex self-center text-base'>
        {/* formMode is either 'create' or 'edit' */}
        {formMode === 'create'
          ? iconMode
            ? <TbPlus className='text-2xl' />
            : 'create new gym'
          : iconMode
            ? (
              <span className='flex gap-1'>
                <TbEdit className='text-2xl' /> {gym.name}
              </span>
            )
            : <span className='text-center'>editing {gym.name}</span>}
      </h3>

      <div className='flex flex-col gap-3 px-3 overflow-y-scroll text-xs'>
        <form
          action={submitAction}
          className='flex flex-col gap-3'
        >
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col'>
              <label htmlFor='name'>name*</label>
              <input
                id='name'
                name='name'
                type='text'
                value={gym.name}
                required
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, name: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='chain'>chain</label>
              <input
                id='chain'
                name='chain'
                type='text'
                value={gym.chain}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, chain: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='street'>street*</label>
              <input
                id='street'
                name='street'
                type='text'
                value={gym.street}
                required
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, street: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='streetNumber'>street number*</label>
              <input
                id='streetNumber'
                name='streetNumber'
                type='text'
                value={gym.streetNumber}
                required
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, streetNumber: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='city'>city*</label>
              <input
                id='city'
                name='city'
                type='text'
                value={gym.city}
                required
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, city: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='district'>district*</label>
              <input
                id='district'
                name='district'
                type='text'
                value={gym.district}
                required
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, district: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='country'>country*</label>
              <input
                id='country'
                name='country'
                type='text'
                value={gym.country}
                required
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, country: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='url'>url</label>
              <input
                id='url'
                name='url'
                type='url'
                value={gym.url}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, url: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='notes'>notes</label>
              <textarea
                id='notes'
                name='notes'
                value={gym.notes}
                className={FORM_INPUT_CLASSES}
                onChange={(event) => {
                  setGym({ ...gym, notes: event.target.value });
                }}
              />
            </div>

            <p>* = required</p>
          </div>

          <div className='flex flex-col gap-1'>
            <h4 className='text-sm font-bold'>regular opening hours</h4>
            <div>
              <h5>everyone</h5>
              <div className='flex flex-row gap-10'>
                <div className='flex flex-col gap-1'>
                  <OpeningHoursDayInput
                    group='everyone'
                    day='MO'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='TU'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='WE'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='TH'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                  />
                </div>
                <div className='flex flex-col justify-center gap-1'>
                  <OpeningHoursDayInput
                    group='everyone'
                    day='FR'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='SA'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                  />
                  <OpeningHoursDayInput
                    group='everyone'
                    day='SU'
                    editedHours={gymQuery.data?.openingHoursEveryone}
                  />
                </div>
              </div>
            </div>
            <div>
              <h5>members</h5>
              <div className='flex flex-row gap-10'>
                <div className='flex flex-col gap-1'>
                  <OpeningHoursDayInput
                    group='members'
                    day='MO'
                    editedHours={gymQuery.data?.openingHoursMembers}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='TU'
                    editedHours={gymQuery.data?.openingHoursMembers}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='WE'
                    editedHours={gymQuery.data?.openingHoursMembers}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='TH'
                    editedHours={gymQuery.data?.openingHoursMembers}
                  />
                </div>
                <div className='flex flex-col justify-center gap-1'>
                  <OpeningHoursDayInput
                    group='members'
                    day='FR'
                    editedHours={gymQuery.data?.openingHoursMembers}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='SA'
                    editedHours={gymQuery.data?.openingHoursMembers}
                  />
                  <OpeningHoursDayInput
                    group='members'
                    day='SU'
                    editedHours={gymQuery.data?.openingHoursMembers}
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
                hidden={formMode === 'create'}
                onChange={() => {
                  setGym({ ...gym, equipmentVisible: !gym.equipmentVisible });
                }}
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
                hidden={formMode === 'create'}
                onChange={() => {
                  setGym({
                    ...gym, membershipsVisible: !gym.membershipsVisible
                  });
                }}
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
          {/* Actual submit button is below <OpeningHoursExceptions />. */}
          <input
            type='submit'
            id='submit-form'
            disabled={isPending}
            className='hidden'
          />
        </form>

        <OpeningHoursExceptions
          exceptions={exceptions} setExceptions={setExceptions}
        />

        {/* Actual submit button outside the <form>
        to have <OpeningHoursExceptions /> appear as part of the form.
        Keep this button identical with SubmitButton used by the other forms!*/}
        <label
          htmlFor='submit-form'
          tabIndex={0} /* make this tab-selectable */
          className={`
          flex justify-center border border-black dark:border-white
          bg-green dark:bg-green-dark px-3 w-full
          text-primary-text dark:text-primary-text-dark text-base
          hover:border-white hover:dark:border-black
          active:border-white active:dark:border-black active:font-bold
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
            <div className='self-center text-red-dark dark:text-red'>
              {state.error}
            </div>
          )
          : null}


        {formMode === 'edit'
          ? <hr />
          : null}

        <div className='flex flex-col gap-1 pb-3'>
          {formMode === 'edit'
            ? (
              <>
                <button
                  className='
                  border bg-tertiary dark:bg-tertiary-dark py-1 cursor-pointer
                  hover:bg-background dark:hover:bg-background-dark
                  active:font-bold'
                  onClick={() => {
                    setEditForm('equipment');
                  }}
                >
                  edit equipment
                </button>
                <button
                  className='
                  border bg-tertiary dark:bg-tertiary-dark py-1 cursor-pointer
                  hover:bg-background dark:hover:bg-background-dark
                  active:font-bold'
                  onClick={() => {
                    setEditForm('memberships');
                  }}
                >
                  edit memberships
                </button>
                <button
                  disabled /* TODO: upcoming post-1.0 feature */
                  className='
                  border bg-tertiary dark:bg-tertiary-dark py-1
                  text-red-700 dark:text-red-400
                  cursor-not-allowed enabled:cursor-pointer
                  enabled:hover:bg-background
                  enabled:dark:hover:bg-background-dark
                  enabled:active:font-bold'
                >
                  edit managers
                </button>
              </>
            )
            : null}

          <ReturnButton
            queryToInvalidate={['gymsIdAndName']} setFormMode={setFormMode}
          />
        </div>
      </div>
    </div>
  );
}
