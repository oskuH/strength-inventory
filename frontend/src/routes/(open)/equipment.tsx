import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(open)/equipment')({
  component: Equipment
});

function Equipment() {
  return <div>Equipment search</div>;
}