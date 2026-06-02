// used by EquipmentForm and MembershipForm

/* GymForm's submit button is largely a clone
that needs to be updated manually! */

interface SubmitButtonProps {
  formMode: string
  isPending: boolean
  error: string | null
}

export default function SubmitButton (
  { formMode, isPending, error }: SubmitButtonProps
) {
  return (
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
        bg-green dark:bg-green-dark px-3 w-full
        text-primary-text dark:text-primary-text-dark text-base
        hover:border-white hover:dark:border-black
        active:border-white active:dark:border-black active:font-bold
        ${!isPending
      ? 'cursor-pointer'
      : 'cursor-progress'
    }`}
      />

      {error
        ? (
          <div className='self-center text-red-dark dark:text-red'>
            {error}
          </div>
        )
        : null}
    </div>
  );
}
