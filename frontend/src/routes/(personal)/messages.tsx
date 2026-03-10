import { createFileRoute } from '@tanstack/react-router';

import Messages from '../../components/personal/Messages';

export const Route = createFileRoute('/(personal)/messages')({
  component: Messages
});
