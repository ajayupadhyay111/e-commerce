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
