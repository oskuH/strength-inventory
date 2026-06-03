// used by GymEquipment and GymMemberships/List

import { FORM_RETURN_BUTTON_CLASSES } from '../../../../../constants/theme';

export default function EditFormReturnButton (
  { setEditForm }: { setEditForm: React.Dispatch<React.SetStateAction<string>> }
) {
  return (
    <button
      className={FORM_RETURN_BUTTON_CLASSES}
      onClick={() => {
        setEditForm('');
      }}
    >
      return
    </button>
  );
}
