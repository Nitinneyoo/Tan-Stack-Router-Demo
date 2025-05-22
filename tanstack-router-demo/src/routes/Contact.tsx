import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  Mail,
  User,
  MessageSquare,
  Github,
  Twitter,
  Linkedin,
  Home,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

// Zod schema for form validation
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

// Animation variants
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
};

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const isLoggedIn = !!JSON.parse(sessionStorage.getItem("dummyAuth") || "{}").email;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      contactSchema.parse(formData);
      const response = await fetch("https://formspree.io/f/your-form-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  // FloatingDock items with navigation
  const dockItems = [
    {
      title: "Home",
      icon: (
        <Link to="/" aria-label="Home" className="flex items-center justify-center">
          <Home className="h-7 w-7 text-blue-100 hover:text-blue-50 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        </Link>
      ),
      href: "/",
    },
    {
      title: "Dashboard",
      icon: (
        <Link to="/dashboard" aria-label="Dashboard" className="flex items-center justify-center">
          <svg
            className="h-7 w-7 text-blue-100 hover:text-blue-50 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
      ),
      href: "/dashboard",
    },
    {
      title: "GitHub",
      icon: (
        <a
          href="https://github.com/anscer-robotics"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex items-center justify-center"
        >
          <Github className="h-7 w-7 text-blue-100 hover:text-blue-50 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        </a>
      ),
      href: "https://github.com/anscer-robotics",
    },
    {
      title: "Twitter",
      icon: (
        <a
          href="https://twitter.com/anscerrobotics"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="flex items-center justify-center"
        >
          <Twitter className="h-7 w-7 text-blue-100 hover:text-blue-50 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        </a>
      ),
      href: "https://twitter.com/anscerrobotics",
    },
    {
      title: "LinkedIn",
      icon: (
        <a
          href="https://www.linkedin.com/company/anscer-robotics"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex items-center justify-center"
        >
          <Linkedin className="h-7 w-7 text-blue-100 hover:text-blue-50 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        </a>
      ),
      href: "https://www.linkedin.com/company/anscer-robotics",
    },
    {
      title: "Logout",
      icon: (
        <button
          onClick={() => {
            sessionStorage.removeItem("dummyAuth");
            alert("Logged out successfully");
            navigate({ to: "/Login", replace: true });
          }}
          disabled={!isLoggedIn}
          aria-label="Logout"
          className={cn(
            "flex items-center justify-center",
            isLoggedIn
              ? "text-red-600 hover:text-red-500"
              : "text-gray-600 opacity-50 cursor-not-allowed"
          )}
        >
          <LogOut className="h-7 w-7 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
        </button>
      ),
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50/90 via-white/90 to-blue-100/90 dark:from-blue-900/90 dark:via-gray-900/90 dark:to-blue-950/90 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-particle top-10 left-20" />
        <div className="absolute w-2 h-2 bg-blue-500/50 rounded-full animate-particle top-40 right-28 delay-600" />
        <div className="absolute w-1 h-1 bg-blue-300/50 rounded-full animate-particle bottom-20 left-40 delay-300" />
        <div className="absolute w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-particle top-60 left-60 delay-900" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-950 dark:to-blue-900 shadow-xl"
      >
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Connect with ANSCER Robotics
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 dark:text-blue-200 font-medium max-w-3xl">
            Pioneering the future of automation, we’re here to answer your questions and explore how our Hybrid AMRs can transform your operations.
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            At ANSCER Robotics, we’re revolutionizing industries with intelligent automation. Reach out to discuss partnerships, solutions, or inquiries.
          </p>
        </motion.div>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white/95 dark:bg-gray-800/95 p-8 sm:p-12 rounded-2xl shadow-2xl border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Name Field */}
          <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
            <Label htmlFor="name" className="text-gray-800 dark:text-gray-100 font-semibold text-lg">
              Name
            </Label>
            <div className="mt-2 relative group">
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={cn(
                  "pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] text-base sm:text-lg",
                  errors.name && "border-red-500 focus:ring-red-500",
                )}
              />
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors"
                aria-hidden="true"
              />
            </div>
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-sm text-red-500 font-medium"
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Email Field */}
          <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
            <Label htmlFor="email" className="text-gray-800 dark:text-gray-100 font-semibold text-lg">
              Email
            </Label>
            <div className="mt-2 relative group">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className={cn(
                  "pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] text-base sm:text-lg",
                  errors.email && "border-red-500 focus:ring-red-500",
                )}
              />
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors"
                aria-hidden="true"
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-sm text-red-500 font-medium"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Message Field */}
          <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
            <Label htmlFor="message" className="text-gray-800 dark:text-gray-100 font-semibold text-lg">
              Message
            </Label>
            <div className="mt-2 relative group">
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your needs or inquiries"
                rows={5}
                className={cn(
                  "pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] text-base sm:text-lg",
                  errors.message && "border-red-500 focus:ring-red-500",
                )}
              />
              <MessageSquare
                className="absolute left-4 top-3 h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors"
                aria-hidden="true"
              />
            </div>
            <AnimatePresence>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-sm text-red-500 font-medium"
                >
                  {errors.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Button */}
          <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-300 animate-pulse-slow"
            >
              Send Message
            </Button>
          </motion.div>
        </motion.form>
      </main>

      {/* Footer with FloatingDock */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-950 dark:to-blue-900 py-10 z-10"
      >
        <FloatingDock
          items={dockItems}
          desktopClassName="max-w-md mx-auto bg-blue-900/95 dark:bg-blue-950/95 rounded-full shadow-2xl border border-blue-400/50 backdrop-blur-xl flex justify-center items-center gap-8 px-8 py-4"
          mobileClassName="fixed bottom-12 right-12"
        />
      </motion.footer>
    </div>
  );
};

export const Route = createFileRoute('/Contact')({
  component: ContactPage,
});
export default ContactPage;