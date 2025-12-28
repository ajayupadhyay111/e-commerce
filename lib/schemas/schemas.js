// lib/schemas/auth-schema.ts
import { z } from "zod";

// Existing auth schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .regex(/^(?=.*\d)/, "Password must contain at least one number")
    .regex(
      /^(?=.*[@$!%*?&])/,
      "Password must contain at least one special character (@$!%*?&)"
    ),
  otp: z.string().regex(/^\d{6}$/, {
    message: "OTP must be a 6-digit number",
  }),
});

// Register schema with confirm password
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/^(?=.*\d)/, "Password must contain at least one number")
      .regex(
        /^(?=.*[@$!%*?&])/,
        "Password must contain at least one special character (@$!%*?&)"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const mediaSchema = z.object({
  _id: z.string().min(3, "_id is required"),
  alt: z.string().min(3, "alt is required"),
  title: z.string().min(3, "title is required"),
});

export const categorySchema = z.object({
  name: z.string().min(3, "name is required"),
  slug: z.string().min(3, "slug is required"),
});
