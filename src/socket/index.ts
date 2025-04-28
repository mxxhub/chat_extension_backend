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
    username: string;
    displayName: string;
  }
}

interface DecodedToken {
  id: string;
  displayName: string;
  userId: string;
  iat: number;
  exp: number;
}

interface SocketUser {
  userId: string;
  username: string;
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
      socket.username = decoded.userId;
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
      const username = socket.username;

      await User.findByIdAndUpdate(userId, {
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
        socket.join(data.tokenAdd);
        const user = await User.findOne({ userId: username });
        if (user) {
          const alreadyJoined = user.channels.some(
            (c) => c.tokenAdd === data.tokenAdd
          );
          if (alreadyJoined) return;

          user.channels.push(data);
          await user.save();
        }
        console.log(`${displayName} joined room: ${data.tokenAdd}`);
      });

      socket.on("leave:room", async (room) => {
        socket.leave(room);
        console.log(`${displayName} left room: ${room}`);
        let user = await User.findOne({ userId: username });

        console.log("user: ", user);
        if (user) {
          await User.findOneAndUpdate(
            {
              userId: username,
            },
            {
              $pull: {
                channels: { tokenAdd: room },
              },
            }
          ).exec();
        }
      });

      socket.on(
        "message:new",
        async (data: { content: string; room: string; timestamp: string }) => {
          console.log("new message detected");
          try {
            const { content, room, timestamp } = data;

            const message = new Message({
              sender: new mongoose.Types.ObjectId(userId),
              username,
              content,
              room,
              timestamp,
            });

            await message.save();

            const populatedMessage = await Message.findById(message._id)
              .populate("sender", "userId avatar")
              .lean();

            io.to(room).emit("message:received", populatedMessage);
          } catch (err) {
            console.log("socket message: new error: ", err);
          }
        }
      );

      socket.on("typing:start", (room) => {
        console.log(socket.rooms);
        console.log(`someone is typing in ${room}`);
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
            username,
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
