import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(personal)/mygyms')({
  component: MyGyms
});

function MyGyms() {
  return <div>My gyms</div>;
}