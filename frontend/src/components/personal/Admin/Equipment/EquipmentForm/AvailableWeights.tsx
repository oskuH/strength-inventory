import { useRef, useState } from 'react';

interface AvailableWeightsProps {
  availableWeights: number[]
  setAvailableWeights:
  React.Dispatch<React.SetStateAction<number[] | undefined>>
}

export default function AvailableWeights ({
  availableWeights, setAvailableWeights
}: AvailableWeightsProps) {
  const [newWeight, setNewWeight] = useState('');
  const [isInvalidStep, setIsInvalidStep] = useState(false);

  const newWeightInputRef = useRef<HTMLInputElement>(null);

  function isNewWeightInvalid () {
    const weight = Number(newWeight);

    return (
      availableWeights.includes(weight) || weight <= 0
    );
  }

  function compareNumbers (a: number, b: number) {
    return a - b;
  }

  function handleAddWeight () {
    const updatedMockWeights = [...availableWeights, Number(newWeight)];
    updatedMockWeights.sort(compareNumbers);
    setAvailableWeights(updatedMockWeights);
  }

  return (
    <div className='flex flex-col'>
      <label>available weights</label>
      <div
        className='flex flex-col gap-2 bg-tertiary dark:bg-tertiary-dark p-1'
      >
        <div className='flex flex-wrap gap-3'>
          {availableWeights.map((weight) => (
            <button
              key={weight}
              onClick={() => {
                const newWeights
                  = availableWeights
                    .filter((availableWeight) => availableWeight !== weight);
                setAvailableWeights(newWeights);
              }}
              className='
              border px-1 cursor-pointer
              hover:bg-red-400 hover:dark:bg-red-800'
            >
              {weight}
            </button>
          ))}
        </div>
        <div className='flex gap-2'>
          <span>add weight:</span>
          <input
            id='new-weight'
            ref={newWeightInputRef}
            type='number'
            value={newWeight}
            min={0}
            step={0.001}
            onChange={(event) => {
              setNewWeight(event.target.value);
              const isMismatch
                = newWeightInputRef.current?.validity.stepMismatch;
              setIsInvalidStep(!!isMismatch);
            }}
            className='bg-secondary dark:bg-secondary-dark w-20'
          />
          <button
            type='button'
            onClick={() => {
              handleAddWeight();
            }}
            disabled={
              !newWeight || isNewWeightInvalid() || isInvalidStep
            }
            className='
            border border-dotted enabled:border-double px-1
            cursor-not-allowed enabled:cursor-pointer
            enabled:border-black enabled:dark:border-white
            enabled:bg-green-700 enabled:dark:bg-green-500
            enabled:text-primary-text-dark enabled:dark:text-primary-text'
          >
            add
          </button>
        </div>
      </div>
    </div>
  );
}
