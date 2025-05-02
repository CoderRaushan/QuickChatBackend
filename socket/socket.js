import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/MessageModel.js";
import Conversation from '../models/ConversationModel.js';
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
  socket.on("send-message", async ({ receiverId, text, tempId }) => {
    try {
      const senderId = userId; // ✅ Use this instead of `req.id`
  
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      }).populate("message");;
  
      // If no conversation exists, create one
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
          message: [],
        });
      }
  
      const newMessage = await Message.create({
        senderId,
        receiverId,
        messages: text,
      });
  
      // Initialize message array if it doesn't exist (safety)
      if (!conversation.message) conversation.message = [];
  
      conversation.message.push(newMessage._id);
      await conversation.save();
  
      const ReceiverSocketId = getReceiverSocketId(receiverId);
      if (ReceiverSocketId) {
        io.to(ReceiverSocketId).emit("newMessage", newMessage);
      }
  
      // Confirm message back to sender with the tempId so they can replace it
      io.to(socket.id).emit("message-confirmed", {
        ...newMessage.toObject(),
        tempId,
      });
    } catch (error) {
      console.error("Error sending message via socket:", error);
    }
  });

  socket.on("typing", ({ to, from, username }) => {
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { from, username });
    }
  });
  
  socket.on("stop-typing", ({ to }) => {
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop-typing", { from: userId });
    }
  });
  
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete UserSocketMap[userId];
    io.emit("OnlineUsers", Object.keys(UserSocketMap));
  });
});

export { io, app, server };
