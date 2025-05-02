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
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "userId avatar")
      .lean();

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.log("Creating message error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  try {
    const { id, content } = req.body;
    console.log("editing message", req.body);
    if (!content || !id) {
      res.status(400).json({ message: "Content and id are required" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    ).lean();

    if (!updatedMessage) {
      res.status(403).json({
        message: "you cann't change this message or message not found",
      });
    }
    console.log("updated message", updatedMessage);

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.log("editing message error: ", err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { editor, id, room } = req.body;
    if (!id) {
      res.status(400).json({ message: "id is required" });
    }

    const deletedMessage = await Message.findOneAndDelete({
      _id: id,
      sender: editor,
      room: room,
    });

    if (!deletedMessage) {
      res.status(403).json({
        message: "you can't delete this message or message not found",
      });
      console.log("you can delete this message or message not found");
    }

    res.status(200).json(deletedMessage);
  } catch (err) {
    console.log("deleting message error: ", err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
