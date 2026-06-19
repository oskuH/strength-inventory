// used by GymEquipment and GymMemberships/List

import { FORM_RETURN_BUTTON_CLASSES } from '../../../../../constants/theme';

interface EditFormReturnButtonProps {
  model: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function EditFormReturnButton (
  { model, setEditForm, setParentNotification }: EditFormReturnButtonProps
) {
  return (
    <button
      className={FORM_RETURN_BUTTON_CLASSES}
      onClick={() => {
        setEditForm('');
        setTimeout(() => {
          setParentNotification({
            type: 'info', message: `${model} have been saved`
          });
        }, 150);
      }}
    >
      return
    </button>
  );
}
