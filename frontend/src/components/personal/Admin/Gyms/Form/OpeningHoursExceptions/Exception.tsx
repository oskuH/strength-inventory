import { type OpeningHoursException } from '@strength-inventory/schemas';

interface ExceptionProps {
  exception: OpeningHoursException
  selectedExceptionId: string
  setSelectedExceptionId: React.Dispatch<React.SetStateAction<string>>
}

export default function Exception ({
  exception, selectedExceptionId, setSelectedExceptionId
}: ExceptionProps) {
  const { id, date, hours, reason, concernsMembers } = exception;

  return (
    <button
      aria-pressed={id === selectedExceptionId}
      className='
      flex flex-col min-w-full
      aria-pressed:bg-gray-300 dark:aria-pressed:bg-gray-600 text-left'
      onClick={() => {
        setSelectedExceptionId(id);
      }}
    >
      <span className='flex flex-col md:flex-row md:gap-2'>
        <span>{date.toLocaleDateString('en-GB')}</span>
        <span>{hours[0]}-{hours[1]}</span>
        {concernsMembers
          ? <span>Members: yes</span>
          : <span>Members: no</span>}
      </span>
      <span className=''>Reason: {reason}</span>
    </button>
  );
}
