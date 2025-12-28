import { connectDB } from "@/lib/server/db";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/server/helperFunction";
import MediaModel from "@/models/media.model";
import { NextResponse } from "next/server";
import { _null } from "zod/v4/core";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized.");
    }

    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page"), 10) || 0;
    const limit = parseInt(searchParams.get("limit"), 10) || 10;
    const deleteType = searchParams.get("deleteType");

    // SD=>soft delete,  RSD=>restore soft delete, PD=>permanent delete

    let filter = {};
    if (deleteType === "SD") {
      filter = { deletedAt: null };
    } else if (deleteType === "PD") {
      filter = { deletedAt: { $ne: null } };
    }

    const mediaData = await MediaModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean();
    const totalMedia = await MediaModel.countDocuments(filter);
    return NextResponse.json({
      mediaData,
      hasMore: (page + 1) * limit < totalMedia,
    });
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}
