import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/isAuthentication";
import CategoryModel from "@/models/category.model";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();
    const { ids = [], deleteType } = payload || {};
    if (!ids?.length || !Array.isArray(ids)) {
      return response(false, 400, "No ids provided.");
    }
    if (!deleteType) {
      return response(false, 400, "No delete type provided.");
    }

    const category = await CategoryModel.find({ _id: { $in: ids } }).lean();
    if (!category?.length) {
      return response(false, 404, "No category found.");
    }
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid delete type.");
    }

    if (deleteType === "RSD") {
      await CategoryModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    } else if (deleteType === "SD") {
      await CategoryModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    }

    return response(
      true,
      200,
      deleteType === "RSD"
        ? "Category restored successfully."
        : "Category moved to trash successfully."
    );
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();
    const { ids = [], deleteType } = payload || {};
    if (!ids?.length || !Array.isArray(ids)) {
      return response(false, 400, "No ids provided.");
    }
    if (!deleteType) {
      return response(false, 400, "No delete type provided.");
    }

    const category = await CategoryModel.find({ _id: { $in: ids } })
      .session(session)
      .lean();
    if (!category?.length) {
      return response(false, 404, "No category found.");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "Invalid delete type.");
    }

    await CategoryModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Category deleted successfully.");
  } catch (error) {
    return catchError(error);
  }
}
