import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/Dashboard/settings')({
  component: () => <div>Settings Page</div>,
});