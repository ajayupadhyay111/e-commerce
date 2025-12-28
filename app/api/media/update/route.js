import { mediaSchema } from "@/lib/schemas/schemas";
import { connectDB } from "@/lib/server/db";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/server/helperFunction";
import MediaModel from "@/models/media.model";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth) {
      return response(false, 401, "Unauthorized");
    }
    await connectDB();

    const payload = await request.json();

    const schema = mediaSchema.pick({
      _id: true,
      alt: true,
      title: true,
    });

    const data = schema.safeParse(payload);
    if (!data.success) {
      return response(false, 400, data.error.message);
    }

    const { _id, alt, title } = data.data;
    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid ID");
    }

    const media = await MediaModel.findById(_id);

    if (!media) {
      return response(false, 404, "Media not found");
    }

    media.alt = alt;
    media.title = title;

    await media.save();

    return response(true, 200, "Media updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
