import { createFileRoute, Outlet, Link } from '@tanstack/react-router'; // Replace with your actual authentication logic

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-300 text-gray-800 p-4">
        <Link to="/dashboard" className="text-2xl">Dashboard</Link>
      </header>
      <div className="flex flex-1 overflow-auto bg-gray-200">
        {/* Sidebar */}
        <aside className="w-64 bg-white text-gray-800 p-4 flex flex-col">
          <nav >
            <ul>
              <li>
                <Link to="/dashboard" activeProps={{ className: 'font-bold' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard/overview" activeProps={{ className: 'font-bold' }}>
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard/settings" activeProps={{ className: 'font-bold' }}>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main Content Area (Child Outlet) */}
        <main className="flex-1 p-4 ">
          <Outlet /> {/* Renders child routes like /dashboard/overview */}
        </main>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});
export default DashboardLayout;