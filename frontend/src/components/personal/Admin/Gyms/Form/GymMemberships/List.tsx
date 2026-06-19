import EditFormReturnButton from '../EditFormReturnButton';
import MembershipList from '../../../MembershipList';

import type { Membership } from '@strength-inventory/schemas';

interface ListProps {
  memberships: Membership[]
  setFormMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedMembershipId: React.Dispatch<React.SetStateAction<string>>
  setEditForm: React.Dispatch<React.SetStateAction<string>>
  setParentNotification: React.Dispatch<React.SetStateAction<{
    type: string,
    message: string
  }>>
}

export default function List ({
  memberships,
  setFormMode,
  setSelectedMembershipId,
  setEditForm,
  setParentNotification
}: ListProps) {
  return (
    <div className='flex flex-1 flex-col gap-3'>
      <MembershipList
        memberships={memberships}
        filterType='gym'
        setFormMode={setFormMode}
        highlightChainMemberships={true}
        setSelectedMembershipId={setSelectedMembershipId}
        disabledMembershipIds={undefined}
        gymId=''
        setParentNotification={setParentNotification}
      />
      <EditFormReturnButton
        model='memberships'
        setEditForm={setEditForm}
        setParentNotification={setParentNotification}
      />
    </div>
  );
}
