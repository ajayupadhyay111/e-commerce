import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/isAuthentication";
import MediaModel from "@/models/media.model";

export async function POST(request) {
  let payload = [];

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    payload = await request.json();

    if (!Array.isArray(payload) || payload.length === 0) {
      return response(false, 400, "Invalid media payload");
    }

    await connectDB();

    const newMedia = await MediaModel.insertMany(payload);

    return response(true, 200, "Media uploaded successfully", newMedia);
  } catch (error) {
    // 🔥 Rollback Cloudinary if DB fails
    if (Array.isArray(payload) && payload.length > 0) {
      const publicIds = payload.map((data) => data.public_id);

      try {
        await cloudinary.api.delete_resources(publicIds, {
          resource_type: "image",
        });
      } catch (deleteError) {
        error.cloudinary = deleteError;
      }
    }

    return catchError(error);
  }
}
