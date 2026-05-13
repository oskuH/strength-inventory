// work in progress
import { useActionState, useState } from 'react';

import {
  skipToken, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import { z } from 'zod';

import { getPiece, postEquipment, putEquipment }
  from '../../../../../utils/api';

import { type EquipmentPostAndPut, EquipmentPostAndPutSchema }
  from '@strength-inventory/schemas';

interface EquipmentFormProps {
  formMode: string;
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
  selectedPieceId: string;
  setSelectedPieceId: React.Dispatch<React.SetStateAction<string>>;
}

export default function EquipmentForm (
  { formMode, setFormMode, selectedPieceId, setSelectedPieceId }:
  EquipmentFormProps
) {
  const queryClient = useQueryClient();

  const pieceQuery = useQuery({
    queryKey: ['piece', selectedPieceId],
    queryFn: selectedPieceId
      ? () => getPiece({ id: selectedPieceId })
      : skipToken  // disable this query when creating a new piece
  });

  const postMutation = useMutation({
    mutationFn: (newPiece: EquipmentPostAndPut) =>
      postEquipment({ piece: newPiece }),
    onSuccess: (newPieceFromServer) => {
      setSelectedPieceId(newPieceFromServer.id);
      setFormMode('edit');
    }
  });

  const putMutation = useMutation({
    mutationFn: ({ id, updatedPiece }:
    { id: string, updatedPiece: EquipmentPostAndPut }) =>
      putEquipment({ id: id, piece: updatedPiece }),
    onSuccess: (editedPieceFromServer) => {
      queryClient
        .setQueryData(['piece', selectedPieceId], editedPieceFromServer);
    }
  });

  const [state, submitAction, isPending] = useActionState(submit, {
    success: false,
    error: null,
    /* submitFailed is used by form fields to determine whether
    to use state variables as default values */
    submitFailed: false,
    name: '',
    category: '',
    manufacturer: '',
    code: '',
    weightUnit: '',
    weight: undefined,
    startingWeight: undefined,
    availableWeights: [],
    maximumWeight: undefined,
    url: '',
    notes: ''
  });

  interface State {
    success: boolean
    error: string | null
    submitFailed: boolean
    name: string
    category: string
    manufacturer: string
    code: string
    weightUnit: string | undefined
    weight: number | undefined
    startingWeight: number | undefined
    availableWeights: number[] | undefined
    maximumWeight: number | undefined
    url: string | undefined
    notes: string | undefined
  }

  async function submit (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const validatedEquipment = EquipmentPostAndPutSchema.parse(req);
      if (formMode === 'create') {
        try {
          await postMutation.mutateAsync(validatedEquipment);
          /* Upon a successful POST, state variables are returned
          empty because the form gets rerendered as an
          edit form with default values from pieceQuery.*/
          return {
            success: true,
            error: null,
            submitFailed: false,
            name: '',
            category: '',
            manufacturer: '',
            code: '',
            weightUnit: '',
            weight: undefined,
            startingWeight: undefined,
            availableWeights: [],
            maximumWeight: undefined,
            url: '',
            notes: ''
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
            name: validatedEquipment.name,
            category: validatedEquipment.category,
            manufacturer: validatedEquipment.manufacturer,
            code: validatedEquipment.code,
            weightUnit: validatedEquipment.weightUnit,
            weight: validatedEquipment.weight,
            startingWeight: validatedEquipment.startingWeight,
            availableWeights: validatedEquipment.availableWeights,
            maximumWeight: validatedEquipment.maximumWeight,
            url: validatedEquipment.url,
            notes: validatedEquipment.notes
          };
        }
      } else {  // formMode === 'edit'
        try {
          await putMutation.mutateAsync({
            id: selectedPieceId, updatedPiece: validatedEquipment
          });
          return {
            success: true,
            error: null,
            submitFailed: false,
            name: validatedEquipment.name,
            category: validatedEquipment.category,
            manufacturer: validatedEquipment.manufacturer,
            code: validatedEquipment.code,
            weightUnit: validatedEquipment.weightUnit,
            weight: validatedEquipment.weight,
            startingWeight: validatedEquipment.startingWeight,
            availableWeights: validatedEquipment.availableWeights,
            maximumWeight: validatedEquipment.maximumWeight,
            url: validatedEquipment.url,
            notes: validatedEquipment.notes
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
            name: validatedEquipment.name,
            category: validatedEquipment.category,
            manufacturer: validatedEquipment.manufacturer,
            code: validatedEquipment.code,
            weightUnit: validatedEquipment.weightUnit,
            weight: validatedEquipment.weight,
            startingWeight: validatedEquipment.startingWeight,
            availableWeights: validatedEquipment.availableWeights,
            maximumWeight: validatedEquipment.maximumWeight,
            url: validatedEquipment.url,
            notes: validatedEquipment.notes
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
        category: formData.get('category') as string,
        manufacturer: formData.get('manufacturer') as string,
        code: formData.get('code') as string,
        weightUnit: formData.get('weightUnit') as string,
        weight:
        formData.get('weight') as unknown as number,
        startingWeight:
        formData.get('startingWeight') as unknown as number,
        availableWeights:
        formData.get('availableWeights') as unknown as number[],
        maximumWeight:
        formData.get('maximumWeight') as unknown as number,
        url: formData.get('url') as string,
        notes: formData.get('notes') as string
      };
    }
  }

  if (selectedPieceId && pieceQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (selectedPieceId && pieceQuery.isError) {
    return <p>Error: {pieceQuery.error.message}</p>;
  }

  const editedPiece = pieceQuery.data;

  return (
    <div className='flex flex-col min-h-0'>
      {/* second-highest <div> with px-3 ensures that
      the scrollbar stays clear of content */}
      <div className='flex flex-col gap-3 px-3 text-xs'>
        <h3 className='flex justify-center text-base'>
          {formMode === 'create'
            ? 'create new equipment'
            : <span>editing {editedPiece?.name}</span>}
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
                  : editedPiece?.name}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='category'>
                category*
              </label>
              <select
                id='category'
                name='category'
                defaultValue={state.submitFailed
                  ? state.category
                  : editedPiece?.category}
                className='
                border bg-tertiary dark:bg-tertiary-dark pl-1 cursor-pointer'
                required
              >
                <option value=''>-- please choose a category --</option>
                <option value='system'>system</option>
                <option value='freeWeight'>free weight</option>
                <option value='handleAttachment'>handle attachment</option>
                <option value='strengthMachine'>strength machine</option>
                <option value='cardio'>cardio</option>
                <option value='accessoryOrTool'>accessory or tool</option>
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='manufacturer'>
                manufacturer*
              </label>
              <input
                id='manufacturer'
                name='manufacturer'
                type='text'
                defaultValue={state.submitFailed
                  ? state.manufacturer
                  : editedPiece?.manufacturer}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='code'>
                code*
              </label>
              <input
                id='code'
                name='code'
                type='text'
                defaultValue={state.submitFailed
                  ? state.code
                  : editedPiece?.code}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                required
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='weightUnit'>
                weight unit {/* TODO add star if weights given */}
              </label>
              <select
                id='weightUnit'
                name='weightUnit'
                defaultValue={state.submitFailed
                  ? state.weightUnit
                  : editedPiece?.weightUnit}
                className='
                border bg-tertiary dark:bg-tertiary-dark pl-1 cursor-pointer'
                required  /* TODO make conditional */
              >
                <option value=''>-- weight unit for values below --</option>
                <option value='kg'>kilograms</option>
                <option value='lbs'>pounds</option>
              </select>
            </div>

            <div className='flex flex-col'>
              <label htmlFor='weight'>
                weight
              </label>
              <input
                id='weight'
                name='weight'
                type='number'
                defaultValue={state.submitFailed
                  ? state.weight
                  : editedPiece?.weight}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='startingWeight'>
                starting weight
              </label>
              <input
                id='startingWeight'
                name='startingWeight'
                type='number'
                defaultValue={state.submitFailed
                  ? state.startingWeight
                  : editedPiece?.startingWeight}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='maximumWeight'>
                maximum weight
              </label>
              <input
                id='maximumWeight'
                name='maximumWeight'
                type='number'
                defaultValue={state.submitFailed
                  ? state.maximumWeight
                  : editedPiece?.maximumWeight}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
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
                  : editedPiece?.url}
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
                  : editedPiece?.notes}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
              />
            </div>

            <p>* = required</p>

            <div className='flex flex-col'>
              <input
                type='submit'
                value={formMode === 'create'
                  ? !isPending
                    ? 'create'
                    : 'creating...'
                  : !isPending
                    ? 'save'
                    : 'saving...'}
                disabled={isPending}
                className={`
                flex justify-center border border-black dark:border-white
                bg-green-700 dark:bg-green-500 px-3 w-full
                text-primary-text-dark dark:text-primary-text text-base
                hover:border-white hover:dark:border-black active:font-bold
                ${!isPending
      ? 'cursor-pointer'
      : 'cursor-progress'
    }`}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
