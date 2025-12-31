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
    const validateData = validationSchema.safeParse(payload);
    if (!validateData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validateData.error
      );
    }

    const { email } = validateData.data;
    const getUser = await UserModel.findOne({ email });
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // remove old otp
    await OtpModel.deleteMany({ email });
    const otp = Math.floor(100000 + Math.random() * 900000);
    const newOTP = new OtpModel({ email, otp });
    await newOTP.save();
    const otpSendStatus = await sendMail(
      "Your forgot password verification code",
      email,
      otpEmail(otp)
    );
    if (!otpSendStatus.success) {
      return response(false, 400, "Failed to send otp");
    }
    return response(true, 200, "OTP sent successfully");
  } catch (error) {
    return catchError(error);
  }
}
