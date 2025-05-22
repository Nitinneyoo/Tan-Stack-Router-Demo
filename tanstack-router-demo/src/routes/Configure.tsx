import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

const ConfigureLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <Link
          to="/configure"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          configure
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 flex flex-col border-r border-gray-200">
          <nav className="space-y-2">
            <ul>
              <li>
                <Link
                  to="/configure"
                  className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Data
                </Link>
              </li>
              <li>
                <Link
                  to="/Configure/automation"
                  className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors mt-5"
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Automation
                </Link>
              </li>
               <li>
                <Link
                  to="/Configure/map"
                  className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors mt-5"
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Map
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet /> {/* Renders child routes like /configure/... */}
          </div>
        </main>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/Configure")({
  component: ConfigureLayout,
});