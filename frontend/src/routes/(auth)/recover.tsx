import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/recover')({
  component: Recover
});

function Recover() {
  return <div>Hello from About!</div>;
}