import { createFileRoute } from '@tanstack/react-router';

import Index from '../components/root';

export const Route = createFileRoute('/')({
  component: Index
});