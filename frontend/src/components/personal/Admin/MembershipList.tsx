import type { Membership } from '@strength-inventory/schemas';

interface MembershipListProps {
  memberships: Membership[]
  filterType: string
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
}

export default function MembershipList ({
  memberships, filterType, setFormMode, setSelectedMembershipId
}: MembershipListProps) {
  if (memberships.length === 0) {
    return (
      <div className='min-w-full bg-background dark:bg-background-dark'>
        <p className='p-1 text-center'>
          the selected {filterType} does not have memberships
        </p>
        <hr />
        <button
          className='
            flex flex-col min-w-full p-1
            hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
          onClick={() => {
            setFormMode('create');
          }}
        >
          add new membership
        </button>
        <hr />
      </div>
    );
  }

  return (
    <ol
      className='bg-background dark:bg-background-dark min-w-full'
    >
      {memberships.map((membership) => (
        <li
          key={membership.id}
          className='flex flex-col min-w-full'
        >
          <button
            className='
            flex flex-col min-w-full p-1
            hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
            onClick={() => {
              setFormMode('edit');
              setSelectedMembershipId(membership.id);
            }}
          >
            <h3 className='flex truncate'>{membership.name}</h3>
            <div className='flex text-xs'>
              <span className='flex w-20'>
                {membership.membershipFee} {membership.feeCurrency}
              </span>
              <span className='flex w-20'>
                per {membership.validity} {membership.validityUnit}
              </span>
              {membership.commitment
                ? (
                  <span>
                    {/* eslint-disable-next-line @stylistic/max-len */}
                    {membership.commitment} {membership.commitmentUnit} commitment
                  </span>
                )
                : null}
            </div>
          </button>
          <hr />
        </li>
      ))}
      <li>
        <button
          className='
            flex flex-col min-w-full p-1
            hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
          onClick={() => {
            setSelectedMembershipId('');
            setFormMode('create');
          }}
        >
          add new membership
        </button>
        <hr />
      </li>
    </ol>
  );
}
