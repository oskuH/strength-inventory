import { createFileRoute } from '@tanstack/react-router';

import Gyms from '../../../components/open/gyms/Index';

export const Route = createFileRoute('/_noAuth/(open)/gyms')({
  component: Gyms
});
