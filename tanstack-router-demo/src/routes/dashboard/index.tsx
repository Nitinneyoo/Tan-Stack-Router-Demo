import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: () => 
  <div className='h-full w-full flex items-center justify-center'>
    Map Component
  </div>,
});