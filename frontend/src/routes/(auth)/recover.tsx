import { createFileRoute } from '@tanstack/react-router';

import Recover from '../../components/auth/Recover';

export const Route = createFileRoute('/(auth)/recover')({
  component: Recover
});
