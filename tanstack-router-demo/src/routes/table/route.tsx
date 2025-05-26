
import { createFileRoute, Link } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

const RouteComponent = () => {
  return (
    <div>
      <div className="flex h-screen">
        {/* Header */}
        <div className="">
          
        </div>
        {/* Sidebar */}
        <aside className="w-64 bg-gray-200 text-text p-4  h-200 flex flex-col justify-center items-center">
          <nav>
            <ul>
              <li>
                <Link
                  to="/table"
                  className="rounded-lg text-geay-700 border-2"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className:
                      " py-2 px-4 rounded-md text-gray-700 font-semibold border-black bg-white",
                  }}
                >
                  Robot Data
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
