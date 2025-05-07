import mongoose, { Document, Schema } from "mongoose";

export interface Channel {
  chainId: string;
  name: string;
  symbol: string;
  tokenAdd: string;
  image: string;
  banner: string;
  twitter?: string;
  website?: string;
  marketCap?: string;
}

export interface IUser extends Document {
  userId: string;
  displayName: string;
  wallet: string;
  avatar?: string;
  channels: Channel[];
  bio?: string;
  isOnline: boolean;
  lastSeen: Date;
}

const ChannelSchema = new Schema<Channel>({
  chainId: String,
  name: String,
  symbol: String,
  tokenAdd: String,
  image: String,
  banner: String,
  twitter: String,
  website: String,
  marketCap: String,
});

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
    channels: [
      {
        type: ChannelSchema,
        default: [],
      },
    ],
    bio: {
      type: String,
      default: "",
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

export default mongoose.model("User", UserSchema);
