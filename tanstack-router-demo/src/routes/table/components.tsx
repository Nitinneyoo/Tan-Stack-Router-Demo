import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/components')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='text-foreground text-foreground-200 border-1 border-gray-300 flex justify-center items-center w-full h-screen'>Hello "/table/components"!</div>
}
