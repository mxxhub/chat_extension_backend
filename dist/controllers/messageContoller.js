"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.editMessage = exports.saveMessage = exports.getMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
const getMessage = async (req, res) => {
    try {
        const { room } = req.body;
        const limit = parseInt(req.body.limit) || 50;
        const messages = await Message_1.default.find({ room })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("sender", "userId avatar")
            .lean();
        res.json(messages.reverse());
    }
    catch (err) {
        console.log("Getting message error: ", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getMessage = getMessage;
const saveMessage = async (req, res) => {
    try {
        const { content, room } = req.body;
        const userId = req.body.id;
        if (!content || !room) {
            res.status(400).json({ message: "Content and room are required" });
        }
        const newMessage = new Message_1.default({
            sender: new mongoose_1.default.Types.ObjectId(userId),
            content,
            room,
        });
        await newMessage.save();
        const populatedMessage = await Message_1.default.findById(newMessage._id)
            .populate("sender", "userId avatar")
            .lean();
        res.status(201).json(populatedMessage);
    }
    catch (err) {
        console.log("Creating message error: ", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.saveMessage = saveMessage;
const editMessage = async (req, res) => {
    try {
        const { id, content } = req.body;
        console.log("editing message", req.body);
        if (!content || !id) {
            res.status(400).json({ message: "Content and id are required" });
        }
        const updatedMessage = await Message_1.default.findByIdAndUpdate(id, { content }, { new: true }).lean();
        if (!updatedMessage) {
            res.status(403).json({
                message: "you cann't change this message or message not found",
            });
        }
        console.log("updated message", updatedMessage);
        res.status(200).json(updatedMessage);
    }
    catch (err) {
        console.log("editing message error: ", err);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.editMessage = editMessage;
const deleteMessage = async (req, res) => {
    try {
        const { editor, id, room } = req.body;
        if (!id) {
            res.status(400).json({ message: "id is required" });
        }
        const deletedMessage = await Message_1.default.findOneAndDelete({
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
    }
    catch (err) {
        console.log("deleting message error: ", err);
        res.status(500).json({ message: "Internal server error!" });
    }
};
exports.deleteMessage = deleteMessage;
