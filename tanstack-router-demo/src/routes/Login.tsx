import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;
type FormErrors = Partial<Record<keyof SignupData, string>>;

// Animation variants
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
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
        sessionStorage.setItem("dummyAuth", JSON.stringify({ email: loginData.email }));
        window.dispatchEvent(new Event("authStateChanged"));
        return;
      }

      // Check if user exists in sessionStorage (from sign-up)
      const storedUsers = JSON.parse(sessionStorage.getItem("users") || "{}");
      if (
        storedUsers[loginData.email] &&
        storedUsers[loginData.email].password === loginData.password
      ) {
        sessionStorage.setItem("dummyAuth", JSON.stringify({ email: loginData.email }));
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
      } else {
        setAuthError((error as any).message);
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
      sessionStorage.setItem("dummyAuth", JSON.stringify({ email: signupData.email }));
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
      } else {
        setAuthError((error as any).message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50/90 via-white/90 to-blue-100/90 dark:from-blue-900/90 dark:via-gray-900/90 dark:to-blue-950/90 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-particle top-10 left-20" />
        <div className="absolute w-2 h-2 bg-blue-500/50 rounded-full animate-particle top-40 right-28 delay-600" />
        <div className="absolute w-1 h-1 bg-blue-300/50 rounded-full animate-particle bottom-20 left-40 delay-300" />
        <div className="absolute w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-particle top-60 left-60 delay-900" />
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full bg-white/95 dark:bg-gray-800/95 p-8 rounded-2xl shadow-2xl border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-lg"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
            {isSignup ? "Sign Up for ANSCER Robotics" : "Login to ANSCER Robotics"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {isSignup
              ? "Create your account to join the automation revolution."
              : "Access your account to explore our solutions."}
            {!isSignup && (
              <span className="block mt-1 text-xs text-gray-500">
                
              </span>
            )}
          </p>

          {/* Form */}
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="mt-6 space-y-6">
            {/* Email Field */}
            <motion.div variants={fieldVariants} custom={0} initial="hidden" animate="visible">
              <Label htmlFor="email" className="text-gray-800 dark:text-gray-100 font-semibold">
                Email
              </Label>
              <div className="mt-2 relative group">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={isSignup ? signupData.email : loginData.email}
                  onChange={isSignup ? handleSignupChange : handleLoginChange}
                  placeholder="Your email"
                  className={cn(
                    "pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                    errors.email && "border-red-500 focus:ring-red-500",
                  )}
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={fieldVariants} custom={1} initial="hidden" animate="visible">
              <Label htmlFor="password" className="text-gray-800 dark:text-gray-100 font-semibold">
                Password
              </Label>
              <div className="mt-2 relative group">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={isSignup ? signupData.password : loginData.password}
                  onChange={isSignup ? handleSignupChange : handleLoginChange}
                  placeholder="Your password"
                  className={cn(
                    "pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                    errors.password && "border-red-500 focus:ring-red-500",
                  )}
                />
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password (Signup Only) */}
            {isSignup && (
              <motion.div variants={fieldVariants} custom={2} initial="hidden" animate="visible">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-800 dark:text-gray-100 font-semibold"
                >
                  Confirm Password
                </Label>
                <div className="mt-2 relative group">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    placeholder="Confirm your password"
                    className={cn(
                      "pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                      errors.confirmPassword && "border-red-500 focus:ring-red-500",
                    )}
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Auth Error */}
            <AnimatePresence>
              {authError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-500 text-center"
                >
                  {authError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              variants={fieldVariants}
              custom={isSignup ? 3 : 2}
              initial="hidden"
              animate="visible"
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-300"
              >
                {isSignup ? "Sign Up" : "Login"}
              </Button>
            </motion.div>
          </form>

          {/* Toggle Signup/Login */}
          <motion.div
            variants={fieldVariants}
            custom={isSignup ? 4 : 3}
            initial="hidden"
            animate="visible"
            className="mt-4 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setErrors({});
                  setAuthError(null);
                  setLoginData({ email: "", password: "" });
                  setSignupData({ email: "", password: "", confirmPassword: "" });
                }}
                className="ml-1 text-blue-600 hover:text-blue-500 font-semibold"
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/Login")({
  component: LoginPage,
});
export default LoginPage;