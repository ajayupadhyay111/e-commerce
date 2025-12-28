import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/server/db";
import { response, catchError } from "@/lib/server/helperFunction";
import { registerSchema } from "@/lib/schemas/schemas";
import { sendMail } from "@/lib/server/sendEmail";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return response(false, 400, "Invalid or missing fields", validated.error);
    }

    let { fullName: name, email, password } = validated.data;

    // Check if user exists
    const exists = await UserModel.exists({ email });
    if (exists) {
      return response(false, 409, "User already exists", null);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;

    // Create new user
    const newUser = await UserModel.create({ name, email, password });

    // Generate email verification token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newUser._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`;

    await sendMail(
      `Email Verification`,
      email,
      emailVerificationLink(verifyUrl)
    );

    return response(
      true,
      200,
      "Registration successful. Please verify your email.",
      null
    );
  } catch (error) {
    return catchError(error);
  }
}
