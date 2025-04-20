import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: { type: String, default: "", required: true, unique: true },
    twitterAdd: { type: String, default: "", required: true, unique: true },
    walletAdd: { type: String, default: "", required: true, unique: true },
    channels: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("users", userSchema);
