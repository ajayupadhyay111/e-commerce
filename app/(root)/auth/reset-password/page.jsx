// components/reset-password-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas/schemas";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import axios from "axios";
import ButtonLoading from "@/components/application/ButtonLoading";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";
import UpdatePasswordForm from "@/components/application/UpdatePassword";
import OTPverification from "@/components/application/OTPverification";

// --- API FUNCTION ---
async function sendVerificationOTP(credentials) {
  const { data } = await axios.post(
    "/api/auth/reset-password/send-otp",
    credentials
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
}

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [OTPverificationLoading, setOTPverificationLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const formSchema = loginSchema.pick({
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      const response = await sendVerificationOTP(data);

      toast.success(response.message || "Reset email sent successfully!");
      setOtpEmail(data.email);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset mail"
      );

      form.setError("root", {
        type: "manual",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  const handleOtpSubmission = async (data) => {
    setOTPverificationLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/reset-password/verify-otp",
        data
      );

      if (response.data.success) {
        toast.success(response.data.message);
        form.reset();
        setIsOtpVerified(true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setOTPverificationLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {!otpEmail ? (
        <>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive a reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Root-level error */}
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

                <ButtonLoading
                  text="Send Reset Link"
                  loading={isSubmitting}
                  className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-yellow-950 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {/* Back to Login */}
                <div className="flex flex-col space-y-3 text-center">
                  <Link
                    href={WEBSITE_LOGIN}
                    className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline transition-colors duration-200"
                  >
                    Back to login
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </>
      ) : (
        <>
          {!isOtpVerified ? (
            <OTPverification
              email={otpEmail}
              loading={OTPverificationLoading}
              onSubmit={handleOtpSubmission}
            />
          ) : (
            <UpdatePasswordForm email={otpEmail} />
          )}
        </>
      )}
    </Card>
  );
}
