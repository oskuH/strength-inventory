import { createFileRoute } from '@tanstack/react-router';

import MyGyms from '../../components/personal/mygyms';

export const Route = createFileRoute('/(personal)/mygyms')({
  component: MyGyms
});