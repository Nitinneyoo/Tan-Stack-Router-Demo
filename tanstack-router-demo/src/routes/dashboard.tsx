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
                <Link
                  to="/dashboard"
                  className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Robot
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/overview"
                  className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors mt-5"
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Overview
                </Link>
              </li>
               <li>
                <Link
                  to="/dashboard/settings"
                  className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors mt-5"
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Setting
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

export const Route = createFileRoute('/Dashboard')({
  component: DashboardLayout,
});
export default DashboardLayout;