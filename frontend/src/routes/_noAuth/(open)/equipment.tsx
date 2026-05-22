import { createFileRoute } from '@tanstack/react-router';

import Equipment from '../../../components/open/Equipment';

export const Route = createFileRoute('/_noAuth/(open)/equipment')({
  component: Equipment
});
