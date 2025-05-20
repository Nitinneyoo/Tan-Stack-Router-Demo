import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Configure')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Configure"!</div>
}
