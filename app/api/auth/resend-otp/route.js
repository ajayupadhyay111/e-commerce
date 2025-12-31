import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { loginSchema } from "@/lib/schemas/schemas";
import { sendMail } from "@/lib/sendEmail";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = loginSchema.pick({
      email: true,
    });
    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validatedData.error
      );
    }

    const user = await UserModel.findOne({ email: validatedData.data.email });
    if (!user) {
      return response(false, 404, "User not found");
    }

    // remove old otp
    await OtpModel.deleteMany({ email: validatedData.data.email });

    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save otp to database
    const newOtp = new OtpModel({
      email: validatedData.data.email,
      otp,
    });
    await newOtp.save();

    const otpSendStatus = await sendMail(
      "Your login verification code ",
      validatedData.data.email,
      otpEmail(otp)
    );

    if (!otpSendStatus.success) {
      return response(false, 500, "Failed to send OTP");
    }

    return response(true, 200, "OTP resent successfully");
  } catch (error) {
    return catchError(error);
  }
}
