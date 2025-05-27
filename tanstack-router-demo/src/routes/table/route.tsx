
import { createFileRoute, Link } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

const RouteComponent = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-auto bg-gray-200">
        {/* Header */}
          
       
        {/* Sidebar */}
        <aside className="w-64 bg-gray-200 text-text p-4 flex flex-col justify-center items-center border-2 sticky top-0">
          <nav>
            <ul>
              <li>
                <Link
                  to="/table"
                  className="block rounded-md text-gray-700 border-2 border-gray-300 p-2"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className:
                      "block py-2 px-4 rounded-md text-gray-700 font-bold border-black bg-text",
                  }}
                >
                  Robot Data
                </Link>
                 <Link
                  to="/table/components"
                  className="block rounded-md text-gray-700 border-2 border-gray-300 p-2 mt-2"
                  activeProps={{
                    className:
                      " block py-2 px-4 rounded-md text-gray-700 font-bold border-black bg-text",
                  }}
                >
                  Component
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main Content Area (Child Outlet) */}
        <main className="flex-1 border">
          <Outlet /> {/* Renders child routes like /table/overview */}
        </main>
      </div>
    </div>
  );
};
export const Route = createFileRoute("/table")({
  component: RouteComponent,
});

export default RouteComponent;
