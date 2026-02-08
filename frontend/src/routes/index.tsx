import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index
});

function Index() {
  return (
    <div>
      <h3 className='font-bold'>Hello world!</h3>
    </div>
  );
}