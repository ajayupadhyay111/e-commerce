import { connectDB } from "@/lib/server/db";
import { catchError, response } from "@/lib/server/helperFunction";
import { loginSchema } from "@/lib/schemas/schemas";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function PUT(request) {
  try {
    console.log("put request");
    await connectDB();
    const payload = await request.json();
    const validationSchema = loginSchema.pick({
      email: true,
      password: true,
    });
    const validateData = validationSchema.safeParse(payload);
    if (!validateData.success)
      response(
        false,
        401,
        "Invalid or missing input field",
        validateData.error
      );

    const { email, password } = validateData.data;
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    getUser.password = hashedPassword;
    await getUser.save();

    return response(true, 200, "Password updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
