import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { User, Mail } from "lucide-react";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-background p-8 border border-gray-300 rounded-lg">
          <h2 className="text-3xl font-bold text-foreground text-center">
            ANSCER Robotics
          </h2>
          <p className="mt-2 text-center text-sm text-foreground">
            Access your account or join the automation revolution.
          </p>
          <Tabs defaultValue="login" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="mt-6 space-y-6">
                <div>
                  <Label htmlFor="login-email" className="text-foreground font-semibold">
                    Email
                  </Label>
                  <div className="mt-2 relative">
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="Your email"
                      className={cn(
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.email && "border-red-500"
                      )}
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-foreground font-semibold">
                    Password
                  </Label>
                  <div className="mt-2 relative">
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Your password"
                      className={cn(
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.password && "border-red-500"
                      )}
                    />
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                {authError && (
                  <p className="text-sm text-red-500 text-center">{authError}</p>
                )}
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-background-500 hover:bg-background-600 text-foreground py-3 rounded-lg"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="mt-6 space-y-6">
                <div>
                  <Label htmlFor="signup-email" className="text-foreground font-semibold">
                    Email
                  </Label>
                  <div className="mt-2 relative">
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="Your email"
                      className={cn(
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.email && "border-red-500"
                      )}
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-foreground font-semibold">
                    Password
                  </Label>
                  <div className="mt-2 relative">
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Your password"
                      className={cn(
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.password && "border-red-500"
                      )}
                    />
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-foreground font-semibold">
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
                        "pl-10 pr-4 py-3 bg-background text-foreground border border-gray-300 rounded-lg",
                        errors.confirmPassword && "border-red-500"
                      )}
                    />
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                {authError && (
                  <p className="text-sm text-red-500 text-center">{authError}</p>
                )}
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-background-500 hover:bg-background-600 text-foreground py-3 rounded-lg"
                  >
                    Sign Up
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/Login")({
  component: LoginPage,
});
export default LoginPage;