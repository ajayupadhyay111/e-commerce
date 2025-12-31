import { categorySchema } from "@/lib/schemas/schemas";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import CategoryModel from "@/models/category.model";
import { isAuthenticated } from "@/lib/isAuthentication";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const auth = await isAuthenticated("admin");
    if (!auth) {
      return response(false, 401, "Unauthorized");
    }
    await connectDB();

    const payload = await request.json();

    const schema = categorySchema.pick({
      name: true,
      slug: true,
    });

    const data = schema.safeParse(payload);
    if (!data.success) {
      return response(false, 400, data.error.message);
    }

    const { name, slug } = data.data;
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid ID");
    }

    const category = await CategoryModel.findById(id);

    if (!category) {
      return response(false, 404, "Category not found");
    }

    category.name = name;
    category.slug = slug;

    await category.save();

    return response(true, 200, "Category updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
