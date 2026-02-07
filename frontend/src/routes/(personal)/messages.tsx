import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(personal)/messages')({
  component: Messages
});

function Messages() {
  return <div>Messages</div>;
}