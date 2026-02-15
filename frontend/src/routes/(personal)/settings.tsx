import { createFileRoute } from '@tanstack/react-router';

import Settings from '../../components/personal/settings';

export const Route = createFileRoute('/(personal)/settings')({
  component: Settings
});