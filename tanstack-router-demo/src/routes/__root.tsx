import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex justify-between gap-4 bg-blue-900 sticky top-0">
        <Link to="/" className="text-white font-bold text-2xl">
          Anscer Robotics
        </Link>
        <div className="flex gap-4 mr-2 justify-center item-center">
          <Link to="/" className="[&.active]:font-bold text-white">
            Home
          </Link>
          <Link to="/dashboard" className="[&.active]:font-bold text-white">
            Dashboard
          </Link>
          <Link to="/Fleet" className="[&.active]:font-bold text-white">
            Fleet
          </Link>
          <Link to="/Configure" className="[&.active]:font-bold text-white">
            Configure
          </Link>
        </div>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
