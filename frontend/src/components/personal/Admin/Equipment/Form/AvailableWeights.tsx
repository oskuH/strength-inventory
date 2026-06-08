import { useRef, useState } from 'react';

import { maxWeight } from '@strength-inventory/schemas';

interface AvailableWeightsProps {
  availableWeights: number[]
  setAvailableWeights: React.Dispatch<React.SetStateAction<number[]>>
  startingWeight: string
}

export default function AvailableWeights ({
  availableWeights, setAvailableWeights, startingWeight
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
    const updatedWeights = [...availableWeights, Number(newWeight)];
    updatedWeights.sort(compareNumbers);
    setAvailableWeights(updatedWeights);
  }

  let lowestRequirement: number | null = null;
  if (startingWeight) {
    lowestRequirement = Number(startingWeight);
  }

  return (
    <div className='flex flex-col'>
      <label>available weights</label>
      <div
        className={`
          flex flex-col gap-2 bg-tertiary dark:bg-tertiary-dark p-1
          ${lowestRequirement
          && lowestRequirement !== Math.min(...availableWeights)
      ? 'outline outline-red dark:outline-red-dark'
      : ''}`}
      >
        <div className='flex flex-wrap gap-3'>
          {availableWeights.map((weight) => (
            <button
              key={weight}
              className='
              border px-1 cursor-pointer
              hover:bg-red hover:dark:bg-red-dark'
              onClick={() => {
                const newWeights
                  = availableWeights
                    .filter((availableWeight) => availableWeight !== weight);
                setAvailableWeights(newWeights);
              }}
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
            max={maxWeight}
            step={0.01}
            className='bg-secondary dark:bg-secondary-dark w-20'
            onChange={(event) => {
              setNewWeight(event.target.value);
              const isMismatch
                = newWeightInputRef.current?.validity.stepMismatch;
              setIsInvalidStep(!!isMismatch);
            }}
          />
          <button
            type='button'
            disabled={
              !newWeight || isNewWeightInvalid() || isInvalidStep
            }
            className='
            border border-dotted enabled:border-double px-1
            cursor-not-allowed enabled:cursor-pointer
            enabled:border-black enabled:dark:border-white
            enabled:bg-green-700 enabled:dark:bg-green-500
            enabled:text-primary-text-dark enabled:dark:text-primary-text'
            onClick={() => {
              handleAddWeight();
            }}
          >
            add
          </button>
        </div>
      </div>
    </div>
  );
}
