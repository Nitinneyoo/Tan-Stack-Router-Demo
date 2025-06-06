import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

const DashboardLayout = () => {
  return (
    <div className=" h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="h-screen flex flex-col fixed w-full">
        {/* Fixed Header */}
        {/* <div className="flex justify-between items-center px-6 py-4 border-b text-foreground-200">
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        </div> */}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Fixed Sidebar */}
            <aside className="w-64 text-foreground-200 border-r">
              <nav className="p-4 space-y-2">
                <Link
                  to="/dashboard"
                  className="block py-2 px-4 rounded-lg text-foreground hover:text-foreground-100 transition-colors"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-background-50 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Robot
                </Link>
                <Link
                  to="/dashboard/overview"
                  className="block py-2 px-4 rounded-lg text-foreground hover:text-foreground-100 transition-colors"
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-background-50 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Overview
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="block py-2 px-4 rounded-lg text-foreground hover:text-foreground-100 transition-colors"
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-lg bg-background-50 text-blue-700 font-semibold border-l-4 border-blue-500",
                  }}
                >
                  Settings
                </Link>
              </nav>
            </aside>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto text-foreground-50">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

export default DashboardLayout;
