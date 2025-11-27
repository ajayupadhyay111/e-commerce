import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { loginSchema } from "@/lib/schemas/auth-schema";
import { sendMail } from "@/lib/sendEmail";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request) {
  connectDB();
  const body = await request.json();
  const validatedData = loginSchema.safeParse(body);

  if (!validatedData.success) {
    return response(
      false,
      400,
      "Invalid or missing fields",
      validatedData.error
    );
  }

  const { email, password } = validatedData.data;

  try {
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return response(false, 404, "User not found");
    }

    if (!user.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const token = await new SignJWT({ userId: user._id.toString() })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

      const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`;

      await sendMail(
        `Email Verification`,
        user.email,
        emailVerificationLink(verifyUrl)
      );

      return response(true, 200, "Please verify your email.", null);
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response(false, 401, "Invalid password");
    }

    // otp generation
    await OtpModel.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtp = new OtpModel({ email, otp });
    await newOtp.save();

    // send otp on mail
    const otpEmailStatus = await sendMail(
      "Your login verification code",
      email,
      otpEmail(otp)
    );

    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to send otp");
    }

    return response(true, 200, "Please verify your device");
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}
