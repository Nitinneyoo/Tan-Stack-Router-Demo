import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: () => <div>Welcome to the Dashboard!</div>,
});