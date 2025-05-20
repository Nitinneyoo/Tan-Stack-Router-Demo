import { createFileRoute,Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/Fleet')({
  component: FleetComponent,
})

function FleetComponent() {
  return <div>
   <main className="flex-1 p-4 ">
      <Outlet/>
    </main>
  </div>
}
