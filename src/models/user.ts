import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  displayName: string;
  wallet: string;
  avatar?: string;
  channels: string[];
  isOnline: boolean;
  lastSeen: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    wallet: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    channels: {
      type: [String],
      default: [],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
