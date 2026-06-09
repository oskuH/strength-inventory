// work in progress

import Day from './Day';

import type { GymGet } from '@strength-inventory/schemas';

interface NextSevenDaysProps {
  gym: GymGet
  membersOnly: boolean
  setExceptionReason: React.Dispatch<React.SetStateAction<string>>
}

export default function NextSevenDays ({
  gym, membersOnly, setExceptionReason
}: NextSevenDaysProps) {
  const mockException = {
    id: '4e0f7e8b-09d1-4df4-8fc7-d5c25717dcdb',
    date: new Date('2026-06-11'),
    hours: [5, 21],
    reason: 'Redi closes early.',
    concernsMembers: true
  };

  const openingHours = {
    MO: '5-15',
    TU: '5-15',
    WE: '5-15',
    TH: '5-15',
    FR: '5-15',
    SA: '5-15',
    SU: '5-15'
  };

  type day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
  const days: day[] = [
    'TU', 'WE', 'TH', 'FR', 'SA', 'SU', 'MO'
  ];
  const exceptions: (string | undefined)[] = [
    undefined,
    undefined,
    mockException.reason,
    undefined,
    undefined,
    undefined,
    undefined
  ];

  return (
    <div className='flex w-full divide-x'>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day={days[0]}
          hours={openingHours[days[0]]}
          highlighted={true}
          exception={exceptions[0]}
          setExceptionReason={setExceptionReason}
        />
      </div>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day={days[1]}
          hours={openingHours[days[1]]}
          highlighted={false}
          exception={exceptions[1]}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day={days[2]}
          hours={mockException.hours.join('-')}
          highlighted={false}
          exception={exceptions[2]}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day={days[3]}
          hours={openingHours[days[3]]}
          highlighted={false}
          exception={exceptions[3]}
          setExceptionReason={setExceptionReason}
        />
      </div>
      <div
        className='flex flex-col justify-center items-center gap-1 w-1/3'
      >
        <Day
          day={days[4]}
          hours={openingHours[days[4]]}
          highlighted={false}
          exception={exceptions[4]}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day={days[5]}
          hours={openingHours[days[5]]}
          highlighted={false}
          exception={exceptions[5]}
          setExceptionReason={setExceptionReason}
        />
        <Day
          day={days[6]}
          hours={openingHours[days[6]]}
          highlighted={false}
          exception={exceptions[6]}
          setExceptionReason={setExceptionReason}
        />
      </div>
    </div>
  );
}
