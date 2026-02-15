import { createFileRoute } from '@tanstack/react-router';

import Equipment from '../../components/open/equipment';

export const Route = createFileRoute('/(open)/equipment')({
  component: Equipment
});