import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Configure/Index')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Configure/Index"!</div>
}
