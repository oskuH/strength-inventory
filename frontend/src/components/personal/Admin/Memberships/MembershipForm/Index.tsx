// work in progress

// todo: invalidate membershipsByCountry upon submit
import { use, useActionState, useState } from 'react';

import { skipToken, useMutation, useQuery, useQueryClient }
  from '@tanstack/react-query';
import { TbEdit, TbPlus } from 'react-icons/tb';

import { AuthContext, IconContext } from '../../../../../utils/contexts';
import {
  deleteMembership, getMembership, postMembership, putMembership
} from '../../../../../utils/api';

import AvailabilityButton from './AvailabilityButton';

interface MembershipFormProps {
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  selectedMembershipId: string
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  country: string
  chain: string
}

/* This type is explicitly defined for AvailabilityButtons.
The membership state in MembershipForm would be fine without. */
export interface FormMembership {
  name: string,
  initiationFee: string,
  membershipFee: string,
  feeCurrency: string,
  validity: string,
  validityUnit: string,
  commitment: string,
  commitmentUnit: string,
  availability: {
    Desk: boolean,
    Web: boolean,
    App: boolean,
    Other: boolean
  },
  url: string,
  notes: string
}

export default function MembershipForm (
  {
    formMode,
    setFormMode,
    selectedMembershipId,
    setSelectedMembershipId,
    country,
    chain
  }: MembershipFormProps
) {
  const auth = use(AuthContext);
  const iconMode = use(IconContext);

  const queryClient = useQueryClient();

  const membershipQuery = useQuery({
    queryKey: ['membership', selectedMembershipId],
    queryFn: selectedMembershipId
      ? () => getMembership({ id: selectedMembershipId })
      : skipToken
  });

  const [membership, setMembership] = useState<FormMembership>({
    name: '',
    initiationFee: '',
    membershipFee: '',
    feeCurrency: '',
    validity: '',
    validityUnit: '',
    commitment: '',
    commitmentUnit: '',
    availability: {
      Desk: false,
      Web: false,
      App: false,
      Other: false
    },
    url: '',
    notes: ''
  });

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
    console.log(req);
  }

  if (selectedMembershipId && membershipQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (selectedMembershipId && membershipQuery.isError) {
    return <p>Error: {membershipQuery.error.message}</p>;
  }

  /* Initialize the form fields when opened in edit mode.
  selectedMembershipId is only defined in edit mode. */
  if (selectedMembershipId && membershipQuery.isSuccess) {
    const {
      name,
      initiationFee,
      membershipFee,
      feeCurrency,
      validity,
      validityUnit,
      commitment,
      commitmentUnit,
      availability,
      url,
      notes
    } = membershipQuery.data;

    setMembership({
      name: name,
      initiationFee: initiationFee
        ? String(initiationFee)
        : '',
      membershipFee: membershipFee
        ? String(membershipFee)
        : '',
      feeCurrency: feeCurrency,
      validity: validity
        ? String(validity)
        : '',
      validityUnit: validityUnit,
      commitment: commitment
        ? String(commitment)
        : '',
      commitmentUnit: commitmentUnit ?? '',
      availability: availability,
      url: url ?? '',
      notes: notes
    });
  }

  return (
    <div className='flex flex-col min-h-0'>
      {/* second-highest <div> with px-3 ensures that
      the scrollbar stays clear of content */}
      <div className='flex flex-col gap-3 px-3 text-xs'>
        <h3 className='flex justify-center text-base'>
          {/* formMode is either 'create' or 'edit' */}
          {formMode === 'create'
            ? iconMode
              ? <TbPlus className='text-2xl' />
              : 'create new membership'
            : iconMode
              ? (
                <span className='flex gap-1'>
                  <TbEdit className='text-2xl' /> {membership.name}
                </span>
              )
              : <span>editing {membership.name}</span>}
        </h3>
        <div className='flex flex-col gap-1'>
          <p className='flex'>
            <span className='w-15'>country:</span> {country}
          </p>

          <p className='flex'>
            <span className='w-15'>chain:</span> {chain}
          </p>

          <form action={submitAction} className='flex flex-col gap-1'>
            <div className='flex flex-col'>
              <label htmlFor='name'>name*</label>
              <input
                id='name'
                name='name'
                type='text'
                value={membership.name}
                required
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setMembership({ ...membership, name: event.target.value });
                }}
              />
            </div>

            <div className='flex gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='membershipFee'>membership fee*</label>
                <input
                  id='membershipFee'
                  name='membershipFee'
                  type='number'
                  value={membership.membershipFee}
                  required
                  min={0.01}
                  step={0.01}
                  className='border bg-tertiary dark:bg-tertiary-dark pl-1 w-25'
                  onChange={(event) => {
                    setMembership(
                      { ...membership, membershipFee: event.target.value }
                    );
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='initiationFee'>initiation fee</label>
                <input
                  id='initiationFee'
                  name='initiationFee'
                  type='number'
                  value={membership.initiationFee}
                  min={0.01}
                  step={0.01}
                  className='border bg-tertiary dark:bg-tertiary-dark pl-1 w-25'
                  onChange={(event) => {
                    setMembership(
                      { ...membership, initiationFee: event.target.value }
                    );
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='feeCurrency'>currency*</label>
                <select
                  id='feeCurrency'
                  name='feeCurrency'
                  value={membership.feeCurrency}
                  required
                  className='
                  border bg-tertiary dark:bg-tertiary-dark pl-1 cursor-pointer'
                  onChange={(event) => {
                    setMembership(
                      { ...membership, feeCurrency: event.target.value }
                    );
                  }}
                >
                  <option value='' />
                  <option value='DKK'>DKK</option>
                  <option value='EUR'>EUR</option>
                  <option value='ISK'>ISK</option>
                  <option value='NOK'>NOK</option>
                  <option value='SEK'>SEK</option>
                </select>
              </div>
            </div>

            <div className='flex gap-3'>
              <div className='flex gap-1'>
                <div className='flex flex-col'>
                  <label htmlFor='validity'>validity*</label>
                  <input
                    id='validity'
                    name='validity'
                    type='number'
                    value={membership.validity}
                    required
                    min={1}
                    step={1}
                    className='
                    border bg-tertiary dark:bg-tertiary-dark pl-1 w-15'
                    onChange={(event) => {
                      setMembership(
                        { ...membership, validity: event.target.value }
                      );
                    }}
                  />
                </div>
                <select
                  id='validityUnit'
                  name='validityUnit'
                  value={membership.validityUnit}
                  required
                  className='
                  self-end border
                  bg-tertiary dark:bg-tertiary-dark pl-1 cursor-pointer'
                  onChange={(event) => {
                    setMembership(
                      { ...membership, validityUnit: event.target.value }
                    );
                  }}
                >
                  <option value=''>-- unit* --</option>
                  <option value='hour'>hour(s)</option>
                  <option value='day'>day(s)</option>
                  <option value='week'>week(s)</option>
                  <option value='month'>month(s)</option>
                  <option value='year'>year(s)</option>
                </select>
              </div>

              <div className='flex gap-1'>
                <div className='flex flex-col'>
                  <label>commitment</label>
                  <div className='flex gap-1'>
                    <input
                      id='commitment'
                      name='commitment'
                      type='number'
                      value={membership.commitment}
                      required={membership.commitmentUnit !== ''}
                      min={1}
                      step={1}
                      className='
                      border bg-tertiary dark:bg-tertiary-dark pl-1 w-15'
                      onChange={(event) => {
                        setMembership(
                          { ...membership, commitment: event.target.value }
                        );
                      }}
                    />
                    <select
                      id='commitmentUnit'
                      name='commitmentUnit'
                      value={membership.commitmentUnit}
                      required={membership.commitment !== ''}
                      className='
                      self-end border
                      bg-tertiary dark:bg-tertiary-dark pl-1 cursor-pointer'
                      onChange={(event) => {
                        setMembership(
                          { ...membership, commitmentUnit: event.target.value }
                        );
                      }}
                    >
                      <option value=''>-- unit --</option>
                      <option value='hour'>hour(s)</option>
                      <option value='day'>day(s)</option>
                      <option value='week'>week(s)</option>
                      <option value='month'>month(s)</option>
                      <option value='year'>year(s)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-col'>
              <label>availability</label>
              <div className='flex gap-3'>
                <AvailabilityButton
                  availabilityType='desk'
                  selected={membership.availability.Desk}
                  setMembership={setMembership}
                />
                <AvailabilityButton
                  availabilityType='web'
                  selected={membership.availability.Web}
                  setMembership={setMembership}
                />
                <AvailabilityButton
                  availabilityType='app'
                  selected={membership.availability.App}
                  setMembership={setMembership}
                />
                <AvailabilityButton
                  availabilityType='other'
                  selected={membership.availability.Other}
                  setMembership={setMembership}
                />
              </div>
            </div>
            <p>* = required</p>
          </form>
        </div>
      </div>
    </div>
  );
}
