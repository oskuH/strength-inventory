import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(open)/gyms')({
  component: Gyms
});

function Gyms() {
  return <div>Gym search</div>;
}