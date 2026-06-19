// used by EquipmentForm and MembershipForm

/* GymForm's submit buttons are largely clones
that need to be updated manually! */

interface SubmitButtonProps {
  formMode: string
  isPending: boolean
}

export default function SubmitButton (
  { formMode, isPending }: SubmitButtonProps
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
          flex justify-center border
          bg-green dark:bg-green-dark px-3 w-full
          text-primary-text dark:text-primary-text-dark text-base
          hover:border-white dark:hover:border-black
          active:border-white dark:active:border-black active:font-bold
        ${!isPending
      ? 'cursor-pointer'
      : 'cursor-progress'
    }`}
      />
    </div>
  );
}
