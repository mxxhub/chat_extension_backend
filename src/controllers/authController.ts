import { Request, Response } from "express";
import User from "../models/User";

export const addUser = async (req: Request, res: Response) => {
  try {
    const { username, displayName, wallet, avatar, channel } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      if (!user.channels.includes(channel)) {
        user.channels.push(channel);
        await user.save();
      }

      res.status(200).json({
        message: "User updated",
        user: {
          username: user.username,
          displayName: user.displayName,
          wallet: user.wallet,
          avatar: user.avatar,
          channels: user.channels,
        },
      });
    } else {
      const newUser = new User({
        username,
        displayName,
        wallet,
        avatar,
        channels: [channel],
      });

      await newUser.save();

      res.status(201).json({
        message: "User created",
        user: {
          username: newUser.username,
          displayName: newUser.displayName,
          wallet: newUser.wallet,
          avatar: newUser.avatar,
          channel: newUser.channels,
        },
      });
    }
  } catch (err) {
    console.log("Register error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
