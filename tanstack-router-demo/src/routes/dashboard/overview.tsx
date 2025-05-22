import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/Dashboard/overview')({
  component: () => <div>Overview Page</div>,
});