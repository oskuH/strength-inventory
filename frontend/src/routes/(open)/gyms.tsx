import { createFileRoute } from '@tanstack/react-router';

import Gyms from '../../components/open/gyms';

export const Route = createFileRoute('/(open)/gyms')({
  component: Gyms
});