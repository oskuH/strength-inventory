import { createFileRoute } from '@tanstack/react-router';

import Reports from '../../components/personal/Reports';

export const Route = createFileRoute('/(personal)/reports')({
  component: Reports
});

