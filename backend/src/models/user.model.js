import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    profilePicture: {
      type: String,
      required: true,
      default:
        "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
