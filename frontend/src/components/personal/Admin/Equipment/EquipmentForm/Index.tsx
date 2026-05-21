import { use, useActionState, useEffect, useRef, useState } from 'react';

import {
  skipToken, useMutation, useQuery, useQueryClient
} from '@tanstack/react-query';
import { TbEdit, TbPlus } from 'react-icons/tb';
import { z } from 'zod';

import { getPiece, postEquipment, putEquipment }
  from '../../../../../utils/api';
import { IconContext } from '../../../../../utils/contexts';

import AvailableWeights from './AvailableWeights';

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
  const iconMode = use(IconContext);

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

  /* React 19's useActionState has had a bug since its 2024 release
  where <select> fields to get reset after <form> submission.
  The useEffect below is a workaround by GitHub user danieltott:
  https://github.com/facebook/react/issues/29034#issuecomment-2843233452

  A PR fixing this issue has been open since November 2025:
  https://github.com/facebook/react/pull/35168 */
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    function watchReset (e: Event) {
      /* console.log('reset in react', e); */
      e.preventDefault();
    }
    const form = formRef.current;
    form?.addEventListener('reset', watchReset);

    return () => {
      form?.removeEventListener('reset', watchReset);
    };
  }, []);

  interface PieceProps {
    name: string,
    category: string,
    manufacturer: string,
    code: string,
    weightUnit: string,
    weight: string,
    startingWeight: string,
    maximumWeight: string,
    url: string,
    notes: string
  }

  const [piece, setPiece] = useState<PieceProps>({
    name: '',
    category: '',
    manufacturer: '',
    code: '',
    weightUnit: '',
    weight: '',
    startingWeight: '',
    maximumWeight: '',
    url: '',
    notes: ''
  });

  /* Available weights are rendered as part of the form,
  but logically they have their separate state which is merged
  with the form data in submit() */
  const [availableWeights, setAvailableWeights]
    = useState<number[] | undefined>();

  const [state, submitAction, isPending] = useActionState(submit, {
    success: true,
    error: null
  });

  interface State {
    success: boolean
    error: string | null
  }

  async function submit (_previousState: State, formData: FormData) {
    const req = Object.fromEntries(formData.entries());

    try {
      const validatedFormData
        = EquipmentPostAndPutSchema.omit({ availableWeights: true })
          .parse(req);
      const validatedAvailableWeights
        = EquipmentPostAndPutSchema.pick({ availableWeights: true })
          .parse({ availableWeights: availableWeights });
      const validatedPiece
        = { ...validatedFormData, ...validatedAvailableWeights };

      if (!validatedPiece.weightUnit
        && (validatedPiece.weight
          || (validatedPiece.availableWeights
            && validatedPiece.availableWeights.length > 0)
          || validatedPiece.startingWeight
          || validatedPiece.maximumWeight
        )) {
        return {
          success: false,
          error: 'weight unit required'
        };
      }
      if (formMode === 'create') {
        try {
          await postMutation.mutateAsync(validatedPiece);
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
            id: selectedPieceId, updatedPiece: validatedPiece
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

  if (selectedPieceId && pieceQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (selectedPieceId && pieceQuery.isError) {
    return <p>Error: {pieceQuery.error.message}</p>;
  }

  /* Initialize the form fields when opened in edit mode.
  selectedPieceId is only defined in edit mode.
  Moreover, !availableWeights evaluates truthy only on the first render
  because a few lines below it is guaranteed to be defined. */
  if (pieceQuery.isSuccess && !availableWeights) {
    const {
      name,
      category,
      manufacturer,
      code,
      weightUnit,
      weight,
      startingWeight,
      availableWeights,
      maximumWeight,
      url,
      notes
    } = pieceQuery.data;

    setPiece({
      name: name,
      category: category,
      manufacturer: manufacturer,
      code: code,
      weightUnit: weightUnit ?? '',
      weight: weight
        ? String(weight)
        : '',
      startingWeight: startingWeight
        ? String(startingWeight)
        : '',
      maximumWeight: maximumWeight
        ? String(maximumWeight)
        : '',
      url: url ?? '',
      notes: notes
    });

    if (availableWeights) {
      setAvailableWeights(availableWeights);
    } else {
      setAvailableWeights([]);
    }
  }

  if (!selectedPieceId && !availableWeights) {
    setAvailableWeights([]);
  }

  return (
    <div className='flex flex-col min-h-0'>
      {/* second-highest <div> with px-3 ensures that
      the scrollbar stays clear of content */}
      <div className='flex flex-col gap-3 px-3 pb-3 text-xs'>
        <h3 className='flex justify-center text-base'>
          {formMode === 'create'
            ? iconMode
              ? <TbPlus className='text-2xl' />
              : 'create new equipment'
            : iconMode
              ? (
                <span className='flex gap-1'>
                  <TbEdit className='text-2xl' /> {piece.name}
                </span>
              )
              : <span>editing {piece.name}</span>}
        </h3>

        <form
          action={submitAction}
          ref={formRef}
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
                value={piece.name}
                required
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setPiece({ ...piece, name: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='category'>
                category*
              </label>
              <select
                id='category'
                name='category'
                value={piece.category}
                required
                className='
                border bg-tertiary dark:bg-tertiary-dark pl-1 cursor-pointer'
                onChange={(event) => {
                  setPiece({ ...piece, category: event.target.value });
                }}
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
                value={piece.manufacturer}
                required
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setPiece({ ...piece, manufacturer: event.target.value });
                }}
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
                value={piece.code}
                required
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setPiece({ ...piece, code: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='weightUnit'>
                weight unit
              </label>
              <select
                id='weightUnit'
                name='weightUnit'
                value={piece.weightUnit}
                className='
                border bg-tertiary dark:bg-tertiary-dark pl-1 cursor-pointer'
                onChange={(event) => {
                  setPiece({ ...piece, weightUnit: event.target.value });
                }}
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
                value={piece.weight}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setPiece({ ...piece, weight: event.target.value });
                }}
              />
            </div>

            {/* This ternary signals TS that availableWeights is defined.
            The colon case should never happen in practice. */}
            {availableWeights
              ? (
                <AvailableWeights
                  availableWeights={availableWeights}
                  setAvailableWeights={setAvailableWeights}
                />
              )
              : null}

            <div className='flex flex-col'>
              <label htmlFor='startingWeight'>
                starting weight
              </label>
              <input
                id='startingWeight'
                name='startingWeight'
                type='number'
                value={piece.startingWeight}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setPiece({ ...piece, startingWeight: event.target.value });
                }}
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
                value={piece.maximumWeight}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setPiece({ ...piece, maximumWeight: event.target.value });
                }}
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
                value={piece.url}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setPiece({ ...piece, url: event.target.value });
                }}
              />
            </div>

            <div className='flex flex-col'>
              <label htmlFor='notes'>
                notes
              </label>
              <textarea
                id='notes'
                name='notes'
                value={piece.notes}
                className='border bg-tertiary dark:bg-tertiary-dark pl-1'
                onChange={(event) => {
                  setPiece({ ...piece, notes: event.target.value });
                }}
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
                hover:border-white hover:dark:border-black
                active:border-white active:dark:border-black active:font-bold
                ${!isPending
      ? 'cursor-pointer'
      : 'cursor-progress'
    }`}
              />

              {state.error
                ? (
                  <div className='self-center text-red-700 dark:text-red-400'>
                    {state.error}
                  </div>
                )
                : null}
            </div>
          </div>
        </form>
        <button
          className={`
          self-center border bg-tertiary dark:bg-tertiary-dark py-1
          w-9/10 cursor-pointer
          hover:bg-background dark:hover:bg-background-dark
          active:font-bold
          ${formMode === 'edit'
      ? 'mt-3'
      : ''
    }`}
          onClick={() => {
            void queryClient.invalidateQueries(
              { queryKey: ['equipmentIdAndName'] }
            );
            setFormMode('hidden');
          }}
        >
          return without saving
        </button>
      </div>
    </div>
  );
}
