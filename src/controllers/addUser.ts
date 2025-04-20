import { Request, Response } from "express";
import { User } from "../models/user";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, twitterAdd, walletAdd, channel } = req.body;
    const userData = await User.find({});
    await userData.map(async (each, i) => {
      if (each == req.body.userId) {
        User.findOneAndUpdate(
          { userId: each },
          { $addToSet: { channels: req.body.channel } },
          { new: true }
        );
        return;
      } else {
        const user = await new User({
          userId,
          twitterAdd,
          walletAdd,
          channels: channel ? [channel] : [],
        }).save();
        console.log("user status: ", user);

        console.log("User creation:", user ? "Success" : "Failed");
        res.status(200).json(user);
      }
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;
    const user = await User.findOneAndDelete({ userId });
    console.log("User deletion:", user ? "Success" : "Failed");
    res.status(200).json(user);
  } catch (err: any) {
    console.log("Error deleting user: ", err.message);
    res.status(400).json({ error: err.message });
  }
};
