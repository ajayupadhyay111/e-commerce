"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/application/ButtonLoading";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas/schemas";

// ---------------------
// API FUNCTION
// ---------------------
async function UpdatePasswordAPI(credentials) {
  const { data } = await axios.put(
    "/api/auth/reset-password/update-password",
    credentials
  );

  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
}

// ---------------------
// COMPONENT
// ---------------------
export default function UpdatePasswordForm({ email }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formSchema = registerSchema.pick({
    email: true,
    password: true,
    confirmPassword: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const res = await UpdatePasswordAPI(values);
      toast.success(res.message || "Password updated successfully!");
      form.reset();
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update password"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Update Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONFIRM PASSWORD */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Re-enter password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT */}
            <ButtonLoading
              text="Update Password"
              loading={isSubmitting}
              className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-yellow-950 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* BACK LINK */}
            <div className="text-center">
              <Link
                href={WEBSITE_LOGIN}
                className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
