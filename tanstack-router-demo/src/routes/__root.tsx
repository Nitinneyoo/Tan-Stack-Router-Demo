
import { createRootRoute, Link, Outlet, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const dummyUser = JSON.parse(sessionStorage.getItem("dummyAuth") || "{}");
    if (!dummyUser.email && location.pathname !== "/Login") {
      throw redirect({
        to: "/Login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(
      !!JSON.parse(sessionStorage.getItem("dummyAuth") || "{}").email
    );

    useEffect(() => {
      const handleDummyAuth = () => {
        const dummyUser = JSON.parse(sessionStorage.getItem("dummyAuth") || "{}");
        setIsLoggedIn(!!dummyUser.email);
        if (dummyUser.email) {
          const redirect =
            new URLSearchParams(window.location.search).get("redirect") || "/";
          navigate({ to: redirect });
        }
      };
      window.addEventListener("authStateChanged", handleDummyAuth);

      return () => {
        window.removeEventListener("authStateChanged", handleDummyAuth);
      };
    }, [navigate]);

    const handleLogout = () => {
      if (!isLoggedIn) return; // Prevent logout if already logged out
      sessionStorage.removeItem("dummyAuth");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("authStateChanged"));
      alert("Logged out successfully");
      navigate({ to: "/Login", replace: true });
    };

    return (
      <>
        <div className="p-2 flex justify-between gap-4 bg-blue-900 sticky top-0">
          <Link to="/" className="text-white font-bold text-2xl">
            ANSCER Robotics
          </Link>
          <div className="flex gap-4 mr-2 justify-center items-center">
            <Link to="/" className="[&.active]:font-bold text-white">
              Home
            </Link>
            <Link to="/dashboard" className="[&.active]:font-bold text-white">
              Dashboard
            </Link>
            <Link to="/Fleet" className="[&.active]:font-bold text-white">
              Fleet
            </Link>
            <Link to="/configure" className="[&.active]:font-bold text-white">
              Configure
            </Link>
            <Link to="/Contact" className="[&.active]:font-bold text-white">
              Contact
            </Link>
            <Button
              onClick={handleLogout}
              disabled={!isLoggedIn}
              className={cn(
                "text-white",
                isLoggedIn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-600 opacity-50 cursor-not-allowed"
              )}
            >
              Logout
            </Button>
          </div>
        </div>
        <hr />
        <Outlet />
      </>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">404 - Page Not Found</h1>
      <Link to="/" className="mt-4 text-blue-600 hover:underline">
        Go to Home
      </Link>
    </div>
  ),
});
