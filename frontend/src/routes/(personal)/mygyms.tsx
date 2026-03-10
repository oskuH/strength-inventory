import { createFileRoute } from '@tanstack/react-router';

import MyGyms from '../../components/personal/MyGyms';

export const Route = createFileRoute('/(personal)/mygyms')({
  component: MyGyms
});
