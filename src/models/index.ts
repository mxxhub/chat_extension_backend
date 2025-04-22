import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  room: string;
  timestamp?: Date;
}

export interface IUser extends Document {
  userId: string;
  displayName: string;
  wallet: string;
  avatar?: string;
  channels: string[];
  isOnline: boolean;
  lastSeen: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
      default: "general",
    },
    timestamp: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema<IUser>(
  {
    userId: {
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
    channels: [{ type: String }],
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

export const User = mongoose.model("user", UserSchema);
export const Message = mongoose.model("message", MessageSchema);
