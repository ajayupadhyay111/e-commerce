import cloudinary from "@/lib/server/cloudinary";
import { connectDB } from "@/lib/server/db";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/server/helperFunction";
import MediaModel from "@/models/media.model";
import mongoose from "mongoose";

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

    const media = await MediaModel.find({ _id: { $in: ids } }).lean();
    if (!media?.length) {
      return response(false, 404, "No media found.");
    }
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid delete type.");
    }

    if (deleteType === "RSD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    } else if (deleteType === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    }

    return response(
      true,
      200,
      deleteType === "RSD"
        ? "Media restored successfully."
        : "Media moved to trash successfully."
    );
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    const media = await MediaModel.find({ _id: { $in: ids } })
      .session(session)
      .lean();
    if (!media?.length) {
      return response(false, 404, "No media found.");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "Invalid delete type.");
    }

    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    // delete all data from cloudinary
    const publicIds = media.map((media) => media.public_id);
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      session.abortTransaction();
      session.endSession();
    }

    session.commitTransaction();
    session.endSession();
    return response(true, 200, "Media deleted successfully.");
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}
