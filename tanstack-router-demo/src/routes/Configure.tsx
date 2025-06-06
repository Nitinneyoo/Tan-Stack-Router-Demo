import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

const configureLayout = () => {
  return (
    <div className=" h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="h-screen flex flex-col fixed w-full">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Configure Screen</h2>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-200 shadow-md p-6 flex flex-col border-white">
              <nav className="space-y-2">
                <ul>
                  <li>
                    <Link
                      to="/configure"
                      className="block py-2 px-4 rounded-lg text-gray-900 hover:text-blue-600 transition-colors mt-4"
                      activeOptions={{ exact: true }}
                      activeProps={{
                        className:
                          "block py-2 px-4 rounded-lg bg-white text-blue-700 font-semibold border-l-4 border-gray-400",
                      }}
                    >
                      Data
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/configure/automation"
                      className="block py-2 px-4 rounded-lg text-gray-900 hover:text-blue-600  mt-4"
                      activeProps={{
                        className:
                          "block py-2 px-4 rounded-lg bg-white text-blue-700 font-semibold border-l-4 border-gray-400",
                      }}
                    >
                      Automation
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/configure/map"
                      className="block py-2 px-4 rounded-lg text-gray-900 hover:text-blue-600 transition-colors mt-4"
                      activeProps={{
                        className:
                          "block py-2 px-4 rounded-lg bg-white text-blue-700 font-semibold border-l-4 border-gray-400",
                      }}
                    >
                      Map
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto  h-full">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/Configure")({
  component: configureLayout,
});
