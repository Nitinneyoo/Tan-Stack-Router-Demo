import { createRootRoute, Link, Outlet, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    let dummyUser = {};
    try {
      dummyUser = JSON.parse(sessionStorage.getItem("dummyAuth") || "{}");
    } catch (error) {
      console.error("Error parsing dummyAuth:", error);
    }
    if (!dummyUser.email && location.pathname !== "/Login") {
      throw redirect({
        to: "/Login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
      try {
        return !!JSON.parse(sessionStorage.getItem("dummyAuth") || "{}").email;
      } catch (error) {
        console.error("Error parsing dummyAuth:", error);
        return false;
      }
    });

    // Handle auth state changes
    useEffect(() => {
      const handleDummyAuth = () => {
        let dummyUser = {};
        try {
          dummyUser = JSON.parse(sessionStorage.getItem("dummyAuth") || "{}");
        } catch (error) {
          console.error("Error parsing dummyAuth:", error);
        }
        setIsLoggedIn(!!dummyUser.email);
        if (dummyUser.email) {
          const redirect =
            new URLSearchParams(window.location.search).get("redirect") || "/";
          navigate({ to: redirect }).catch((err) => console.error("Navigation error:", err));
        }
      };
      window.addEventListener("authStateChanged", handleDummyAuth);

      return () => {
        window.removeEventListener("authStateChanged", handleDummyAuth); // Fixed typo
      };
    }, [navigate]);

    const handleLogout = () => {
      if (!isLoggedIn) return;
      sessionStorage.removeItem("dummyAuth");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("authStateChanged"));
      alert("Logged out successfully");
      navigate({ to: "/Login", replace: true }).catch((err) => console.error("Navigation error:", err));
    };

    // If not logged in, render only the Outlet (login screen)
    if (!isLoggedIn) {
      return <Outlet />;
    }

    // Render navbar and Outlet for logged-in users
    return (
      <div className="min-h-screen text-text">
        <div className="p-2 flex justify-between gap-4 bg-primary sticky top-0 z-1">
          <Link to="/" className="text-text font-bold text-2xl">
            ANSCER Robotics
          </Link>
          <div className="flex gap-4 mr-2 justify-center items-center">
            <Link to="/" className="[&.active]:font-bold text-text
             hover:underline">
              Home
            </Link>
            <Link to="/dashboard" className="[&.active]:font-bold text-text
             hover:underline">
              Dashboard
            </Link>
            <Link to="/Fleet" className="[&.active]:font-bold text-text
             hover:underline">
              Fleet
            </Link>
            <Link to="/configure" className="[&.active]:font-bold text-text
             hover:underline">
              Configure
            </Link>
            <Link to="/Contact" className="[&.active]:font-bold text-text
             hover:underline">
              Contact
            </Link>
            <Button
              onClick={handleLogout}
              disabled={!isLoggedIn}
              className={cn(
                "text-white",
                isLoggedIn
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-400 opacity-50 cursor-not-allowed"
              )}
            >
              Logout
            </Button>
          </div>
        </div>
        <hr className="border-gray-300" />
        <Outlet />
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-text
    ">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 text-blue-600 hover:underline">
        Go to Home
      </Link>
    </div>
  ),
});