import { connectDB } from "@/lib/server/db";
import { catchError, response } from "@/lib/server/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    const { token } = await request.json();

    if (!token) {
      return response(false, 400, "Missing token.");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;

    // get user
    const user = await UserModel.findById(userId);
    if (!user) {
      return response(false, 404, "User not found");
    }

    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "Email Verification successfull.");
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}
