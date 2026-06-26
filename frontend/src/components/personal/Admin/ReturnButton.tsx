// used by all admin base forms

import { useQueryClient } from '@tanstack/react-query';

import { FORM_RETURN_BUTTON_CLASSES } from '../../../constants/theme';

interface ReturnButtonProps {
  queriesToInvalidate: string[][]
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
  unsavedChanges: boolean
}

export default function ReturnButton (
  { queriesToInvalidate, setFormMode, unsavedChanges }: ReturnButtonProps
) {
  const queryClient = useQueryClient();

  return (
    <button
      className={FORM_RETURN_BUTTON_CLASSES}
      onClick={() => {
        queriesToInvalidate.map((query) =>
          void queryClient.invalidateQueries(
            { queryKey: query }
          ));
        setFormMode('hidden');
      }}
    >
      {unsavedChanges
        ? 'return without saving'
        : 'return'}
    </button>
  );
}
