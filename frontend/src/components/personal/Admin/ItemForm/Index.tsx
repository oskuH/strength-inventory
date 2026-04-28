// work in progress
import GymForm from './GymForm/Index';

interface ItemFormProps {
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  model: string
  selectedItemId: string
}

export default function ItemForm (
  { formMode, setFormMode, model, selectedItemId }: ItemFormProps
) {
  if (model === 'gym') {
    return (
      <GymForm
        formMode={formMode}
        setFormMode={setFormMode}
        selectedItemId={selectedItemId}
      />
    );
  }

  if (model === 'equipment') {
    return (
      <p>Form missing!</p>
    );
  }
}
