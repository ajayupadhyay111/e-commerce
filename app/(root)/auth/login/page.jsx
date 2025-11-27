// components/auth-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas/auth-schema";
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
import ButtonLoading from "@/components/application/ButtonLoading";
import { toast } from "sonner";
import { WEBSITE_REGISTER } from "@/routes/WebsiteRoutes";
import axios from "axios";

// Mock API function - replace with your actual API call
async function loginUser(credentials) {
  // Replace this with your actual API call
  const { data: LoginResponse } = await axios.post(
    "/api/auth/login",
    credentials
  );

  if (!LoginResponse.success) {
    throw new Error(LoginResponse.message);
  }

  return LoginResponse;
}

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    setIsLoading(true);

    try {
      // Call your API
      const result = await loginUser(data);

      // Handle successful login
      toast.success("Login successful!");
      console.log("Login result:", result);

      // Redirect or handle success
      // router.push('/dashboard');
      // or
      // window.location.href = '/dashboard';
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );

      // You can also set form errors if needed
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Using react-hook-form's built-in loading state
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Password must contain: 8+ characters, uppercase, lowercase,
                    number, and special character
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonLoading
              type="submit"
              text="Login"
              loading={isSubmitting}
              className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-yellow-950 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Additional Links */}
            <div className="flex flex-col space-y-3 text-center">
              {/* Forgot Password Link */}
              <Link
                href="/forgot-password"
                className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline transition-colors duration-200"
              >
                Forgot your password?
              </Link>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {/* Create Account Link */}
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href={WEBSITE_REGISTER}
                  className="font-medium text-yellow-600 hover:text-yellow-700 hover:underline transition-colors duration-200"
                >
                  Create new account
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
