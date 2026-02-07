import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(personal)/lists')({
  component: Lists
});

function Lists() {
  return <div>Lists</div>;
}