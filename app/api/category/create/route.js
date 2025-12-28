import { categorySchema } from "@/lib/schemas/schemas";
import { connectDB } from "@/lib/server/db";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/server/helperFunction";
import CategoryModel from "@/models/category.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();

    const validatedData = categorySchema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 400, "Invalid Category Data", validatedData.error);
    }

    const { name, slug } = validatedData.data;
    await CategoryModel.create({ name, slug });
    return response(true, 200, "Category created successfully");
  } catch (error) {
    return catchError(error);
  }
}
