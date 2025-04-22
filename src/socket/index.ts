import { Socket, Server } from "socket.io";
import User from "../models/User";
import Message from "../models/Message";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "Bear_";

declare module "socket.io" {
  interface Socket {
    userId: string;
    displayName: string;
  }
}

interface DecodedToken {
  id: string;
  displayName: string;
  iat: number;
  exp: number;
}

interface SocketUser {
  userId: string;
  displayName: string;
  socketId: string;
}

export default (io: Server) => {
  const connectedUsers: Map<string, SocketUser> = new Map();

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

      socket.userId = decoded.id;
      socket.displayName = decoded.displayName;

      next();
    } catch (err) {
      next(new Error("Authentication error."));
    }
  });

  io.on("connection", async (socket: Socket) => {
    try {
      const userId = socket.userId;

      const displayName = socket.displayName;

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date(),
      });

      connectedUsers.set(userId, {
        userId,
        displayName,
        socketId: socket.id,
      });

      // Broadcast user online status
      io.emit("user:status", {
        userId,
        displayName,
        isOnline: true,
      });

      socket.on("join:room", (room) => {
        socket.join(room);
        console.log(`${displayName} joined room: ${room}`);
      });

      socket.on("leave:room", (room) => {
        socket.leave(room);
        console.log(`${displayName} left room: ${room}`);
      });

      socket.on(
        "message:new",
        async (data: { content: string; room: string; timestamp: string }) => {
          console.log("new message detected");
          try {
            const { content, room, timestamp } = data;

            const message = new Message({
              sender: new mongoose.Types.ObjectId(userId),
              content,
              room,
              timestamp,
            });

            await message.save();

            const populatedMessage = await Message.findById(message._id)
              .populate("sender", "userId avatar")
              .lean();
            console.log(room);
            console.log(populatedMessage);

            // io.to(room).emit("message:received", populatedMessage);
            io.emit("message:received", populatedMessage);
          } catch (err) {
            console.log("socket message: new error: ", err);
          }
        }
      );

      socket.on("typing:start", (room) => {
        console.log("someone is typing");
        socket.to(room).emit("user:typing", { displayName, room });
      });

      socket.on("disconnect", async () => {
        try {
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          connectedUsers.delete(userId);

          io.emit("user:status", {
            userId,
            displayName,
            isOnline: false,
          });

          console.log(`User disconnected: ${displayName} (${userId})`);
        } catch (err) {
          console.log("Socket disconnect error: ", err);
        }
      });
    } catch (err) {
      console.log("Socket error: ", err);
    }
  });
};
