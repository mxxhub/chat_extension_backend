import { Request, Response } from "express";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "User with that username already exists",
      });
    }

    const user = new User({
      username,
      email,
    });
  } catch (err) {
    console.log("Register error: ", err);
  }
};
