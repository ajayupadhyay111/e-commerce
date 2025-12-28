import { connectDB } from "@/lib/server/db";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/server/helperFunction";
import MediaModel from "@/models/media.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }
    await connectDB();
    const getParams = await params;
    const id = getParams.id;
    const filter = {
      deletedAt: null,
    };
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid object Id");
    }
    filter._id = id;
    const getMedia = await MediaModel.findOne(filter).lean();
    if (!getMedia) {
      return response(false, 404, "Media not found");
    }
    console.log(getMedia);
    return response(true, 200, "Media found", getMedia);
  } catch (error) {
    return catchError(error);
  }
}
