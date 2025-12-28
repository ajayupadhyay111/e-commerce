// components/register-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas/schemas";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";
import axios from "axios";
import ButtonLoading from "@/components/application/ButtonLoading";

// Mock API function - replace with your actual API call
async function registerUser(credentials) {
  // Replace this with your actual API call
  const { data } = await axios.post("/api/auth/register", credentials);
  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data) {
    setIsLoading(true);

    try {
      console.log("Registration data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call your API
      const result = await registerUser(data);

      // Handle successful registration
      toast.success("Account created successfully!");
      console.log("Registration result:", result.message);

      // Reset form on success
      form.reset();

      // Redirect to login or dashboard
      // router.push('/login');
      // or
      // router.push('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error
          ? error.response.data.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Root error message */}
            {form.formState.errors.root && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      type="text"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Your full name as you'd like it to appear
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Create a password"
                      type={"password"}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Password must contain: 8+ characters, uppercase, lowercase,
                    number, and special character (@$!%*?&)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your password"
                      type={"password"}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonLoading
              type="submit"
              text="Create Account"
              loading={isSubmitting}
              className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-yellow-950 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Additional Links */}
            <div className="text-center space-y-3 pt-2">
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href={WEBSITE_LOGIN}
                  className="font-medium text-yellow-600 hover:text-yellow-700 hover:underline transition-colors duration-200"
                >
                  Sign in
                </Link>
              </div>

              <div className="text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-yellow-600 hover:text-yellow-700 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-yellow-600 hover:text-yellow-700 hover-underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
