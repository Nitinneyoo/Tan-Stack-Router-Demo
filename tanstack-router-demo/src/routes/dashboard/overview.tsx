import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/overview')({
  component: () => <div>Overview Page</div>,
});