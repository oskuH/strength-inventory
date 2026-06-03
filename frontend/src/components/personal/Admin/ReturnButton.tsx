// used by all admin base forms

import { useQueryClient } from '@tanstack/react-query';

import { FORM_RETURN_BUTTON_CLASSES } from '../../../constants/theme';

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
      className={FORM_RETURN_BUTTON_CLASSES}
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
