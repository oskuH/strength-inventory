import { createFileRoute } from '@tanstack/react-router';

import Messages from '../../components/personal/messages';

export const Route = createFileRoute('/(personal)/messages')({
  component: Messages
});