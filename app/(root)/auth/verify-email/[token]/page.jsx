"use client";

import { use, useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

async function verifyEmailApi(token) {
  try {
    const res = await axios.post("/api/auth/verify-email", { token });
    return res.data;
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message:
        err?.response?.data?.message || "Something went wrong while verifying.",
    };
  }
}

export default function VerifyEmailPage({ params }) {
  const { token } = use(params);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    let cancelled = false;

    (async () => {
      setStatus("loading");
      const result = await verifyEmailApi(token);
      if (cancelled) return;
      if (result?.success) {
        setStatus("success");
        setMessage(result.message || "Your email has been verified.");
      } else {
        setStatus("error");
        setMessage(result.message || "Email verification failed.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]); // runs exactly once per token

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      {status === "loading" && (
        <div className="flex flex-col items-center">
          <Loader2 className="w-20 h-20 text-yellow-500 animate-spin" />
          <p className="mt-4 text-muted-foreground text-lg">
            Verifying your email...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center">
          <CheckCircle className="w-24 h-24 text-yellow-500 mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Email Verified 🎉
          </h1>
          <p className="text-muted-foreground mb-6 text-center max-w-sm">
            {message}
          </p>
          <Link href="/auth/login">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl shadow-lg">
              Continue to Login
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center">
          <XCircle className="w-24 h-24 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Verification Failed ❌
          </h1>
          <p className="text-muted-foreground mb-6 text-center max-w-sm">
            {message}
          </p>
          <Link href="/auth/resend-email">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl shadow-lg">
              Resend Verification Email
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
