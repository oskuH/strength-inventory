// work in progress
interface EquipmentProps {
  selectedItemId: string
  gymName: string
  setEditForm: React.Dispatch<React.SetStateAction<string>>
}

export default function Equipment (
  { selectedItemId, gymName, setEditForm }: EquipmentProps
) {
  return (
    <div>
      <span>Editing equipment for {gymName}</span>
      <button
        onClick={() => {
          setEditForm('');
        }}
      >
        return
      </button>
    </div>
  );
}
