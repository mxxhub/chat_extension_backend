"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Message_1 = __importDefault(require("../models/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "Bear_";
exports.default = (io) => {
    const connectedUsers = new Map();
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            socket.userId = decoded.id;
            socket.username = decoded.userId;
            socket.displayName = decoded.displayName;
            next();
        }
        catch (err) {
            next(new Error("Authentication error."));
        }
    });
    io.on("connection", async (socket) => {
        try {
            const userId = socket.userId;
            const displayName = socket.displayName;
            const username = socket.username;
            await User_1.default.findByIdAndUpdate(userId, {
                isOnline: true,
                lastSeen: new Date(),
            });
            connectedUsers.set(userId, {
                userId,
                username,
                displayName,
                socketId: socket.id,
            });
            // Broadcast user online status
            io.emit("user:status", {
                userId,
                username,
                displayName,
                isOnline: true,
            });
            socket.on("join:room", async (data) => {
                // when data = {tokenAdd: "0x1234567890"} -> function will be called
                if (data.toString().startsWith("0x")) {
                    console.log("first tokenAdd: ", data);
                    console.log("join:room", data);
                    await socket.join(data);
                }
                console.log("join:room", data);
                await socket.join(data.tokenAdd);
                const user = await User_1.default.findOne({ userId: username });
                if (user) {
                    const alreadyJoined = user.channels.some((c) => c.tokenAdd === data.tokenAdd);
                    if (alreadyJoined || !data.tokenAdd)
                        return;
                    user.channels.push(data);
                    await user.save();
                }
                console.log(`${displayName} joined room: ${data.tokenAdd}`);
            });
            socket.on("leave:room", async (room) => {
                socket.leave(room);
                console.log(`${displayName} left room: ${room}`);
                let user = await User_1.default.findOne({ userId: username });
                console.log("user: ", user);
                if (user) {
                    await User_1.default.findOneAndUpdate({
                        userId: username,
                    }, {
                        $pull: {
                            channels: { tokenAdd: room },
                        },
                    }).exec();
                }
            });
            socket.on("message:new", async (data) => {
                console.log("new message detected");
                try {
                    const { content, room, timestamp } = data;
                    const message = new Message_1.default({
                        sender: new mongoose_1.default.Types.ObjectId(userId),
                        username,
                        content,
                        room,
                        timestamp,
                    });
                    await message.save();
                    const populatedMessage = await Message_1.default.findById(message._id)
                        .populate("sender", "userId avatar")
                        .lean();
                    io.to(room).emit("message:received", populatedMessage);
                }
                catch (err) {
                    console.log("socket message: new error: ", err);
                }
            });
            socket.on("typing:start", (room) => {
                console.log(socket.rooms);
                console.log(`someone is typing in ${room}`);
                // socket.to(room).emit("user:typing", { displayName, room });
                socket.emit("user:typing", { displayName, room });
            });
            socket.on("disconnect", async () => {
                try {
                    await User_1.default.findByIdAndUpdate(userId, {
                        isOnline: false,
                        lastSeen: new Date(),
                    });
                    connectedUsers.delete(userId);
                    io.emit("user:status", {
                        userId,
                        username,
                        displayName,
                        isOnline: false,
                    });
                    console.log(`User disconnected: ${displayName} (${userId})`);
                }
                catch (err) {
                    console.log("Socket disconnect error: ", err);
                }
            });
        }
        catch (err) {
            console.log("Socket error: ", err);
        }
    });
};
