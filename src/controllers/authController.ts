import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Bear_";

export const addUser = async (req: Request, res: Response) => {
  try {
    const { userId, displayName, wallet, avatar, channel } = req.body;
    console.log(req.body);

    let user = await User.findOne({ userId });
    if (user) {
      const alreadyExists = user.channels.some(
        (c) => c.tokenAdd === channel.tokenAdd
      );
      if (!alreadyExists && channel.tokenAdd !== "") {
        user.channels.push(channel);
        await user.save();
      }
      const token = jwt.sign(
        { id: user._id, userId: user.userId, displayName: user.displayName },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      res.status(200).json({
        message: "User updated",
        user: {
          _id: user._id,
          userId: user.userId,
          displayName: user.displayName,
          wallet: user.wallet,
          avatar: user.avatar,
          channels: user.channels,
          bio: user.bio,
        },
        token,
      });
    } else {
      const newUser = new User({
        userId,
        displayName,
        wallet,
        avatar,
        channels: [channel],
      });

      await newUser.save();

      const token = jwt.sign(
        {
          _id: newUser._id,
          userId: newUser.userId,
          displayName: newUser.displayName,
        },
        JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.status(201).json({
        message: "User created",
        user: {
          id: newUser._id,
          userId: newUser.userId,
          displayName: newUser.displayName,
          wallet: newUser.wallet,
          avatar: newUser.avatar,
          channel: newUser.channels,
          bio: newUser.bio,
        },
        token,
      });
    }
  } catch (err) {
    console.log("Register error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log("Delete user error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { _id, userId, displayName, wallet, bio } = req.body;
    console.log("update user: ", req.body);

    const user = await User.findOneAndUpdate(
      { _id },
      {
        userId,
        displayName,
        wallet,
        bio,
      }
    );

    if (!user) return;

    res.status(200).json({
      message: "User updated",
      user: {
        _id: user._id,
        userId: user.userId,
        displayName: user.displayName,
        wallet: user.wallet,
        avatar: user.avatar,
        channels: user.channels,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.log("Update user error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOnlineUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ isOnline: true })
      .select("userId displayName avatar isOnline lastSeen")
      .sort({ username: 1 });

    if (!users) {
      res.status(201).json({ message: "No user found" });
    }

    res.json(users);
  } catch (err) {
    console.log("Getting online users error: ", err);
    res.status(201).json({ message: "Getting online users error" });
  }
};

export const getChannelsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    console.log("get channels by user id: ", req.body);
    const channels = await User.findOne({ userId }).select("channels");

    if (!channels) {
      res.status(404).json({ message: "Channels not found" });
    }

    console.log("Channels: ", channels);
    res.json(channels);
  } catch (err) {
    console.log("Getting channels by user error: ", err);
  }
};
