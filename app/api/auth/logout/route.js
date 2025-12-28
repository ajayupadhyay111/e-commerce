import { connectDB } from "@/lib/server/db";
import { catchError, response } from "@/lib/server/helperFunction";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    return response(true, 200, "Logout successful");
  } catch (error) {
    return catchError(error);
  }
}
