import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/Fleet')({
  component: FleetComponent,
})

function FleetComponent() {
  return <div>
    <main className="flex-1  bg-background text-black">
      <Outlet />
    </main>
  </div>
}
