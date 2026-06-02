// used by all admin forms

import { useQueryClient } from '@tanstack/react-query';

interface ReturnButtonProps {
  queryToInvalidate: string[]
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
}

export default function ReturnButton (
  { queryToInvalidate, setFormMode }: ReturnButtonProps
) {
  const queryClient = useQueryClient();

  return (
    <button
      className='
      self-center border bg-tertiary dark:bg-tertiary-dark py-1
      w-9/10 cursor-pointer
      hover:bg-background dark:hover:bg-background-dark
      active:font-bold'
      onClick={() => {
        void queryClient.invalidateQueries(
          { queryKey: queryToInvalidate }
        );
        setFormMode('hidden');
      }}
    >
      return without saving
    </button>
  );
}
