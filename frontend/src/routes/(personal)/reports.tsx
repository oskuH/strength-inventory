import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(personal)/reports')({
  component: Reports
});

function Reports() {
  return <div>HReports</div>;
}