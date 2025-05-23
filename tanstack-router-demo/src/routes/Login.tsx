import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { User, Mail } from "lucide-react";
import { z } from "zod";

// WARNING: Hardcoded credentials and client-side auth are for TESTING ONLY. Remove before production!
const DEFAULT_CREDENTIALS = {
  username: "admin@anscer.com",
  password: "Admin123!",
};

// Zod schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;
type FormErrors = Partial<Record<keyof SignupData, string>>;

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setAuthError(null);
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setAuthError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse(loginData);

      // Default credentials check (TESTING ONLY)
      if (
        loginData.email === DEFAULT_CREDENTIALS.username &&
        loginData.password === DEFAULT_CREDENTIALS.password
      ) {
        sessionStorage.setItem(
          "dummyAuth",
          JSON.stringify({ email: loginData.email })
        );
        window.dispatchEvent(new Event("authStateChanged"));
        return;
      }

      // Check if user exists in sessionStorage (from sign-up)
      const storedUsers = JSON.parse(sessionStorage.getItem("users") || "{}");
      if (
        storedUsers[loginData.email] &&
        storedUsers[loginData.email].password === loginData.password
      ) {
        sessionStorage.setItem(
          "dummyAuth",
          JSON.stringify({ email: loginData.email })
        );
        window.dispatchEvent(new Event("authStateChanged"));
        return;
      }

      throw new Error("Invalid email or password");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        // biome-ignore lint/complexity/noForEach: <explanation>
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof LoginData] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setAuthError(error.message);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signupSchema.parse(signupData);

      // Store user in sessionStorage (TESTING ONLY)
      const storedUsers = JSON.parse(sessionStorage.getItem("users") || "{}");
      if (storedUsers[signupData.email]) {
        throw new Error("Email already exists");
      }
      storedUsers[signupData.email] = { password: signupData.password };
      sessionStorage.setItem("users", JSON.stringify(storedUsers));

      // Auto-login after sign-up
      sessionStorage.setItem(
        "dummyAuth",
        JSON.stringify({ email: signupData.email })
      );
      window.dispatchEvent(new Event("authStateChanged"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        // biome-ignore lint/complexity/noForEach: <explanation>
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof SignupData] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setAuthError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg">
          <h2 className="text-3xl font-bold text-black text-center">
            {isSignup
              ? "Sign Up for ANSCER Robotics"
              : "Login to ANSCER Robotics"}
          </h2>
          <p className="mt-2 text-center text-sm text-black">
            {isSignup
              ? "Create your account to join the automation revolution."
              : "Access your account to explore our solutions."}
          </p>

          {/* Form */}
          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="mt-6 space-y-6"
          >
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-black font-semibold">
                Email
              </Label>
              <div className="mt-2 relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={isSignup ? signupData.email : loginData.email}
                  onChange={isSignup ? handleSignupChange : handleLoginChange}
                  placeholder="Your email"
                  className={cn(
                    "pl-10 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg",
                    errors.email && "border-red-500"
                  )}
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-black font-semibold">
                Password
              </Label>
              <div className="mt-2 relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={isSignup ? signupData.password : loginData.password}
                  onChange={isSignup ? handleSignupChange : handleLoginChange}
                  placeholder="Your password"
                  className={cn(
                    "pl-10 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg",
                    errors.password && "border-red-500"
                  )}
                />
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (Signup Only) */}
            {isSignup && (
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-black font-semibold"
                >
                  Confirm Password
                </Label>
                <div className="mt-2 relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    placeholder="Confirm your password"
                    className={cn(
                      "pl-10 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg",
                      errors.confirmPassword && "border-red-500"
                    )}
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Auth Error */}
            {authError && (
              <p className="text-sm text-red-500 text-center">{authError}</p>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
              >
                {isSignup ? "Sign Up" : "Login"}
              </Button>
            </div>
          </form>

          {/* Toggle Signup/Login */}
          <div className="mt-4 text-center">
            <p className="text-sm text-black">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <Button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setErrors({});
                  setAuthError(null);
                  setLoginData({ email: "", password: "" });
                  setSignupData({
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
                className="ml-1 text-blue-500 hover:text-blue-600 font-semibold bg-white border-2"
              >
                {isSignup ? "Login" : "Sign Up"}
              </Button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/Login")({
  component: LoginPage,
});
export default LoginPage;
