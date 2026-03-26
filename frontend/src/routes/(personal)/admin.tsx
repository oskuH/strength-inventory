import { createFileRoute } from '@tanstack/react-router';

import Admin from '../../components/personal/Admin';

export const Route = createFileRoute('/(personal)/admin')({
  component: Admin
});
