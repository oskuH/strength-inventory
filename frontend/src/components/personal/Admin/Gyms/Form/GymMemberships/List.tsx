import EditFormReturnButton from '../EditFormReturnButton';
import MembershipList from '../../../MembershipList';

import type { Membership } from '@strength-inventory/schemas';

interface ListProps {
  memberships: Membership[]
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  setEditForm: React.Dispatch<React.SetStateAction<string>>
}

export default function List ({
  memberships, setFormMode, setSelectedMembershipId, setEditForm
}: ListProps) {
  return (
    <div className='flex flex-1 flex-col gap-3'>
      <MembershipList
        memberships={memberships}
        filterType='gym'
        setFormMode={setFormMode}
        setSelectedMembershipId={setSelectedMembershipId}
        disabledMembershipIds={undefined}
        gymId=''
      />
      <EditFormReturnButton setEditForm={setEditForm} />
    </div>
  );
}
