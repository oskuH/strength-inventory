import { createFileRoute } from '@tanstack/react-router';

import Lists from '../../components/personal/lists';

export const Route = createFileRoute('/(personal)/lists')({
  component: Lists
});