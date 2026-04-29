// work in progress
import GymForm from './GymForm/Index';

interface ItemFormProps {
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  model: string
  selectedItemId: string
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>
}

export default function ItemForm (
  {
    formMode, setFormMode, model, selectedItemId, setSelectedItemId
  }: ItemFormProps
) {
  if (model === 'gym') {
    return (
      <GymForm
        formMode={formMode}
        setFormMode={setFormMode}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
      />
    );
  }

  if (model === 'equipment') {
    return (
      <p>Form missing!</p>
    );
  }
}
