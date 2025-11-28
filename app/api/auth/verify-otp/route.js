import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { loginSchema } from "@/lib/schemas/auth-schema";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
  await connectDB();
  const body = await request.json();

  const formSchema = loginSchema.pick({
    email: true,
    otp: true,
  });

  const validatedData = formSchema.safeParse(body);

  if (!validatedData.success) {
    return response(
      false,
      400,
      "Invalid or missing fields",
      validatedData.error
    );
  }

  const { email, otp } = validatedData.data;

  try {
    let getOTP = await OtpModel.findOne({ email, otp });
    if (!getOTP) {
      return response(false, 400, "Invalid OTP");
    }

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return response(false, 400, "User not found");
    }

    const userData = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(userData)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    const cookieStore = await cookies();

    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // remove otp after validation
    await getOTP.deleteOne();

    return response(true, 200, "Login successful", userData);
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}
