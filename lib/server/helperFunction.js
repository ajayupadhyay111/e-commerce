import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    { status: statusCode } // IMPORTANT
  );
};

export const catchError = (error, customMessage) => {
  // Handle duplicate key error
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(",");
    error.message = `Duplicate field: ${keys}. These fields must be unique.`;
  }

  // Build error object
  let errorObj = {};

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error: error,
    };
  } else {
    errorObj = {
      message: customMessage || "Internal server error",
    };
  }

  let finalStatusCode = 500;
  if (error.code === 11000) {
    finalStatusCode = 409; // Conflict
  }

  return response(
    false,
    finalStatusCode,
    errorObj.message,
    errorObj.error || null
  );
};

export const isAuthenticated = async (role) => {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) {
      return {
        isAuth: false,
      };
    }

    const access_token = cookieStore.get("access_token");
    const { payload } = await jwtVerify(
      access_token.value,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    if (payload.role !== role) {
      return {
        isAuth: false,
      };
    }
    return {
      isAuth: true,
      userId: payload.id,
    };
  } catch (error) {
    return {
      isAuth: false,
      error,
    };
  }
};
