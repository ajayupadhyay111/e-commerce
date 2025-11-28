import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { loginSchema } from "@/lib/schemas/auth-schema";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  console.log("obdy", body);
  const formSchema = loginSchema.pick({
    email: true,
    otp: true,
  });

  const validatedData = formSchema.safeParse(body);
  console.log("validatedData", validatedData);
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

    // remove otp after validation
    await getOTP.deleteOne();

    return response(true, 200, "OTP verified");
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}
