import { createFileRoute } from '@tanstack/react-router';

import Index from '../../components/root/Index';

export const Route = createFileRoute('/_noAuth/')({
  component: Index
});
