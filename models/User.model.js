import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, select: false },
    avatar: {
      url: String,
      public_id: String,
    },
    isEmailVerified: { type: Boolean, default: false },
    phone: String,
    address: String,
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
