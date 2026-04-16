// work in progress
import GymForm from './GymForm';

interface ItemFormProps {
  formMode: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  model: string
}

export default function ItemForm (
  { formMode, setFormMode, model }: ItemFormProps
) {
  if (model === 'gym') {
    return (
      <GymForm formMode={formMode} setFormMode={setFormMode} />
    );
  }

  if (model === 'equipment') {
    return (
      <p>Form missing!</p>
    );
  }
}
