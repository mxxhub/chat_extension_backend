import { Request, Response } from "express";
import Message from "../models/Message";
import mongoose from "mongoose";

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { room } = req.body;
    const limit = parseInt(req.body.limit as string) || 50;
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("sender", "userId avatar")
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    console.log("Getting message error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveMessage = async (req: Request, res: Response) => {
  try {
    const { content, room } = req.body;
    console.log(req.body);
    const userId = req.body.id;

    if (!content || !room) {
      res.status(400).json({ message: "Content and room are required" });
    }

    const newMessage = new Message({
      sender: new mongoose.Types.ObjectId(userId),
      content,
      room,
    });

    await newMessage.save();
    console.log("new message id: ", newMessage._id);
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "userId avatar")
      .lean();

    console.log("populated message: ", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.log("Creating message error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
