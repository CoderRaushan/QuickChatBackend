import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/MessageModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"], 
});

const UserSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return UserSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    UserSocketMap[userId] = socket.id;
    console.log("User connected:", userId, socket.id);
  }

  io.emit("OnlineUsers", Object.keys(UserSocketMap));
  
  socket.on("message-seen", async (messageId) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status: "seen" });
      const msg = await Message.findById(messageId);
      const senderSocket = UserSocketMap[msg.senderId?.toString()];
      if (senderSocket) {
        io.to(senderSocket).emit("message-status-updated", msg);
      }
    } catch (err) {
      console.error("message-seen error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete UserSocketMap[userId];
    io.emit("OnlineUsers", Object.keys(UserSocketMap));
  });
});

export { io, app, server };
