import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import {  useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Mail, MessageSquare, User } from "lucide-react";

// Zod schema for form validation
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const isLoggedIn = !!JSON.parse(sessionStorage.getItem("dummyAuth") || "{}")
    .email;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMessage(null);
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
        setMessage({ type: "success", text: "Message sent successfully!" });
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        setMessage({
          type: "error",
          text: "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        // biome-ignore lint/complexity/noForEach: <explanation>
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setMessage({
          type: "error",
          text: "An error occurred. Please try again.",
        });
      }
    }
  };

  // FloatingDock items with navigation
  

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Header */}
      <header className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-black">
            Connect with ANSCER Robotics
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-black max-w-3xl">
            Pioneering the future of automation, we’re here to answer your
            questions and explore how our Hybrid AMRs can transform your
            operations.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-black text-lg">
            At ANSCER Robotics, we’re revolutionizing industries with
            intelligent automation. Reach out to discuss partnerships,
            solutions, or inquiries.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-8 sm:p-12 border border-gray-300 rounded-lg"
        >
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-black font-semibold text-lg">
              Name
            </Label>
            <div className="mt-2 relative">
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={cn(
                  "pl-12 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg text-base sm:text-lg",
                  errors.name && "border-red-500"
                )}
              />
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-500 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-black font-semibold text-lg">
              Email
            </Label>
            <div className="mt-2 relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className={cn(
                  "pl-12 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg text-base sm:text-lg",
                  errors.email && "border-red-500"
                )}
              />
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-500 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <Label
              htmlFor="message"
              className="text-black font-semibold text-lg"
            >
              Message
            </Label>
            <div className="mt-2 relative">
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your needs or inquiries"
                rows={5}
                className={cn(
                  "pl-12 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg text-base sm:text-lg",
                  errors.message && "border-red-500"
                )}
              />
              <MessageSquare
                className="absolute left-4 top-3 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
            </div>
            {errors.message && (
              <p className="mt-2 text-sm text-red-500 font-medium">
                {errors.message}
              </p>
            )}
          </div>

          {/* Message Feedback */}
          {message && (
            <p
              className={cn(
                "text-sm text-center",
                message.type === "success" ? "text-green-500" : "text-red-500"
              )}
            >
              {message.text}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-lg"
            >
              Send Message
            </Button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 py-10">
        
      </footer>
    </div>
  );
};

export const Route = createFileRoute("/Contact")({
  component: ContactPage,
});
export default ContactPage;
