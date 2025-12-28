"use client";

import { loginSchema } from "@/lib/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const OTPverification = ({ email, onSubmit, loading }) => {
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [timer, setTimer] = useState(0); // countdown

  // Pick only email + otp from schema
  const formSchema = loginSchema.pick({
    email: true,
    otp: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  const handleSubmit = (data) => {
    onSubmit?.(data);
  };

  // Resend OTP Handler + Start 30s Timer
  const handleResendOTP = async () => {
    setIsResendingOTP(true);
    setTimer(30); // Start 30-second countdown

    try {
      const res = await axios.post("/api/auth/resend-otp", { email });

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent successfully!");
      } else {
        toast.error(res.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("OTP Resend Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsResendingOTP(false);
    }
  };

  // Countdown Timer Logic
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="w-full max-w-sm space-y-6 mx-auto mt-10 p-4"
    >
      <h2 className="text-xl font-semibold text-center">OTP Verification</h2>

      {/* Email (readonly) */}
      <div>
        <p className="text-sm text-gray-600 mb-1">Email</p>
        <input
          type="text"
          value={email}
          disabled
          className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
        />
      </div>

      {/* OTP Input */}
      <div className="flex flex-col items-center">
        <p className="text-sm mb-2 text-gray-600">Enter the OTP</p>

        <InputOTP
          maxLength={6}
          value={form.watch("otp")}
          onChange={(value) => form.setValue("otp", value)}
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="size-12" />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {form.formState.errors.otp && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.otp.message}
          </p>
        )}
      </div>

      {/* Verify Button */}
      <Button disabled={loading} type="submit" className="w-full">
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>

      {/* Resend OTP Section */}
      <div className="text-center text-sm">
        Didn&apos;t receive the OTP?{" "}
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={timer > 0 || isResendingOTP}
          className="text-primary font-bold   hover:underline"
        >
          {timer > 0
            ? `Resend OTP in ${timer}s`
            : isResendingOTP
              ? "Resending..."
              : "Resend OTP"}
        </button>
      </div>
    </form>
  );
};

export default OTPverification;
